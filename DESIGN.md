---
name: Bilal Abbasi
description: Quiet Ramsian editorial typography paired with hand-inked Urdu qalam calligraphy and multiply-blended watercolor sketches across two isolated personal worlds.
colors:
  roasted-saffron: "#c55c00"
  clove-umber: "#693501"
  terracotta-vermilion: "#b83b14"
  qalam-oxblood: "#721817"
  amber-bleed: "#fa9f42"
  indigo-slate: "#2b4162"
  scientist-blue: "#3d68a8"
  paper-white: "#ffffff"
  warm-paper: "#fafaf9"
  charcoal-ink: "#18181b"
  slate-body: "#4b5563"
  stone-muted: "#6b7280"
  hairline-rule: "#e5e7eb"
  pewter-track: "#94a3b8"
typography:
  display:
    fontFamily: "Lora, Georgia, 'Noto Nastaliq Urdu', 'Geeza Pro', serif"
    fontSize: "4rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-1.5px"
  gateway-display:
    fontFamily: "Lora, Georgia, 'Noto Nastaliq Urdu', 'Geeza Pro', serif"
    fontSize: "3.5rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-1.2px"
  headline:
    fontFamily: "Lora, Georgia, 'Noto Nastaliq Urdu', 'Geeza Pro', serif"
    fontSize: "3rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-1px"
  subtitle:
    fontFamily: "Lora, Georgia, 'Noto Nastaliq Urdu', 'Geeza Pro', serif"
    fontSize: "2.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.5px"
  title:
    fontFamily: "Lora, Georgia, 'Noto Nastaliq Urdu', 'Geeza Pro', serif"
    fontSize: "1.6rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.5px"
  urdu-display:
    fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', 'Jameel Noori Nastaleeq', 'Geeza Pro', Tahoma, serif"
    fontSize: "2.65rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  body-small:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "1.5px"
  nav:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.01em"
  badge:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "40px"
  2xl: "48px"
  3xl: "60px"
  4xl: "80px"
components:
  nav-bar:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.slate-body}"
    typography: "{typography.nav}"
    height: "60px"
  nav-link:
    textColor: "{colors.slate-body}"
    typography: "{typography.nav}"
    padding: "0 0 3px 0"
  nav-link-kitchen-active:
    textColor: "{colors.roasted-saffron}"
    typography: "{typography.nav}"
    padding: "0 0 3px 0"
  external-link:
    textColor: "{colors.charcoal-ink}"
    typography: "{typography.body-small}"
    padding: "0 0 2px 0"
  external-link-kitchen:
    textColor: "{colors.roasted-saffron}"
    typography: "{typography.body}"
    padding: "0 0 3px 0"
  step-card:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.slate-body}"
    rounded: "{rounded.lg}"
    padding: "24px"
  scroll-down-btn:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.roasted-saffron}"
    rounded: "{rounded.full}"
    width: "44px"
    height: "44px"
  pop-badge:
    backgroundColor: "{colors.indigo-slate}"
    textColor: "{colors.paper-white}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  qalam-tooltip:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.roasted-saffron}"
    rounded: "{rounded.sm}"
    padding: "5px 11px"
---

# Design System: Bilal Abbasi

## Overview

**Creative North Star: "The Monograph & The Kitchen Notebook"**

This visual system holds two distinct registers inside one disciplined architectural frame. On the root gateway (`/`) and the office profile (`/office/`), it reads like a crisp technical monograph—pure white paper, obsidian charcoal typography, disciplined whitespace, and zero ornamental noise. Crossing into The Kitchen (`/kitchen/` and individual recipes), the same structural grid softens into a hand-kept kitchen notebook: warm culinary spice pigments, `Noto Nastaliq Urdu` calligraphy, procedural reed-pen (`qalam`) ink strokes, and watercolor/line illustrations blended directly into the page.

