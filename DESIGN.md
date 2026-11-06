---
name: bilalabbasi.com
description: The Scholar's Monograph & Spice Folio — High-craft dual personal portfolio and culinary heritage archive
colors:
  primary: "#721817"
  secondary: "#fa9f42"
  tertiary: "#2b4162"
  neutral-title: "#18181b"
  neutral-body: "#4b5563"
  neutral-muted: "#9ca3af"
  neutral-border: "#e5e7eb"
  neutral-bg: "#ffffff"
  neutral-paper: "#fafaf9"
typography:
  display:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "4rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-1.5px"
  headline:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "2.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.5px"
  title:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "1.6rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.5px"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0px"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "1.5px"
rounded:
  sm: "3px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  2xl: "60px"
components:
  link-primary:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-title}"
    padding: "0 0 2px 0"
    typography: "{typography.body}"
  link-recipe:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    padding: "0 0 2px 0"
    typography: "{typography.body}"
  badge-pop:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.neutral-title}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  card-step:
    backgroundColor: "rgba(0, 0, 0, 0.02)"
    textColor: "{colors.neutral-body}"
    rounded: "{rounded.lg}"
    padding: "24px"
  button-scroll:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: "44px"
    height: "44px"
    width: "44px"
---

# Design System: bilalabbasi.com

## Overview

**Creative North Star: "The Scholar's Monograph & Spice Folio"**

The design system for `bilalabbasi.com` unites two sovereign worlds under a single, disciplined visual philosophy inspired by Dieter Rams ("less, but better"). On one side lies the **Scholar's Monograph**: an austere, monochromatic research portfolio tailored for academic peers, scientific collaborators, and systems engineers. On the other lies the **Spice Folio**: an intimate, aromatic culinary archive celebrating diaspora recipes, Urdu language heritage, and mother's cooking.

The interface treats digital space like high-grade tactile paper. Dark charcoal typography rests upon a calm canvas (`#ffffff` and `#fafaf9`), paired with hand-drawn ink sketches that merge into the page texture via `mix-blend-mode: multiply`. Visual noise is ruthlessly pruned: there are no commercial blog popups, cookie banners, intrusive gradients, or decorative drop-shadows.

Interaction is unhurried and tactile. Links reveal themselves through sliding hairline rules; recipe decks paginate with vertical scroll snapping; and Urdu typography sits alongside English with optical balance and dignity.

**Key Characteristics:**
- **Sovereign Dual Spaces**: Absolute aesthetic separation between the grayscale research profile and the warm, high-chroma culinary archive.
- **Architectural Stability**: Fixed navigation coordinates (60px height, 160px vertical baseline) eliminating layout jump across all page transitions.
- **Paper & Ink Tactility**: Expressive sketchwork blending directly into the warm background canvas.
- **Dieter Rams Restraint**: Functional clarity where every line, rule, and margin earns its presence.

## Colors

The palette balances clinical grayscale rigor with rich, earthen culinary accents drawn from South Asian kitchen traditions.

### Primary
- **Warm Terracotta** (`#721817`): Deep red-brown earthen anchor used for kitchen subtitles, primary recipe links, active section tabs, and key focal accents. Communicates domestic warmth and cooked clay.

### Secondary
- **Sunlit Amber** (`#fa9f42`): Electric tangerine and warm ochre used for interactive link hover states, culinary category underlines, and secondary emphasis.

### Tertiary
- **Midnight Denim** (`#2b4162`): Deep slate navy blue used for accent pop badges (`.pop-tag`, `.badge-pop`), step indicators, and focal highlights.

### Neutral
- **Deep Charcoal** (`#18181b`): High-contrast ink for main titles, primary names, active navigation labels, and high-importance headings.
- **Muted Charcoal** (`#4b5563`): Readable body text for biographical paragraphs, recipe instructions, and long-form notes.
- **Warm Slate Gray** (`#9ca3af`): Muted indicators, navigational dividers, arrow icons, and timestamps.
- **Hairline Gray** (`#e5e7eb`): Subtle border dividers, card contours, and section separators.
- **Clean Canvas** (`#ffffff`): Primary screen background and container fill.
- **Warm Paper** (`#fafaf9`): Ambient off-white tone ensuring sketch illustrations blend without stark white borders.

### Named Rules
**The Sovereign Palette Rule.** The professional portfolio is strictly monochromatic grayscale; terracotta, amber, and denim accents must never bleed into the `/professional/` space.
**The Ink Rarity Rule.** High-chroma colors (`#721817`, `#fa9f42`, `#2b4162`) are reserved exclusively for titles, links, badges, and interactive feedback—never for long-form body text.
**The Dynamic Theme Rule.** Kitchen and recipe accent colors must be defined in `KITCHEN_CONFIG.theme` within `config.js` and injected as CSS variables, never hardcoded into stylesheet roots.

## Typography

