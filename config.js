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
            category: "meat",
            categoryUrdu: "گوشت",
            name: "keema",
            url: "recipes/keema/",
            description: "One pot, super easy mattar keema dish."
        }
    ]
};