The atmosphere is quiet, tactile, and unhurried. Breathing room and typographic scale do the heavy lifting so essays, family photographs, and cooking steps command attention without UI chrome getting in the way. The system explicitly rejects generic developer portfolio templates, dark-mode SaaS glow, food-blog clutter (popups, card walls, ad rails, star ratings), and decorative shadow stacks.

**Key Characteristics:**
- **Dual-world color discipline:** Monochromatic charcoal on `/office/`; warm culinary and calligraphic pigments scoped strictly to `/kitchen/` and recipes via runtime theme injection.
- **Ramsian baseline stability:** Every hero and space title locks to the exact same `160px` desktop vertical origin with `scrollbar-gutter: stable` so page transitions never jump.
- **Organic ink on a crisp grid:** Procedural SVG `qalam` brush strokes and multiply-blended sketches bring physical warmth to an otherwise borderless, rectilinear typographic layout.
- **Bilingual visual harmony:** Lowercase `Lora` editorial headings pair directly with right-aligned `Noto Nastaliq Urdu` calligraphy across navigation, menus, and space headers.

## Colors

A pure-white editorial canvas anchored by cool charcoal neutrals, punctuated only in The Kitchen and gateway interactions by culinary spice and calligraphic ink pigments.

### Primary
- **Roasted Saffron** (`#c55c00`): Primary culinary anchor across The Kitchen and recipe pages—used for subtitles, recipe links, active navigation text, completed Qalam progress ink, and archival photo dates.
- **Clove Umber** (`#693501`): Deep active and hover state for all Kitchen links, navigation tabs, collapsible section titles, and wet-ink stroke highlights.

### Secondary
- **Terracotta Vermilion** (`#b83b14`): Calligraphic accent reserved for Nastaliq Urdu space headers, menu category Urdu labels, and the gateway's "the cook" / kitchen hover state.
- **Qalam Oxblood** (`#721817`): Deep crimson-garnet ink accent used on "bilal" in the gateway title and as the primary ink-brush pigment parameter in navigation dynamics.
- **Amber Bleed** (`#fa9f42`): Translucent capillary halo color behind wet reed-pen brush transitions.

### Tertiary
- **Indigo Slate** (`#2b4162`): Compact Kitchen pop badges over white text.
- **Scientist Blue** (`#3d68a8`): Accessible steel-blue accent (`5.5:1` on white) used on the gateway's `"the scientist"` reel state, `"office"` link hover/selection, and inline link sweeps on `/office/`.

### Neutral
- **Paper White** (`#ffffff`): Primary full-bleed page canvas and sticky frosted navigation backdrop (`rgba(255, 255, 255, 0.94)`).
- **Warm Paper** (`#fafaf9`): Subtle warm paper surface used for mobile sticky headers, Qalam milestone tooltips, ink-blot cutout halos, and light recipe card tinting.
- **Charcoal Ink** (`#18181b`): Primary ink for display titles, strong editorial emphasis, Office links, and resting focal navigation labels.
- **Slate Body** (`#4b5563`): Default body prose, Office subtitle, resting navigation tabs, and secondary hover ink on monochromatic pages.
- **Stone Muted** (`#6b7280`): Quiet WCAG AA (`4.8:1`) metadata, footers, directional arrows, resting scroll prompts, and faded out-of-focus gateway reel descriptors.
- **Hairline Rule** (`#e5e7eb`): Crisp `1px` solid and dashed dividers separating space headers, menu columns, recipe sections, and card edges.
- **Pewter Track** (`#94a3b8`): Incomplete state for the vertical and horizontal Qalam recipe progress stroke and hollow milestone ink blots (paired with `#cbd5e1` capillary bleed).

### Named Rules
**The Theme Isolation Rule.** Culinary pigments (`#c55c00`, `#693501`, `#b83b14`, `#2b4162`) are injected strictly on Kitchen and recipe routes and must never bleed into `/office/`. Office stays monochromatic except for its single watercolor illustration and subtle scientist-blue hover accents.

**The Ink-Over-Fill Rule.** Color belongs in type, Urdu calligraphy, Qalam brush strokes, and compact pill tags—never in heavy colored background panels, saturated buttons, or full-bleed tinted sections.

