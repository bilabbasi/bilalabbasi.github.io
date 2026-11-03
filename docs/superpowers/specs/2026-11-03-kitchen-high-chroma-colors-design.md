# Kitchen High Chroma Color System & Centralized Theme Config

## Intent & The "Why"
Upgrade the Kitchen and Recipe sections of the website to a high-contrast, modern "High Chroma" color palette inspired by the 2-similar-colors + 1-pop-color formula (specifically inspired by the TikTok UI design references), while ensuring the color palette can be easily managed from a single configuration file without manually editing CSS files.

## Goals
- Apply the **High Chroma** trio strictly to the **Kitchen** and **Recipe** pages:
  - **Anchor Color (`#7c2d12`)**: Deep Terracotta / Red-Brown for main links, recipe names, primary titles, and structural borders.
  - **Distinct Similar Color (`#ff5722`)**: Electric Tangerine for subtitles (`main-subtitle`), category column headers (`veg`, `meat`, `bakery`), and link hover states.
  - **The POP Color (`#ccff00`)**: Yellow Punk / Acid Lime for accent badges, "NEW" / "STEP-BY-STEP" tags, and focal indicators.
- Centralize all color declarations into [`config.js`](../../config.js) under `KITCHEN_CONFIG.theme`.
- Automatically inject CSS variables (`--link-color`, `--text-subtitle`, `--link-hover`, `--color-pop`) when `config.js` is loaded so changes propagate everywhere instantly.
- Keep default CSS fallbacks in [`kitchen.css`](../../kitchen.css) and [`kitchen/recipes/recipe.css`](../../kitchen/recipes/recipe.css) to prevent any FOUC (flash of unstyled content).

## Non-Goals & Anti-Goals
- Do NOT alter the Professional landing page (`professional/index.html`) or global default tokens in `index.css`. The professional profile must remain monochromatic/neutral grayscale per design guidelines.
- Do NOT break visual stability (navigation bar coordinates, header heights, or vertical text alignment as specified in `AGENTS.md`).

## Constraints
- Must work seamlessly on `file:///` URLs as well as standard HTTP servers (already handled via direct script inclusions of `config.js`).
- Preserve existing font choices (`Lora` serif and `Inter` sans).

## Approaches Considered
1. **Hardcoding into `kitchen.css` and `recipe.css`**:
   - *Tradeoff:* Fast, but duplicates declarations across files; requires opening and editing multiple CSS files whenever colors change.
2. **Centralized CSS Theme file (`kitchen-theme.css`)**:
   - *Tradeoff:* Requires editing HTML `<head>` links across all recipe pages (`template.html`, `yellowdaal/index.html`, etc.).
3. **Centralized `config.js` with CSS Variable Injection *(Chosen Approach)***:
   - *Tradeoff:* Every kitchen page already imports `config.js`. Defining `KITCHEN_CONFIG.theme` in `config.js` and having it set the root CSS variables allows changing the entire palette in one single file with instant propagation across all kitchen and recipe pages. Default values in `kitchen.css` and `recipe.css` provide instantaneous static fallback.

## Implementation Details
1. **[`config.js`](../../config.js)**:
   Add `theme` object to `KITCHEN_CONFIG`:
   ```javascript
   theme: {
       anchor: "#7c2d12",    // Primary red-brown for links and recipe names
       distinct: "#ff5722",  // Electric tangerine for subtitles, categories, and hover
       pop: "#ccff00"        // Yellow punk for badges, pills, and accent tags
   }
   ```
   Add a self-invoking helper at the end of `config.js` that applies `--link-color`, `--text-subtitle`, `--link-hover`, and `--color-pop` to `document.documentElement.style`.

2. **[`kitchen.css`](../../kitchen.css)**:
   - Update `:root` defaults to match the High Chroma palette.
   - Add `.badge-pop` / `.tag-pop` style helper utilizing `var(--color-pop, #ccff00)` and dark charcoal text `#18181b`.
   - Update category column titles to use `var(--text-subtitle)` with a subtle distinct accent underline.

3. **[`kitchen/recipes/recipe.css`](../../kitchen/recipes/recipe.css)**:
   - Update `:root` defaults to match the High Chroma palette.
   - Style step indicators, tags, or badges with `var(--color-pop)`.

## Verification
- Verify `kitchen/index.html` renders with the High Chroma palette.
- Verify `kitchen/recipes/template.html` and static recipe pages (`yellowdaal/index.html`, etc.) adopt the new tokens.
- Verify changing a color in `config.js` immediately propagates across both pages.
- Verify `professional/index.html` remains unaffected.
