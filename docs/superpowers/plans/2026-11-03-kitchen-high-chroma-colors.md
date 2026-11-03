# Kitchen High Chroma Color System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize the Kitchen and Recipe color palette into `config.js` and apply the High Chroma trio (`#7c2d12` anchor, `#ff5722` distinct, `#ccff00` pop) across all kitchen and recipe pages.

**Architecture:** Define `KITCHEN_CONFIG.theme` in `config.js` with an automatic runtime CSS variable injector (`--link-color`, `--text-subtitle`, `--link-hover`, `--color-pop`). Update static `:root` fallback variables in `kitchen.css` and `kitchen/recipes/recipe.css` so that modifying `config.js` instantly propagates across all kitchen and recipe views while avoiding any flash of unstyled content.

**Tech Stack:** Vanilla JavaScript (`config.js`), CSS Variables (`kitchen.css`, `kitchen/recipes/recipe.css`), Node.js verification scripts.

**Spec:** [`docs/superpowers/specs/2026-11-03-kitchen-high-chroma-colors-design.md`](../specs/2026-11-03-kitchen-high-chroma-colors-design.md)

## Global Constraints

- Scope: Strictly Kitchen (`kitchen/index.html`) and recipe pages (`kitchen/recipes/*`).
- Do NOT modify `professional/index.html` or default tokens in `index.css`.
- Preserves layout coordinates, navigation height (60px), and spacing stability from `AGENTS.md`.
- Works on both `file:///` URLs and web servers without build tools or external fetch dependencies.

## Review Focus

1. **Propagation without reload errors**: Changing a color in `config.js` immediately changes the rendered CSS variables on any kitchen or recipe page.
2. **Professional page isolation**: Loading `professional/index.html` does NOT apply the kitchen theme variables to the professional view.
3. **FOUC prevention**: Static `:root` blocks in `kitchen.css` and `recipe.css` match the new defaults so pages render with High Chroma even before script execution.
4. **Contrast & readability**: The pop color (`#ccff00`) must always use dark text (`#18181b`) for WCAG compliance.
5. **No layout shift**: Adding badge/tag classes or updating colors must not introduce vertical baseline jumps or change navigation height.

---

### Task 1: Add Centralized Theme Configuration & Auto-Injector in `config.js`

**Files:**
- Modify: `config.js`
- Test: `tests/test_theme_config.js`

**Interfaces:**
- Produces: `KITCHEN_CONFIG.theme` with properties `anchor`, `distinct`, `pop`.
- Produces: Global or DOM CSS variable injection on `document.documentElement` for `--link-color`, `--text-subtitle`, `--link-hover`, and `--color-pop`.

- [ ] **Step 1: Write verification test for `config.js` theme definition and injection**

Create `tests/test_theme_config.js` to assert `KITCHEN_CONFIG.theme` exists with `#7c2d12`, `#ff5722`, `#ccff00`, and that the applicator function runs without errors in a DOM/node environment.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_theme_config.js`
Expected: FAIL (theme object not found in `KITCHEN_CONFIG`).

- [ ] **Step 3: Implement `theme` in `config.js` and add auto-applicator**

Add `theme` object to `KITCHEN_CONFIG`:
```javascript
theme: {
    anchor: "#7c2d12",
    distinct: "#ff5722",
    pop: "#ccff00"
}
```
Add self-executing function `applyKitchenTheme()` to apply styles to `document.documentElement.style`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_theme_config.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add config.js tests/test_theme_config.js
git commit -m "feat(kitchen): add centralized theme config and css variable injector to config.js"
```

---

### Task 2: Update Fallback CSS Variables & Element Selectors in `kitchen.css`

**Files:**
- Modify: `kitchen.css:8-16`
- Test: `tests/test_kitchen_css.js`

**Interfaces:**
- Consumes: `--link-color`, `--text-subtitle`, `--link-hover`, `--color-pop`.
- Produces: Updated styles for `.menu-column .column-title`, `.nav-item a.active`, and new `.pop-tag` badge style.

- [ ] **Step 1: Write test for `kitchen.css` token defaults and classes**

Create `tests/test_kitchen_css.js` checking that `:root` in `kitchen.css` sets:
- `--link-color: #7c2d12;`
- `--text-subtitle: #ff5722;`
- `--link-hover: #ff5722;`
- `--color-pop: #ccff00;`
and that `.pop-tag` or accent badges have dark text `#18181b` on `--color-pop`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_kitchen_css.js`
Expected: FAIL (`--text-subtitle` still `#b45309`).

- [ ] **Step 3: Update `kitchen.css`**

Update `:root` variables in `kitchen.css` and add `.pop-tag` helper styling.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_kitchen_css.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add kitchen.css tests/test_kitchen_css.js
git commit -m "style(kitchen): update kitchen.css with High Chroma variables and pop badge styling"
```

---

### Task 3: Update Fallback CSS Variables in `kitchen/recipes/recipe.css`

**Files:**
- Modify: `kitchen/recipes/recipe.css:8-16`
- Test: `tests/test_recipe_css.js`

**Interfaces:**
- Consumes: `--link-color`, `--text-subtitle`, `--link-hover`, `--color-pop`.
- Produces: Synchronized recipe `:root` fallbacks.

- [ ] **Step 1: Write test for `recipe.css` token defaults**

Create `tests/test_recipe_css.js` checking that `:root` in `recipe.css` sets:
- `--link-color: #7c2d12;`
- `--text-subtitle: #ff5722;`
- `--link-hover: #ff5722;`
- `--color-pop: #ccff00;`

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_recipe_css.js`
Expected: FAIL (`--text-subtitle` still `#b45309`).

- [ ] **Step 3: Update `kitchen/recipes/recipe.css`**

Update `:root` variables in `kitchen/recipes/recipe.css`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_recipe_css.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add kitchen/recipes/recipe.css tests/test_recipe_css.js
git commit -m "style(recipes): update recipe.css variables to match High Chroma palette"
```

---

### Task 4: End-to-End Propagation & Isolation Verification

**Files:**
- Test: `tests/test_e2e_theme.js`

**Interfaces:**
- Verifies: `kitchen/index.html`, `kitchen/recipes/template.html`, and `professional/index.html`.

- [ ] **Step 1: Write E2E test verifying propagation and page isolation**

Create `tests/test_e2e_theme.js` to simulate loading `config.js` and verify:
1. Dynamic change of `KITCHEN_CONFIG.theme.anchor = "#112233"` updates `document.documentElement.style.getPropertyValue('--link-color')`.
2. Kitchen pages load the High Chroma palette.
3. Professional page does not load kitchen theme or alter its monochromatic styling.

- [ ] **Step 2: Run E2E test**

Run: `node tests/test_e2e_theme.js`
Expected: PASS.

- [ ] **Step 3: Clean up test files if appropriate or commit test suite**

Commit test suite for regression tracking:
```bash
git add tests/
git commit -m "test(kitchen): add automated test suite for theme configuration propagation"
```
