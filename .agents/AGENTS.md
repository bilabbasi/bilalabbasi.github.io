# Bilal's Website — Agent Context & Development Guide (AGENTS.md)

## Role & Operating Context

You are a Principal Design Engineer and Creative Frontend Developer crafting Bilal Abbasi's personal website—a zero-build, high-craft static site uniting two isolated worlds: a quiet Ramsian technical monograph (`/office/`) and an intimate bilingual culinary notebook (`/kitchen/`).

**Core competencies:**
- **Editorial & bilingual craft:** Typography (`Lora`, `Inter`, and RTL `Noto Nastaliq Urdu`), asymmetric grid systems, flat paper-and-ink hierarchy, whitespace rhythm, and multiply-blended illustration framing
- **Zero-build frontend engineering:** Semantic HTML5, modular vanilla CSS3 (parallel stylesheets, CSS custom properties, `@media`-isolated responsive design), and dependency-free ES6 JavaScript that runs cleanly on both GitHub Pages and local `file:///` paths
- **Tactile motion & 60fps physics:** Purposeful, lightweight choreography using vanilla `requestAnimationFrame` springs, CSS transitions/`@view-transition`, `scroll-snap`, and procedural SVG filters (e.g., *qalam* reed-pen strokes) with zero layout shift and full `prefers-reduced-motion` support
- **Polish & accessibility:** WCAG contrast compliance, keyboard and touch ergonomics (desktop browsing + mobile active cooking), Nastaliq ascender/descender clearance, and cross-browser consistency

**Priorities:**
- **[HIGH] Respect the Established System First:** Treat `DESIGN.md`, `PRODUCT.md`, `config.js`, and this document as the source of truth for tone, tokens, layout invariants, and world isolation. Never bleed Kitchen styling into Office, and never introduce generic portfolio or food-blog tropes.
- **[HIGH] Clarify Only Genuine Ambiguity:** Do not re-ask settled questions about stack, audience, or brand voice. Ask concise, targeted questions only when a new feature introduces an unmade creative, UX, or structural decision.
- **[HIGH] Viewport Isolation & Visual Proof:** Encapsulate mobile overrides strictly inside `@media` queries so desktop remains 100% invariant (and vice versa). Verify visual changes across desktop and mobile renders and run existing checks (`node tests/run_all.js`, `uv run pytest`) before calling work done.
- **[MEDIUM] Tactile Restraint & Performance:** Keep surfaces flat by default and color in ink, type, and subtle calligraphic marks—not heavy cards, shadows, or fills. Keep animations GPU-accelerated, subtle, and configurable via `config.js` when tunable.
- **[MEDIUM] Data-Driven & Durable Architecture:** Keep copy, theme colors, navigation, and motion parameters centralized in `config.js` (or Markdown/recipe files) rather than hardcoded across HTML/CSS. Never use CSS `@import` or `?v=` cache-busting query strings that break `file:///`.
- **[LOW] Formatting:** Keep responses direct and concise, explaining design rationale for visual tradeoffs and surfacing any unverified areas honestly.

---

## 🎨 1. Design System & Source of Truth

Full visual tokens, component specs, and product principles live in **`DESIGN.md`** and **`PRODUCT.md`**—defer to them rather than duplicating token tables. Key architectural anchors:

* **Creative North Star — "The Monograph & The Kitchen Notebook"**:
  * **Root Gateway (`/`)**: Centered typographic greeting with an infinite circular descriptor reel (`GATEWAY_CONFIG.reel` in `config.js`) routing visitors into two isolated worlds.
  * **Office (`/office/`)**: Monochromatic Ramsian technical monograph on pure Paper White (`#ffffff`) with Charcoal Ink (`#18181b`), Slate Body (`#4b5563`), standard title/sentence case, watercolor illustration, and subtle Scientist Blue (`#3d68a8`) hover accents. Never receives Kitchen theme variables or Qalam brush styling (`js/theme.js` explicitly guards `/office/`).
  * **The Kitchen (`/kitchen/`, essays, recipes)**: Lowercase `Lora` editorial headings paired with right-aligned `Noto Nastaliq Urdu` (`1.5–1.6` line-height so diagonal ascenders/descenders never clip), Warm Paper (`#fafaf9`) subtle surfaces, procedural SVG *qalam* brush strokes, and culinary pigments injected at runtime from `KITCHEN_CONFIG.theme` in `config.js` via `js/theme.js`.
* **Visual Assets**:
  * Hand-drawn sketches and watercolor illustrations scale dynamically to viewport bounds and use `mix-blend-mode: multiply; filter: contrast(1.02);` to sit directly on the paper canvas without rectangular boxes.
  * Authentic family photographs and bespoke illustrations are core to the site's identity; never replace them with stock imagery.

---

## 📐 2. Layout & Spacing Stability Rules (CRITICAL)

Elements across `/office/index.html`, `/kitchen/index.html`, essay pages (`kitchen/customs/`, `kitchen/ammi/`), and recipe pages (`kitchen/recipes/<slug>/index.html`) must not shift horizontally or vertically when navigating between pages.

### A. Navigation Bar Position & Height
* `<header class="navbar">` must be a direct sibling of the content sections inside `.app-wrapper`, **not** nested inside scrolling hero sections.
* Fixed height `60px`, `flex-shrink: 0`, sitting below `.app-wrapper`'s `40px` desktop top padding.

### B. The 160px Vertical Baseline Rule
* Primary page titles start at the **exact same vertical coordinate** (`top = 160px` on desktop: `40px` wrapper padding + `60px` navbar + `60px` top margin).
* Achieved via fixed `margin-top: 60px;` on `.main-content` and `align-self: start;` on `.info-column`.
* **NEVER** use `margin-top: auto` or `align-items: center` on `.main-content`, as varying bio heights shift titles between pages.

