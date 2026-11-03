/**
 * nav.js - Shared Navigation Component for Bilal Abbasi's Website
 * Automatically renders navigation headers from config.js without repeating markup.
 */

(function () {
    /**
     * Computes the relative path between two root-relative paths.
     * E.g. computeRelativePath("kitchen/me/", "kitchen/culture/") -> "../culture/"
     */
    function computeRelativePath(fromPath, toPath) {
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
     * Fallback to automatically infer the active tab if data-current is not specified.
     */
    function detectCurrentId(items) {
        const pathname = (typeof window !== "undefined" && window.location)
            ? window.location.pathname.replace(/\\/g, "/")
            : "";
        for (const item of items) {
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
     * Renders navigation markup into a <header class="navbar"> element.
     */
    function renderNavbar(header) {
        // If data-back is specified, render a back-link navbar (e.g. recipe templates)
        const backUrl = header.getAttribute("data-back");
        if (backUrl) {
            const backLabel = header.getAttribute("data-back-label") || "← the kitchen";
            header.innerHTML = `
            <ul class="nav-links">
                <li class="nav-item"><a href="${backUrl}" class="active" id="kitchen-tab">${backLabel}</a></li>
            </ul>`.trim();
            return;
        }

        // Determine navigation configuration
        const navKey = header.getAttribute("data-nav") || "kitchen";
        const navConfig = (typeof NAVIGATION_CONFIG !== "undefined" && NAVIGATION_CONFIG[navKey])
            ? NAVIGATION_CONFIG[navKey]
            : (typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.nav ? KITCHEN_CONFIG.nav : [
                { id: "kitchen", label: "the kitchen", path: "kitchen/", focal: true, dividerAfter: true },
                { id: "culture", label: "July 17, 1987", path: "kitchen/culture/" },
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
            const href = computeRelativePath(fromPath, item.path);
            const classes = [];
            if (isActive) classes.push("nav-home");
            if (item.focal) classes.push("nav-focal");

            const classAttr = classes.length ? ` class="${classes.join(" ")}"` : "";
            const idAttr = item.id === "kitchen" ? ` id="kitchen-tab"` : "";

            // Dynamic label if "the kitchen"
            let label = item.label;
            if (item.id === "kitchen" && typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.name) {
                label = KITCHEN_CONFIG.name;
            }

            itemsHtml.push(`<li class="nav-item"><a href="${href}"${classAttr}${idAttr}>${label}</a></li>`);
            if (item.dividerAfter) {
                itemsHtml.push(`<li class="nav-divider" aria-hidden="true">|</li>`);
            }
        });

        header.innerHTML = `
            <ul class="nav-links">
                ${itemsHtml.join("\n                ")}
            </ul>`.trim();
    }

    /**
     * Scans and initializes all matching navbars on the page.
     */
    function initNavbars() {
        if (typeof document === "undefined") return;
        const headers = document.querySelectorAll("header.navbar");
        headers.forEach(header => {
            const hasExplicitAttr = header.hasAttribute("data-current") ||
                                    header.hasAttribute("data-nav") ||
                                    header.hasAttribute("data-back");
            const isEmpty = header.children.length === 0 || !header.querySelector(".nav-links");

            if (hasExplicitAttr || isEmpty) {
                renderNavbar(header);
            }
        });
    }

    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initNavbars);
        } else {
            initNavbars();
        }
    }

    // Expose globally for manual or dynamic invocation if needed
    if (typeof window !== "undefined") {
        window.renderSiteNavbar = renderNavbar;
        window.initSiteNavbars = initNavbars;
    }
})();

