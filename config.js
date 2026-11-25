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
    // Navigation links shown at the bottom of the gateway
    links: [
        {
            label: "office",        // Display text for the link
            url: "office/",         // Destination URL
            target: "office"        // Associates link with "the scientist" reel state
        },
        {
            label: "kitchen",       // Display text for the link
            url: "kitchen/",        // Destination URL
            target: "kitchen"       // Associates link with "the cook" reel state
        }
    ],

    // Faded flat reel (descriptor stack) positioned beneath "hi, i'm bilal,".
    // - In resting state: all options are visible in faded grey, with the midline
    //   between "the cook" and "the scientist" centered on the second line.
    // - Hovering/clicking "kitchen": smoothly rolls "the cook" into alignment (terracotta).
    // - Hovering/clicking "office": smoothly rolls "the scientist" into alignment (indigo slate).
    // - Scrolling (mouse wheel, drag, or touch swipe): lets visitors explore all other descriptors (easter egg).
    reel: {
        // Initial phrase shown at rest; evaporates (one-way) on first hover or interaction
        restingLabel: "a bit of everything",

        // Evaporation tuning for restingLabel:
        // - duration: How long (ms) the phrase takes to dissolve away (higher = slower, e.g. 800, 1400, 2400)
        // - revealDuration: How long (ms) the horizontal wheel takes to fade in behind it
        // - blur: Final blur amount in px as it turns to mist
        // - rise: Upward drift in px while evaporating
        // - spread: Letter-spacing expansion in em while dispersing
        evaporation: {
            duration: 2000,
            revealDuration: 2000,
            blur: 10,
            rise: 14,
            spread: 0.04
        },

        // Descriptors in the circular reel. You can add, edit, or reorder items freely here.
        // - id: unique slug for DOM classes and query parameters (?item=<id>)
        // - label: visible text rendered on the reel
        // - target: optional ("kitchen" | "office"); associates item with a navigation link
        // - color: hex color used when this item is active/locked
        // - atmospheric: true = easter egg descriptor (renders in dark charcoal #1e293b when centered)
        items: [
            { id: "runner", label: "the runner", atmospheric: true },
            { id: "cook", label: "the cook", target: "kitchen", color: "#b83b14" },
            { id: "scientist", label: "the scientist", target: "office", color: "#3d68a8" },
            { id: "reader", label: "the reader", atmospheric: true },
            { id: "son", label: "the son", atmospheric: true },
            { id: "husband", label: "the husband", atmospheric: true },
            { id: "cyclist", label: "the cyclist", atmospheric: true },
            { id: "gamer", label: "the gamer", atmospheric: true },
            { id: "friend", label: "the friend", atmospheric: true },
            { id: "brother", label: "the brother", atmospheric: true },
            { id: "foodie", label: "the foodie", atmospheric: true }
        ],
        // Scroll physics for desktop wheel & trackpad:
        // - wheelSensitivity: How far the reel moves per wheel tick.
        //   * 0.15 = slower, heavier, more deliberate (good for trackpad precision)
        //   * 0.35 = balanced default
        //   * 0.60 = fast, spins freely through items
        wheelSensitivity: 0.15,

        // - friction: Momentum glide deceleration after releasing a flick.
        //   * 0.85 = brisk stop (little momentum)
        //   * 0.92 = smooth natural decay (default)
        //   * 0.96 = long glide before magnetic settling
        friction: 0.92
    },

    // How long (in milliseconds) the highlighted title stays on screen before transitioning pages.
    // e.g. 900 = balanced hold; 1400 = longer hold so visitors clearly read the title; 500 = fast
    navigationDelay: 1100
};

