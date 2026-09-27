# Recipe Guide & Formatting Specification

This directory contains the recipe pages, stylesheet, and recipes for **The Kitchen**.

---

## 🍳 How to Add a New Recipe

Adding a recipe is a 2-step process:

1. **Create a recipe JS file** in `recipes/recipes/<slug>.js` (or `recipes/examples/<slug>.js`).
2. **Register the recipe** in [`config.js`](../config.js) under `KITCHEN_CONFIG.recipes`.

---

## 📄 Step 1: Recipe File Format

Each recipe is stored as a `.js` file exporting a `const RECIPE_DATA` template string containing YAML.

> **Why `.js` instead of raw `.yaml`?**  
> Serving static `.js` allows recipes to be opened directly via `file:///` protocols locally without browser CORS restrictions.

### Full Recipe Template

Create `recipes/recipes/my_recipe.js`:

```javascript
const RECIPE_DATA = `
title: "Dish Name"
subtitle: "نام / Secondary Name"
description: "A short, descriptive summary of the dish, background, or childhood memories."
image: "../assets/kitchen_sketch.png"

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
    image: "../assets/kitchen_sketch_step1.png"
    items:
      - "Chop vegetables into bite-sized pieces."
      - "Measure out all spices."

  - section: "Cooking"
    image: "../assets/kitchen_sketch_step2.png"
    items:
      - "Heat ghee in a pan over medium heat."
      - "Add cumin seeds and let them sizzle for 30 seconds."
      - "Sauté onions until golden brown."

  - section: "Finishing & Serving"
    image: "../assets/kitchen_sketch_step3.png"
    items:
      - "Simmer for 15 minutes until tender."
      - "Garnish with fresh coriander and serve hot."
`;
```

---

## 📐 Schema & Field Reference

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Display name of the recipe (e.g. `"Ammi’s Yellow Daal"`). |
| `subtitle` | `string` | Secondary title or Urdu text (e.g. `"تڑکا دال"`). |
| `description` | `string` | Short description or story shown in the hero header. |
| `image` | `string` | Path to the default/hero visual (e.g. `"../assets/kitchen_sketch.png"`). |
| `ingredients` | `list` | Grouped list of ingredients. Each entry requires `section:` and an `items:` array. |
| `steps` | `list` | Step groups. Each entry requires `section:` and `items:`, with an optional `image:`. |

### Step Images (`image` field)
- Each step section can have an optional `image` field:
  ```yaml
  steps:
    - section: "Prepare the Tarka"
      image: "../assets/kitchen_sketch_step4.png"
      items:
        - "Heat ghee and fry garlic until golden."
  ```
- In **Step-by-Step mode**, this image stays sticky on the left side and smoothly reveals itself when the user scrolls to that section.
- **Fallback**: If a section omits an `image`, it automatically falls back to `recipe.image` so the visual area never goes blank.
- **Paths**: Both `"../assets/..."` and `"assets/..."` are supported.

---

## 🔗 Step 2: Register in `config.js`

Open [`config.js`](../config.js) at the repository root and add your recipe to the `KITCHEN_CONFIG.recipes` array:

```javascript
const KITCHEN_CONFIG = {
    // ...
    recipes: [
        // Pre-existing recipes...
        {
            category: "veg",                     // "chicken", "meat", "veg", "dessert", or custom
            categoryUrdu: "سبزی",                // Optional Urdu translation for the column title
            name: "my dish name",                // Title displayed on the kitchen menu
            file: "recipes/my_recipe.js",        // Relative path from the recipes/ folder
            description: "A short teaser description displayed beneath the link."
        }
    ]
};
```

### Predefined Categories

The kitchen dashboard automatically groups recipes into columns based on `category`:
- `"chicken"` (`مرغ`)
- `"meat"` (`گوشت`)
- `"veg"` (`سبزی`)
- `"dessert"` (`میٹھی`)
- Any custom category key (will generate a new column automatically).

---

## 🌐 Testing Locally

Open your browser and navigate to:
```text
recipes/template.html?file=recipes/my_recipe.js
```
Or start a local test server:
```bash
python3 -m http.server 8000
# Visit http://localhost:8000/kitchen.html
```

Test both:
1. **Side-by-Side View**: Collapsible ingredients and steps with scroll buttons.
2. **Step-by-Step View**: Centered mise en place and scrolling step cards with sticky illustration layers.
