/**
 * nav.js - Shared Navigation Component for Bilal Abbasi's Website
 * Automatically renders navigation headers, manages continuous sliding underline indicators,
 * and provides fluid, instant page transitions without visual choppiness or lost animations.
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
                <span class="nav-indicator" aria-hidden="true"></span>
            </ul>`.trim();
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

            itemsHtml.push(`<li class="nav-item"><a href="${href}"${classAttr}${idAttr} data-nav-id="${item.id}">${label}</a></li>`);
            if (item.dividerAfter) {
                itemsHtml.push(`<li class="nav-divider" aria-hidden="true">|</li>`);
            }
        });

        // Add persistent indicator element
        itemsHtml.push(`<span class="nav-indicator" aria-hidden="true"></span>`);

        header.innerHTML = `
            <ul class="nav-links">
                ${itemsHtml.join("\n                ")}
            </ul>`.trim();
    }

    /**
     * Ensures an indicator element exists in the navigation links container.
     */
    function ensureIndicator(navLinks) {
        if (!navLinks) return null;
        let indicator = navLinks.querySelector(".nav-indicator");
        if (!indicator) {
            indicator = document.createElement("span");
            indicator.className = "nav-indicator";
            indicator.setAttribute("aria-hidden", "true");
            navLinks.appendChild(indicator);
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
     * Updates the continuous underline indicator position to align with target link.
     */
    function updateIndicator(navLinks, targetLink, animate = true) {
        if (!navLinks || !targetLink) return;
        const indicator = ensureIndicator(navLinks);
        if (!indicator) return;

        const linksRect = navLinks.getBoundingClientRect();
        const targetRect = targetLink.getBoundingClientRect();

        if (targetRect.width === 0) return;

        const x = targetRect.left - linksRect.left;
        const width = targetRect.width;

        if (!animate) {
            indicator.style.transition = "none";
        } else {
            indicator.style.transition = "transform 0.28s cubic-bezier(0.25, 0.8, 0.25, 1), width 0.28s cubic-bezier(0.25, 0.8, 0.25, 1)";
        }

        indicator.style.transform = `translateX(${x}px)`;
        indicator.style.width = `${width}px`;
        navLinks.classList.add("has-indicator");
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
                node.style.transition = "opacity 0.15s ease, transform 0.15s ease";
                node.style.opacity = "0";
                node.style.transform = "translateY(3px)";
            });

            // 2. Fetch new page HTML in parallel
            const response = await fetch(href);
            if (!response.ok) throw new Error(`HTTP ${response.status} loading ${href}`);
            const htmlText = await response.text();

            const parser = new DOMParser();
            const newDoc = parser.parseFromString(htmlText, "text/html");

            // 3. Wait for exit animation to complete (~140ms)
            await new Promise(r => setTimeout(r, 140));

            // 4. Update browser tab title
            if (newDoc.title) {
                document.title = newDoc.title;
            }

            // 5. Remove old content nodes
            contentNodes.forEach(node => node.remove());

            // 6. Extract new content nodes and mount them with entrance animation
            const newWrapper = newDoc.querySelector(".app-wrapper");
            const newContentNodes = newWrapper ? Array.from(newWrapper.children).filter(el =>
                !el.classList.contains("navbar") && !el.classList.contains("footer")
            ) : [];

            const footer = appWrapper ? appWrapper.querySelector(".footer") : null;
            newContentNodes.forEach(newNode => {
                const importedNode = document.importNode(newNode, true);
                importedNode.style.opacity = "0";
                importedNode.style.transform = "translateY(3px)";
                importedNode.style.transition = "opacity 0.22s ease, transform 0.22s ease";
                if (footer && appWrapper) {
                    appWrapper.insertBefore(importedNode, footer);
                } else if (appWrapper) {
                    appWrapper.appendChild(importedNode);
                }

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        importedNode.style.opacity = "1";
                        importedNode.style.transform = "translateY(0)";
                    });
                });
            });

            // 7. Update browser history state
            if (pushState) {
                window.history.pushState({ href, targetNavId }, newDoc.title, href);
            }

            // 8. Update Navbar in-place WITHOUT destroying or recreating the .nav-links DOM!
            if (header && navLinks) {
                const newHeader = newDoc.querySelector("header.navbar");
                const finalTargetId = targetNavId || (newHeader ? newHeader.getAttribute("data-current") : null);

                if (finalTargetId) {
                    header.setAttribute("data-current", finalTargetId);

                    // Update active class on tab links
                    let targetActiveLink = null;
                    navLinks.querySelectorAll(".nav-item a").forEach(a => {
                        if (a.getAttribute("data-nav-id") === finalTargetId) {
                            a.classList.add("nav-home");
                            a.classList.remove("active");
                            targetActiveLink = a;
                        } else {
                            a.classList.remove("nav-home", "active");
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
                        const itemLink = navLinks.querySelector(`[data-nav-id="${item.id}"]`);
                        if (itemLink) {
                            const newRelHref = computeRelativePath(fromPath, item.path);
                            itemLink.setAttribute("href", newRelHref);
                        }
                    });

                    // Ensure continuous indicator smoothly tracks new active tab
                    if (targetActiveLink) {
                        updateIndicator(navLinks, targetActiveLink, true);
                    }
                }
            }

            // 9. Reset viewport scroll position
            window.scrollTo({ top: 0, behavior: "instant" });

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
        const link = e.target.closest(".nav-item a");
        if (!link) return;

        // Ignore modified clicks (Cmd, Ctrl, Shift, Alt) or secondary clicks
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("//") || link.target === "_blank") {
            return;
        }

        // Only intercept intra-navbar tab navigation (tabs with data-nav-id)
        const targetNavId = link.getAttribute("data-nav-id");
        if (!targetNavId) {
            return; // Normal link click
        }

        // If clicking the already active tab, avoid unnecessary refetches
        if (link.classList.contains("nav-home") || link.classList.contains("active")) {
            e.preventDefault();
            return;
        }

        const header = link.closest("header.navbar");
        const navLinks = header ? header.querySelector(".nav-links") : null;

        // Immediately glide indicator to clicked link
        if (navLinks) {
            updateIndicator(navLinks, link, true);
        }

        const appWrapper = document.querySelector(".app-wrapper");
        if (!appWrapper || typeof window.fetch !== "function" || !window.history.pushState) {
            return;
        }

        e.preventDefault();
        performPageTransition(href, targetNavId, true);
    }

    /**
     * Attaches continuous hover, resize, and click interactions to a navbar header.
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

        // Hover delegation: mouseover on any nav link smoothly moves the indicator
        header.addEventListener("mouseover", (e) => {
            const link = e.target.closest(".nav-item a");
            const nl = header.querySelector(".nav-links");
            if (link && nl && nl.contains(link)) {
                updateIndicator(nl, link, true);
            }
        });

        // Mouseout delegation: leaving the nav links container returns indicator to active tab
        header.addEventListener("mouseout", (e) => {
            const nl = header.querySelector(".nav-links");
            if (!nl) return;
            if (!e.relatedTarget || !nl.contains(e.relatedTarget)) {
                const active = getActiveNavTarget(nl);
                if (active) updateIndicator(nl, active, true);
            }
        });

        // Click handler for seamless client-side page transitions
        header.addEventListener("click", onNavbarClick);
    }

    /**
     * Renders bipartite/tripartite space headers (<header class="split-title-header">)
     * using metadata defined in KITCHEN_CONFIG.spaces.
     * Prevents having to manually copy-paste Urdu, roman transliteration, and English title markup.
     */
    function renderSplitHeaders() {
        if (typeof document === "undefined") return;
        const splitHeaders = document.querySelectorAll("header.split-title-header");
        splitHeaders.forEach(header => {
            let spaceId = header.getAttribute("data-space");
            if (!spaceId) {
                const navbar = document.querySelector("header.navbar");
                if (navbar) {
                    spaceId = navbar.getAttribute("data-current");
                }
            }
            if (!spaceId) return;

            const spacesConfig = (typeof KITCHEN_CONFIG !== "undefined" && KITCHEN_CONFIG.spaces)
                ? KITCHEN_CONFIG.spaces
                : null;
            const space = spacesConfig ? spacesConfig[spaceId] : null;
            if (!space) return;

            header.innerHTML = `
                <h2 class="about-title">${space.title}</h2>
                <div class="split-title-right">
                    <div class="split-title-urdu" dir="rtl" lang="ur">${space.urdu}</div>
                    <span class="split-title-roman">${space.roman}</span>
                </div>
            `.trim();
        });
    }

    /**
     * Executes initializers for page-specific dynamic content.
     */
    function initActivePageContent() {
        renderSplitHeaders();
        if (document.getElementById("recipes-menu-grid") || document.getElementById("main-title")) {
            if (typeof window.initKitchenDashboard === "function") {
                window.initKitchenDashboard();
            }
        }
        if (document.getElementById("this-space-content")) {
            if (typeof window.initCulturePage === "function") {
                window.initCulturePage();
            }
        }
        if (document.getElementById("us-content")) {
            if (typeof window.initMePage === "function") {
                window.initMePage();
            }
        }
    }

    /**
     * Scans and initializes all matching navbars on the page.
     */
    function initNavbars() {
        if (typeof document === "undefined") return;
        renderSplitHeaders();
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

    // Shared page initializers guarantee any page works regardless of entry point
    if (typeof window !== "undefined") {
        if (typeof window.initKitchenDashboard !== "function") {
            window.initKitchenDashboard = function () {
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
                        <div class="menu-column">
                            <h3 class="column-title">${cat.title} ${cat.titleUrdu ? `<span class="urdu-title">${cat.titleUrdu}</span>` : ""}</h3>
                            <div class="menu-items">
                                ${cat.items.map(item => `
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
                                `).join("")}
                            </div>
                        </div>
                    `).join("");
                }
            };
        }

        if (typeof window.initCulturePage !== "function") {
            window.initCulturePage = function () {
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
            };
        }

        if (typeof window.initMePage !== "function") {
            window.initMePage = function () {
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
            };
        }
    }

    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initNavbars);
        } else {
            initNavbars();
        }

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
                performPageTransition(window.location.href, detectedId, false);
            }
        });
    }

    // Expose globally for dynamic or manual access
    if (typeof window !== "undefined") {
        window.renderSiteNavbar = renderNavbar;
        window.initSiteNavbars = initNavbars;
        window.updateNavIndicator = updateIndicator;
        window.renderSplitHeaders = renderSplitHeaders;
    }
})();