**Display Font:** Lora (with Georgia, serif fallback)
**Body Font:** Inter (with -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif fallback)
**Urdu Script:** System Naskh / Nastaliq fallback (`font-family: inherit`) rendered with native optical parity.

**Character:** A deliberate dialogue between scholarly classical serif warmth (`Lora`) and ultra-clean modern geometric sans (`Inter`), establishing an editorial atmosphere that feels timeless yet technologically sharp.

### Hierarchy
- **Display** (weight: 500, size: 4rem / 64px, line-height: 1.1, letter-spacing: -1.5px): Used for primary cover titles (`.main-title`, `.menu-title`).
- **Headline** (weight: 400, size: 2.75rem / 44px, line-height: 1.2, letter-spacing: -0.5px): Used for subtitles (`.main-subtitle`, `.step-section-heading`).
- **Title** (weight: 400, size: 1.6rem / 25.6px, line-height: 1.2, letter-spacing: -0.5px): Used for column category headers (`.column-title`) and Urdu section headings.
- **Body** (weight: 400, size: 1.05rem / 16.8px, line-height: 1.55, letter-spacing: 0px): Used for biography copy (`.bio-paragraph`) and recipe instructions (`.recipe-description`, max-width: 580px).
- **Label** (weight: 600, size: 0.85rem / 13.6px, line-height: 1.2, letter-spacing: 1.5px, uppercase): Used for recipe section dividers (`.recipe-section-title`), step counters (`.step-number`), and scroll guides (`.scroll-text`).

### Named Rules
**The Serif-Sans Partition Rule.** Headings and expressive titles belong strictly to `Lora` serif; all functional labels, metadata, navigation, and body copy belong strictly to `Inter` sans.
**The Justified Monograph Rule.** Desktop biographical text uses justified alignment (`text-align: justify`) with a constrained reading measure (max-width: 580px) to mirror a printed monograph column.
**The Bilingual Dignity Rule.** Urdu typography (`اردو`) is set inline with identical dignity and optical size matching its English counterpart, never rendered as an undersized subscript.

## Layout

The layout uses a fixed outer wrapper (`.app-wrapper`) constrained to a maximum width of 1440px with generous perimeter margins (40px top, 80px sides, 24px bottom).

On desktop viewports, content is split via an asymmetric grid:
- **Main Content Grid**: Split into an unequal `1fr 1.25fr` ratio (`.main-content`), allocating 25% more spatial priority to visual artwork and sketches than text.
- **Kitchen Menu Grid**: 4-column responsive grid (`repeat(4, 1fr)`) with 40px gaps grouping dishes by category (`veg`, `meat`, `bakery`, `dessert`).
- **Step-by-Step Split Layout**: Equal 2-column grid (`1fr 1fr`) pairing a sticky visual illustration container (`.visual-sticky-column`) with scrolling instruction step cards (`.steps-scrolling-column`).

### Named Rules
**The 160px Baseline Lock.** The top coordinate of the primary title, subtitle, and biography text blocks must start at exactly `top: 160px` across all pages (40px wrapper padding + 60px fixed navbar height + 60px content margin-top). Container-level vertical centering or auto margins are strictly forbidden.
**The Paper Gutter Rule.** `scrollbar-gutter: stable` is declared globally on `html` to preserve horizontal layout stability when navigating between non-scrollable and scrollable pages.
**The Snap Offset Rule.** All scroll-snapped full-screen sections must declare `scroll-margin-top: 100px` to offset the navbar's layout footprint and prevent initial page jump on load.

## Elevation & Depth

Surfaces are flat at rest, echoing traditional print. Physical depth and elevation are conveyed primarily through tonal background shifts (`rgba(0, 0, 0, 0.02)`), delicate hairline borders (`1px solid #e5e7eb`), and crisp negative space.

Shadows exist exclusively as responsive, ambient feedback when a visitor interacts with interactive components:
- **Ambient Floating Button Shadow** (`box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)`): Applied to floating circular scroll-down controls (`.scroll-down-btn`).
- **Tactile Card Hover Lift** (`box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04)`): Applied when hovering over step cards (`.step-card`), accompanied by a 2px upward translation (`transform: translateY(-2px)`).

### Named Rules
**The Flat Rest Rule.** Containers, panels, and buttons must be completely flat at rest. Drop-shadows are strictly dynamic reactions to hover or focus states.
**The Border Contrast Rule.** Structural containment uses 1px solid hairline borders (`#e5e7eb`); internal recipe sub-sections use 1px dashed borders to evoke perforated notebook paper.

## Shapes

The geometric vocabulary is disciplined and intentional:
- **Sharp Structural Shells**: Outer app wrappers, content grids, and column splits maintain clean, unrounded 0px corners, reinforcing structural discipline.
- **Tactile Container Corners**: Step cards (`.step-card`) use gentle 12px rounded corners (`border-radius: 12px`), providing a comfortable card feel.
- **Circular & Pill Accents**: Floating buttons (`.scroll-down-btn`) and accent tags (`.pop-tag`, `.badge-pop`) use full pill curvature (`border-radius: 9999px` or `50%`).
- **Hand-Drawn Silhouette Blend**: Artwork containers use `mix-blend-mode: multiply` with `filter: contrast(1.02)` and `opacity: 0.9` to allow sketched ink strokes to marry naturally with the warm background.

