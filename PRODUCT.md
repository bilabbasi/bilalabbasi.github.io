# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **AI Researchers & Industry Peers**: Scientists, academic collaborators, hiring committees, and systems engineers evaluating Bilal Abbasi's scientific background, publications (Google Scholar), systems code (GitHub), and domain credentials (PhD in Applied Mathematics at McGill, AI-based video compression at InterDigital, deep learning for meshes at Eidos-Montréal).
- **Culinary & Diaspora Audience**: Friends, family, home cooks, and members of the South Asian / Indian diaspora seeking authentic childhood recipes (such as Ammi's comforting tarka yellow daal, dahi ka bhagar, keema, and cari), cultural context, and bilingual Urdu storytelling.

## Product Purpose

The product is the authoritative, durable personal home on the web (`www.bilalabbasi.com`). It unites two sovereign facets of personal identity under a single minimal gateway:
1. **Professional Portfolio**: A clear, concise, scholarly presentation of research, publications, and credentials.
2. **The Kitchen**: A living culinary and cultural archive celebrating mother's recipes, diaspora memories, and the Urdu language.

Success means visitors seamlessly find and explore the space matching their interest, experiencing a distraction-free, beautifully typeset interface tailored to that specific context without blurring professional credibility or domestic culinary warmth.

## Positioning

An intentional dual-identity personal web presence. Rather than relegating culinary heritage to an offhand personal bio bullet or overwhelming recipes with commercial blog clutter and ads, the site gives both spaces equal dignity and sovereign focus:
- "Professional me" is understated, monochromatic, and focused on research impact.
- "The Kitchen" is warm, narrative-driven, culturally grounded in the Indian immigrant household experience, and illustrated with custom hand-drawn sketches.

## Operating Context

- Deployed as a static website hosted on GitHub Pages (`bilalabbasi.github.io`) mapped to custom domain `www.bilalabbasi.com`.
- Accessed across desktop browsers (academic reading, technical review, cooking planning) and mobile screens (active use in the kitchen while cooking).
- Content management workflow is zero-dependency, static, and centralized: profile information, external links, navigation registries, and recipe metadata are maintained in `config.js`.

## Capabilities and Constraints

- **Core Capabilities**:
  - Root gateway cover page (`index.html`) providing clean two-path navigation to `/professional/` and `/kitchen/`.
  - Professional profile (`professional/index.html`) presenting biographical summary, research focus, and external links.
  - Kitchen portal (`kitchen/index.html`) featuring categorized recipe menus (veg, meat) and narrative sections (`kitchen/culture/`, `kitchen/me/`).
  - Dual recipe view system (`kitchen/recipes/template.html`): side-by-side ingredients and steps overview (`#menu`) plus interactive step-by-step cooking mode (`#step-by-step`) with sticky sketch illustrations and cross-fade layer transitions.
- **Technical Constraints**:
  - Vanilla web standards only: HTML5, CSS3, and ES6 JavaScript. No external runtime frameworks, build steps, or bundle dependencies.
  - Local filesystem (`file:///`) compatibility: recipe data loaded via script tags rather than CORS-restricted raw fetches.
  - Layout stability across navigation: fixed navbar positioning (60px height, 160px top content baseline), `scrollbar-gutter: stable`, and strict container max-heights to eliminate page-transition jumps.

## Brand Commitments

- **Name & Persona**: Bilal Abbasi (Research Scientist, PhD).
- **Design Ethos**: Grounded in Dieter Rams' principles ("less, but better") and web minimalism: dark charcoal typography on a warm off-white background (`#fafaf9`).
- **Voice & Tone**: Direct, honest, warm, unpretentious, and humble ("all credit goes to my mom. only the mistakes are mine").
- **Cultural & Linguistic Anchor**: Integrates Urdu (اردو) script and diaspora food customs as an authentic living inheritance.
- **Visual Vocabulary**: Hand-drawn ink sketch illustrations with dynamic viewport scaling and blend modes (`mix-blend-mode: multiply`).
- **Aesthetic Separation**: The professional space remains strictly monochromatic and grayscale; the kitchen space employs warm terracotta, amber, and culinary accents.

## Evidence on Hand

- **Professional Credentials**: PhD Applied Mathematics (McGill), Research Scientist at InterDigital, former researcher at Eidos-Montréal; publications on Google Scholar; code on GitHub.
- **Family Recipes**: Authenticated family recipes authored in JavaScript/YAML format in `kitchen/recipes/recipes/` (`yellowdaal.js`, `dahi_bhagar.js`, `keema.js`, `cari.js`).
- **Memoirs & Essays**: Authentic narrative drafts documented in `wip/us-draft.md`.
- **Original Illustrations**: Hand-drawn sketches preserved in `assets/` (portrait silhouette, kitchen sketches, step illustrations).
- *Notice*: Future work must preserve these authentic materials and must not invent fictional recipes, credentials, or citations.

## Product Principles

1. **Dual Integrity Without Dilution**: The professional profile and the kitchen each command full respect in their own idiom without diluting each other.
2. **Content-First Simplicity**: Clean typography, fast static loading, and readable layouts take absolute precedence over interface clutter or unnecessary technical abstractions.
3. **Authentic Cultural Grounding**: Urdu language, childhood memories, and culinary traditions are preserved faithfully with dignity and warmth.
4. **Durable, Self-Contained Implementation**: Zero-dependency vanilla web standards ensure longevity, instant rendering, and independence from shifting framework ecosystems.

## Accessibility & Inclusion

- Semantic HTML5 structure across all pages and recipe modes.
- High-contrast, legible typography (`Lora` serif headings paired with `Inter` sans-serif body text).
- Native right-to-left handling for embedded Urdu typography.
- Keyboard-accessible interactive elements and recipe step navigation.
- Stable viewport layout preventing disorientation or unexpected scroll jumps during navigation.