## Typography

**Display Font:** `Lora` (fallback: `Georgia`, `Noto Nastaliq Urdu`, `Geeza Pro`, `serif`)
**Urdu Calligraphic Font:** `Noto Nastaliq Urdu` (fallback: `Urdu Typesetting`, `Jameel Noori Nastaleeq`, `Geeza Pro`, `Tahoma`, `serif`)
**Body & UI Font:** `Inter` (fallback: `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`)

**Character:** `Lora`'s calligraphic, softly bracketed serifs bridge literary warmth and modern restraint, pairing effortlessly with `Inter`'s neutral legibility for dense cooking instructions and `Noto Nastaliq Urdu`'s expressive diagonal cadence for bilingual cultural moments.

### Hierarchy
- **Display** (`500`, `4rem` scaling to `3.2rem` ≤1024px and `2.5rem` ≤480px, `1.1` line-height, `-1.5px` tracking): Primary hero titles (`Bilal Abbasi`, `the kitchen`, recipe names, and split space headers).
- **Gateway Display** (`500`, `3.5rem` clamping down to `1.95rem`–`2.6rem` on mobile, `1.15` line-height, `-1.2px` tracking): Centered cover greeting and circular descriptor reel on `/`.
- **Headline** (`500`, `3rem` scaling to `2rem`–`2.25rem` on mobile, `1.1` line-height, `-1px` tracking, lowercase): Secondary full-viewport section headings (`the menu`, `ingredients`, standalone about titles).
- **Subtitle** (`400`, `2.75rem` scaling to `2.2rem` ≤1024px and `1.8rem` ≤480px, `1.2` line-height, `-0.5px` tracking): Immediate subhead beneath hero titles (`Research Scientist, PhD`, `recipes from my childhood`, recipe Urdu subtitles).
- **Title** (`400`–`500`, `1.6rem`–`2.2rem`, `1.2` line-height, `-0.5px` tracking, lowercase): Menu category column headings (`1.6rem`) and Step-by-Step slide headings (`2.2rem`, `500`).
- **Urdu Display** (`500`, `2.65rem` desktop / `1.8rem` mobile, `1.5`–`1.6` line-height, RTL): Right-aligned Nastaliq calligraphy in split space headers; `1.6rem` (`400`, `1.3` line-height) in menu category columns; `1.25rem` (`500`, `1` line-height) for the quiet `بلال` navbar home mark.
- **Body** (`400`, `1.05rem` bio/essays and `1.15rem` step-by-step prose, `1.55`–`1.65` line-height): Main biographies (justified inside `580px` max column width), essays (constrained to `780px` reading measure), and step instructions. Secondary recipe descriptions step down to `0.9rem` (`1.5` line-height).
- **Label** (`600`, `0.85rem`–`0.9rem`, `1.5px`–`2px` tracking, uppercase): Recipe ingredient/step section eyebrows and step numbers. Navigation links use `0.9rem` (`500`, `0.01em` tracking); pop badges use `0.7rem` (`700`, `0.04em` tracking); footers sit at `0.8rem`.

### Named Rules
**The Dual-Register Casing Rule.** Office headings and prose use standard title and sentence case; the Gateway, Kitchen headings, menu categories, and step headings use lowercase to establish an intimate, unhurried voice.

**The Bilingual Pairing Rule.** Whenever English and Urdu share a header or drawer row, English aligns flush left in `Lora` and Urdu aligns flush right in `Noto Nastaliq Urdu` with generous vertical breathing room (`1.5`–`1.6` line-height) so Nastaliq ascenders and descenders never collide or clip.

## Layout

The site runs on a centered `1440px` maximum-width container with generous outer margins (`40px 80px 24px` desktop, stepping down to `40px` ≤1024px, `24px 20px` ≤900px, and `20px 18px` ≤480px). Desktop `/office/` locks cleanly to a single `100vh` viewport with no vertical scroll, while `/kitchen/` and recipe routes enable smooth vertical scrolling with gentle `scroll-snap-type: y proximity` across full-viewport chapters.