## Components

### Buttons & Floating Controls
- **Floating Scroll Button (`.scroll-down-btn`)**:
  - **Shape**: Perfect circle (44px × 44px, `border-radius: 50%`).
  - **Color**: Canvas background (`#ffffff`), 1px hairline border (`#e5e7eb`), icon in terracotta (`#721817`).
  - **State**: Appears dynamically via `.visible` (`opacity: 1`); on hover lifts with `transform: translateX(-50%) scale(1.05)` and background `#e5e7eb`.
  - **At End**: Icon rotates 180° (`.at-end`) to invite smooth return to the top.

### Links & Navigation
- **Editorial Text Links (`.external-link`, `.recipe-link`)**:
  - **Shape**: Inline text with 2px bottom padding and positioned hairline underline (`::after`, height 1px).
  - **Animation**: Underline scales smoothly from left to right (`transform: scaleX(1)`) on hover; external arrow SVG shifts diagonally (`transform: translate(2px, -2px)`).
  - **Color**: Default charcoal (`#18181b`) or terracotta (`#721817`); shifts to amber (`#fa9f42`) on hover.
- **Top Navigation Bar (`.navbar`)**:
  - **Dimensions**: Fixed 60px height, aligned to the top-right.
  - **Items**: 0.9rem Inter links with 32px gap; active tab marked by 1.5px bottom border; sections separated by delicate vertical pipes (`.nav-divider`, `opacity: 0.45`).

### Chips & Badges
- **Pop Accent Badge (`.pop-tag`, `.badge-pop`)**:
  - **Shape**: Full pill (`border-radius: 9999px`), padding `2px 8px`.
  - **Color**: Midnight denim background (`#2b4162`), high-contrast dark charcoal text (`#18181b`), 0.7rem font size, bold 700 weight, letter-spacing `0.04em`.

### Cards & Recipe Containers
- **Step Card (`.step-card`)**:
  - **Shape**: 12px rounded rectangle, 24px internal padding.
  - **Background**: Soft tonal tint (`rgba(0, 0, 0, 0.02)`), 1px border (`#e5e7eb`).
  - **States**: On hover, shifts border to terracotta/subtitle color (`#721817`), lifts 2px (`translateY(-2px)`), and gains soft ambient shadow (`0 6px 16px rgba(0,0,0,0.04)`).
- **Collapsible Section (`.recipe-section`)**:
  - **Header**: 0.85rem uppercase label with 1px dashed bottom border and rotating chevron icon (`.collapse-icon`, rotates -90° when collapsed).
  - **Animation**: Smooth max-height transition (`0.4s cubic-bezier(0.4, 0, 0.2, 1)`).

### Signature Component: The Sticky Split Deck
- **Description**: A dual-column recipe cooking interface (`.split-steps-container`).
- **Left Column**: Sticky viewport container (`.visual-sticky-column`, `height: 100vh`) holding layered culinary drawings (`.sketch-layer`).
- **Right Column**: Scrolling instruction cards (`.step-slide`, `height: 100vh`).
- **Mechanism**: `IntersectionObserver` tracks the currently centered step in the viewport and cross-fades the corresponding sketch layer (`opacity: 0` to `1` over 0.5s), synchronizing step instructions with dish illustrations without layout jitter.

## Do's and Don'ts

### Do:
- **Do** maintain the exact 60px navbar height and 160px title top coordinate across all pages to guarantee visual stability.
- **Do** keep the professional portfolio strictly monochromatic grayscale (`#18181b`, `#4b5563`, `#9ca3af`).
- **Do** centralize all kitchen theme color modifications in `KITCHEN_CONFIG.theme` within `config.js`.
- **Do** apply `mix-blend-mode: multiply` on sketch illustrations so the illustration paper seamlessly melts into the page background.
- **Do** declare `scrollbar-gutter: stable` globally to prevent horizontal baseline jumping between scrollable and non-scrollable pages.
- **Do** ensure all recipe data structures and scripts remain zero-dependency and fully operational on `file:///` local URLs.

### Don't:
- **Don't** bleed warm terracotta, amber, or denim colors into the professional profile page.
- **Don't** use `margin-top: auto` or container vertical centering (`align-items: center`) on `.main-content`.
- **Don't** introduce external UI framework bundles, icon font packages, or build dependencies.
- **Don't** apply heavy drop-shadows, glossy gradients, or commercial blog widgets.
- **Don't** add query-string cache buster parameters (e.g. `?v=2`) to script or stylesheet tags that break local `file:///` filesystem resolution.
