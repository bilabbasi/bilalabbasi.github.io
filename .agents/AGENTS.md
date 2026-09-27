# Bilal's Website - Development & Style Guide (AGENTS.md)

This document outlines the core architecture, visual design system, recipe data pipeline, and layout stability constraints of this project. Any agent working on this codebase MUST review and adhere to these guidelines to prevent regressions.

---

## 🎨 1. Design System & Ethos

The website is designed with a high-fidelity minimalist, typographic aesthetic inspired by Dieter Rams' design principles ("less, but better").

* **Typography**:
  * **Serif (`Lora`)**: Used for high-impact title typography (`.main-title`, `.main-subtitle`, and section headings).
  * **Sans-Serif (`Inter`)**: Used for body text, list descriptions, and navigation tabs.
* **Colors**:
  * **Base**: Dark charcoal text (`#1e293b` for titles, `#475569` for body) on a warm off-white background (`#fafaf9`).
  * **Accents**:
    * *Professional Profile*: Monochromatic/neutral grayscale.
    * *Kitchen/Recipes*: Warm culinary accents, including terracotta brown (`#7c2d12` for links, `#ea580c` for hover states) and warm amber/ochre (`#b45309` for subtitle).
* **Visual Assets**:
  * Hand-drawn sketch illustrations (e.g. portrait silhouette on professional page, culinary sketches and process drawings on kitchen/recipe pages) that scale dynamically to fit viewport heights.
  * In recipe step-by-step mode, sketches use `mix-blend-mode: multiply;` and `filter: contrast(1.02);` to blend seamlessly with the warm off-white paper background.

---

## 📐 2. Layout & Spacing Stability Rules (CRITICAL)

To maintain absolute visual stability, the elements on the professional landing page (`professional/index.html`), kitchen landing page (`kitchen/index.html`), and recipe page template (`recipes/template.html`) must not shift horizontally or vertically when navigating between pages.

### A. Navigation Tab Position & Height
* The navigation header (`.navbar`) must remain in the **exact same location** across all pages.
* The `<header class="navbar">` must be placed as a direct sibling of the content sections inside the `.app-wrapper`, **not** nested inside scrolling hero sections.
* It has a fixed height of `60px`, `flex-shrink: 0` (to prevent compression on restricted viewports), and sits below a top wrapper padding of `40px`.

### B. Vertical Alignments for Titles & Bios
* The title, subtitle, and biography text blocks must start at the **exact same vertical coordinate** (`top = 160px` relative to viewport top) across all pages.
* **How it is achieved**:
  * Fixed `margin-top: 60px;` on the content grid (`.main-content`) directly below the navbar.
  * `align-self: start;` on the text column (`.info-column`) so that text blocks align flush with the top of the grid row, while the image centers itself vertically.
  * **NEVER** use auto margins (`margin-top: auto`) or vertical grid alignment (`align-items: center`) on the whole grid container, as varying bio text heights will push the titles up/down between page transitions.

### C. Scrollbar Jump Prevention
* Always ensure `scrollbar-gutter: stable;` is declared on the `html` element. This reserves a vertical layout gutter for the scrollbar, preventing horizontal baseline jumps when navigating from a non-scrollable page (like the professional home) to a scrollable page (like the kitchen page).

### D. Image Containment
* Illustrations (`.sketch-img`) must remain in full view inside the viewport bounds.
* Constrained by `max-height: calc(100vh - 215px);` on the homepage, and `max-height: calc(100vh - 235px);` on scrollable sections to fit within initial page boundaries. They use `object-fit: contain;`.
* Use `object-position: top;` to align the topmost drawing pixels with the top line of biography headings, preventing visual gaps below the navbar.

### E. Scroll-Snapping Offset
* The kitchen and recipe templates utilize CSS scroll snapping (`scroll-snap-type: y proximity`).
* Always apply `scroll-margin-top: 100px;` to the `.hero-section` to offset the scroll alignment boundary by the navbar's layout footprint. This prevents the browser from automatically scrolling/jumping down on page load.

