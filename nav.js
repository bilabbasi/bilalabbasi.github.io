/**
 * nav.js - Shared Navigation Component for Bilal Abbasi's Website
 * Automatically renders navigation headers, manages the tactile sumi-e / Nastaliq qalam
 * ink brush stroke indicator, and provides fluid, instant page transitions.
 */

(function () {
    /**
     * Configurable parameters for the Sumi-e / Nastaliq Qalam ink brush stroke indicator.
     */
    const INK_NAV_DEFAULTS = {
        strokeColor: null,                        // Uses CSS --ink-color when null
        bleedColor: null,                         // Uses CSS --ink-bleed-color when null
        strokeOpacity: 0.92,                      // Resting core pigment translucency (0.0 - 1.0)
        bleedOpacity: 0.36,                       // Wet edge bleed halo translucency (0.0 - 1.0)
        ghostOpacity: 0.24,                       // Hover brush ghost trail opacity (0.0 - 1.0)
        transitionDuration: 420,                  // Reed pen (qalam) travel duration in ms
        bloomDuration: 150,                       // Wet ink absorption bloom on landing in ms
        easing: "cubic-bezier(0.22, 1, 0.36, 1)", // Human motor deceleration curve
        inkBleedIntensity: 2.4,                   // SVG feDisplacementMap capillary scale
        paperTextureOpacity: 0.22,                // Microscopic paper-fiber tooth intensity
        anisotropicStretch: 1.0,                  // Horizontal tension stretch multiplier
        pressScaleY: 0.85                         // Vertical ink compression on click/press
    };

    /**
     * Procedural SVG brush stroke paths (viewBox="0 0 240 16").
     * All three core morph states share an identical 6-segment cubic-bezier topology
     * (M ... C ... C ... C ... C ... C ... C ... Z) for hardware-accelerated vector morphing.
     */
    const INK_BRUSH_PATHS = {
        // Resting stroke: oblique 35-deg qalam nib entry on left, poised kashida belly, razor-fine feathered exit
        CORE_REST: "M 1.8,9.1 C 7,5.8 24,4.8 62,5.2 C 108,5.7 154,6.4 196,6.1 C 214,6.0 228,6.7 236.5,7.6 C 226,8.7 208,9.2 188,9.1 C 144,8.9 98,10.2 52,10.5 C 22,10.7 8,10.2 1.8,9.1 Z",
        // In-flight stretched stroke: taut, elongated filament under anisotropic reed tension
        CORE_STRETCH: "M 0.8,8.3 C 12,6.6 36,6.0 74,6.3 C 116,6.6 158,6.9 198,6.6 C 218,6.5 232,7.0 239.0,7.7 C 230,8.4 212,8.8 192,8.7 C 148,8.5 104,9.2 58,9.4 C 26,9.5 10,9.1 0.8,8.3 Z",
        // Landing bloom stroke: fuller pigment belly as wet ink absorbs into paper fibers
        CORE_SETTLE: "M 1.5,9.3 C 6,5.2 22,4.2 60,4.7 C 106,5.2 152,6.0 194,5.7 C 213,5.6 228,6.4 237.2,7.5 C 227,9.0 209,9.6 189,9.5 C 145,9.3 99,10.7 53,11.0 C 22,11.2 7,10.6 1.5,9.3 Z",
        // Mid-tone translucent sumi wash extending slightly further into the feathered terminal
        WASH: "M 1.2,9.2 C 6,5.4 22,4.4 60,4.9 C 108,5.4 156,6.1 200,5.8 C 218,5.7 232,6.5 239.2,7.5 C 231,8.9 214,9.6 192,9.5 C 146,9.3 98,10.6 50,10.9 C 20,11.1 6,10.5 1.2,9.2 Z",
        // Translucent capillary edge bleed halo surrounding the core pigment
        BLEED: "M 0.8,9.3 C 5,4.9 22,3.8 60,4.4 C 108,5.0 156,5.8 200,5.4 C 219,5.3 233,6.2 239.6,7.5 C 232,9.3 214,10.1 190,10.0 C 144,9.8 96,11.2 48,11.5 C 18,11.7 5,10.9 0.8,9.3 Z",
        // Delicate feathered split-hair bristle filaments (kasure) at entry and trailing release
        BRISTLES: "M 182,5.9 C 204,5.7 224,6.2 239.4,7.1 M 176,9.3 C 200,9.5 220,9.0 237.8,8.2 M 14,10.4 C 42,10.9 78,10.6 114,9.9",
        // Subtle dry-brush paper-tooth whisper near the feathered exit
        DRY_STREAKS: "M 164,7.4 C 190,7.2 214,7.4 234,7.6"
    };

    /**
     * Resolves active ink configuration by merging INK_NAV_DEFAULTS with KITCHEN_CONFIG.inkNav
     * and any runtime overrides.
     */
    function getInkConfig() {
        const externalConfig = (typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.inkNav)
            ? KITCHEN_CONFIG.inkNav
            : {};
        const runtimeConfig = (typeof window !== "undefined" && window.INK_NAV_CONFIG)
            ? window.INK_NAV_CONFIG
            : {};
        return Object.assign({}, INK_NAV_DEFAULTS, externalConfig, runtimeConfig);
    }

    /**
     * Injects the shared procedural SVG filter (<feTurbulence> + <feDisplacementMap> + paper grain)
     * into the document once, producing microscopic paper-fiber tooth and capillary edge bleed
     * without raster image assets.
     */
    function ensureInkFilterDefs() {
        if (typeof document === "undefined" || !document.body || typeof document.body.appendChild !== "function") {
            return;
        }
        if (typeof document.getElementById === "function" && document.getElementById("nav-ink-svg-defs")) {
            return;
        }

        const cfg = getInkConfig();
        const svgDefs = document.createElement("div");
        svgDefs.id = "nav-ink-svg-defs";
        svgDefs.setAttribute("aria-hidden", "true");
        svgDefs.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";
        svgDefs.innerHTML = `
            <svg width="0" height="0" aria-hidden="true" focusable="false">
                <defs>
                    <filter id="nav-ink-filter" x="-12%" y="-45%" width="124%" height="190%" color-interpolation-filters="sRGB">
                        <feTurbulence id="nav-ink-turbulence" type="fractalNoise" baseFrequency="0.045 0.18" numOctaves="3" seed="7" result="paperNoise" />
                        <feDisplacementMap id="nav-ink-displacement" in="SourceGraphic" in2="paperNoise" scale="${cfg.inkBleedIntensity}" xChannelSelector="R" yChannelSelector="G" result="displacedInk" />
                        <feGaussianBlur id="nav-ink-blur" in="displacedInk" stdDeviation="0.42" result="softBleed" />
                        <feColorMatrix id="nav-ink-grain-matrix" in="paperNoise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -${cfg.paperTextureOpacity} 1.05" result="paperGrainAlpha" />
                        <feComposite in="displacedInk" in2="paperGrainAlpha" operator="in" result="texturedCore" />
                        <feMerge>
                            <feMergeNode in="softBleed" />
                            <feMergeNode in="texturedCore" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>
        `.trim();
        document.body.appendChild(svgDefs);
    }

    /**
     * Generates the inner SVG brush stroke markup for active or ghost indicators.
     */
    function createBrushSvgMarkup(isGhost) {
        if (isGhost) {
            return `<span class="nav-ink-stage"><svg class="nav-brush-svg" viewBox="0 0 240 16" preserveAspectRatio="none" focusable="false"><path class="nav-ink-wash-path" d="${INK_BRUSH_PATHS.WASH}" /><path class="nav-ink-core-path" d="${INK_BRUSH_PATHS.CORE_REST}" /><path class="nav-ink-bristles-path" d="${INK_BRUSH_PATHS.BRISTLES}" /></svg></span>`;
        }
        return `<span class="nav-ink-stage"><svg class="nav-brush-svg" viewBox="0 0 240 16" preserveAspectRatio="none" focusable="false"><path class="nav-ink-bleed-path" d="${INK_BRUSH_PATHS.BLEED}" /><path class="nav-ink-wash-path" d="${INK_BRUSH_PATHS.WASH}" /><path class="nav-ink-core-path" d="${INK_BRUSH_PATHS.CORE_REST}" /><path class="nav-ink-bristles-path" d="${INK_BRUSH_PATHS.BRISTLES}" /><path class="nav-ink-dry-path" d="${INK_BRUSH_PATHS.DRY_STREAKS}" /></svg></span>`;
    }

    /**
     * Runtime configurator for updating stroke color/translucency, transition duration,
     * ink bleed intensity, and paper texture opacity dynamically.
     */
    function configureInkNavbar(options = {}) {
        if (typeof window !== "undefined") {
            window.INK_NAV_CONFIG = Object.assign({}, window.INK_NAV_CONFIG || {}, options);
        }
        const cfg = getInkConfig();

        if (typeof document !== "undefined" && document.documentElement && document.documentElement.style) {
            const rootStyle = document.documentElement.style;
            if (cfg.strokeColor) rootStyle.setProperty("--ink-color", cfg.strokeColor);
            if (cfg.bleedColor) rootStyle.setProperty("--ink-bleed-color", cfg.bleedColor);
            if (typeof cfg.strokeOpacity === "number") rootStyle.setProperty("--ink-opacity", String(cfg.strokeOpacity));
            if (typeof cfg.bleedOpacity === "number") rootStyle.setProperty("--ink-bleed-opacity", String(cfg.bleedOpacity));
            if (typeof cfg.ghostOpacity === "number") rootStyle.setProperty("--ink-ghost-opacity", String(cfg.ghostOpacity));
            if (typeof cfg.transitionDuration === "number") rootStyle.setProperty("--ink-duration", `${cfg.transitionDuration}ms`);
            if (typeof cfg.bloomDuration === "number") rootStyle.setProperty("--ink-bloom-duration", `${cfg.bloomDuration}ms`);
            if (cfg.easing) rootStyle.setProperty("--ink-easing", cfg.easing);
            if (typeof cfg.inkBleedIntensity === "number") rootStyle.setProperty("--ink-bleed-intensity", String(cfg.inkBleedIntensity));
            if (typeof cfg.paperTextureOpacity === "number") rootStyle.setProperty("--ink-paper-tooth", String(cfg.paperTextureOpacity));
            if (typeof cfg.pressScaleY === "number") rootStyle.setProperty("--ink-press-scale-y", String(cfg.pressScaleY));
        }

        if (typeof document !== "undefined" && typeof document.getElementById === "function") {
            const disp = document.getElementById("nav-ink-displacement");
            if (disp && typeof cfg.inkBleedIntensity === "number") {
                disp.setAttribute("scale", String(cfg.inkBleedIntensity));
            }
            const grain = document.getElementById("nav-ink-grain-matrix");
            if (grain && typeof cfg.paperTextureOpacity === "number") {
                grain.setAttribute("values", `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -${cfg.paperTextureOpacity} 1.05`);
            }
        }
        return cfg;
    }

    /**
     * Computes the relative path between two root-relative paths.
     * E.g. computeRelativePath("kitchen/me/", "kitchen/culture/") -> "../culture/"
     */
    function computeRelativePath(fromPath, toPath) {
        if (!toPath && toPath !== "") return "";
        fromPath = fromPath || "";
        toPath = toPath || "";
        if (fromPath === toPath) return "./";
        const fromParts = fromPath.replace(/\/$/, "").split("/").filter(Boolean);
        const toParts = toPath.replace(/\/$/, "").split("/").filter(Boolean);

        let common = 0;
        while (common < fromParts.length && common < toParts.length && fromParts[common] === toParts[common]) {
            common++;
        }

        const upCount = fromParts.length - common;
        const upStr = "../".repeat(upCount);
        const downParts = toParts.slice(common);
        const downStr = downParts.length > 0 ? downParts.join("/") + "/" : "";

        const rel = upStr + downStr;
        return rel || "./";
    }

    /**
     * Resolves a repo-relative asset path (e.g. "assets/foo.png") relative to fromPath.
     */
    function resolveAssetPath(fromPath, assetRel) {
        const parts = (fromPath || "").replace(/\/$/, "").split("/").filter(Boolean);
        const upCount = parts.length;
        const upStr = "../".repeat(upCount);
        return upStr + assetRel.replace(/^\//, "");
    }

    /**
     * Fallback to automatically infer the active tab if data-current is not specified.
     */
    function detectCurrentId(items) {
        const pathname = (typeof window !== "undefined" && window.location)
            ? window.location.pathname.replace(/\\/g, "/")
            : "";
        // Sort items by path specificity (longest path first) so sub-paths match before parent paths
        const sorted = items.slice().sort((a, b) => (b.path || "").length - (a.path || "").length);
        for (const item of sorted) {
            if (item.isText || !item.path) continue;
            const cleanPath = item.path.replace(/^\/|\/$/g, "");
            if (pathname.includes("/" + cleanPath + "/") ||
                pathname.endsWith("/" + cleanPath) ||
                pathname.endsWith("/" + cleanPath + "/index.html")) {
                return item.id;
            }
        }
        return items[0] ? items[0].id : null;
    }

    /**
     * Renders navigation markup into a <header class="navbar"> element
     * using accessible semantics (<nav>, <ul role="tablist">, role="tab", aria-selected).
     */
    function renderNavbar(header) {
        // If data-back is specified, render a back-link navbar (e.g. recipe templates)
        const backUrl = header.getAttribute("data-back");
        if (backUrl) {
            const recipeTitle = header.getAttribute("data-recipe-title");
            if (recipeTitle) {
                renderRecipeNavbar(header, recipeTitle, backUrl);
                return;
            }
            const backLabel = header.getAttribute("data-back-label") || "← the kitchen";
            header.innerHTML = `
            <nav class="nav-container" aria-label="Breadcrumb">
                <ul class="nav-links">
                    <li class="nav-item"><a href="${backUrl}" class="active" id="kitchen-tab" aria-current="page">${backLabel}</a></li>
                    <span class="nav-indicator" aria-hidden="true"></span>
                </ul>
            </nav>`.trim();
            return;
        }

        // Determine navigation configuration
        const navKey = header.getAttribute("data-nav") || "kitchen";
        const navConfig = (typeof NAVIGATION_CONFIG !== "undefined" && NAVIGATION_CONFIG[navKey])
            ? NAVIGATION_CONFIG[navKey]
            : (typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.nav ? KITCHEN_CONFIG.nav : [
                { id: "kitchen", label: "the kitchen", path: "kitchen/", focal: true, dividerAfter: true },
                { id: "culture", label: "customs", path: "kitchen/culture/" },
                { id: "ammi", label: "ammi", path: "kitchen/me/" }
            ]);

        // Determine active tab ID
        let currentId = header.getAttribute("data-current");
        if (!currentId) {
            currentId = detectCurrentId(navConfig);
        }

        const currentItem = navConfig.find(item => item.id === currentId) || navConfig[0];
        const fromPath = currentItem ? currentItem.path : "kitchen/";

        const itemsHtml = [];
        navConfig.forEach(item => {
            const isActive = item.id === currentId;
            let href = (item.path !== undefined) ? computeRelativePath(fromPath, item.path) : "";
            if (item.isHome && typeof window !== "undefined" && window.location.protocol === "file:") {
                href += "index.html";
            }
            const classes = [];
            if (isActive) classes.push("nav-home");
            if (item.focal) classes.push("nav-focal");
            if (item.id === "bilal" || item.isHome) classes.push("nav-item-bilal");

            const classAttr = classes.length ? ` class="${classes.join(" ")}"` : "";
            const idAttr = item.id === "kitchen" ? ` id="kitchen-tab"` : "";
            const ariaSelected = isActive ? "true" : "false";
            const ariaCurrent = isActive ? ` aria-current="page"` : "";
            const homeAttr = item.isHome ? ` data-is-home="true"` : "";

            // Dynamic label if "the kitchen", or desktopLabel (e.g. Urdu "بلال" on desktop)
            let label = item.desktopLabel || item.label;
            if (item.id === "kitchen" && typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.name) {
                label = KITCHEN_CONFIG.name;
            }

            // Collapsible items on mobile: items after "the kitchen" and "customs" (e.g. "ammi", and future family spaces)
            const isCollapsible = (item.id !== "kitchen" && item.id !== "culture");
            const collapsibleClass = isCollapsible ? " nav-item-collapsible" : "";
            const bilalLiClass = (item.id === "bilal" || item.isHome) ? " nav-item-bilal" : "";

            let innerHtml = "";
            if (item.isText) {
                innerHtml = `<span class="nav-text" data-nav-id="${item.id}">${label}</span>`;
            } else {
                innerHtml = `<a href="${href}"${classAttr}${idAttr}${homeAttr} data-nav-id="${item.id}" role="tab" aria-selected="${ariaSelected}"${ariaCurrent}>${label}</a>`;
            }

            itemsHtml.push(`<li class="nav-item${collapsibleClass}${bilalLiClass}" role="presentation" data-nav-id="${item.id}">${innerHtml}</li>`);
            if (item.dividerAfter) {
                const dividerCollapsibleClass = isCollapsible ? " nav-divider-collapsible" : "";
                itemsHtml.push(`<li class="nav-divider${dividerCollapsibleClass}" aria-hidden="true">|</li>`);
            }
        });

        // Add persistent indicator element
        itemsHtml.push(`<span class="nav-indicator" aria-hidden="true"></span>`);

        // Check if an active page is one of the collapsible sub-pages
        const isCollapsedActive = navConfig.some(item => item.id === currentId && (item.id !== "kitchen" && item.id !== "culture"));
        const toggleActiveClass = isCollapsedActive ? " is-subpage-active" : "";

        // Build mobile dropdown items: ONLY items that are NOT in the horizontal bar (i.e. collapsible items)
        const dropdownItemsHtml = [];
        navConfig.forEach(item => {
            const isCollapsible = (item.id !== "kitchen" && item.id !== "culture");
            if (!isCollapsible) return; // Exclude items already visible in the top nav bar

            const isActive = item.id === currentId;
            let href = (item.path !== undefined && item.path !== null) ? computeRelativePath(fromPath, item.path) : "";
            if (item.isHome && typeof window !== "undefined" && window.location.protocol === "file:") {
                href += "index.html";
            }
            let label = item.label;
            if (item.id === "kitchen" && typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.name) {
                label = KITCHEN_CONFIG.name;
            }
            let urduLabel = item.urdu || (typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.spaces && KITCHEN_CONFIG.spaces[item.id] ? KITCHEN_CONFIG.spaces[item.id].urdu : "");
            if (!urduLabel) {
                if (item.id === "kitchen") urduLabel = "باورچی خانہ";
                else if (item.id === "culture") urduLabel = "رسم و رواج";
                else if (item.id === "ammi") urduLabel = "امی";
                else if (item.id === "abu") urduLabel = "ابو";
                else if (item.id === "bhaiya") urduLabel = "بھیا";
                else if (item.id === "bilal") urduLabel = "بلال";
            }
            const activeClass = isActive ? " is-active" : "";
            const ariaCurrent = isActive ? ` aria-current="page"` : "";
            const homeAttr = item.isHome ? ` data-is-home="true"` : "";

            if (item.isText) {
                dropdownItemsHtml.push(`
                    <div class="mobile-nav-link mobile-nav-text" data-mobile-nav-id="${item.id}">
                        <span class="mobile-nav-label-en">${label}</span>
                        <span class="mobile-nav-label-ur">${urduLabel}</span>
                    </div>
                `.trim());
            } else {
                dropdownItemsHtml.push(`
                    <a href="${href}" class="mobile-nav-link${activeClass}" data-mobile-nav-id="${item.id}"${ariaCurrent}${homeAttr}>
                        <span class="mobile-nav-label-en">${label}</span>
                        <span class="mobile-nav-label-ur">${urduLabel}</span>
                    </a>
                `.trim());
            }
        });

        const logoSrc = resolveAssetPath(fromPath, "assets/kitchen_collapsible_menu_logo_2.png");

        header.innerHTML = `
            <nav class="nav-container" aria-label="Primary">
                <ul class="nav-links" role="tablist">
                    ${itemsHtml.join("\n                    ")}
                </ul>
                <button class="mobile-nav-toggle${toggleActiveClass}" type="button" aria-expanded="false" aria-controls="mobile-nav-dropdown" aria-label="Toggle navigation menu">
                    <img class="mobile-toggle-icon" src="${logoSrc}" alt="" aria-hidden="true">
                    <svg class="mobile-toggle-close" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"></line><line x1="13" y1="3" x2="3" y2="13"></line></svg>
                </button>
            </nav>
            <div class="mobile-nav-dropdown" id="mobile-nav-dropdown" aria-hidden="true">
                <div class="mobile-nav-items">
                    ${dropdownItemsHtml.join("\n                    ")}
                </div>
            </div>
            <div class="mobile-nav-backdrop" aria-hidden="true"></div>`.trim();

        setupMobileNavToggle(header);
    }

    /**
     * Initializes the Apple-style mobile navigation toggle button and dropdown overlay.
     */
    function setupMobileNavToggle(header) {
        if (!header) return;
        const toggleBtn = header.querySelector ? header.querySelector(".mobile-nav-toggle") : null;
        const dropdown = header.querySelector ? header.querySelector(".mobile-nav-dropdown") : null;
        const backdrop = header.querySelector ? header.querySelector(".mobile-nav-backdrop") : null;
        if (!toggleBtn || !dropdown) return;

        const openMenu = () => {
            header.classList.add("is-menu-open");
            toggleBtn.setAttribute("aria-expanded", "true");
            dropdown.setAttribute("aria-hidden", "false");
            if (typeof document !== "undefined" && document.addEventListener) {
                document.addEventListener("keydown", handleKeydown);
            }
        };

        const closeMenu = () => {
            header.classList.remove("is-menu-open");
            toggleBtn.setAttribute("aria-expanded", "false");
            dropdown.setAttribute("aria-hidden", "true");
            if (typeof document !== "undefined" && document.removeEventListener) {
                document.removeEventListener("keydown", handleKeydown);
            }
        };

        const toggleMenu = () => {
            if (header.classList.contains("is-menu-open")) {
                closeMenu();
            } else {
                openMenu();
            }
        };

        const handleKeydown = (e) => {
            if (e.key === "Escape") {
                closeMenu();
                if (toggleBtn.focus) toggleBtn.focus();
            }
        };

        if (toggleBtn.addEventListener) {
            toggleBtn.addEventListener("click", toggleMenu);
        }
        if (backdrop && backdrop.addEventListener) {
            backdrop.addEventListener("click", closeMenu);
        }
        const links = dropdown.querySelectorAll ? dropdown.querySelectorAll("a.mobile-nav-link") : [];
        if (links.forEach) {
            links.forEach(l => {
                if (l.addEventListener) l.addEventListener("click", closeMenu);
            });
        }
    }

    /**
     * Hydrates a .nav-indicator element with the procedural SVG brush stroke and ensures
     * the shared SVG filter defs and hover ghost element exist.
     */
    function ensureIndicator(navLinks) {
        if (!navLinks) return null;
        ensureInkFilterDefs();

        let indicator = navLinks.querySelector(".nav-indicator");
        if (!indicator && typeof document !== "undefined" && typeof document.createElement === "function") {
            indicator = document.createElement("span");
            indicator.className = "nav-indicator";
            indicator.setAttribute("aria-hidden", "true");
            if (typeof navLinks.appendChild === "function") {
                navLinks.appendChild(indicator);
            }
        }

        // Hydrate SVG brush stroke inside indicator when running in a full DOM environment
        if (indicator && typeof indicator.querySelector === "function" && !indicator.querySelector(".nav-ink-stage")) {
            indicator.innerHTML = createBrushSvgMarkup(false);
            if (indicator.classList && typeof indicator.classList.add === "function") {
                indicator.classList.add("is-ink-hydrated");
            }
        }

        // Ensure hover ghost indicator exists for faint brush ghost trails
        if (typeof navLinks.querySelector === "function" &&
            typeof navLinks.appendChild === "function" &&
            typeof document !== "undefined" &&
            typeof document.createElement === "function") {
            let ghost = navLinks.querySelector(".nav-indicator-ghost");
            if (!ghost && indicator && typeof indicator.querySelector === "function") {
                ghost = document.createElement("span");
                ghost.className = "nav-indicator-ghost";
                ghost.setAttribute("aria-hidden", "true");
                ghost.innerHTML = createBrushSvgMarkup(true);
                navLinks.appendChild(ghost);
            }
        }

        return indicator;
    }

    /**
     * Finds the currently active link element in a nav container.
     */
    function getActiveNavTarget(navLinks) {
        if (!navLinks) return null;
        return navLinks.querySelector(".nav-home") || navLinks.querySelector(".active");
    }

    /**
     * Checks whether the user prefers reduced motion.
     */
    function prefersReducedMotion() {
        return typeof window !== "undefined" &&
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    /**
     * Updates the tactile ink brush stroke indicator to align with targetLink.
     * Implements FLIP + anisotropic qalam tension stretch, gentle landing contraction,
     * and a 150ms wet-ink pigment deposition bloom via the Web Animations API.
     */
    function updateIndicator(navLinks, targetLink, animate = true) {
        if (!navLinks) return;
        if (!targetLink) {
            targetLink = navLinks.querySelector(".nav-item a.active") || navLinks.querySelector(".nav-item a");
        }
        if (!targetLink) return;
        const indicator = ensureIndicator(navLinks);
        if (!indicator) return;

        const linksRect = navLinks.getBoundingClientRect();
        const targetRect = targetLink.getBoundingClientRect();

        if (targetRect.width === 0) return;

        const x = targetRect.left - linksRect.left;
        const width = targetRect.width;

        const stage = (typeof indicator.querySelector === "function")
            ? indicator.querySelector(".nav-ink-stage")
            : null;

        // Sample current visual geometry (supports seamless mid-flight interruption)
        let prevX = indicator._inkState ? indicator._inkState.left : undefined;
        let prevWidth = indicator._inkState ? indicator._inkState.width : undefined;

        if (stage && indicator._inkState && stage._activeAnim && typeof stage.getBoundingClientRect === "function") {
            const liveRect = stage.getBoundingClientRect();
            if (liveRect && liveRect.width > 0) {
                prevX = liveRect.left - linksRect.left;
                prevWidth = liveRect.width;
            }
        }

        const dx = (prevX !== undefined) ? (x - prevX) : 0;
        const direction = dx > 0.5 ? 1 : (dx < -0.5 ? -1 : 0);

        indicator._inkState = {
            left: x,
            width: width,
            direction: direction
        };

        if (navLinks.dataset) {
            navLinks.dataset.inkDirection = direction > 0 ? "right" : (direction < 0 ? "left" : "rest");
        }

        const cfg = getInkConfig();
        const shouldAnimate = Boolean(
            animate &&
            !prefersReducedMotion() &&
            prevX !== undefined &&
            prevWidth !== undefined &&
            (Math.abs(dx) > 0.5 || Math.abs(width - prevWidth) > 0.5)
        );

        if (!animate) {
            indicator.style.transition = "none";
        } else if (!stage) {
            // Fallback transition for bare mock elements in unit tests
            indicator.style.transition = `transform ${cfg.transitionDuration}ms ${cfg.easing}, width ${cfg.transitionDuration}ms ${cfg.easing}`;
        } else {
            indicator.style.transition = "opacity 0.2s ease";
        }

        // Snap outer anchor coordinates once; inner .nav-ink-stage runs 60fps compositor transform
        indicator.style.transform = `translateX(${x}px)`;
        indicator.style.width = `${width}px`;
        if (navLinks.classList && typeof navLinks.classList.add === "function") {
            navLinks.classList.add("has-indicator");
        }

        if (shouldAnimate && stage && typeof stage.animate === "function") {
            if (stage._activeAnim && typeof stage._activeAnim.cancel === "function") {
                stage._activeAnim.cancel();
            }

            const startScaleX = Math.max(0.2, prevWidth / width);
            const avgWidth = (prevWidth + width) * 0.5;
            const stretchPx = Math.min(Math.abs(dx) * 0.44, 68) * cfg.anisotropicStretch;
            const midWidth = avgWidth + stretchPx;
            const midScaleX = Math.max(startScaleX, midWidth / width);

            // Calculate mid-flight offset along movement axis so leading nib pulls ahead
            const midTranslateX = direction >= 0
                ? (-dx * 0.46) - (midWidth - width) * 0.34
                : (-dx * 0.30) - (midWidth - width) * 0.66;

            const settleOvershootX = direction * 1.1;

            stage._activeAnim = stage.animate([
                {
                    transform: `translate3d(${-dx}px, 0, 0) scaleX(${startScaleX.toFixed(4)}) scaleY(0.92)`,
                    offset: 0
                },
                {
                    transform: `translate3d(${midTranslateX.toFixed(2)}px, 0, 0) scaleX(${midScaleX.toFixed(4)}) scaleY(0.84)`,
                    offset: 0.42
                },
                {
                    transform: `translate3d(${settleOvershootX.toFixed(2)}px, 0, 0) scaleX(0.972) scaleY(1.06)`,
                    offset: 0.84
                },
                {
                    transform: "translate3d(0, 0, 0) scaleX(1) scaleY(1)",
                    offset: 1
                }
            ], {
                duration: cfg.transitionDuration,
                easing: cfg.easing,
                fill: "none"
            });

            // Vector path morphing + 150ms wet pigment deposition bloom on landing
            const corePath = stage.querySelector ? stage.querySelector(".nav-ink-core-path") : null;
            const bleedPath = stage.querySelector ? stage.querySelector(".nav-ink-bleed-path") : null;
            const svgEl = stage.querySelector ? stage.querySelector(".nav-brush-svg") : null;

            if (corePath && typeof corePath.animate === "function") {
                corePath.animate([
                    { d: `path("${INK_BRUSH_PATHS.CORE_REST}")`, offset: 0 },
                    { d: `path("${INK_BRUSH_PATHS.CORE_STRETCH}")`, offset: 0.42 },
                    { d: `path("${INK_BRUSH_PATHS.CORE_SETTLE}")`, offset: 0.85 },
                    { d: `path("${INK_BRUSH_PATHS.CORE_REST}")`, offset: 1 }
                ], {
                    duration: cfg.transitionDuration + cfg.bloomDuration,
                    easing: cfg.easing
                });
            }

            const totalBloomWindow = cfg.transitionDuration + cfg.bloomDuration;
            const landingOffset = Math.min(0.78, (cfg.transitionDuration * 0.72) / totalBloomWindow);
            const peakBloomOffset = Math.min(0.92, (cfg.transitionDuration * 0.96) / totalBloomWindow);

            if (bleedPath && typeof bleedPath.animate === "function") {
                bleedPath.animate([
                    { opacity: cfg.bleedOpacity * 0.55, transform: "scaleY(0.82)", offset: 0 },
                    { opacity: cfg.bleedOpacity * 0.65, transform: "scaleY(0.86)", offset: landingOffset },
                    { opacity: Math.min(0.75, cfg.bleedOpacity * 1.65), transform: "scaleY(1.22)", offset: peakBloomOffset },
                    { opacity: cfg.bleedOpacity, transform: "scaleY(1)", offset: 1 }
                ], {
                    duration: totalBloomWindow,
                    easing: "ease-out"
                });
            }

            if (svgEl && typeof svgEl.animate === "function") {
                svgEl.animate([
                    { opacity: cfg.strokeOpacity * 0.84, offset: 0 },
                    { opacity: cfg.strokeOpacity * 0.88, offset: landingOffset },
                    { opacity: Math.min(1, cfg.strokeOpacity * 1.08), offset: peakBloomOffset },
                    { opacity: cfg.strokeOpacity, offset: 1 }
                ], {
                    duration: totalBloomWindow,
                    easing: "ease-out"
                });
            }
        }
    }

    /**
     * Updates or hides the faint hover brush ghost trailing under non-active tabs.
     */
    function updateGhostIndicator(navLinks, hoveredLink) {
        if (!navLinks || typeof navLinks.querySelector !== "function") return;
        ensureIndicator(navLinks);
        const ghost = navLinks.querySelector(".nav-indicator-ghost");
        if (!ghost) return;

        const activeLink = getActiveNavTarget(navLinks);
        if (!hoveredLink || hoveredLink === activeLink) {
            ghost.classList.remove("is-visible", "is-pressed");
            return;
        }

        const linksRect = navLinks.getBoundingClientRect();
        const targetRect = hoveredLink.getBoundingClientRect();
        if (targetRect.width === 0) return;

        const x = targetRect.left - linksRect.left;
        const width = targetRect.width;
        const wasVisible = ghost.classList.contains("is-visible");
        const prevX = ghost._ghostX;
        const prevWidth = ghost._ghostWidth;

        ghost._ghostX = x;
        ghost._ghostWidth = width;

        ghost.style.transform = `translateX(${x}px)`;
        ghost.style.width = `${width}px`;
        ghost.classList.add("is-visible");

        const stage = ghost.querySelector ? ghost.querySelector(".nav-ink-stage") : null;
        if (stage && typeof stage.animate === "function" && !prefersReducedMotion()) {
            const cfg = getInkConfig();
            if (wasVisible && prevX !== undefined && prevWidth !== undefined && Math.abs(x - prevX) > 0.5) {
                const dx = x - prevX;
                const startScaleX = Math.max(0.25, prevWidth / width);
                stage.animate([
                    { transform: `translate3d(${-dx}px, 0, 0) scaleX(${startScaleX.toFixed(3)}) scaleY(0.9)` },
                    { transform: "translate3d(0, 0, 0) scaleX(1) scaleY(1)" }
                ], {
                    duration: Math.round(cfg.transitionDuration * 0.75),
                    easing: cfg.easing
                });
            } else if (!wasVisible) {
                stage.animate([
                    { transform: "scaleX(0.86) scaleY(0.85)", opacity: 0.2 },
                    { transform: "scaleX(1) scaleY(1)", opacity: 1 }
                ], {
                    duration: 180,
                    easing: cfg.easing
                });
            }
        }
    }

    /**
     * Applies or releases the subtle vertical ink compression (scaleY: 0.85) on press.
     */
    function setPressedState(navLinks, isPressed) {
        if (!navLinks || typeof navLinks.querySelector !== "function") return;
        const indicator = navLinks.querySelector(".nav-indicator");
        const ghost = navLinks.querySelector(".nav-indicator-ghost");
        [indicator, ghost].forEach(el => {
            if (!el || !el.classList) return;
            if (isPressed) {
                el.classList.add("is-pressed");
            } else {
                el.classList.remove("is-pressed");
            }
        });
    }

    let isTransitioning = false;

    /**
     * Executes client-side page transition between tabs.
     * Preserves the navbar DOM and continuous indicator completely intact.
     */
    async function performPageTransition(href, targetNavId, pushState = true) {
        if (isTransitioning) return;
        isTransitioning = true;

        const appWrapper = document.querySelector(".app-wrapper");
        const header = document.querySelector("header.navbar");
        const navLinks = header ? header.querySelector(".nav-links") : null;

        try {
            // 1. Content exit animation: fade out old content nodes (excluding navbar & footer)
            const contentNodes = appWrapper ? Array.from(appWrapper.children).filter(el =>
                !el.classList.contains("navbar") && !el.classList.contains("footer")
            ) : [];

            contentNodes.forEach(node => {
                node.style.transition = "opacity 0.15s ease";
                node.style.opacity = "0";
            });

            // 2. Fetch new page HTML in parallel using canonical absolute URL
            const targetUrl = new URL(href, window.location.href);
            targetUrl.hash = "";
            if (!targetUrl.pathname.endsWith("/") && !targetUrl.pathname.split("/").pop().includes(".")) {
                targetUrl.pathname += "/";
            }
            const response = await fetch(targetUrl.href);
            if (!response.ok) throw new Error(`HTTP ${response.status} loading ${targetUrl.href}`);
            const htmlText = await response.text();

            const parser = new DOMParser();
            const newDoc = parser.parseFromString(htmlText, "text/html");

            // 3. Extract and validate new content nodes BEFORE removing old content
            const newWrapper = newDoc.querySelector(".app-wrapper");
            const newContentNodes = newWrapper ? Array.from(newWrapper.children).filter(el =>
                !el.classList.contains("navbar") && !el.classList.contains("footer")
            ) : [];

            if (!newWrapper || newContentNodes.length === 0) {
                throw new Error("No content nodes found in target document");
            }

            // 4. Wait for exit animation to complete (~140ms)
            await new Promise(r => setTimeout(r, 140));

            // 5. Update browser history state with canonical URL
            if (pushState && window.history && window.history.pushState) {
                window.history.pushState({ href: targetUrl.href, targetNavId }, newDoc.title || "", targetUrl.href);
            }

            // 6. Update browser tab title
            if (newDoc.title) {
                document.title = newDoc.title;
            }

            // 7. Remove old content nodes
            contentNodes.forEach(node => node.remove());

            // 8. Normalize relative media paths against target base URL to prevent 404s
            newWrapper.querySelectorAll("img[src]").forEach(img => {
                const rawSrc = img.getAttribute("src");
                if (rawSrc && !rawSrc.startsWith("http://") && !rawSrc.startsWith("https://") && !rawSrc.startsWith("data:") && !rawSrc.startsWith("/")) {
                    try {
                        img.src = new URL(rawSrc, targetUrl.href).href;
                    } catch (e) { }
                }
            });

            // 9. Mount new content nodes directly visible to guarantee zero blank screens
            const footer = appWrapper ? appWrapper.querySelector(".footer") : null;
            newContentNodes.forEach(newNode => {
                const importedNode = document.importNode(newNode, true);
                importedNode.style.opacity = "1";
                importedNode.style.transform = "none";
                if (footer && appWrapper) {
                    appWrapper.insertBefore(importedNode, footer);
                } else if (appWrapper) {
                    appWrapper.appendChild(importedNode);
                }
            });

            // 8. Update Navbar in-place WITHOUT destroying or recreating the .nav-links DOM!
            if (header && navLinks) {
                const newHeader = newDoc.querySelector("header.navbar");
                const finalTargetId = targetNavId || (newHeader ? newHeader.getAttribute("data-current") : null);

                if (finalTargetId) {
                    header.setAttribute("data-current", finalTargetId);

                    // Update active class and ARIA state on tab links
                    let targetActiveLink = null;
                    navLinks.querySelectorAll(".nav-item a").forEach(a => {
                        if (a.getAttribute("data-nav-id") === finalTargetId) {
                            a.classList.add("nav-home");
                            a.classList.remove("active");
                            a.setAttribute("aria-selected", "true");
                            a.setAttribute("aria-current", "page");
                            targetActiveLink = a;
                        } else {
                            a.classList.remove("nav-home", "active");
                            a.setAttribute("aria-selected", "false");
                            a.removeAttribute("aria-current");
                        }
                    });

                    // Update all relative links based on new route
                    const navKey = header.getAttribute("data-nav") || "kitchen";
                    const navConfig = (typeof NAVIGATION_CONFIG !== "undefined" && NAVIGATION_CONFIG[navKey])
                        ? NAVIGATION_CONFIG[navKey]
                        : (typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.nav ? KITCHEN_CONFIG.nav : [
                            { id: "kitchen", label: "the kitchen", path: "kitchen/", focal: true, dividerAfter: true },
                            { id: "culture", label: "customs", path: "kitchen/culture/" },
                            { id: "ammi", label: "ammi", path: "kitchen/me/" }
                        ]);

                    const currentItem = navConfig.find(item => item.id === finalTargetId);
                    const fromPath = currentItem ? currentItem.path : "kitchen/";

                    navConfig.forEach(item => {
                        if (item.isText || item.path === undefined || item.path === null) return;
                        let newRelHref = computeRelativePath(fromPath, item.path);
                        if (item.isHome && typeof window !== "undefined" && window.location.protocol === "file:") {
                            newRelHref += "index.html";
                        }
                        const itemLink = navLinks.querySelector(`a[data-nav-id="${item.id}"]`);
                        if (itemLink) {
                            itemLink.setAttribute("href", newRelHref);
                        }
                        const mobileLink = header.querySelector(`a.mobile-nav-link[data-mobile-nav-id="${item.id}"]`);
                        if (mobileLink) {
                            mobileLink.setAttribute("href", newRelHref);
                        }
                    });

                    const toggleImg = header.querySelector(".mobile-toggle-icon");
                    if (toggleImg) {
                        const newLogoSrc = resolveAssetPath(fromPath, "assets/kitchen_collapsible_menu_logo_2.png");
                        toggleImg.setAttribute("src", newLogoSrc);
                    }
                    const toggleBtn = header.querySelector(".mobile-nav-toggle");
                    if (toggleBtn) {
                        const isSubpage = (finalTargetId !== "kitchen" && finalTargetId !== "culture");
                        if (isSubpage) {
                            toggleBtn.classList.add("is-subpage-active");
                        } else {
                            toggleBtn.classList.remove("is-subpage-active");
                        }
                    }

                    // Ensure continuous indicator smoothly tracks new active tab
                    if (targetActiveLink) {
                        updateGhostIndicator(navLinks, null);
                        updateIndicator(navLinks, targetActiveLink, true);
                    }
                }
            }

            // 9. Reset viewport scroll position
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;

            // 10. Execute active page content initializers
            initActivePageContent();

        } catch (err) {
            console.warn("Client-side transition fallback:", err);
            if (pushState) {
                window.location.href = href;
            } else {
                window.location.reload();
            }
        } finally {
            isTransitioning = false;
        }
    }

    /**
     * Dispatches click events on navbar tab links for smooth client-side transitions.
     */
    function onNavbarClick(e) {
        const link = e.target.closest(".nav-item a, .mobile-nav-link");
        if (!link) return;

        // Ignore modified clicks (Cmd, Ctrl, Shift, Alt) or secondary clicks
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const header = link.closest("header.navbar");
        const navLinks = header ? header.querySelector(".nav-links") : null;
        if (navLinks) {
            setPressedState(navLinks, false);
        }

        // Close mobile dropdown if navigating via mobile link
        if (header && header.classList.contains("is-menu-open")) {
            header.classList.remove("is-menu-open");
            const toggle = header.querySelector(".mobile-nav-toggle");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
            const dropdown = header.querySelector(".mobile-nav-dropdown");
            if (dropdown) dropdown.setAttribute("aria-hidden", "true");
        }

        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("//") || link.target === "_blank") {
            return;
        }

        // Only intercept intra-navbar tab navigation (tabs with data-nav-id or data-mobile-nav-id)
        if (link.getAttribute("data-is-home") === "true") {
            return; // Normal link click back to beginning
        }

        const targetNavId = link.getAttribute("data-nav-id") || link.getAttribute("data-mobile-nav-id");
        if (!targetNavId || targetNavId === "bilal") {
            return; // Normal link click
        }

        // If clicking the already active tab, smoothly scroll to top and clear any hash
        if (link.classList.contains("nav-home") || link.classList.contains("active") || link.classList.contains("is-active")) {
            e.preventDefault();
            if (window.scrollY > 0 || window.location.hash) {
                if (window.location.hash) {
                    history.pushState(null, "", window.location.pathname);
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
            return;
        }

        // Immediately clear hover ghost and glide active ink indicator to clicked link
        if (navLinks) {
            updateGhostIndicator(navLinks, null);
            updateIndicator(navLinks, link, true);
        }

        const appWrapper = document.querySelector(".app-wrapper");
        if (!appWrapper || typeof window.fetch !== "function" || !window.history.pushState) {
            return;
        }

        e.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        performPageTransition(href, targetNavId, true);
    }

    /**
     * Handles accessible keyboard navigation (ArrowLeft, ArrowRight, Home, End) within the tablist.
     */
    function onNavbarKeydown(e) {
        const link = e.target.closest(".nav-item a");
        if (!link) return;
        const header = link.closest("header.navbar");
        const navLinks = header ? header.querySelector(".nav-links") : null;
        if (!navLinks) return;

        const tabs = Array.from(navLinks.querySelectorAll(".nav-item a"));
        if (tabs.length <= 1) return;

        const currentIndex = tabs.indexOf(link);
        if (currentIndex === -1) return;

        let nextIndex = -1;
        if (e.key === "ArrowRight") {
            nextIndex = (currentIndex + 1) % tabs.length;
        } else if (e.key === "ArrowLeft") {
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
            nextIndex = 0;
        } else if (e.key === "End") {
            nextIndex = tabs.length - 1;
        }

        if (nextIndex !== -1) {
            e.preventDefault();
            const nextTab = tabs[nextIndex];
            if (typeof nextTab.focus === "function") {
                nextTab.focus();
            }
            updateGhostIndicator(navLinks, nextTab);
        }
    }

    /**
     * Attaches continuous hover, press, keyboard, resize, and click interactions to a navbar header.
     * Uses robust event delegation so interactions persist permanently across page updates.
     */
    function attachContinuousNav(header) {
        if (!header) return;

        const navLinks = header.querySelector(".nav-links");
        if (navLinks) {
            ensureIndicator(navLinks);
            requestAnimationFrame(() => {
                const active = getActiveNavTarget(navLinks);
                if (active) updateIndicator(navLinks, active, false);
            });
            if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                    const active = getActiveNavTarget(navLinks);
                    if (active) updateIndicator(navLinks, active, false);
                });
            }
        }

        // Only attach event listeners once per header element
        if (header.dataset.continuousAttached) return;
        header.dataset.continuousAttached = "true";

        // Resize listener to keep indicator aligned
        window.addEventListener("resize", () => {
            const nl = header.querySelector(".nav-links");
            if (!nl) return;
            const active = getActiveNavTarget(nl);
            if (active) updateIndicator(nl, active, false);
        });

        // Hover delegation: mouseover on a non-active nav link trails the faint brush ghost
        header.addEventListener("mouseover", (e) => {
            const link = e.target.closest(".nav-item a");
            const nl = header.querySelector(".nav-links");
            if (link && nl && nl.contains(link)) {
                updateGhostIndicator(nl, link);
            }
        });

        // Mouseout delegation: leaving the nav links container hides the brush ghost
        header.addEventListener("mouseout", (e) => {
            const nl = header.querySelector(".nav-links");
            if (!nl) return;
            if (!e.relatedTarget || !nl.contains(e.relatedTarget)) {
                updateGhostIndicator(nl, null);
                setPressedState(nl, false);
            }
        });

        // Press state: slight vertical ink compression (scaleY: 0.85) on pointerdown/mousedown
        header.addEventListener("mousedown", (e) => {
            const link = e.target.closest(".nav-item a");
            const nl = header.querySelector(".nav-links");
            if (link && nl && nl.contains(link)) {
                setPressedState(nl, true);
            }
        });

        header.addEventListener("mouseup", () => {
            const nl = header.querySelector(".nav-links");
            if (nl) setPressedState(nl, false);
        });

        // Keyboard navigation (ArrowLeft / ArrowRight / Home / End)
        header.addEventListener("keydown", onNavbarKeydown);

        // Click handler for seamless client-side page transitions
        header.addEventListener("click", onNavbarClick);
    }

    /**
     * Renders bipartite/tripartite space headers (<header class="split-title-header">)
     * using metadata defined in KITCHEN_CONFIG.spaces.
     */
    function renderSplitHeaders() {
        if (typeof document === "undefined") return;
        if (typeof KITCHEN_CONFIG === "undefined" || !KITCHEN_CONFIG.spaces) return;

        const splitHeaders = document.querySelectorAll("header.split-title-header");
        splitHeaders.forEach(header => {
            let spaceId = header.getAttribute("data-space");
            if (!spaceId) {
                const navbar = document.querySelector("header.navbar");
                if (navbar) {
                    spaceId = navbar.getAttribute("data-current");
                }
            }
            if (!spaceId || !KITCHEN_CONFIG.spaces[spaceId]) return;

            const space = KITCHEN_CONFIG.spaces[spaceId];
            const urduColor = header.getAttribute("data-urdu-color") || (space && (space.urduColor || space.color)) || "";
            const urduStyle = urduColor ? ` style="color: ${urduColor};"` : "";
            header.innerHTML = `
                <h2 class="about-title">${space.title}</h2>
                <div class="split-title-right">
                    <div class="split-title-urdu" dir="rtl" lang="ur"${urduStyle}>${space.urdu}</div>
                </div>
            `.trim();
        });
    }

    /**
     * Initializes the main Kitchen dashboard (recipes grid, title, bio, external links).
     * Automatically called by initActivePageContent() when on the kitchen home page.
     */
    function initKitchenDashboard() {
        if (typeof KITCHEN_CONFIG === "undefined") return;

        document.title = KITCHEN_CONFIG.name;
        const titleEl = document.getElementById("main-title");
        if (titleEl) titleEl.textContent = KITCHEN_CONFIG.name;
        const subtitleEl = document.getElementById("main-subtitle");
        if (subtitleEl) subtitleEl.textContent = KITCHEN_CONFIG.subtitle;
        const bioEl = document.getElementById("bio-text");
        if (bioEl) bioEl.textContent = KITCHEN_CONFIG.bio;

        const kitchenTab = document.getElementById("kitchen-tab");
        if (kitchenTab) {
            kitchenTab.textContent = KITCHEN_CONFIG.name;
        }

        const linksList = document.getElementById("links-list");
        if (linksList) {
            const links = KITCHEN_CONFIG.links || [];
            linksList.innerHTML = links.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="external-link">
                    ${link.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                </a>
            `).join("");
        }

        const menuGrid = document.getElementById("recipes-menu-grid");
        if (menuGrid) {
            const recipes = KITCHEN_CONFIG.recipes || [];
            const categories = {
                chicken: { title: "chicken", titleUrdu: "مرغ", items: [] },
                meat: { title: "meat", titleUrdu: "گوشت", items: [] },
                veg: { title: "veg", titleUrdu: "سبزی", items: [] },
                dessert: { title: "dessert", titleUrdu: "میٹھی", items: [] }
            };
            recipes.forEach(recipe => {
                const cat = recipe.category || "other";
                if (!categories[cat]) {
                    categories[cat] = {
                        title: cat,
                        titleUrdu: recipe.categoryUrdu || "",
                        items: []
                    };
                }
                categories[cat].items.push(recipe);
            });

            menuGrid.innerHTML = Object.values(categories).map(cat => `
                <div class="menu-column" data-category="${cat.title}">
                    <h3 class="menu-heading">
                        <button class="column-title" type="button" aria-expanded="false" aria-controls="menu-items-${cat.title}">
                            <span class="column-title-text">${cat.title}</span>
                            <span class="column-title-right">
                                ${cat.titleUrdu ? `<span class="urdu-title">${cat.titleUrdu}</span>` : ""}
                                <svg class="menu-collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </span>
                        </button>
                    </h3>
                    <div class="menu-items" id="menu-items-${cat.title}">
                        ${cat.items.length > 0 ? cat.items.map(item => `
                            <div class="menu-item">
                                <a href="${item.url || `recipes/template.html?file=${item.file}`}" class="recipe-link">
                                    <span class="recipe-name">${item.name}</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                        stroke-linecap="round" stroke-linejoin="round" class="link-arrow">
                                        <line x1="7" y1="17" x2="17" y2="7"></line>
                                        <polyline points="7 7 17 7 17 17"></polyline>
                                    </svg>
                                </a>
                                <p class="recipe-description">${item.description}</p>
                            </div>
                        `).join("") : `<p class="menu-empty-note">ammi’s recipes in preparation</p>`}
                    </div>
                </div>
            `).join("");

            // Setup collapsible toggle handlers for mobile
            const columns = menuGrid.querySelectorAll(".menu-column");
            columns.forEach(col => {
                const titleBtn = col.querySelector(".column-title");
                if (titleBtn) {
                    titleBtn.addEventListener("click", () => {
                        const isNowOpen = col.classList.toggle("is-open");
                        titleBtn.setAttribute("aria-expanded", isNowOpen ? "true" : "false");
                    });
                }
            });
        }

        // Floating hover indicator: hide when menu section is in view, show when in hero (mobile only)
        const menuSection = document.getElementById("menu");
        const scrollIndicator = document.querySelector(".hero-section .scroll-indicator");
        if (menuSection && scrollIndicator && typeof IntersectionObserver !== "undefined") {
            const updateIndicatorVisibility = (entry) => {
                if (window.innerWidth > 768) {
                    scrollIndicator.classList.remove("is-hidden");
                    return;
                }
                const scrollY = window.scrollY || window.pageYOffset || 0;
                if (scrollY < 60) {
                    scrollIndicator.classList.remove("is-hidden");
                    return;
                }
                const rect = menuSection.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.75) {
                    scrollIndicator.classList.add("is-hidden");
                } else {
                    scrollIndicator.classList.remove("is-hidden");
                }
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => updateIndicatorVisibility(entry));
            }, {
                threshold: [0, 0.1, 0.2, 0.5],
                rootMargin: "0px 0px -80px 0px"
            });
            observer.observe(menuSection);

            window.addEventListener("scroll", () => {
                if (window.innerWidth > 768) return;
                const scrollY = window.scrollY || window.pageYOffset || 0;
                if (scrollY < 60) {
                    scrollIndicator.classList.remove("is-hidden");
                }
            }, { passive: true });

            window.addEventListener("resize", () => {
                if (window.innerWidth > 768) {
                    scrollIndicator.classList.remove("is-hidden");
                }
            }, { passive: true });
        }
    }

    /**
     * Initializes the Customs page by loading markdown from this_space.md.
     */
    function initCulturePage() {
        if (typeof KITCHEN_CONFIG !== "undefined") {
            document.title = (KITCHEN_CONFIG.name || "the kitchen") + " — customs";
        }
        const thisSpaceEl = document.getElementById("this-space-content");
        if (thisSpaceEl) {
            if (thisSpaceEl.children.length > 0) return;
            const mdUrl = new URL("this_space.md", window.location.href).href;
            fetch(mdUrl)
                .then(res => {
                    if (!res.ok) throw new Error("Could not fetch this_space.md");
                    return res.text();
                })
                .then(markdown => {
                    let html = (typeof marked !== "undefined" && marked.parse)
                        ? marked.parse(markdown)
                        : markdown.trim().split(/\n\s*\n/).map(p => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`).join("");
                    if (!html.includes('href="#arrival-picture"')) {
                        html = html.replace(/\b(for them)\b/gi, '<a href="#arrival-picture" class="culture-link">$1</a>');
                    }
                    thisSpaceEl.innerHTML = html;
                    if (!window.location.hash) {
                        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                        if (document.documentElement) document.documentElement.scrollTop = 0;
                        if (document.body) document.body.scrollTop = 0;
                    }
                    thisSpaceEl.querySelectorAll('a[href="#arrival-picture"]').forEach(link => {
                        link.classList.add("culture-link");
                        link.addEventListener("click", (e) => {
                            e.preventDefault();
                            const target = document.getElementById("arrival-picture");
                            if (target) {
                                target.scrollIntoView({ behavior: "smooth" });
                                history.pushState(null, "", "#arrival-picture");
                            }
                        });
                    });
                })
                .catch(err => {
                    console.warn("Using inline fallback content for this space:", err);
                });
        }
    }

    /**
     * Initializes the Ammi / Mom page by loading markdown from us.md.
     */
    function initMePage() {
        if (typeof KITCHEN_CONFIG !== "undefined") {
            document.title = (KITCHEN_CONFIG.name || "the kitchen") + " — ammi";
        }
        const usSpaceEl = document.getElementById("us-content");
        if (usSpaceEl) {
            if (usSpaceEl.children.length > 0) return;
            const mdUrl = new URL("us.md", window.location.href).href;
            fetch(mdUrl)
                .then(res => {
                    if (!res.ok) throw new Error("Could not fetch us.md");
                    return res.text();
                })
                .then(markdown => {
                    if (typeof marked !== "undefined" && marked.parse) {
                        usSpaceEl.innerHTML = marked.parse(markdown);
                    } else {
                        usSpaceEl.innerHTML = markdown.trim().split(/\n\s*\n/).map(p => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`).join("");
                    }
                })
                .catch(err => {
                    console.warn("Using inline fallback content for this space:", err);
                });
        }
    }

    /**
     * Executes initializers for page-specific dynamic content.
     */
    function initActivePageContent() {
        renderSplitHeaders();
        if (document.getElementById("recipes-menu-grid") || document.getElementById("main-title")) {
            initKitchenDashboard();
        }
        if (document.getElementById("this-space-content")) {
            initCulturePage();
        }
        if (document.getElementById("us-content")) {
            initMePage();
        }
    }

    /**
     * Scans and initializes all matching navbars on the page.
     */
    function initNavbars() {
        if (typeof document === "undefined") return;
        if (typeof history !== "undefined" && "scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
        if (typeof window !== "undefined" && !window.location.hash) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
        }
        initActivePageContent();
        const headers = document.querySelectorAll("header.navbar");
        headers.forEach(header => {
            const hasExplicitAttr = header.hasAttribute("data-current") ||
                header.hasAttribute("data-nav") ||
                header.hasAttribute("data-back");

            if (hasExplicitAttr) {
                renderNavbar(header);
                attachContinuousNav(header);
            } else if (header.querySelector(".nav-links")) {
                attachContinuousNav(header);
            }
        });
    }

    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initNavbars);
        } else {
            initNavbars();
        }

        // Ensure clean scroll-to-top on back/forward cache restores (iOS Safari / Chrome)
        window.addEventListener("pageshow", () => {
            if (!window.location.hash) {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                if (document.documentElement) document.documentElement.scrollTop = 0;
                if (document.body) document.body.scrollTop = 0;
            }
        });

        // Sticky scrolled shadow/border toggle
        window.addEventListener("scroll", () => {
            const navbar = document.querySelector("header.navbar");
            if (navbar) {
                if (window.scrollY > 20) {
                    navbar.classList.add("is-scrolled");
                } else {
                    navbar.classList.remove("is-scrolled");
                }
            }
        }, { passive: true });

        // Support seamless browser Back/Forward navigation for tabbed headers
        window.addEventListener("popstate", () => {
            const header = document.querySelector("header.navbar");
            if (header && (header.hasAttribute("data-nav") || header.hasAttribute("data-current"))) {
                const navKey = header.getAttribute("data-nav") || "kitchen";
                const navConfig = (typeof NAVIGATION_CONFIG !== "undefined" && NAVIGATION_CONFIG[navKey])
                    ? NAVIGATION_CONFIG[navKey]
                    : (typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.nav ? KITCHEN_CONFIG.nav : [
                        { id: "kitchen", label: "the kitchen", path: "kitchen/", focal: true, dividerAfter: true },
                        { id: "culture", label: "customs", path: "kitchen/culture/" },
                        { id: "ammi", label: "ammi", path: "kitchen/me/" }
                    ]);
                const detectedId = detectCurrentId(navConfig);
                const currentRoute = header.getAttribute("data-current");

                // If on the same page and only hash changed (e.g. back button after clicking "for them")
                if (detectedId === currentRoute) {
                    if (!window.location.hash) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    } else if (window.location.hash === "#arrival-picture") {
                        const target = document.getElementById("arrival-picture");
                        if (target) target.scrollIntoView({ behavior: "smooth" });
                    }
                    return;
                }

                performPageTransition(window.location.href, detectedId, false);
            }
        });
    }

    /**
     * Renders stationary recipe navbar: "← the kitchen | <recipe_name>"
     * with <recipe_name> active and underlined by the Urdu qalam indicator.
     */
    function renderRecipeNavbar(header, recipeTitle, backUrl) {
        if (!header) header = document.querySelector("header.navbar[data-back]") || document.querySelector("header.navbar");
        if (!header) return;

        const effectiveBackUrl = backUrl || header.getAttribute("data-back") || "../../";
        const backLabel = header.getAttribute("data-back-label") || "← the kitchen";
        const title = (recipeTitle || header.getAttribute("data-recipe-title") || "the recipe").toLowerCase();

        header.setAttribute("data-recipe-title", title);
        header.setAttribute("data-recipe-nav-mode", "breadcrumb");

        ensureInkFilterDefs();

        header.innerHTML = `
        <nav class="nav-container" aria-label="Breadcrumb">
            <ul class="nav-links has-indicator" role="tablist">
                <li class="nav-item" role="presentation"><a href="${effectiveBackUrl}" id="kitchen-tab" role="tab">${backLabel}</a></li>
                <li class="nav-divider" aria-hidden="true">|</li>
                <li class="nav-item" role="presentation"><a href="#me" class="recipe-top-link active" id="recipe-top-tab" role="tab" aria-selected="true" aria-current="page">${title}</a></li>
                <span class="nav-indicator" aria-hidden="true"></span>
            </ul>
        </nav>`.trim();

        const topLink = header.querySelector("#recipe-top-tab");
        if (topLink) {
            topLink.addEventListener("click", (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        const navLinks = header.querySelector(".nav-links");
        if (navLinks) {
            ensureIndicator(navLinks);
            attachContinuousNav(header);
            const positionActive = () => {
                const activeLink = navLinks.querySelector("#recipe-top-tab") || navLinks.querySelector(".active");
                if (activeLink) {
                    updateIndicator(navLinks, activeLink, false);
                }
            };
            positionActive();
            requestAnimationFrame(positionActive);
            setTimeout(positionActive, 40);
            setTimeout(positionActive, 120);
        }
    }

    function setRecipeNavbarMode(header, isModeActive, recipeTitle, backUrl) {
        renderRecipeNavbar(header, recipeTitle, backUrl);
    }

    /**
     * Renders stationary recipe navbar: "← the kitchen | <recipe_name>"
     * with <recipe_name> active and underlined by the Urdu qalam indicator.
     */
    function renderRecipeNavbar(header, recipeTitle, backUrl) {
        if (!header) header = document.querySelector("header.navbar[data-back]") || document.querySelector("header.navbar");
        if (!header) return;

        const effectiveBackUrl = backUrl || header.getAttribute("data-back") || "../../";
        const backLabel = header.getAttribute("data-back-label") || "← the kitchen";
        const title = (recipeTitle || header.getAttribute("data-recipe-title") || "the recipe").toLowerCase();

        header.setAttribute("data-recipe-title", title);
        header.setAttribute("data-recipe-nav-mode", "breadcrumb");

        ensureInkFilterDefs();

        header.innerHTML = `
        <nav class="nav-container" aria-label="Breadcrumb">
            <ul class="nav-links has-indicator" role="tablist">
                <li class="nav-item" role="presentation"><a href="${effectiveBackUrl}" id="kitchen-tab" role="tab">${backLabel}</a></li>
                <li class="nav-divider" aria-hidden="true">|</li>
                <li class="nav-item" role="presentation"><a href="#me" class="recipe-top-link active" id="recipe-top-tab" role="tab" aria-selected="true" aria-current="page">${title}</a></li>
                <span class="nav-indicator" aria-hidden="true"></span>
            </ul>
        </nav>`.trim();

        const topLink = header.querySelector("#recipe-top-tab");
        if (topLink) {
            topLink.addEventListener("click", (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        const navLinks = header.querySelector(".nav-links");
        if (navLinks) {
            ensureIndicator(navLinks);
            attachContinuousNav(header);
            const positionActive = () => {
                const activeLink = navLinks.querySelector("#recipe-top-tab") || navLinks.querySelector(".active");
                if (activeLink) {
                    updateIndicator(navLinks, activeLink, false);
                }
            };
            positionActive();
            requestAnimationFrame(positionActive);
            setTimeout(positionActive, 40);
            setTimeout(positionActive, 120);
        }
    }

    function setRecipeNavbarMode(header, isModeActive, recipeTitle, backUrl) {
        renderRecipeNavbar(header, recipeTitle, backUrl);
    }

    // Expose globally for dynamic or manual access
    if (typeof window !== "undefined") {
        window.initKitchenDashboard = initKitchenDashboard;
        window.initCulturePage = initCulturePage;
        window.initMePage = initMePage;
        window.initActivePageContent = initActivePageContent;
        window.renderSiteNavbar = renderNavbar;
        window.initSiteNavbars = initNavbars;
        window.renderRecipeNavbar = renderRecipeNavbar;
        window.setRecipeNavbarMode = setRecipeNavbarMode;
        window.ensureInkFilterDefs = ensureInkFilterDefs;
        window.updateNavIndicator = updateIndicator;
        window.updateNavGhostIndicator = updateGhostIndicator;
        window.setNavPressedState = setPressedState;
        window.configureInkNavbar = configureInkNavbar;
        window.INK_NAV_DEFAULTS = INK_NAV_DEFAULTS;
        window.INK_BRUSH_PATHS = INK_BRUSH_PATHS;
        window.renderSplitHeaders = renderSplitHeaders;
    }
})();
