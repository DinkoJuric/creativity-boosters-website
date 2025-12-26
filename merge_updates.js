const fs = require('fs');

try {
    const originalData = JSON.parse(fs.readFileSync('podcast_episodes.json', 'utf8'));
    const userData = JSON.parse(fs.readFileSync('user_manual_update.json', 'utf8'));

    // Map user episodes by ID for easy lookup
    const userEpisodesMap = new Map(userData.episodes.map(ep => [ep.id, ep]));

    let updatedCount = 0;

    originalData.episodes.forEach(episode => {
        if (userEpisodesMap.has(episode.id)) {
            const userEpisode = userEpisodesMap.get(episode.id);
            // Overwrite description with user's manual version
            episode.description = userEpisode.description;

            // Should accurate metadata be needed, we could merge other fields, but assuming description is the key here.
            updatedCount++;
        } else {
            // For episodes NOT in user list, we ensure "Extended description" logic is applied if missing
            // BUT user asked to "revert" distortion.
            // If the distortion was adding "Extended description" incorrectly, maybe we should leave them alone OR revert them
            // to whatever they were in podcast_episodes.json (which IS the backup).
            // So we do nothing to them, we just keep them as is from the clean backup.
        }
    });

    console.log(`Updated ${updatedCount} episodes from user manual input.`);

    // Write back to podcast_episodes_updated.json
    fs.writeFileSync('podcast_episodes_updated.json', JSON.stringify(originalData, null, 4), 'utf8');

    // Update episodes_data.js
    fs.writeFileSync('episodes_data.js', `const PODCAST_DATA = ${JSON.stringify(originalData, null, 4)};`, 'utf8');

    console.log('Successfully saved merged data.');

} catch (err) {
    console.error('Error merging data:', err);
    process.exit(1);
}
