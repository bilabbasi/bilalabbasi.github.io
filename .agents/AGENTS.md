# Bilal's Website - Development & Style Guide (AGENTS.md)

This document outlines the core architecture, visual design system, and layout stability constraints of this project. Any agent working on this codebase MUST review and adhere to these guidelines to prevent regressions.

---

## 🎨 1. Design System & Ethos

The website is designed with a high-fidelity minimalist, typographic aesthetic inspired by Dieter Rams' design principles.

*   **Typography**:
    *   **Serif (Lora)**: Used for high-impact title typography (`.main-title`, `.main-subtitle`, and section headings).
    *   **Sans-Serif (Inter)**: Used for body text, list descriptions, and navigation tabs.
*   **Colors**:
    *   **Base**: Dark charcoal text (`#1e293b` for titles, `#475569` for body) on a warm off-white background (`#fafaf9`).
    *   **Accents**: 
        *   *Professional Profile*: Monochromatic/neutral grayscale.
        *   *Kitchen/Recipes*: Warm culinary accents, including terracotta brown (`#7c2d12` for links, `#ea580c` for hover states) and warm amber/ochre (`#b45309` for subtitle).
*   **Visual Assets**:
    *   Features hand-drawn sketch illustrations (e.g. portrait silhouette on professional page, bread blueprints on kitchen/recipe pages) that scale dynamically to fit viewport heights.

---

## 📐 2. Layout & Spacing Stability Rules (CRITICAL)

To maintain absolute visual stability, the elements on the professional landing page, kitchen landing page, and recipe page templates must not shift horizontally or vertically when navigating between pages.

### A. Navigation Tab Position & Height
*   The navigation header (`.navbar`) must remain in the **exact same location** across all pages.
*   The `<header class="navbar">` must be placed as a direct sibling of the content sections inside the `.app-wrapper`, **not** nested inside scrolling hero sections.
*   It has a fixed height of `60px`, `flex-shrink: 0` (to prevent compression on restricted viewports), and sits below a top wrapper padding of `40px`.

### B. Vertical Alignments for Titles & Bios
*   The title, subtitle, and biography text blocks must start at the **exact same vertical coordinate** (`top = 160px` relative to viewport top) across all pages.
*   **How it is achieved**:
    *   We set a fixed `margin-top: 60px;` on the content grid (`.main-content`) directly below the navbar.
    *   We use `align-self: start;` on the text column (`.info-column`) so that text blocks align flush with the top of the grid row, while the image centers itself vertically.
    *   **NEVER** use auto margins (`margin-top: auto`) or vertical grid alignment (`align-items: center`) on the whole grid container, as varying bio text heights will push the titles up/down between page transitions.

### C. Scrollbar Jump Prevention
*   Always ensure `scrollbar-gutter: stable;` is declared on the `html` element. This reserves a vertical layout gutter for the scrollbar, preventing horizontal baseline jumps when navigating from a non-scrollable page (like the professional home) to a scrollable page (like the kitchen page).

### D. Image Containment
*   Illustrations (`.sketch-img`) must remain in full view inside the viewport bounds.
*   They are constrained by `max-height: calc(100vh - 215px);` on the homepage, and `max-height: calc(100vh - 235px);` on scrollable sections to fit perfectly within the initial page boundaries. They use `object-fit: contain;` to scale dynamically.
*   We use `object-position: top;` to align the topmost drawing pixels of the illustration with the top line of the biography headings, preventing visual gaps below the navbar.

### E. Scroll-Snapping offset
*   The kitchen and recipe templates utilize CSS scroll snapping (`scroll-snap-type: y proximity`). 
*   Always apply `scroll-margin-top: 100px;` to the `.hero-section` to offset the scroll alignment boundary by the navbar's layout footprint. This prevents the browser from automatically scrolling/jumping down on page load.

### F. Grid Proportions & Column Spacing
*   The content grid (`.main-content`) is split unequally into a `1fr 1.25fr` ratio (width of visual column is 25% larger than the text column) to make visual illustrations appear larger and occupy more space.
*   We use a grid column `gap: 48px;` to keep column elements close and readable while maximizing layout space.

---

## 💻 3. Code Architecture & Rules

### A. Data-Driven Configurations (`config.js`)
*   Dynamic page content (names, subtitles, biographies, external links, and recipe directories) is loaded from the shared configuration file [config.js](../config.js).
*   **HTML Support**: The biography element loader uses `.innerHTML` rather than `.textContent` in the JavaScript loaders. This allows you to declare line breaks (`<br>`), bold tags (`<strong>`), or other inline HTML elements inside the `config.js` strings.
*   **Newline Support**: The `.bio-paragraph` class uses `white-space: pre-line;` to preserve raw newlines (`\n` or template strings) from `config.js`.

### B. Stylesheet Links
*   Always link stylesheet files directly in the HTML `<head>` (e.g. `<link rel="stylesheet" href="index.css">` and `<link rel="stylesheet" href="kitchen.css">`) in parallel.
*   **DO NOT** use `@import` inside CSS files to link stylesheets. Direct linking avoids browser caching blocks during development and allows layout changes to refresh instantly.

### C. Local Filesystem (`file://`) Support
*   Do not include query string variables or version parameters (like `?v=2`) in HTML `<link>` paths. Query strings break resource resolution when loading pages directly from local disk files (`file:///` path drag-and-drops).
