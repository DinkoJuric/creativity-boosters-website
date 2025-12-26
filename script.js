document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-color)';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = 'var(--shadow-md)';
            }
        });
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close menu if open
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // --- Intersection Observer for Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // --- Podcast Engine ---
    loadEpisodes();
    setupModal();
});

// Modal Logic
function setupModal() {
    const modal = document.getElementById('episode-modal');
    const closeBtn = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');

    if (!modal) return;

    const closeModal = () => modal.classList.remove('active');

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

function openModal(episode) {
    const modal = document.getElementById('episode-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    // Format Date
    const dateStr = new Date(episode.release_date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Populate Content
    modalBody.innerHTML = `
        <h2>${episode.title}</h2>
        <div class="modal-meta">${dateStr} • ${Math.round(episode.duration_minutes)} min listen</div>
        <div class="modal-desc">${formatDescription(episode.description)}</div>
        
        <a href="${episode.spotify_url}" target="_blank" class="btn btn-primary" style="width: 100%; text-align: center;">
            Listen on Spotify
        </a>
    `;

    modal.classList.add('active');
}

// Magic Formatter for Description
function formatDescription(text) {
    if (!text) return '';

    // 1. Linkify URLs first
    let formatted = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

    // 2. Split into lines for processing
    let lines = formatted.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
        let trimmed = line.trim();
        if (!trimmed) {
            if (inList) { html += '</ul>'; inList = false; }
            return;
        }

        // Detect Headers (e.g. "**Key Takeaways:**", "Chapters", "Extended description")
        // Keywords: Takeaways, Lessons, Chapters, Timestamps, Links, Toolkit, Description
        const headerKeywords = /Extended\s+description|Key\s+Takeaways|Key\s+Lessons|Chapters|Time\s?stamps|Timestamp|Links|Toolkit|Description/i;

        // A line is a header if it only contains a keyword (plus optional bolding and punctuation)
        // We strip non-alphanumeric chars to check if the core text matches our keywords
        const coreText = trimmed.replace(/[\*\:#]/g, '').trim();

        if (headerKeywords.test(coreText) && coreText.length < 30) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h4>${coreText}</h4>`;
            return;
        }

        // Detect Timestamps for styling (MM:SS or HH:MM:SS)
        if (/^(\(?(\d{1,2}:)?\d{2}:\d{2}\)?)/.test(trimmed)) {
            // Apply bolding to the timestamp part
            let row = trimmed.replace(/^(\(?(\d{1,2}:)?\d{2}:\d{2}\)?)\s*/, '<strong>$1</strong> ');
            // Also apply markdown bolding to the rest of the line
            row = row.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html += `<p class="timestamp-row">${row}</p>`;
            return;
        }

        // Detect Lists (lines starting with - or •)
        if (/^[-•]/.test(trimmed)) {
            if (!inList) { html += '<ul>'; inList = true; }
            let content = trimmed.replace(/^[-•]\s*/, '');
            content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html += `<li>${content}</li>`;
            return;
        }

        // Close list if open for regular paragraphs
        if (inList) { html += '</ul>'; inList = false; }

        // Regular Paragraph - Apply Markdown Bold
        let para = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html += `<p>${para}</p>`;
    });

    if (inList) html += '</ul>';
    return html;
}

function loadEpisodes() {
    const grid = document.getElementById('episodes-grid');
    if (!grid) return;

    try {
        const data = typeof PODCAST_DATA !== 'undefined' ? PODCAST_DATA : window.PODCAST_DATA;
        if (!data || !data.episodes) throw new Error('Episode data not found');

        const episodes = data.episodes;
        // Determine page context to set limit
        // If we are on 'episodes.html' or body has 'page-episodes' class, show all.
        // Otherwise (Home), show top 3.
        const isArchive = document.body.classList.contains('page-episodes');
        const limit = isArchive ? episodes.length : 3;

        grid.innerHTML = '';

        episodes.slice(0, limit).forEach((episode, index) => {
            const card = createEpisodeCard(episode, index);
            grid.appendChild(card);

            setTimeout(() => {
                card.classList.add('visible');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50); // Faster stagger for long lists
        });

    } catch (error) {
        console.error('Error loading episodes:', error);
        grid.innerHTML = '<p class="error-msg">Failed to load episodes. Please check your connection.</p>';
    }
}

// Regex magic to find takeaways
function extractTakeaways(description) {
    if (!description) return [];

    let takeawayLines = [];

    // Try finding the block with specific headers first
    const takeawayRegex = /(?:Takeaways|Key Takeaways|Key Lessons|Highlights)[:\s-]*\n([\s\S]*?)(?:\n\n|Chapters|Time stamps|Links|Timestamp|Toolkit|\*\*Key Timestamps|\*\*Extended description|Extended description|$)/i;
    const match = description.match(takeawayRegex);

    if (match && match[1]) {
        takeawayLines = match[1].split('\n');
    } else {
        // Fallback: Just look for all lines starting with emojis/bullets in the whole description
        // But we must stop before "Extended description" or "Timestamps" to avoid reading unwanted parts
        const splitBySection = description.split(/(?:Chapters|Time stamps|Links|Timestamp|Toolkit|\*\*Key Timestamps|\*\*Extended description|Extended description)/i);
        const mainContent = splitBySection[0]; // Only look in the first part
        takeawayLines = mainContent.split('\n');
    }

    return takeawayLines
        .map(line => line.trim())
        .filter(line => line.length > 5) // Ignore super short lines
        // Filter: starts with a bullet (- • *), or an Emoji (detected as non-ascii)
        .filter(line => /^[-•*]/.test(line) || /^[^\x00-\x7F]/.test(line))
        .slice(0, 3) // Only ever take top 3 for the card
        .map(line => {
            // 1. Remove bullet prefix but KEEP emojis
            let cleaned = line.replace(/^([-•*]\s*)/, '');

            // 2. Convert Markdown Bold to Strong for the card
            // Example: "🚀 **The Myth:**" -> "🚀 <strong>The Myth:</strong>"
            cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // 3. Fallback: strip any remaining single *
            return cleaned.replace(/\*/g, '').trim();
        });
}

function createEpisodeCard(episode, index) {
    const article = document.createElement('article');
    article.className = 'episode-card fade-in-up';
    article.style.opacity = '0'; // Start hidden for animation logic

    // Safety check for date
    let dateStr = 'Recently';
    if (episode.release_date) {
        dateStr = new Date(episode.release_date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    }

    const takeaways = extractTakeaways(episode.description);

    let takeawaysHtml = '';
    if (takeaways.length > 0) {
        takeawaysHtml = `
            <div class="takeaways-preview">
                <!-- <span class="takeaways-label">Key Takeaways</span> -->
                <ul class="takeaways-list">
                    ${takeaways.slice(0, 3).map(t => `<li>${t}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Removed Hook display as per user request

    article.innerHTML = `
        <div class="episode-content">
            <div class="episode-meta">
                <span class="episode-date">${dateStr}</span>
                <span class="episode-duration">${Math.round(episode.duration_minutes)} min</span>
            </div>
            
            <h3 class="episode-title">
                <a href="#" class="modal-trigger">${episode.title}</a>
            </h3>
            
            <!-- Only Takeaways now -->
            ${takeawaysHtml}
            
            <button class="read-more-btn modal-trigger" style="margin-top: auto; padding-top: 1rem;">Read Full Description</button>
            
            <div class="episode-footer">
                <a href="${episode.spotify_url}" target="_blank" class="listen-link">
                    <span>▶</span> Listen
                </a>
            </div>
        </div>
    `;

    // Attach click events for modal
    const triggers = article.querySelectorAll('.modal-trigger');
    triggers.forEach(t => {
        t.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(episode);
        });
    });

    return article;
}

// Helper to inject "Extended Description" header if missing after timestamps
function formatDescription(text) {
    if (!text) return '';

    // 1. Linkify URLs first
    let formatted = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

    // 2. Split into lines for processing
    let lines = formatted.split('\n');
    let html = '';
    let inList = false;
    let foundTimestamps = false;
    let injectedExtendedHeader = false;

    lines.forEach((line, i) => {
        let trimmed = line.trim();
        if (!trimmed) {
            if (inList) { html += '</ul>'; inList = false; }
            return;
        }

        // Detect Headers
        const headerKeywords = /Extended\s+description|Key\s+Takeaways|Key\s+Lessons|Chapters|Time\s?stamps|Timestamp|Links|Toolkit|Description/i;
        const coreText = trimmed.replace(/[\*\:#]/g, '').trim();

        if (headerKeywords.test(coreText) && coreText.length < 30) {
            if (inList) { html += '</ul>'; inList = false; }

            if (/Time\s?stamps|Timestamp|Chapters/i.test(coreText)) {
                foundTimestamps = true;
            }
            // If we found an explicit extended description header, mark as injected so we don't double up
            if (/Extended\s+description/i.test(coreText)) {
                injectedExtendedHeader = true;
            }

            html += `<h4>${coreText}</h4>`;
            return;
        }

        // Detect Timestamps
        if (/^(\(?(\d{1,2}:)?\d{2}:\d{2}\)?)/.test(trimmed)) {
            let row = trimmed.replace(/^(\(?(\d{1,2}:)?\d{2}:\d{2}\)?)\s*/, '<strong>$1</strong> ');
            row = row.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html += `<p class="timestamp-row">${row}</p>`;
            return;
        }

        // HEURISTIC: If we passed timestamps, and we haven't injected the header yet, 
        // and this is a long paragraph (likely the summary), inject the header now.
        if (foundTimestamps && !injectedExtendedHeader && trimmed.length > 80 && !/^[-•]/.test(trimmed)) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h4>Extended description</h4>`;
            injectedExtendedHeader = true; // Only do it once
        }

        // Detect Lists
        if (/^[-•]/.test(trimmed)) {
            if (!inList) { html += '<ul>'; inList = true; }
            let content = trimmed.replace(/^[-•]\s*/, '');
            content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html += `<li>${content}</li>`;
            return;
        }

        if (inList) { html += '</ul>'; inList = false; }

        let para = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html += `<p>${para}</p>`;
    });

    if (inList) html += '</ul>';
    return html;
}


// Return truncated hook for cards
function getHook(description) {
    if (!description) return '';

    // Remove headers if present in the hook area to clean it up
    let cleanDesc = description.split(/(?:Takeaways|Key Takeaways|Key Lessons|Chapters|Time stamps|Links|Timestamp|Toolkit|\*\*Key Timestamps|\*\*Extended description|Extended description)/i)[0].trim();

    // Remove "Welcome back" fluff
    cleanDesc = cleanDesc.replace(/^Welcome back.*?!\s*/i, '');

    // If it's already structured with multiple paragraphs, take the first one
    const paragraphs = cleanDesc.split('\n\n'); // Split by double newline to get paragraphs
    if (paragraphs.length > 0) {
        // Return the first substantial paragraph
        return paragraphs.find(p => p.length > 50) || paragraphs[0];
    }

    return cleanDesc.substring(0, 150) + '...';
}