// -------------------------------------------------------------------------
// 1. OFFICE CONFIGURATION
// -------------------------------------------------------------------------
const OFFICE_CONFIG = {
    // Your name as you want it displayed (e.g. "Bilal Abbasi")
    name: "Bilal Abbasi",

    // Your office subtitle (appears under your name)
    subtitle: "Research Scientist, PhD",

    // Your biography paragraph
    bio: "I am a research scientist at <a href=\"https://www.interdigital.com\" target=\"_blank\" rel=\"noopener noreferrer\">InterDigital</a>, working on AI-based video compression. Previously, I was a researcher at <a href=\"https://eidosmontreal.com\" target=\"_blank\" rel=\"noopener noreferrer\">Eidos-Montréal</a>, working on deep learning for meshes. And, before that, I was doing a PhD at <a href=\"https://www.mcgill.ca\" target=\"_blank\" rel=\"noopener noreferrer\">McGill University</a> in Applied Mathematics.",

    // Contact trigger & obfuscated recipient (XOR-encoded char codes decoded only on form submit)
    contact: {
        label: "Let's get to work.",
        codes: [43, 32, 37, 40, 37, 103, 40, 43, 43, 40, 58, 32, 103, 43, 40, 9, 46, 36, 40, 32, 37, 103, 42, 38, 36],
        key: 73
    },

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

    // Navigation bar tabs (used by nav.js to auto-render headers across all kitchen pages)
    nav: [
        { id: "kitchen", label: "the kitchen", urdu: "باورچی خانہ", path: "kitchen/", focal: true, dividerAfter: true },
        { id: "customs", label: "customs", urdu: "رسم و رواج", path: "kitchen/customs/" },
        { id: "ammi", label: "ammi", urdu: "امی", path: "kitchen/ammi/" },
        { id: "abu", label: "abu", urdu: "ابو", isText: true },
        { id: "bhaiya", label: "bhaiya", urdu: "بھیا", isText: true, dividerAfter: true },
        { id: "bilal", label: "bilal", desktopLabel: "بلال", urdu: "بلال", path: "", isHome: true }
    ],

    // -------------------------------------------------------------------------
    // Spaces Configuration (customs, ammi, etc.)
    // -------------------------------------------------------------------------
    // Configures the split header on sub-pages (e.g. kitchen/customs/ and kitchen/ammi/).
    // - title: English title displayed on the left in large serif font.
    // - urdu: Urdu calligraphy displayed on the right.
    // - urduColor: Optional color override for the Urdu text on this specific page.
    //              (Defaults to theme.urdu below if omitted).
    spaces: {
        kitchen: {
            title: "the kitchen",
            urdu: "باورچی خانہ",
            urduColor: "#b83b14"
        },
        customs: {
            title: "customs",
            urdu: "رسم و رواج",
            urduColor: "#b83b14"
        },
        ammi: {
            title: "ammi",
            urdu: "امی",
            urduColor: "#b83b14"
        },
        abu: {
            title: "abu",
            urdu: "ابو",
            urduColor: "#b83b14"
        },
        bhaiya: {
            title: "bhaiya",
            urdu: "بھیا",
            urduColor: "#b83b14"
        },
        bilal: {
            title: "bilal",
            urdu: "بلال",
            urduColor: "#b83b14"
        }
    },

    // -------------------------------------------------------------------------
    // Theme Colors for Kitchen & Recipes
    // -------------------------------------------------------------------------
    // Changing these colors will automatically propagate across all kitchen
    // and recipe pages without touching any CSS files.
    theme: {
        anchor: "#c55c00",    // Roasted saffron: links, subtitles, resting ink
        distinct: "#693501",  // Clove umber: hover states & active underline
        pop: "#2b4162",       // Accent slate: badges, category tags, focal highlights
        urdu: "#b83b14",      // Rich terracotta pigment: Urdu calligraphy subtitle in space headers
        // Centralized Urdu calligraphy font for all kitchen & recipe pages (loaded automatically by js/theme.js).
        // Examples:
        //   { family: "Gulzar", googleFonts: "Gulzar" }
        //   { family: "Noto Nastaliq Urdu", googleFonts: "Noto+Nastaliq+Urdu:wght@400..700" }
        //   { family: "Aref Ruqaa", googleFonts: "Aref+Ruqaa:wght@400;700" }
        urduFont: {
            family: "Noto Nastaliq Urdu",
            googleFonts: "Noto+Nastaliq+Urdu:wght@400..700"
        }
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
    // FLOATING INGREDIENT LENS & STEP TRANSITIONS
    // -------------------------------------------------------------------------
    // Controls the Apple Watch-style hover lens on desktop, layout spacing,
    // and mobile tap-to-focus / vertical swipe transitions.
    // -------------------------------------------------------------------------
    floatingLens: {
        // Desktop hover lens
        maxScale: 1.75,               // Peak magnification directly under cursor (e.g. 1.5 - 2.0)
        baseScale: 0.96,              // Resting scale for items outside the hover radius
        radiusPx: 58,                 // Gaussian falloff radius in px (smaller = more isolated)
        neighborPushPx: 26,           // Subtle outward nudge of nearby items (0 to disable)
        maxBlurPx: 3.5,               // Smooth background blur on unfocused items (0 to disable)
        minOpacity: 0.55,             // Subtle fade on unfocused background items (1.0 to disable)
        focusThreshold: 0.45,         // Focus falloff (0-1) before background blur & text fade start
        spring: 0.10,                 // 60fps zoom/blur smoothing (0.06 = slow/silky, 0.25 = snappy)

        // Stage sizing & spacing
        heroBaseSizePx: 74,           // Base icon size on the recipe landing page
        heroPaddingPx: 18,            // Minimum gap between items on the landing page
        stepPaddingPx: 28,            // Minimum gap between active items in desktop step-by-step

        // Mobile tap-to-focus & vertical swipe
        mobileFocusScale: 1.42,       // Scale of tapped/focused ingredient on mobile
        mobileBgBlurPx: 3.5,          // Background blur when an ingredient is tapped on mobile
        mobileBgOpacity: 0.38,        // Background opacity when an ingredient is tapped on mobile
        mobileFocusDurationMs: 280,   // Duration (ms) of mobile tap-to-focus & unblur transition
        mobileSwipeFadeFactor: 1.15   // Cross-fade speed during mobile vertical step swipe
    },

    // -------------------------------------------------------------------------
    // RECIPES LIST & MENU DIRECTORY
    // -------------------------------------------------------------------------
    // Powers the recipe menu grid on the kitchen home page.
    //
    // HOW TO ADD A NEW RECIPE:
    // 1. Run: node kitchen/recipes/new.js <slug> [path/to/recipe.yaml]
    // 2. Edit kitchen/recipes/<slug>/recipe.js (if you didn't pass a .yaml file).
    // 3. Add an entry to the "recipes" array below.
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
            category: "veg",
            categoryUrdu: "سبزی",
            name: "test tarka aloo",
            url: "recipes/test_recipe/",
            description: "4-step stress-test recipe using real ingredient PNGs.",
            isTest: true
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
            categoryUrdu: "گوشت",
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
