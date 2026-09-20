# bilalabbasi.github.io

This repository hosts my personal website. It is divided into two spaces:
1. **Professional Portfolio**: Highlights my background as a research scientist in AI, deep learning, and systems engineering.
2. **The Kitchen**: A space for some of my favourite recipes throughout my childhood.

## Basic ethos
The site is built with a focus on simplicity, responsiveness, and clean typography.
* [Vitsœ's Dieter Rams: Ten principles for good design](https://www.vitsoe.com/us/about/good-design)
* [A vulgar yet poignant website](https://motherfuckingwebsite.com/)

---

## Under the hood
* **Frontend**: Vanilla HTML5 and Javascript (ES6). No complex frameworks or dependencies.
* **Styling**: Vanilla CSS3, designed to be lightweight and responsive.
* **Centralized Configuration**: Content is separated from structure. All text, bios, and external links are managed in a single javascript configuration file.

---

## Repository structure

* `index.html` — Minimalist gateway cover page at the root domain.
* `professional.html` / `index.css` — Dedicated professional profile and core design system.
* `kitchen.html` / `kitchen.css` — Dedicated dashboard and styles for "The Kitchen" recipes.
* `config.js` — Central configuration file holding profile info, links, and titles.
* `recipes/` — Contains CSS, HTML templates, and recipes (see [recipes/README.md](recipes/README.md) for the recipe formatting guide).
* `assets/` — Images, conceptual sketches, and favicons.
* `.nojekyll` — Bypasses Jekyll processing on GitHub Pages to ensure fast, static asset delivery.