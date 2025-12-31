/**
 * Creativity Boosters Website Logic
 * Modular Structure for cleaner organization and separation of concerns.
 */

const CB = {
    // --- UTILITIES ---
    Utils: {
        /**
         * Helper to format raw text descriptions into structured HTML
         * Handles headers, lists, timestamps, and auto-injection of "Extended description"
         */
        formatDescription(text) {
            if (!text) return '';

            // 1. Linkify URLs
            let formatted = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

            let lines = formatted.split('\n');
            let html = '';
            let inList = false;
            let foundTimestamps = false;
            let injectedExtendedHeader = false;

            lines.forEach((line) => {
                let trimmed = line.trim();

                // Handle empty lines (close lists)
                if (!trimmed) {
                    if (inList) { html += '</ul>'; inList = false; }
                    return;
                }

                const coreText = trimmed.replace(/[\*\:#]/g, '').trim();

                // 2. Detect Headers
                const headerKeywords = /Extended\s+description|Key\s+Takeaways|Key\s+Lessons|Chapters|Time\s?stamps|Timestamp|Links|Toolkit|Description/i;

                // Check for headers (short lines with keywords)
                if (headerKeywords.test(coreText) && coreText.length < 30) {
                    if (inList) { html += '</ul>'; inList = false; }

                    if (/Time\s?stamps|Timestamp|Chapters/i.test(coreText)) foundTimestamps = true;
                    if (/Extended\s+description/i.test(coreText)) injectedExtendedHeader = true;

                    html += `<h4>${coreText}</h4>`;
                    return;
                }

                // 3. Detect Timestamps (e.g., (02:42))
                if (/^(\(?(\d{1,2}:)?\d{2}:\d{2}\)?)/.test(trimmed)) {
                    let row = trimmed.replace(/^(\(?(\d{1,2}:)?\d{2}:\d{2}\)?)\s*/, '<strong>$1</strong> ');
                    row = row.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    html += `<p class="timestamp-row">${row}</p>`;
                    return;
                }

                // 4. Inject "Extended description" Header (Heuristic)
                // If we passed timestamps and haven't seen the header yet, inject it.
                if (foundTimestamps && !injectedExtendedHeader) {
                    if (inList) { html += '</ul>'; inList = false; }
                    html += `<h4>Extended description</h4>`;
                    injectedExtendedHeader = true;
                }

                // 5. Detect Lists (Bullets or Emojis)
                if (/^[-•]/.test(trimmed)) {
                    if (!inList) { html += '<ul>'; inList = true; }
                    let content = trimmed.replace(/^[-•]\s*/, '');
                    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    html += `<li>${content}</li>`;
                    return;
                }

                if (inList) { html += '</ul>'; inList = false; }

                // 6. Regular Paragraphs
                let para = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                html += `<p>${para}</p>`;
            });

            if (inList) html += '</ul>';
            return html;
        },

        extractTakeaways(description) {
            if (!description) return [];

            let takeawayLines = [];

            // Try specific header block first
            const takeawayRegex = /(?:Takeaways|Key Takeaways|Key Lessons|Highlights)[:\s-]*\n([\s\S]*?)(?:\n\n|Chapters|Time stamps|Links|Timestamp|Toolkit|\*\*Key Timestamps|\*\*Extended description|Extended description|$)/i;
            const match = description.match(takeawayRegex);

            if (match && match[1]) {
                takeawayLines = match[1].split('\n');
            } else {
                // Fallback: limited scan until next section
                const splitBySection = description.split(/(?:Chapters|Time stamps|Links|Timestamp|Toolkit|\*\*Key Timestamps|\*\*Extended description|Extended description)/i);
                takeawayLines = splitBySection[0].split('\n');
            }

            return takeawayLines
                .map(line => line.trim())
                .filter(line => line.length > 5)
                .filter(line => /^[-•*]/.test(line) || /^[^\x00-\x7F]/.test(line)) // Bullets or Emojis
                .slice(0, 3) // Top 3 only
                .map(line => {
                    let cleaned = line.replace(/^([-•*]\s*)/, '');
                    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return cleaned.replace(/\*/g, '').trim();
                });
        }
    },

    // --- UI LOGIC ---
    UI: {
        init() {
            this.setupMobileMenu();
            this.setupSmoothScroll();
            this.setupAnimations();
        },

        setupMobileMenu() {
            const menuToggle = document.querySelector('.menu-toggle');
            const navLinks = document.querySelector('.nav-links');

            if (menuToggle && navLinks) {
                menuToggle.addEventListener('click', () => {
                    const isFlex = navLinks.style.display === 'flex';
                    navLinks.style.display = isFlex ? 'none' : 'flex';

                    if (!isFlex) {
                        // Inline styles for toggle state
                        Object.assign(navLinks.style, {
                            flexDirection: 'column',
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            width: '100%',
                            padding: '1rem',
                            boxShadow: 'var(--shadow-md)'
                        });
                    }
                });
            }
        },

        setupSmoothScroll() {
            const navLinks = document.querySelector('.nav-links');
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                        // Close mobile menu if open
                        if (window.innerWidth <= 768 && navLinks) {
                            navLinks.style.display = 'none';
                        }
                    }
                });
            });
        },

        setupAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

            // New Generic Fade Section Observer
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.fade-in-section').forEach(el => sectionObserver.observe(el));

            // Navbar Scroll Effect
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                });
            }
        }
    },

    // --- MODAL LOGIC ---
    Modal: {
        init() {
            this.modal = document.getElementById('episode-modal');
            this.body = document.getElementById('modal-body');
            this.closeBtn = document.querySelector('.modal-close');
            this.overlay = document.querySelector('.modal-overlay');

            if (!this.modal) return;

            this.bindEvents();
        },

        bindEvents() {
            const closeModal = () => this.modal.classList.remove('active');

            this.closeBtn.addEventListener('click', closeModal);
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) closeModal();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('active')) closeModal();
            });
        },

        open(episode) {
            if (!this.modal || !this.body) return;

            // Date Formatting
            const dateStr = new Date(episode.release_date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            // Render Content
            this.body.innerHTML = `
                <h2>${episode.title}</h2>
                <div class="modal-meta">${dateStr} • ${Math.round(episode.duration_minutes)} min listen</div>
                <div class="modal-desc">${CB.Utils.formatDescription(episode.description)}</div>
                
                <a href="${episode.spotify_url}" target="_blank" class="btn btn-primary" style="width: 100%; text-align: center;">
                    Listen on Spotify
                </a>
            `;

            this.modal.classList.add('active');
            this.applySpacingFixes();
        },

        // "Nuclear" Spacing Fix: Force gap between intro text and emoji lists
        applySpacingFixes() {
            const paras = this.body.querySelectorAll('p');
            paras.forEach(p => {
                const text = p.textContent.trim();
                // Check for non-word chars at start (Emojis, bullets)
                if (text.length > 0 && !/^[\w"']/.test(text)) {
                    p.classList.add('emoji-list-item');
                }
            });
        },

        // Open by ID (used for Bento Grid)
        openById(id) {
            const data = typeof PODCAST_DATA !== 'undefined' ? PODCAST_DATA : window.PODCAST_DATA;
            if (!data || !data.episodes) return;

            const episode = data.episodes.find(ep => ep.id === id);
            if (episode) {
                this.open(episode);
            } else {
                console.warn("Episode not found:", id);
            }
        }
    },

    // --- ORBIT LOGIC ---
    Orbit: {
        activeIndex: 0,
        items: [],
        elements: [],

        init(episodes) {
            this.container = document.getElementById('orbit-container');
            this.track = document.getElementById('orbit-track');
            this.prevBtn = document.getElementById('orbit-prev');
            this.nextBtn = document.getElementById('orbit-next');

            if (!this.track) return;

            // Take top 5 for the orbit (Center + 2 neighbors + 2 hidden buffers)
            // Even if fewer, it works, but 5 is ideal for this visual
            this.episodes = episodes.slice(0, 5);

            this.renderCards();
            this.updateClasses();
            this.bindEvents();
        },

        renderCards() {
            this.track.innerHTML = '';
            this.elements = this.episodes.map((ep, i) => {
                // Reuse existing card creation but modify for Orbit
                const card = CB.Podcast.createCard(ep, i);

                // Swap classes
                card.classList.remove('episode-card', 'fade-in-up');
                card.classList.add('orbit-item');

                // RESET INLINE STYLES from createCard (opacity: 0)
                card.style.opacity = '';
                card.style.transform = '';

                // Click to navigate
                card.addEventListener('click', () => {
                    // If clicking a side card, rotate to it. 
                    // If clicking center, maybe open modal? 
                    // Current behavior: createCard adds modal trigger to title/button.
                    // We need to ensure clicking the *card body* rotates, 
                    // but clicking the *button* opens modal.
                    // Actually, let's keep it simple: Click anytime rotates to it, 
                    // UNLESS it's already center, then inner clicks work.

                    if (this.activeIndex !== i) {
                        this.goTo(i);
                    }
                });

                this.track.appendChild(card);
                return card;
            });
        },

        goTo(index) {
            this.activeIndex = index;
            this.updateClasses();
        },

        next() {
            this.activeIndex = (this.activeIndex + 1) % this.elements.length;
            this.updateClasses();
        },

        prev() {
            this.activeIndex = (this.activeIndex - 1 + this.elements.length) % this.elements.length;
            this.updateClasses();
        },

        updateClasses() {
            const count = this.elements.length;

            this.elements.forEach((item, i) => {
                // Remove state classes, keep base
                item.className = 'orbit-item';

                // Calculate distance wrapped around
                // distance: 0 (center), 1 (right), -1 (left), etc.
                // We need a stable modulo logic for distance

                let diff = (i - this.activeIndex) % count;
                if (diff < 0) diff += count; // normalize to 0..count-1

                // Map standard diffs: 
                // 0 -> Center
                // 1 -> Right
                // count-1 -> Left (equivalent to -1)
                // 2 -> Far Right
                // count-2 -> Far Left (equivalent to -2)

                if (diff === 0) {
                    item.classList.add('center');
                    // Enable pointer events for inner triggers only when centered
                    item.style.pointerEvents = 'auto';
                } else if (diff === 1) {
                    item.classList.add('right');
                } else if (diff === count - 1) {
                    item.classList.add('left');
                } else if (diff === 2) {
                    item.classList.add('far-right');
                } else if (diff === count - 2) {
                    item.classList.add('far-left');
                } else {
                    item.style.opacity = '0';
                    item.style.pointerEvents = 'none';
                }
            });
        },

        bindEvents() {
            if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
            if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

            // Keyboard
            document.addEventListener('keydown', (e) => {
                // Only if element is in view to avoid hijacking global scroll? 
                // For now, simple binding.
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            });

            // Swipe
            let startX = 0;
            this.track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
            this.track.addEventListener('touchend', e => {
                const endX = e.changedTouches[0].clientX;
                if (startX - endX > 50) this.next();
                if (endX - startX > 50) this.prev();
            });
        }
    },

    // --- PODCAST DATA ---
    Podcast: {
        init() {
            const data = this.getData();
            if (!data || !data.episodes) {
                console.error("No podcast data found");
                return;
            }

            // 1. Try Orbit (Landing Page)
            const orbitContainer = document.getElementById('orbit-container');
            if (orbitContainer) {
                CB.Orbit.init(data.episodes);
                return;
            }

            // 2. Try Grid (Archive Page)
            this.grid = document.getElementById('episodes-grid');
            if (this.grid) {
                this.loadGrid(data.episodes);
            }
        },

        getData() {
            return typeof PODCAST_DATA !== 'undefined' ? PODCAST_DATA : window.PODCAST_DATA;
        },

        loadGrid(episodes) {
            try {
                this.grid.innerHTML = '';
                const isArchive = document.body.classList.contains('page-episodes');
                const limit = isArchive ? episodes.length : 3;

                episodes.slice(0, limit).forEach((episode, index) => {
                    const card = this.createCard(episode, index);
                    this.grid.appendChild(card);

                    // Staggered Animation
                    setTimeout(() => {
                        card.classList.add('visible');
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                });

            } catch (error) {
                console.error('Error loading episodes:', error);
                this.grid.innerHTML = '<p class="error-msg">Failed to load episodes.</p>';
            }
        },

        createCard(episode, index) {
            const article = document.createElement('article');
            article.className = 'episode-card fade-in-up';
            article.style.opacity = '0';

            const dateStr = episode.release_date
                ? new Date(episode.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : 'Recently';

            const takeaways = CB.Utils.extractTakeaways(episode.description);
            let takeawaysHtml = '';

            if (takeaways.length > 0) {
                takeawaysHtml = `
                    <div class="takeaways-preview">
                        <ul class="takeaways-list">
                            ${takeaways.slice(0, 3).map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            article.innerHTML = `
                <div class="episode-content">
                    <div class="episode-meta">
                        <span class="episode-date">${dateStr}</span>
                        <span class="episode-duration">${Math.round(episode.duration_minutes)} min</span>
                    </div>
                    
                    <h3 class="episode-title">
                        <a href="#" class="modal-trigger">${episode.title}</a>
                    </h3>
                    
                    ${takeawaysHtml}
                    
                    <button class="read-more-btn modal-trigger" style="margin-top: auto; padding-top: 1rem;">Read Full Description</button>
                    
                    <div class="episode-footer">
                        <a href="${episode.spotify_url}" target="_blank" class="listen-link">
                            <span>▶</span> Listen
                        </a>
                    </div>
                </div>
            `;

            article.querySelectorAll('.modal-trigger').forEach(t => {
                t.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent orbit rotation click
                    CB.Modal.open(episode);
                });
            });

            return article;
        }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    CB.UI.init();
    CB.Modal.init();
    CB.Podcast.init();
});