- **Asymmetric Hero Split:** Text and illustration sit in a `1fr 1.25fr` grid (`48px` gap) on Kitchen and recipes, widening to `1fr 1.35fr` (`56px` gap) on `/office/` desktop so the watercolor illustration carries greater presence. Illustrations are contained within the viewport (`max-height: calc(100vh - 215px)` base, `calc(100vh - 235px)` kitchen/recipe hero, `calc(100vh - 145px)` office desktop) using `object-fit: contain; object-position: top`.
- **Directory & Recipe Grids:** The Kitchen menu organizes dishes into a `4`-column grid (`40px` gap), stepping to `2` columns at `≤1024px` and collapsing into single-column accordions with `1px` dividers at `≤768px`. Recipe Side-by-Side splits `1fr 1fr` (`40px` gap) with paired internal vertical scroll panels (`max-height: max(420px, calc(100vh - 340px))`) and `scroll-snap-type: y mandatory` on step cards. Step-by-Step opens on a centered full-viewport mise-en-place slide (`max-width: 1100px`) followed by a `1fr 1fr` (`80px` gap) sticky-illustration and scrolling-step-slide (`max-width: 400px`) split.
- **Essay & Photo Rhythm:** Customs and Ammi essays align their full-width split header to the `160px` baseline while constraining reading prose to `780px`; archival photos sit in calm full-viewport frames (`max-height: calc(100vh - 140px)`).
- **Responsive Breakpoints & Isolation:** Key breakpoints live at `1024px` (tablet tightening), `900px` (hero stacks to `1fr`, scrolling unlocks, recipe step-by-step converts to a `32vh` sticky top sketch with a horizontal mobile Qalam bar), `768px` (mobile semi-collapsible `52px` navbar + full-height bilingual drawer + accordion menu + floating watercolor menu banner), `640px`/`600px` (compact gateway & stacked split headers), and `480px` (small phones). Mobile adaptations stay strictly encapsulated inside `@media` blocks so desktop layout remains invariant.

### Named Rules
**The 160px Baseline Rule.** Every primary page title (`Bilal Abbasi`, `the kitchen`, `customs`, `ammi`, and recipe titles) starts at `top = 160px` on desktop—built from `40px` wrapper top padding, a non-shrinking `60px` navbar, a fixed `60px` top margin, `align-self: start` on text columns, and `scrollbar-gutter: stable` on `html`. Never vertically center hero grids with `align-items: center` or `margin-top: auto`.

## Elevation & Depth

Surfaces are flat by default, behaving like ink printed on crisp white paper rather than stacked floating cards. Hierarchy comes from typographic scale, generous whitespace, and `1px` hairline rules (`#e5e7eb`). Hand-drawn illustrations dissolve into the paper surface via `mix-blend-mode: multiply` and `filter: contrast(1.02)` so they never sit inside rectangular white boxes. When a sticky Kitchen navigation bar scrolls over content, it uses a soft translucent veil (`rgba(255, 255, 255, 0.94)` with `backdrop-filter: blur(8px)`) rather than a heavy drop shadow.

### Shadow Vocabulary
- **Step Card Hover Lift** (`box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04)`): Whisper-light ambient shadow paired with `translateY(-2px)` and border tinting when hovering a Side-by-Side recipe step card.
- **Floating Circular Control** (`box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)`): Grounding shadow beneath the `44px` circular scroll-down button anchored at the bottom edge of the recipe steps column.
- **Archival Photograph Frame** (`box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08)`): Soft museum-mount lift reserved for real family photographs on essay pages.
- **Qalam Milestone Tooltip** (`box-shadow: 0 4px 14px rgba(124, 45, 18, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)`): Warm-tinted ambient elevation paired with `backdrop-filter: blur(8px)` on step progress tooltips.
- **Mobile Watercolor Menu Banner** (`filter: drop-shadow(0 4px 14px rgba(124, 45, 18, 0.22))` resting; `0 6px 20px rgba(184, 59, 20, 0.35)` hover): Contoured shadow following the organic painted brushstroke silhouette on mobile kitchen home.

