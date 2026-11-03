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
    ]
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
    bio: "I am a research scientist at InterDigital, working on AI-based video compression. Previously, I was a researcher at Eidos-Montréal, working on deep learning for meshes. And, before that, I was doing a PhD at McGill University in Applied Mathematics.",

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

    // -------------------------------------------------------------------------
    // Theme Colors for Kitchen & Recipes
    // -------------------------------------------------------------------------
    // Changing these colors will automatically propagate across all kitchen
    // and recipe pages without touching any CSS files.
    theme: {
        anchor: "#b45309",    // Original warm amber/terracotta (exact match to www.bilalabbasi.com/kitchen subtitle)
        distinct: "#ff5722",  // New distinct electric tangerine for hover & secondary emphasis
        pop: "#ccff00"        // New Yellow Punk for badges, tags, and focal highlights
    },

    // Recipes metadata list for dynamic menu generation
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
