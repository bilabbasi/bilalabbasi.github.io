// =========================================================================
// WEBSITE CONFIGURATION FILE
// =========================================================================
// Change the text strings below to customize your website content.
// You do not need to touch the index.html or index.css files to change text.

// -------------------------------------------------------------------------
// 0. GATEWAY (COVER PAGE) CONFIGURATION
// -------------------------------------------------------------------------
const GATEWAY_CONFIG = {
    name: "hi, i'm bilal",
    links: [
        {
            label: "professional",
            url: "professional/"
        },
        {
            label: "kitchen",
            url: "kitchen/"
        }
    ],

    // Revolving door animation (beside "bilal" on the gateway page).
    // When hovering over "professional" or "kitchen", the door vertically
    // rolls to show ", the scientist" (in slate grey) or ", the cook" (in terracotta).
    // The greeting "hi, i'm bilal" remains completely stationary.
    door: {
        professional: {
            text: ", the scientist",
            color: "#4b5563"       // Slate grey matching the professional page subtitle
        },
        kitchen: {
            text: ", the cook",
            color: "#b83b14"       // Rich terracotta matching the kitchen theme
        }
    }
};

// -------------------------------------------------------------------------
// 1. PROFESSIONAL ME CONFIGURATION
// -------------------------------------------------------------------------
const PROFESSIONAL_CONFIG = {
    // Your name as you want it displayed (e.g. "Bilal Abbasi")
    name: "Bilal Abbasi",

    // Your professional subtitle (appears under your name)
    subtitle: "Research Scientist, PhD",

    // Your biography paragraph
    bio: "I am a research scientist at <a href=\"https://www.interdigital.com\" target=\"_blank\" rel=\"noopener noreferrer\">InterDigital</a>, working on AI-based video compression. Previously, I was a researcher at <a href=\"https://eidosmontreal.com\" target=\"_blank\" rel=\"noopener noreferrer\">Eidos-Montréal</a>, working on deep learning for meshes. And, before that, I was doing a PhD at <a href=\"https://www.mcgill.ca\" target=\"_blank\" rel=\"noopener noreferrer\">McGill University</a> in Applied Mathematics. \n \n Let's get to work.",

    // Tab title
    tab: "professional me",

    // Links to your profiles (LinkedIn, Google Scholar, GitHub, etc.)
    links: [
        {
            label: "LinkedIn",
            url: "https://linkedin.com/in/bilabbasi"
        },
        {
            label: "Google Scholar",
            url: "https://scholar.google.com/citations?user=jlcrVoIAAAAJ&hl=en"
        },
        {
            label: "GitHub",
            url: "https://github.com/bilabbasi"
        }
    ]
};