### Named Rules
**The Flat-By-Default Rule.** Editorial surfaces and lists remain completely flat at rest. Shadows appear only as ambient cues on floating controls, tooltips, archival photographs, or subtle interactive hover lift—never to build layered card dashboards.

## Shapes

The form language contrasts rectilinear typographic clarity with deliberate hand-inked organic marks:

- **Borderless Primary Plane:** Navigation bars, hero blocks, essays, and recipe ingredient lists use open whitespace and `1px` solid or dashed hairlines (`#e5e7eb`) rather than boxed containers.
- **Restrained Radius Ladder:** Focus outlines and small accents use crisp `4px` corners; frosted Qalam tooltips use `6px`; archival family photographs use softly rounded `8px` frames; Side-by-Side step cards use comfortable `12px` corners; the floating scroll button is a true circle (`50%`); and category pop badges use full pills (`9999px`).
- **Calligraphic Counterpoint:** Active navigation underlines, Kitchen inline/recipe links, and the Step-by-Step progress track replace straight geometric rules with procedural SVG reed-pen (`qalam`) brush masks displaced with subtle fractal turbulence and paired with organic ink-blot milestone nodes.

## Components

**Philosophy:** *Restraint with calligraphic warmth*—controls stay quiet and borderless at rest, revealing crisp mechanical precision on Office and physical, hand-inked tactility across The Kitchen. All interactive motion respects `@media (prefers-reduced-motion: reduce)` and favors a natural human deceleration curve (`cubic-bezier(0.22, 1, 0.36, 1)`).

### Navigation
- **Desktop Top Bar:** Right-aligned single row (`60px` height, `32px` link gap), sticky with translucent white blur on Kitchen and recipe pages, participating in cross-document `@view-transition` (`view-transition-name: main-navbar`). Ends with the muted `بلال` Urdu home mark (`0.38` resting opacity rising to `0.95` on hover).
- **Qalam Brush Indicator:** Hardware-accelerated SVG reed-pen stroke (`7.5px` tall) that glides smoothly (`420ms`) under the active Kitchen tab with capillary edge bleed, faint hover ghost (`0.24` opacity) under hovered sibling tabs, and subtle nib compression (`scaleY(0.85)`) on press.
- **Mobile Semi-Collapsible Bar (`≤768px`):** Compact `52px` sticky bar keeping primary tabs visible while collapsing family subpages behind a bespoke brushstroke icon that morphs into a close `×` and reveals a full-height bilingual overlay drawer (`1.85rem` English `Lora` left, `1.85rem` Urdu Nastaliq right over `1px` rules).

### Links & Action Controls
- **Office External Link:** Borderless `Inter` (`0.95rem`, `500`) in Charcoal Ink with a `1px` bottom rule that smoothly retracts rightward (`scaleX(0)`) on hover while a `14px` diagonal northeast arrow shifts `translate(2px, -2px)`.
- **Kitchen & Recipe Link:** Roasted Saffron text with an SVG-masked Qalam brush stroke underline that draws across (`420ms` `qalam-stroke-draw`) and darkens to Clove Umber on hover/focus, compressing subtly on click.
- **Recipe Mode Selectors & Scroll Prompts:** Centered lowercase `Inter` labels (`0.85rem`, `1px` tracking) over gently bouncing `20px` chevrons. Active mode shows Roasted Saffron text, `600` weight, and a persistent Qalam underline; inactive mode recedes to `0.5` opacity. On mobile Kitchen home, the menu prompt transforms into a floating `156px × 54px` painted watercolor banner.
- **Floating Circular Scroll Button:** `44px` circular Paper White button with a `1px` hairline border and soft shadow centered at the bottom of the Side-by-Side steps column; scales to `1.05` on hover and rotates its chevron `180deg` to loop back to top at the end of the list.

