# Modal Spacing Guide

This document explains exactly how to control the spacing for the different sections of your episode modal, based on the red lines you highlighted.

![Your Spacing Request](assets/spacing_diagram.png)

## 1. The "Red Line" Gap (Intro Text -> Bullet Points)
**What it is:** The large gap between your introductory paragraph and the first emoji bullet point.
**How it works:** This is the "Nuclear Option" rule we added. It specifically targets *any emoji list item that comes immediately after a normal paragraph*.

**File:** `style.css`
**Find this code (near bottom of file):**
```css
/* Fallback spacing for the "Red Line" gap */
p:not(.emoji-list-item) + .emoji-list-item {
    margin-top: 2.0rem !important;  /* <--- CHANGE THIS VALUE */
}
```
- **Increase**: `3.0rem` (Wider gap)
- **Decrease**: `1.0rem` (Narrower gap)

---

## 2. The "Top Red Line" (Title/Date -> Description)
**What it is:** The vertical space between the episode title/date and the start of the text.
**How it works:** This is controlled by the bottom margin of the meta information block.

**File:** `style.css`
**Find this code:**
```css
.modal-meta {
    color: var(--primary);
    margin-bottom: 2rem; /* <--- ADD or CHANGE THIS VALUE */
}
```
*Note: If `margin-bottom` isn't there, you can add it to increase space.*

---

## 3. Section Headers (Key Timestamps & Extended Description)
**What it is:** The space *above* headers like "Key Timestamps" and "Extended description".
**How it works:** This rule controls the top margin for all H4 headers inside the description.

**File:** `style.css`
**Find this code:**
```css
.modal-desc h4 {
    /* ... other styles ... */
    margin-top: 2.5rem; /* <--- CHANGE THIS VALUE (Space ABOVE header) */
    margin-bottom: 1rem; /* <--- CHANGE THIS VALUE (Space BELOW header) */
}
```
- **To move the header down (more space above):** Increase `margin-top` (e.g., `4.5rem`).
- **To move the text below it closer:** Decrease `margin-bottom` (e.g., `0.5rem`).

---

## 4. Spacing Between List Items
**What it is:** The vertical space between each emoji bullet point.

**File:** `style.css`
**Find this code:**
```css
.emoji-list-item {
    margin-bottom: 0.5rem; /* <--- CHANGE THIS VALUE */
}
```
- **More breathing room:** Increase to `1rem`.
- **Tighter list:** Decrease to `0.25rem`.

---

## 5. Modal Button Spacing (Text -> Spotify Button)
**What it is:** The vertical space between the last paragraph of text and the "Listen on Spotify" button.

**File:** `style.css`
**Find this code:**
```css
/* Modal Button Spacing */
.modal-container .btn-primary {
    margin-top: 3rem; /* <--- CHANGE THIS VALUE */
}
```
- **Increase**: `4rem` or more for a larger gap.

---

## Cheatsheet
| Visual Area | CSS Rule | Property to Change |
| :--- | :--- | :--- |
| **Top (Title ➔ Desc)** | `.modal-meta` | `margin-bottom` |
| **Intro ➔ 🚀 List** | `p:not(.emoji-list-item) + .emoji-list-item` | `margin-top` |
| **Space ABOVE "Timestamps"** | `.modal-desc h4` | `margin-top` |
| **Space BELOW "Timestamps"** | `.modal-desc h4` | `margin-bottom` |
| **Between 🚀 Items** | `.emoji-list-item` | `margin-bottom` |
| **Above Spotify Button** | `.modal-container .btn-primary` | `margin-top` |
