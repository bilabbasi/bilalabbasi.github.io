---
name: office-profile
description: Instructions, layout stability constraints, and theme isolation rules for updating Bilal Abbasi's office profile landing page.
---

# Office Profile Management Skill

This skill provides the operational playbook for updating biographical content, external links, and visual assets on Bilal Abbasi's office landing page (`office/index.html`), while strictly maintaining Ramsian layout stability and theme isolation.

## Architecture

The office profile is data-driven from `config.js` (`OFFICE_CONFIG`) and `office/bio.md`:

```text
office/
├── index.html             # High-impact typography and sketch silhouette layout
└── bio.md                 # Markdown biography rendered via assets/marked.min.js
config.js                  # Data source: name, subtitle, bioFile, contact, external links
index.css                  # Core typography and grid layout rules
```

---

## Content Editing in `office/bio.md` & `config.js`

Edit `office/bio.md` directly in standard Markdown to update the biography (paragraphs, links, bold/italics, lists). External `http(s)` links automatically receive `target="_blank" rel="noopener noreferrer"` on render.

To update name, subtitle, contact label, or external profile links, edit `OFFICE_CONFIG` in `config.js`:

```javascript
const OFFICE_CONFIG = {
    // Display name
    name: "Bilal Abbasi",

    // Office subtitle (e.g. "Research Scientist, PhD")
    subtitle: "Research Scientist, PhD",

    // Biography Markdown file (relative to office/index.html)
    bioFile: "bio.md",

    // Contact trigger & obfuscated recipient
    contact: {
        label: "Let's get to work.",
        codes: [...],
        key: 73
    },

    // External links (LinkedIn, Google Scholar, GitHub, etc.)
    links: [
        { label: "LinkedIn", url: "https://linkedin.com/in/bilabbasi" },
        { label: "Google Scholar", url: "https://scholar.google.com/citations?user=jlcrVoIAAAAJ&hl=en" },
        { label: "GitHub", url: "https://github.com/bilabbasi" }
    ]
};
```

- **Markdown Bio**: `office/index.html` fetches `OFFICE_CONFIG.bioFile` (`office/bio.md`) and renders it with vendored `assets/marked.min.js` into `<div class="bio-paragraph" id="bio-text">`.
- **Automatic Safe Links**: External links (`https://...`) in `office/bio.md` automatically get `target="_blank"` and `rel="noopener noreferrer"`.

---

## Strict Layout Stability Mandates (Zero-Shift Guarantee)

To preserve Ramsian visual stability, elements across the office landing page (`office/index.html`), kitchen landing page (`kitchen/index.html`), and recipe pages must never jump horizontally or vertically during navigation:

1. **Vertical Baseline Alignment (`top = 160px`)**:
   - The title, subtitle, and biography text blocks must start at the exact same vertical coordinate (`top = 160px` relative to viewport top).
   - **Achieved by**: Fixed `margin-top: 60px;` on `.main-content` directly below the fixed `60px` navbar (`40px` wrapper padding + `60px` navbar + `60px` margin = `160px`).
   - `align-self: start;` on `.info-column` ensures text blocks align flush with the top of the grid row.
   - **NEVER** use auto margins (`margin-top: auto`) or vertical grid alignment (`align-items: center`) on `.main-content`, as varying bio lengths will shift the title baseline between pages.
2. **Grid Proportions (`1fr 1.35fr` on Office desktop)**:
   - The base content grid (`.main-content`) uses `1fr 1.25fr` (`gap: 48px;`), widening to `1fr 1.35fr` (`gap: 56px;`) on `.main-content.office-content` at desktop (`@media (min-width: 901px)`) so the watercolor illustration carries greater presence.
3. **Illustration Containment**:
   - Illustrations (`.sketch-img`) use `object-fit: contain;` and `object-position: top;`, with `max-height: calc(100vh - 215px);` as the base rule and `max-height: calc(100vh - 145px);` for `.office-sketch .sketch-img` on desktop (`@media (min-width: 901px)`).
4. **Scrollbar Gutter Reservation**:
   - `html { scrollbar-gutter: stable; }` prevents horizontal layout shifts when moving from a non-scrollable page (office home) to a scrollable page (kitchen menu).
5. **Strict Theme Isolation (Zero Style Bleed)**:
   - Kitchen theme colors and CSS variables (`--link-color`, `--text-subtitle`, `--link-hover`, `--color-pop`, `--color-urdu`) MUST NEVER bleed into `/office/`.
   - The theme applicator in `js/theme.js` explicitly guards `/office/` paths.

---

## Verification Checklist
- [ ] Biography and links render correctly on `/office/index.html`
- [ ] External links have `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Top baseline starts at `160px` below viewport top
- [ ] No kitchen theme CSS variables bleed into the office page
- [ ] No layout shift when navigating between `/office/` and `/kitchen/`
- [ ] Run test suite: `node tests/run_all.js`