### Cards / Containers
- **Recipe Step Card:** Softly tinted (`rgba(0, 0, 0, 0.02)`), `1px` hairline border, `12px` radius, `24px` padding (`16px` ≤600px) stacking an uppercase step counter (`0.85rem`, `600`, Roasted Saffron) above body copy. Snaps cleanly inside the desktop scroll panel and lifts `translateY(-2px)` with a Saffron border and faint ambient shadow on hover.
- **Collapsible Recipe Section:** Uppercase tracked eyebrow (`0.85rem`, `600`, `1.5px` tracking, Roasted Saffron) above a `1px dashed` divider with a `14px` chevron rotating `-90deg` when collapsed. Expands smoothly (`400ms`) in Side-by-Side view; remains permanently open and borderless in Step-by-Step mise-en-place view.
- **Archival Photo Frame:** Clean `8px` rounded image container (`object-fit: contain`) with soft museum-mount shadow and centered `0.95rem` muted caption highlighting dates in Roasted Saffron.

### Badges & Signature Components
- **Pop Badge:** Compact full-pill tag (`9999px` radius, `2px 8px` padding) in Indigo Slate with crisp white `0.7rem` bold text.
- **Gateway Descriptor Reel:** Infinite circular vertical typography drum (`1.15em` in-flow height, `4.6em` edge-faded mask viewport) below `"hi, i'm bilal,"`. Rests equidistant between `"the cook"` and `"the scientist"`, smoothly rolls and color-locks (`#b83b14` or `#2b4162`) on link hover/click, and supports free wheel/drag/touch momentum scrolling through atmospheric descriptors as an easter egg.
- **Split Bilingual Header:** Full-width `1px`-underlined header pairing lowercase `4rem` `Lora` English on the left with `2.65rem` Terracotta Vermilion `Noto Nastaliq Urdu` on the right (stacking cleanly left-aligned below `600px`).
- **Urdu Qalam Progress Track:** Fixed vertical procedural Qalam ink stroke (`180px` tall on desktop right margin) with hollow pewter ink-blot nodes that fill with Roasted Saffron when passed and bloom with Clove Umber when active, accompanied by frosted Warm Paper hover tooltips. Below `900px`, switches to a horizontal scrubbable ink line directly beneath the sticky top sketch with generous `32px` touch targets.

## Do's and Don'ts

### Do:
- **Do** preserve the `160px` desktop title baseline (`40px` top padding + `60px` navbar + `60px` top margin, `align-self: start`, `scrollbar-gutter: stable`) on every hero and space page.
- **Do** keep `/office/` strictly isolated from Kitchen theme variables and Qalam brush effects.
- **Do** blend hand-drawn sketches onto the paper canvas with `mix-blend-mode: multiply` and `object-fit: contain; object-position: top`.
- **Do** pair `Lora` lowercase English headings with `Noto Nastaliq Urdu` at `1.5`–`1.6` line-height whenever bilingual headers or drawers appear.
- **Do** scope every mobile override strictly inside `@media` queries (`≤900px`, `≤768px`, `≤600px`, `≤480px`) so desktop layout remains 100% invariant.
- **Do** honor `@media (prefers-reduced-motion: reduce)` on all page-enter, gateway reel, and Qalam ink animations.

### Don't:
- **Don't** introduce dark-mode glows, heavy box shadows, gradient buttons, or card-wall grids that fight the flat paper aesthetic.
- **Don't** add food-blog conventions (ad slots, newsletter popups, star ratings, comment boxes, or stock photography) to The Kitchen.
- **Don't** use `align-items: center` or `margin-top: auto` on `.main-content`, which breaks cross-page title alignment when bio lengths vary.
- **Don't** place bright background fills behind Kitchen navigation items or recipe links—keep color in ink, typography, and Qalam strokes.
- **Don't** use `@import` across local stylesheets or append `?v=` cache-busting query strings that break local `file:///` rendering.
