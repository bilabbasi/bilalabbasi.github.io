# Recipe Guide & Formatting Specification

This directory contains the recipe pages, stylesheet, and self-contained recipe directories for **The Kitchen**.

---

## 🍳 How to Add a New Recipe (Self-Contained Folder Pattern)

Every recipe is organized into its own self-contained directory under `kitchen/recipes/<slug>/`:

```text
kitchen/recipes/
├── css/                   # Modular recipe stylesheets
│   ├── recipe-base.css         # Invariants, navbar, layout, hero, typography
│   ├── recipe-side-by-side.css # Dual-column scrolling, cards, scroll-down btn
│   ├── recipe-step-by-step.css # Centered ingredients, split visual slides
│   └── recipe-progress-bar.css # Urdu Qalam vertical progress bar & ink blots
├── recipe-engine.js       # Shared rendering engine and layout interactions
├── yellowdaal/
│   ├── index.html         # Shell loader (~25 lines)
│   ├── recipe.js          # Recipe data in YAML-in-JS format
│   └── assets/            # Optional recipe-specific sketches and photos
└── keema/
    ├── index.html
    ├── recipe.js
    └── assets/
```

### Adding a recipe is a 2-step process:

1. **Run the recipe scaffolder** from the repo root:
   ```bash
   # From an existing YAML file:
   node kitchen/recipes/new.js <dish-slug> path/to/recipe.yaml

   # Or start from a blank template:
   node kitchen/recipes/new.js <dish-slug> "Dish Name" "Short description."
   ```
   This creates `kitchen/recipes/<dish-slug>/` with `index.html`, `recipe.js`, and `assets/`. When importing a `.yaml` file, any `image:` paths must be **absolute paths**—`new.js` copies those images into `kitchen/recipes/<dish-slug>/assets/` and rewrites `recipe.js` to reference them. If you didn't pass a `.yaml` file, edit `recipe.js` with your ingredients and steps.

2. **Register the recipe in [`config.js`](../../config.js)** under `KITCHEN_CONFIG.recipes` (the script prints the exact snippet for you):
   ```javascript
   {
       category: "veg",                     // "chicken" | "meat" | "veg" | "dessert"
       categoryUrdu: "سبزی",                 // "مرغ" | "گوشت" | "سبزی" | "میٹھی"
       name: "yellow daal",
       url: "recipes/yellowdaal/",
       description: "Quintessential tarka."
   }
   ```

---

## 📄 Recipe Data Format (`recipe.js`)

Each recipe is stored as a `.js` file exporting a `const RECIPE_DATA` template string containing YAML.

> **Why `.js` instead of raw `.yaml`?**  
> Serving static `.js` allows recipes to be opened directly via `file:///` protocols locally without browser CORS restrictions.

### Example `recipe.js`:

```javascript
const RECIPE_DATA = `
title: "Dish Name"
subtitle: "نام / Secondary Name"
description: "A short, descriptive summary of the dish, background, or childhood memories."
image: "../../../assets/kitchen_sketch.png" # Or local "assets/my_sketch.png"

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
    image: "../../../assets/kitchen_sketch_step1.png" # Or local "assets/step1.png"
    items:
      - "Chop vegetables into bite-sized pieces."
      - "Measure out all spices."

  - section: "Cooking"
    items:
      - "Heat ghee in a pan over medium heat."
      - "Sauté onions until golden brown."
`;
```

---

## 📐 Schema & Field Reference

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Display name of the recipe (e.g. `"Ammi’s Yellow Daal"`). |
| `subtitle` | `string` | Secondary title or Urdu text (e.g. `"تڑکا دال"`). |
| `description` | `string` | Short description or story shown in the hero header. |
| `image` | `string` | Path to default/hero visual (`assets/sketch.png` or `../../../assets/kitchen_sketch.png`). |
| `ingredients` | `list` | Grouped list of ingredients. Each entry requires `section:` and an `items:` array. |
| `steps` | `list` | Step groups. Each entry requires `section:` and `items:`, with an optional `image:`. |

### Step Images & Local Assets
- **Self-Contained Assets**: If you have photos or sketches specific to the dish, you can place them directly in `kitchen/recipes/<slug>/assets/` and reference them as `assets/step1.png` or `./assets/step1.png`.
- **Shared Assets**: If you want to use the repository-level illustrations, reference `../../../assets/kitchen_sketch.png` or `../../../assets/kitchen_sketch_step1.png`.

---

## 🌐 Testing Locally

Start a local web server from the repository root:
```bash
python3 -m http.server 8000
```
Open your browser and navigate to:
```text
http://localhost:8000/kitchen/
http://localhost:8000/kitchen/recipes/yellowdaal/
http://localhost:8000/kitchen/recipes/keema/
```