### F. Grid Proportions & Column Spacing
* The content grid (`.main-content`) is split unequally into a `1fr 1.25fr` ratio (visual column is 25% larger than text column) to make visual illustrations appear prominent.
* Grid column `gap: 48px;` keeps column elements close and readable while maximizing layout space.

---

## 🍲 3. Recipe System Architecture

### A. Recipe File Format (`.js` as YAML container)
* Recipes live in `recipes/recipes/<slug>.js` (or `recipes/examples/<slug>.js`).
* Each recipe is a JavaScript file exporting a template literal:
  ```javascript
  const RECIPE_DATA = `
  title: "Recipe Name"
  subtitle: "ترکیب کا نام"
  description: "Description..."
  image: "../assets/kitchen_sketch.png"

  ingredients:
    - section: "Section Name"
      items:
        - "Ingredient 1"

  steps:
    - section: "Step Section Name"
      image: "../assets/kitchen_sketch_step1.png"
      items:
        - "Step instruction 1"
  `;
  ```
* **Why `.js` instead of raw `.yaml`?**  
  Browsers block local `fetch()` requests on `file:///` URLs due to CORS. Loading the recipe as `<script src="..."></script>` parses without CORS issues both locally and on web servers.

### B. Dual Recipe Views in `recipes/template.html`
1. **Side-by-Side View (`#menu`)**:
   - Two columns: Ingredients on left, Steps on right.
   - Sections are collapsible (`.recipe-section.collapsed`).
   - Sticky scroll button automatically appears when steps overflow.
2. **Step-by-Step View (`#step-by-step`)**:
   - Starts with a centered full-screen "mise en place" ingredients slide (`data-step="0"`).
   - Followed by a split container: sticky illustration on the left (`.visual-sticky-column`) and scrolling step cards on the right (`.steps-scrolling-column`).
   - `IntersectionObserver` tracks the currently centered step slide and activates the corresponding sticky sketch layer (`.sketch-layer.active`) with smooth cross-fade opacity transitions.
   - **Image Fallback**: If a step section omits an `image`, it gracefully falls back to `recipe.image` so the visual container is never blank.

### C. Path Resolution
* `template.html` uses `resolveImagePath()` to normalize paths. Both `"assets/..."` and `"../assets/..."` resolve correctly relative to the `/recipes/` directory.

### D. Registering Recipes (`config.js`)
* Add new recipes to `KITCHEN_CONFIG.recipes` in `config.js`:
  ```javascript
  {
      category: "veg",                     // "chicken", "meat", "veg", "dessert", or custom
      categoryUrdu: "سبزی",
      name: "tarka daal",
      file: "recipes/yellowdaal.js",       // Path relative to recipes/template.html
      description: "Ammi’s comforting yellow lentils..."
  }
  ```

---

## 💻 4. Code Architecture & Development Rules

### A. Data-Driven Configurations (`config.js`)
* Dynamic page content (names, subtitles, biographies, external links, and recipe listings) is driven from `config.js`.
* **HTML Support**: The biography element loader uses `.innerHTML`. You can use `<br>`, `<strong>`, or inline tags in `config.js` strings.
* **Newline Support**: `.bio-paragraph` uses `white-space: pre-line;` to preserve raw newlines (`\n`).

### B. Stylesheet Links
* Always link stylesheets directly in the HTML `<head>` (e.g. `<link rel="stylesheet" href="index.css">` and `<link rel="stylesheet" href="kitchen.css">`) in parallel.
* **DO NOT** use `@import` inside CSS files. Direct linking avoids caching blocks and allows instant reloads.

### C. Local Filesystem (`file://`) Support
* Do not include query string version parameters (e.g. `?v=2`) in HTML `<link>` or `<script>` tags as they break local `file:///` path resolution on some operating systems.
* Query parameters for dynamic recipe loading (`template.html?file=...`) are supported; when omitted, `template.html` defaults to `examples/sourdough.js`.

### D. Git & Safety Guidelines
* Always run `git status` and `git diff` before committing.
* Do not stage or commit changes unless explicitly requested by the user.
* Avoid committing sensitive files (`.env`, credentials, SSH keys).
