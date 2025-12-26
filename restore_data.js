const fs = require('fs');

function processDescription(description) {
    if (!description) return '';

    // If it already has the header, don't add it again
    if (description.includes('Extended description')) return description;

    const sections = description.split('\n\n');
    if (sections.length > 1) {
        const lastIndex = sections.length - 1;
        // Check if the last section looks like a summary paragraph
        // Usually long, no bullets, no timestamps
        if (sections[lastIndex].length > 100 && !sections[lastIndex].includes(':') && !/^[-•*]/.test(sections[lastIndex])) {
            sections[lastIndex] = '**Extended description:**\n' + sections[lastIndex];
        } else if (sections.length > 2) {
            // Try the second to last if the last is short (like a link)
            sections[lastIndex] = '**Extended description:**\n' + sections[lastIndex];
        }
    } else {
        // Just add it before the text if only one paragraph
        return '**Extended description:**\n' + description;
    }

    return sections.join('\n\n');
}

try {
    const rawData = fs.readFileSync('podcast_episodes.json', 'utf8');
    const data = JSON.parse(rawData);

    data.episodes.forEach(episode => {
        episode.description = processDescription(episode.description);
    });

    // Save JSON
    fs.writeFileSync('podcast_episodes_updated.json', JSON.stringify(data, null, 4), 'utf8');

    // Save JS Data
    fs.writeFileSync('episodes_data.js', 'const PODCAST_DATA = ' + JSON.stringify(data, null, 4) + ';', 'utf8');

    console.log('Successfully processed ' + data.episodes.length + ' episodes.');
} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
