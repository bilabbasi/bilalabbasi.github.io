---
name: professional-profile
description: Instructions, layout stability constraints, and theme isolation rules for updating Bilal Abbasi's professional profile landing page.
---

# Professional Profile Management Skill

This skill provides the operational playbook for updating biographical content, external links, and visual assets on Bilal Abbasi's professional landing page (`professional/index.html`), while strictly maintaining Ramsian layout stability and theme isolation.

## Architecture

The professional profile is purely data-driven from `config.js` (`PROFESSIONAL_CONFIG`):

```text
professional/
└── index.html             # High-impact typography and sketch silhouette layout
config.js                  # Data source: bio text, external links, subtitles
index.css                  # Core typography and grid layout rules
```

---

## Content Editing in `config.js`

To update professional information, edit `PROFESSIONAL_CONFIG` in `config.js`:

```javascript
const PROFESSIONAL_CONFIG = {
    // Display name
    name: "Bilal Abbasi",

    // Professional subtitle (e.g. "Research Scientist, PhD")
    subtitle: "Research Scientist, PhD",

    // Biography paragraph (supports inline HTML links and standard \n\n newlines)
    bio: "I am a research scientist at <a href=\"https://www.interdigital.com\" target=\"_blank\" rel=\"noopener noreferrer\">InterDigital</a>, working on AI-based video compression. Previously, I was a researcher at <a href=\"https://eidosmontreal.com\" target=\"_blank\" rel=\"noopener noreferrer\">Eidos-Montréal</a>, working on deep learning for meshes. And, before that, I was doing a PhD at <a href=\"https://www.mcgill.ca\" target=\"_blank\" rel=\"noopener noreferrer\">McGill University</a> in Applied Mathematics. \n \n Let's get to work.",

    // Tab title
    tab: "professional me",

    // External links (LinkedIn, Google Scholar, GitHub, etc.)
    links: [
        { label: "LinkedIn", url: "https://linkedin.com/in/bilabbasi" },
        { label: "Google Scholar", url: "https://scholar.google.com/citations?user=jlcrVoIAAAAJ" },
        { label: "GitHub", url: "https://github.com/bilabbasi" }
    ]
};
```

- **HTML Links Supported**: `.bio-paragraph` uses `.innerHTML`. You can safely include inline links (`<a href="..." target="_blank" rel="noopener noreferrer">`), `<strong>`, or `<br>` tags.
- **Line Breaks**: `.bio-paragraph` uses `white-space: pre-line;` so standard `\n\n` newlines create paragraph spacing without requiring raw HTML tags.

---

## Strict Layout Stability Mandates (Zero-Shift Guarantee)

To preserve Ramsian visual stability, elements across the professional landing page (`professional/index.html`), kitchen landing page (`kitchen/index.html`), and recipe pages must never jump horizontally or vertically during navigation:

1. **Vertical Baseline Alignment (`top = 160px`)**:
   - The title, subtitle, and biography text blocks must start at the exact same vertical coordinate (`top = 160px` relative to viewport top).
   - **Achieved by**: Fixed `margin-top: 60px;` on `.main-content` directly below the fixed `60px` navbar (`40px` wrapper padding + `60px` navbar + `60px` margin = `160px`).
   - `align-self: start;` on `.info-column` ensures text blocks align flush with the top of the grid row.
   - **NEVER** use auto margins (`margin-top: auto`) or vertical grid alignment (`align-items: center`) on `.main-content`, as varying bio lengths will shift the title baseline between pages.
2. **Grid Proportions (`1fr 1.25fr`)**:
   - The content grid (`.main-content`) uses a `1fr 1.25fr` ratio (visual column is 25% larger than the text column) with `gap: 48px;`.
3. **Illustration Containment**:
   - Illustrations (`.sketch-img`) use `max-height: calc(100vh - 215px);`, `object-fit: contain;`, and `object-position: top;` to align the topmost drawing pixels with the biography heading.
4. **Scrollbar Gutter Reservation**:
   - `html { scrollbar-gutter: stable; }` prevents horizontal layout shifts when moving from a non-scrollable page (professional home) to a scrollable page (kitchen menu).
5. **Strict Theme Isolation (Zero Style Bleed)**:
   - Kitchen theme colors and CSS variables (`--link-color`, `--text-subtitle`, `--link-hover`, `--color-pop`, `--color-urdu`) MUST NEVER bleed into `/professional/`.
   - The theme applicator in `config.js` explicitly guards `/professional/` paths.

---

## Verification Checklist
- [ ] Biography and links render correctly on `/professional/index.html`
- [ ] External links have `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Top baseline starts at `160px` below viewport top
- [ ] No kitchen theme CSS variables bleed into the professional page
- [ ] No layout shift when navigating between `/professional/` and `/kitchen/`
- [ ] Run test suite: `node tests/run_all.js`
