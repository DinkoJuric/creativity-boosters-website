# Creativity Boosters Website - Architecture & Structure

This document outlines the technical architecture, file structure, and design patterns used in the Creativity Boosters website.

## 1. Technology Stack
- **Core**: Semantic HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+).
- **Data**: Static JS object (`episodes_data.js`) acting as a lightweight database.
- **Dependencies**: None. No build steps, frameworks, or external libraries required.

## 2. File Structure

```
/
├── index.html            # Main landing page (latest episodes, about, subscribe)
├── episodes.html         # Full episode archive
├── style.css             # Centralized stylesheet (variables, components, layout)
├── script.js             # Main application logic (modular namespace)
├── episodes_data.js      # 'Database' file containing all episode metadata
├── podcast_episodes_updated.json # Backup/Reference of the episode data
├── perfect_description_template.json # Template for future episode descriptions
└── assets/               # Images, logos, and static resources
```

> **Note**: `podcast_episodes_updated.json` and `perfect_description_template.json` are preserved as reference for content formatting and data backup, though the live site runs off `episodes_data.js`.

## 3. JavaScript Architecture (`script.js`)

The application logic is encapsulated within a single global namespace `CB` to prevent global scope pollution. It is organized into four distinct modules:

### `CB.Utils`
Pure functions for data formatting.
- `formatDescription(text)`: Converts raw text descriptions into structured HTML with headers, lists, and timestamps.
- `extractTakeaways(description)`: Regex-based extraction of key highlights/bullet points from episode descriptions.

### `CB.UI`
Handles general website interface interactions.
- `setupMobileMenu()`: Toggles the mobile navigation dropdown.
- `setupSmoothScroll()`: Intercepts anchor links for smooth scrolling behavior.
- `setupAnimations()`: Manages `IntersectionObserver` for scroll-triggered fade-in effects.

### `CB.Modal`
Manages the Episode Detail View.
- `open(episode)`: Populates the modal with data, injects HTML, and triggers visibility.
- `applySpacingFixes()`: A UI patch that detects list items in paragraphs and enforces correct spacing (the "Red Line" fix).

### `CB.Podcast`
Responsible for data binding and DOM generation.
- `loadEpisodes()`: Fetches data from `PODCAST_DATA`, determines how many to show (3 vs. all), and renders the grid.
- `createCard(episode)`: Generates the HTML structure for individual episode cards.

## 4. CSS Architecture (`style.css`)

The CSS uses a semantic, variable-driven approach.

### Key Concepts
- **Variables**: All colors, fonts, and spacing are defined in `:root`.
    - *Palette*: Brand Teal, Champagne Mist, Ink Black (Dark Mode).
- **Responsive Design**: Mobile-first media queries (mostly adjusting grid columns and font sizes).
- **Components**: Reusable classes for buttons (`.btn-primary`), cards (`.episode-card`), and modals (`.modal-container`).
- **Animations**: CSS transitions for hover states and `@keyframes` (handled via Javascript adding classes) for entry animations.

## 5. Data Flow

1. **Source**: `episodes_data.js` defines a global constant `const PODCAST_DATA = { ... }`.
2. **Loading**: `index.html` and `episodes.html` script tags load `episodes_data.js` *before* `script.js`.
3. **Consumption**: `CB.Podcast.loadEpisodes()` reads `PODCAST_DATA` and generates the DOM elements dynamically.
4. **Detail View**: Clicking a card passes the specific `episode` object to `CB.Modal.open(episode)`, which renders the detailed view in the overlay.