// -------------------------------------------------------------------------
// 2. KITCHEN ME CONFIGURATION (The Kitchen Page)
// -------------------------------------------------------------------------
const KITCHEN_CONFIG = {
    // Page title/header name
    name: "the kitchen",

    // Culinary subtitle
    subtitle: "recipes from my childhood",

    // Biography for your kitchen profile
    bio: `
    a space to share some of my favourite recipes growing up in an Indian immigrant household.
    there is urdu (اردو) scattered about, reflecting a humble attempt to give a glimpse of the beauty of the language I spoke growing up.
    food and language are among the primary pillars of the cultural inheritance of the diaspora; this is just my drop in the ocean.
    
    all credit goes to my mom.
    only the mistakes are mine.`,

    // Tab title
    tab: "kitchen me",

    // Navigation bar tabs (used by nav.js to auto-render headers across all kitchen pages)
    nav: [
        { id: "kitchen", label: "the kitchen", path: "kitchen/", focal: true, dividerAfter: true },
        { id: "culture", label: "customs", path: "kitchen/culture/" },
        { id: "ammi", label: "ammi", path: "kitchen/me/" }
    ],

    // -------------------------------------------------------------------------
    // Spaces Configuration (customs, ammi, etc.)
    // -------------------------------------------------------------------------
    // Configures the split header on sub-pages (e.g. kitchen/culture/ and kitchen/me/).
    // - title: English title displayed on the left in large serif font.
    // - urdu: Urdu calligraphy displayed on the right.
    // - urduColor: Optional color override for the Urdu text on this specific page.
    //              (Defaults to theme.urdu below if omitted).
    spaces: {
        culture: {
            title: "customs",
            urdu: "رسم و رواج",
            urduColor: "#b83b14"
        },
        ammi: {
            title: "ammi",
            urdu: "امی",
            urduColor: "#b83b14"
        }
    },

    // -------------------------------------------------------------------------
    // Theme Colors for Kitchen & Recipes
    // -------------------------------------------------------------------------
    // Changing these colors will automatically propagate across all kitchen
    // and recipe pages without touching any CSS files.
    theme: {
        anchor: "#c55c00ff",    // Primary warm amber/terracotta: links, subtitles, resting ink
        distinct: "#693501ff",  // Electric tangerine: hover states & active underline
        pop: "#2b4162",       // Accent slate: badges, category tags, focal highlights
        urdu: "#b83b14"       // Rich terracotta pigment: Urdu calligraphy subtitle in space headers
    },

    // -------------------------------------------------------------------------
    // Tactile Ink Brush Indicator Parameters (Sumi-e / Nastaliq Qalam Dynamics)
    // -------------------------------------------------------------------------
    // Controls the fluid brush stroke underline that follows your cursor on tabs and links.
    inkNav: {
        strokeColor: "#721817",       // Primary qalam pigment (matches theme.anchor)
        bleedColor: "#fa9f42",        // Capillary edge bleed wash (matches theme.distinct)
        strokeOpacity: 0.92,          // Resting ink pigment translucency (0.0 - 1.0)
        bleedOpacity: 0.38,           // Edge bleed halo translucency (0.0 - 1.0)
        ghostOpacity: 0.24,           // Hover trail brush ghost translucency (0.0 - 1.0)
        transitionDuration: 420,      // Reed pen travel duration in ms
        bloomDuration: 150,           // Wet pigment absorption bloom on landing in ms
        easing: "cubic-bezier(0.22, 1, 0.36, 1)", // Human motor deceleration curve
        inkBleedIntensity: 2.4,       // SVG feDisplacementMap capillary scale
        paperTextureOpacity: 0.22,    // Microscopic paper-fiber tooth intensity
        anisotropicStretch: 1.0,      // Horizontal tension stretch factor during travel
        pressScaleY: 0.85             // Vertical nib compression on press/click
    },

    // -------------------------------------------------------------------------
    // RECIPES LIST & MENU DIRECTORY
    // -------------------------------------------------------------------------
    // This list powers the recipe menu grid on the kitchen home page.
    //
    // HOW TO ADD A NEW RECIPE IN 3 SIMPLE STEPS:
    // -------------------------------------------------------------------------
    // Step 1: Create a new folder under "kitchen/recipes/<dish-name>/"
    //         (e.g., "kitchen/recipes/biryani/").
    //
    // Step 2: Add two files in that folder:
    //         a) "index.html" -> Copy directly from "kitchen/recipes/yellowdaal/index.html"
    //            and change the <title> tag to your dish name.
    //         b) "recipe.js"  -> Copy from yellowdaal/recipe.js and customize your
    //            ingredients, quantities, steps, and optional sketch images.
    //
    // Step 3: Add an entry to the "recipes" list below:
    //         {
    //             category: "chicken" | "meat" | "veg" | "dessert",
    //             categoryUrdu: "مرغ" | "گوشت" | "سبزی" | "میٹھی",
    //             name: "my dish name",
    //             url: "recipes/<dish-name>/",
    //             description: "A short, mouth-watering one-liner about this dish."
    //         }
    // -------------------------------------------------------------------------
    recipes: [
        {
            category: "veg",
            categoryUrdu: "سبزی",
            name: "yellow daal",
            url: "recipes/yellowdaal/",
            description: "Quintessential tarka."
        },
        {
            category: "veg",
            categoryUrdu: "سبزی",
            name: "dahi ka bhagar",
            url: "recipes/dahi_bhagar/",
            description: "Yogurt, rice, daal. What else?"
        },
        {
            category: "meat",
            categoryUrdu: "گوشت",
            name: "keema",
            url: "recipes/keema/",
            description: "One pot, super easy mattar keema dish."
        },
        {
            category: "meat",
            categoryUrdu: "کاری",
            name: "cari",
            url: "recipes/cari/",
            description: "A coconut and anees dish unlike anything you've tried before. I promise."
        }
    ]
};

// -------------------------------------------------------------------------
// Navigation Configuration Registry
// -------------------------------------------------------------------------
const NAVIGATION_CONFIG = {
    kitchen: KITCHEN_CONFIG.nav
};

// -------------------------------------------------------------------------
// 3. AUTOMATIC KITCHEN THEME APPLICATOR
// -------------------------------------------------------------------------
// Applies KITCHEN_CONFIG.theme to CSS variables across kitchen and recipe pages.
// Only applies if the current page is within the kitchen/ or recipes/ section,
// ensuring the professional page remains strictly untouched.
(function applyKitchenTheme() {
    if (typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.theme) {
        const isKitchenPage = () => {
            if (typeof window === "undefined" || !window.location) return true; // Default to true in node/testing
            const path = window.location.pathname || "";

            // Explicit exclusion for professional profile and root gateway pages
            if (path.includes("/professional/") || path.endsWith("/professional") || path.endsWith("/professional/index.html")) {
                return false;
            }

            // Check for presence of kitchen or recipe stylesheets in document
            if (typeof document !== "undefined" && document.querySelector) {
                if (document.querySelector('link[href*="kitchen.css"], link[href*="recipe.css"]')) {
                    return true;
                }
            }

            // Fallback: match kitchen/ or recipes/ as the immediate page/directory segment
            return /\/(kitchen|recipes)(\/|$)/.test(path);
        };

        const apply = () => {
            if (!isKitchenPage()) return;
            if (typeof document !== "undefined" && document.documentElement) {
                const root = document.documentElement;
                if (KITCHEN_CONFIG.theme.anchor) {
                    root.style.setProperty("--text-subtitle", KITCHEN_CONFIG.theme.anchor);
                    root.style.setProperty("--link-color", KITCHEN_CONFIG.theme.anchor);
                }
                if (KITCHEN_CONFIG.theme.distinct) {
                    root.style.setProperty("--link-hover", KITCHEN_CONFIG.theme.distinct);
                }
                if (KITCHEN_CONFIG.theme.pop) {
                    root.style.setProperty("--color-pop", KITCHEN_CONFIG.theme.pop);
                }
                if (KITCHEN_CONFIG.theme.urdu) {
                    root.style.setProperty("--color-urdu", KITCHEN_CONFIG.theme.urdu);
                }
            }
        };

        // Expose applyTheme for programmatic/dynamic updates
        KITCHEN_CONFIG.applyTheme = apply;

        if (typeof document !== "undefined" && document.documentElement) {
            apply();
        }
        if (typeof document !== "undefined" && document.addEventListener) {
            document.addEventListener("DOMContentLoaded", apply);
        }
    }
})();
