# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two distinct primary audiences routed from the root gateway (`/`):

- **The Kitchen (`/kitchen/`)**: Friends, family, and fellow diaspora visitors reading personal essays and cooking childhood recipes.
- **Office (`/office/`)**: Research peers, collaborators, and recruiters checking Bilal Abbasi's credentials and external profiles.

## Product Purpose

Personal website for Bilal Abbasi (`www.bilalabbasi.com`) separating his professional research presence from an intimate culinary and cultural archive:

- **Office**: A focused calling card summarizing Bilal's academic and industry research background and linking out to LinkedIn, Google Scholar, and GitHub.
- **The Kitchen**: A personal home for childhood recipes from an Indian immigrant household, family photographs, and essays honoring diaspora heritage and the Urdu language.

## Positioning

Rather than collapsing career credentials and personal heritage into a generic portfolio or commercial food blog, the site uses a lightweight personal gateway (`/`) to route visitors into two deliberately separate spaces. The Kitchen treats food and Urdu (`اردو`) together as cultural inheritance—explicitly crediting Bilal's mother ("all credit goes to my mom. only the mistakes are mine.")—while Office stays a restrained, direct research profile.

## Operating Context

- Used on both desktop and mobile browsers (the repository includes `./serve.sh` with LAN/Tailscale QR codes for testing on phones, alongside responsive recipe views).
- Hosted as a static site on GitHub Pages (`www.bilalabbasi.com`) and also opened directly over local `file:///` paths without a server.
- Recipes support two usage contexts: quick scanning/overview (**Side-by-Side**) and active cooking (**Step-by-Step**).

## Capabilities and Constraints

- **Zero-build static architecture**: Vanilla HTML5, CSS3, and ES6 JavaScript with no bundler, framework, or compile step.
- **Content & authoring model**:
  - Site copy, gateway descriptors, navigation, links, and the recipe directory live in `config.js`.
  - Cultural essays (`kitchen/customs/this_space.md`, `kitchen/ammi/us.md`) are authored in Markdown and rendered client-side via vendored `assets/marked.min.js`.
  - Recipes live in self-contained folders under `kitchen/recipes/<slug>/` with YAML stored inside `recipe.js` template literals (avoiding `file:///` CORS restrictions) and scaffolded via `node kitchen/recipes/new.js`.
- **Local `file:///` compatibility**: Static `<link>` and `<script>` references must avoid cache-busting query strings (e.g., `?v=`).
- **World isolation**: `/office/` remains separate from `/kitchen/` (no cross-links from `/office/` into `/kitchen/`, and kitchen theming does not apply to `/office/`).
- **Undecided / open product facts**:
  - Whether `abu` (`ابو`) and `bhaiya` (`بھیا`)—currently non-clickable text entries in `KITCHEN_CONFIG.nav`—will become full essay pages or remain placeholders.
  - Whether `/office/` will remain a single-page profile or expand to list publications/projects on-site.
  - Whether product-specific accessibility requirements (such as explicit Urdu `lang`/`dir` markup for assistive technology or reading accommodations) need formal targets.

## Brand Commitments

- **Identity & domain**: Bilal Abbasi (`www.bilalabbasi.com`).
- **Voice**: Direct and concise on Office ("Let's get to work."); lowercase, intimate, and reflective across the gateway and The Kitchen.
- **Bilingual heritage & attribution**: Natural English + Urdu (`اردو`) weaving throughout The Kitchen (headers, navigation, ingredients, essays) and explicit credit to Ammi for the childhood recipes.
- **Authentic personal media**: Real family photographs and bespoke illustrations belong to the site's identity and should not be replaced with generic stock imagery.

## Evidence on Hand

- **Office credentials & external profiles (`config.js`)**: Research Scientist at InterDigital (AI-based video compression); previously researcher at Eidos-Montréal (deep learning for meshes); PhD in Applied Mathematics at McGill University; links to LinkedIn, Google Scholar, and GitHub.
- **Published recipes (`kitchen/recipes/`)**: `yellowdaal` (Ammi's Yellow Daal), `dahi_bhagar` (Dahi Ka Bhagar), `keema`, and `cari`.
- **Essays**: `kitchen/customs/this_space.md` (diaspora tribute) and `kitchen/ammi/us.md` (note on Ammi).
- **Family photographs**: `assets/photos/ammi_and_abu_arrive_1.JPG` (Ammi and Abu arriving in Toronto, July 17, 1987) and `assets/photos/bilal_baby.png` (Bilal and Ammi in the kitchen sink).
- **Custom illustrations & icons**: `assets/office/watercolor_office_image_transparent.png`, `assets/office/sketch.png`, `assets/kitchen_sketch.png`, `assets/kitchen_sketch_step1.png` through `assets/kitchen_sketch_step4.png`, `assets/favicon_ba.png`, and `assets/favicon_ba_urdu_orange.png`.
- **Absences future work must not fabricate**: No testimonials, press coverage, reader comments, ratings, metrics, on-site publications list beyond Google Scholar, or essays for `abu` and `bhaiya`.

## Product Principles

1. **Keep the two worlds cleanly separated**: Serve peers/recruiters on Office and friends/family/diaspora in The Kitchen without blurring their voices or mixing concerns.
2. **Honor authentic heritage over generic templates**: Ground The Kitchen in real family recipes, Urdu language, and honest attribution to Ammi rather than commercial food-blog patterns.
3. **Preserve lightweight durability**: Keep the site zero-build, data/Markdown-driven, and working seamlessly on both GitHub Pages and local `file:///`.
4. **Support both browsing and active cooking**: Keep recipes effortless to scan at a glance and clear to follow step by step across desktop and mobile.
