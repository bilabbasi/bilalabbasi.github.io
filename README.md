# bilalabbasi.github.io

Personal website of Bilal Abbasi (`www.bilalabbasi.com`), divided into two spaces:
1. **Office** (`/office/`) — Research, publications, and engineering background.
2. **The Kitchen** (`/kitchen/`) — Childhood recipes, cultural essays, and Urdu typography.

Built with vanilla HTML5, CSS3, and ES6 JavaScript—no build step, no bundler, no framework.

---

## Repository Map

### Content (files you edit regularly)
* `config.js` — All site text, kitchen bio, external links, nav tabs, theme colors, and the recipe directory.
* `office/bio.md` — Markdown biography for the **office** page (`/office/`).
* `kitchen/customs/this_space.md` — Essay for the **customs** page (`/kitchen/customs/`).
* `kitchen/ammi/us.md` — Essay for the **ammi** page (`/kitchen/ammi/`).
* `kitchen/recipes/<slug>/recipe.js` — Individual recipe data (YAML inside a JS template string so `file://` works without CORS).
* `assets/` — Sketches, photos, and favicons.

### Plumbing (layout, styling, and scripts)
* `index.html` + `gateway.css` — Root cover page (`/`) with the interactive descriptor reel.
* `office/index.html` — Office profile page.
* `kitchen/index.html` + `kitchen.css` — Kitchen landing page and recipe menu grid.
* `kitchen/customs/index.html` & `kitchen/ammi/index.html` — Kitchen subpage shells that render their `.md` files.
* `kitchen/recipes/` — Shared `recipe-engine.js`, modular `css/recipe-*.css`, and `new.js` scaffolder (see [kitchen/recipes/README.md](kitchen/recipes/README.md)).
* `index.css` — Shared design tokens, typography, navbar, and base 2-column layout.
* `js/theme.js` — Applies `KITCHEN_CONFIG.theme` CSS variables on kitchen/recipe pages only.
* `nav.js` — Navbar rendering, ink-brush indicator animations, page transitions, and kitchen page loaders.
* `serve.sh` / `serve.js` — Local dev server with LAN/Tailscale QR code for mobile testing.
* `tests/` — Automated checks (`node tests/run_all.js`).

---

## Local Preview & Verification

Start the local server (prints a QR code for testing on your phone):
```bash
./serve.sh
```
Or run Python's built-in server:
```bash
python3 -m http.server 8000
```

Run the test suite after any edit:
```bash
node tests/run_all.js
```

---

## How to Make Common Edits

### 1. Add a new recipe
Run the scaffolder—either from a `.yaml` file or from scratch:
```bash
# Option A: Import an existing YAML file directly
node kitchen/recipes/new.js biryani path/to/biryani.yaml

# Option B: Create a starter template
node kitchen/recipes/new.js biryani "Ammi’s Biryani" "Fragrant layered basmati rice."
```
Then add the printed entry to `KITCHEN_CONFIG.recipes` in `config.js`.

### 2. Edit a bio, links, or gateway descriptors
* Edit `office/bio.md` directly in Markdown for the office biography.
* Open `config.js` to edit:
  * `GATEWAY_CONFIG.reel.items` — Descriptors on the cover page.
  * `OFFICE_CONFIG` — Name, subtitle, `bioFile`, contact trigger, and external links.
  * `KITCHEN_CONFIG` — Kitchen title, subtitle, bio, theme colors, and recipes.

### 3. Edit the Customs or Ammi essays
Edit the Markdown directly in:
* `kitchen/customs/this_space.md`
* `kitchen/ammi/us.md`

### 4. Update navigation tabs
Edit `KITCHEN_CONFIG.nav` and `KITCHEN_CONFIG.spaces` in `config.js`.
