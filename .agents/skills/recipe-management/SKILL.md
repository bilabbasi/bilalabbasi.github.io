---
name: recipe-management
description: Step-by-step workflow for authoring, styling, registering, and validating recipes in the kitchen section of Bilal Abbasi's website.
---

# Recipe Authoring & Management Skill

This skill provides the standardized workflow for adding, styling, registering, and validating recipe pages in **The Kitchen** section of Bilal Abbasi's website.

## Architecture

Recipes live under `kitchen/recipes/` and follow a self-contained folder pattern:

```text
kitchen/recipes/
├── recipe.css             # Unified bundle stylesheet
├── css/                   # Modular recipe stylesheets
│   ├── recipe-base.css         # Invariants, navbar, layout, hero, typography
│   ├── recipe-side-by-side.css # Dual-column scrolling, cards, scroll-down btn
│   ├── recipe-step-by-step.css # Centered ingredients, split visual slides
│   └── recipe-progress-bar.css # Urdu Qalam vertical progress bar & ink blots
├── recipe-engine.js       # Shared layout engine, mode toggles, and step observer
├── template.html          # Dynamic query-parameter template (e.g. ?file=...)
└── <dish-slug>/           # Self-contained recipe directory (e.g. yellowdaal, keema)
    ├── index.html         # Declarative 36-line loader
    ├── recipe.js          # Recipe data in YAML-in-JS format
    └── assets/            # (Optional) Dish-specific sketches or photos
```

---

## 3-Step Recipe Creation Workflow

### Step 1: Create the Recipe Directory
Choose a short, lowercase, hyphenated or unspaced slug (e.g. `biryani` or `chicken_karahi`):
```bash
mkdir -p kitchen/recipes/<dish-slug>/assets
```

### Step 2: Create `index.html` and `recipe.js`

#### `index.html` (Shell Loader)
Create `kitchen/recipes/<dish-slug>/index.html` using this standardized shell:
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../../../assets/favicon_ba_urdu_orange.png">
    <title>Dish Name — the kitchen</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="A one-sentence description of the dish.">
    <meta name="author" content="Bilal Abbasi">
    <meta name="robots" content="index, follow">

    <!-- Shared Stylesheets -->
    <link rel="stylesheet" href="../../../index.css">
    <link rel="stylesheet" href="../css/recipe-base.css">
    <link rel="stylesheet" href="../css/recipe-side-by-side.css">
    <link rel="stylesheet" href="../css/recipe-step-by-step.css">
    <link rel="stylesheet" href="../css/recipe-progress-bar.css">

    <!-- YAML Parser Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script>

    <!-- Global Configuration & Palette -->
    <script src="../../../config.js"></script>

    <!-- Recipe Data -->
    <script src="recipe.js"></script>

    <!-- Shared Recipe Engine -->
    <script src="../recipe-engine.js" defer></script>
</head>

<body>
    <div id="recipe-root"></div>
</body>

</html>
```

#### `recipe.js` (YAML-in-JS Format)
Create `kitchen/recipes/<dish-slug>/recipe.js`:
```javascript
const RECIPE_DATA = `
title: "Dish Name"
subtitle: "اردو نام / Secondary Subtitle"
description: "A short, vivid description of the dish, background, or childhood memories."
image: "../../../assets/kitchen_sketch.png" # Or local "assets/hero.png"

ingredients:
  - section: "Tempering / Base"
    items:
      - "2 tbsp Ghee (گھی)"
      - "1 tsp Cumin Seeds (سفید زیرہ)"
      - "1 medium Onion, finely chopped (پیاز)"
  - section: "Main Ingredients"
    items:
      - "500g Main Ingredient"
      - "1 tsp Turmeric Powder (ہلدی)"
      - "Salt to taste (نمک)"

steps:
  - section: "Preparation"
    image: "../../../assets/kitchen_sketch_step1.png" # Optional step sketch
    items:
      - "Measure out all spices and chop aromatics."
      - "Rinse and prep the main ingredient."

  - section: "Cooking"
    items:
      - "Heat ghee in a heavy pan over medium heat."
      - "Sauté onions until translucent and fragrant."
`;
```

> **Why `.js` instead of raw `.yaml`?**  
> Browsers block local `fetch()` requests on `file:///` URLs due to CORS. Embedding YAML inside `recipe.js` allows recipes to run without CORS restrictions both locally on the filesystem and on live web servers.

### Step 3: Register in `config.js`
Open `config.js` and add an entry to the `KITCHEN_CONFIG.recipes` array:
```javascript
{
    category: "veg",                     // "chicken" | "meat" | "veg" | "dessert"
    categoryUrdu: "سبزی",                 // "مرغ" | "گوشت" | "سبزی" | "میٹھی"
    name: "dish name",                   // Display name in menu column
    url: "recipes/<dish-slug>/",         // Relative link from kitchen/
    description: "One-sentence culinary description."
}
```

---

## Dual Recipe Views & Visual Guidelines

1. **Side-by-Side View (`#menu`)**:
   - Two columns: Ingredients on the left, collapsible step cards on the right.
   - Sticky scroll button automatically appears when steps overflow the viewport.
2. **Step-by-Step View (`#step-by-step`)**:
   - Starts with a centered full-screen "mise en place" ingredients slide (`data-step="0"`).
   - Followed by a split container: sticky illustration on the left (`.visual-sticky-column`) and scrolling step cards on the right (`.steps-scrolling-column`).
   - `IntersectionObserver` tracks the currently centered step card and activates the corresponding sticky sketch layer with smooth cross-fade opacity transitions.
   - **Image Fallback Hierarchy**: If a step section omits an `image`, it gracefully inherits the recipe hero image (`recipe.image`). The visual container is never blank.
3. **Sketch Blending**:
   - Sketches use `mix-blend-mode: multiply;` and `filter: contrast(1.02);` to blend seamlessly into the warm off-white paper background (`#fafaf9`).

---

## Verification Checklist
- [ ] Recipe folder exists at `kitchen/recipes/<dish-slug>/`
- [ ] `index.html` loads without console errors
- [ ] `recipe.js` defines `const RECIPE_DATA` with valid YAML
- [ ] Entry added to `KITCHEN_CONFIG.recipes` in `config.js`
- [ ] Recipe appears in the correct category column on the kitchen menu page
- [ ] Both Side-by-Side and Step-by-Step view toggle seamlessly
- [ ] Run test suite: `node tests/run_all.js`