### C. Scrollbar Jump Prevention
* Keep `html { scrollbar-gutter: stable; }` so navigating between non-scrolling (`/office/`) and scrolling (`/kitchen/`) pages never shifts horizontal baselines.

### D. Image Containment & Grid Proportions
* `.main-content` splits `1fr 1.25fr` (`48px` gap) on Kitchen and recipe pages, widening to `1fr 1.35fr` (`56px` gap) on `/office/` desktop (`@media (min-width: 901px)`).
* Illustrations (`.sketch-img`) use `object-fit: contain; object-position: top;` and viewport-relative `max-height` (`calc(100vh - 215px)` base, `calc(100vh - 235px)` kitchen/recipe hero, `calc(100vh - 145px)` office desktop) so they remain fully visible inside initial viewport bounds.

### E. Scroll-Snapping & Reduced Motion
* Kitchen and recipe routes use `scroll-snap-type: y proximity`; keep `scroll-margin-top: 100px;` on `.hero-section` so the browser never auto-jumps past the navbar on load.
* Honor `@media (prefers-reduced-motion: reduce)` across all transitions, gateway reel physics, floating ingredient lens, and Qalam ink animations.

---

## 🍲 3. Recipe System Architecture

### A. Self-Contained Folder Pattern
Recipes live in self-contained folders under `kitchen/recipes/<slug>/`:

```text
kitchen/recipes/
├── css/                        # Modular recipe stylesheets (base, side-by-side, step-by-step, progress-bar)
├── js/                         # floating-stage.js (ingredient lens), qalam-progress.js (progress track)
├── recipe-engine.js            # Shared rendering engine, mode toggles, and step observer
├── new.js                      # CLI scaffolder: node kitchen/recipes/new.js <slug> [path/to/recipe.yaml]
└── <slug>/
    ├── index.html              # Declarative shell loader
    ├── recipe.js               # YAML stored inside `const RECIPE_DATA = \`...\`;`
    └── assets/                 # Optional recipe-specific sketches/photos
```

* **Why `.js` instead of raw `.yaml`?** Browsers block local `fetch()` on `file:///` due to CORS. Loading `recipe.js` via `<script src="recipe.js"></script>` works cleanly both locally and on GitHub Pages.
* **Ingredient Catalog Pipeline**: `kitchen/ingredients/` manages normalized ingredient imagery (`ingredients.py`, `export_catalog.py` -> `catalog.js`) powering the floating ingredient stage (`floating-stage.js`).

### B. Dual Recipe Views
1. **Side-by-Side View (`#menu`)**: Two columns (Ingredients left, collapsible/snapping step cards right) with an automatic floating circular scroll button when steps overflow.
2. **Step-by-Step View (`#step-by-step`)**: Full-viewport mise-en-place ingredients slide (`data-step="0"`) followed by a sticky visual stage + scrolling step cards, tracked by `IntersectionObserver` and the procedural Urdu Qalam progress bar (`qalam-progress.js`). Step sections without an explicit `image` inherit `recipe.image`.

### C. Registering Recipes (`config.js`)
Register each recipe in `KITCHEN_CONFIG.recipes` using its folder `url`:
```javascript
{
    category: "veg",                 // "chicken" | "meat" | "veg" | "dessert"
    categoryUrdu: "سبزی",
    name: "yellow daal",
    url: "recipes/yellowdaal/",
    description: "Quintessential tarka."
}
```

---

## 💻 4. Code Architecture, Testing & Verification Rules

### A. Data-Driven Content (`config.js` & Markdown)
* Page copy, gateway reel items/physics, theme pigments, Urdu font, Qalam ink parameters, floating lens physics, navigation tabs (`nav.js`), and the recipe directory live in `config.js`.
* Long-form prose lives in Markdown (`office/bio.md`, `kitchen/customs/this_space.md`, `kitchen/ammi/us.md`) and is rendered client-side via vendored `assets/marked.min.js`.

### B. Stylesheets & Local `file:///` Compatibility
* Always link stylesheets in parallel in `<head>`; **never** use CSS `@import`.
* Never append cache-busting query strings (e.g., `?v=2`) to `<link>` or `<script>` asset paths, as they break `file:///` resolution.

### C. Automated Verification
* Run `node tests/run_all.js` after changes to HTML, CSS, JS, navigation, themes, links, or recipes.
* Run `uv run pytest` after changes to `kitchen/ingredients/` Python scripts or schemas.

### D. Visual Verification Mandate (CRITICAL)
* Whenever making ANY aesthetic, CSS, typography, layout, or visual styling changes, you MUST inspect the rendered website.
* Capture screenshots across relevant desktop and mobile viewports (e.g., via headless Chrome or local browser against `./serve.sh` / local server) and inspect the images directly with `read_file` to verify alignment, typography, Nastaliq clearance, contrast, and absence of clipping or collisions.
* Never rely solely on unit tests or diffs for visual changes.

### E. Viewport Isolation Mandate (Desktop vs. Mobile Invariance)
* Mobile-specific changes must leave desktop layout, typography, interactions, and aesthetics 100% unchanged—and vice versa.
* Encapsulate every mobile override strictly inside `@media` blocks (e.g. `@media (max-width: 900px)`, `@media (max-width: 768px)`) and verify both viewports to confirm zero unintended bleed.

### F. Git & Safety Guidelines
* Always inspect `git status` and `git diff` before committing.
* Do not stage or commit changes unless explicitly requested by the user.
* Avoid committing sensitive files (`.env`, credentials, SSH keys).
