/**
 * Applies KITCHEN_CONFIG.theme to CSS custom properties on kitchen and recipe pages.
 * Runs synchronously in <head> before first paint to prevent a flash of unstyled colors,
 * while keeping /office/ and the root gateway strictly untouched.
 */
(function () {
    if (typeof KITCHEN_CONFIG === "undefined" || !KITCHEN_CONFIG.theme) return;

    function isKitchenPage() {
        if (typeof window === "undefined" || !window.location) return true;
        const path = window.location.pathname || "";

        if (path.includes("/office/") || path.endsWith("/office") || path.endsWith("/office/index.html")) {
            return false;
        }

        if (typeof document !== "undefined" && document.querySelector) {
            if (document.querySelector('link[href*="kitchen.css"], link[href*="recipe.css"], link[href*="recipe-"]')) {
                return true;
            }
        }

        // Match kitchen/ or recipes/ as a whole path segment so an ancestor folder
        // containing "kitchen" in its name never leaks kitchen colors onto /office/.
        return /\/(kitchen|recipes)(\/|$)/.test(path);
    }

    function applyTheme() {
        if (!isKitchenPage()) return;
        if (typeof document === "undefined" || !document.documentElement) return;

        const root = document.documentElement;
        const theme = KITCHEN_CONFIG.theme;
        if (theme.anchor) {
            root.style.setProperty("--text-subtitle", theme.anchor);
            root.style.setProperty("--link-color", theme.anchor);
        }
        if (theme.distinct) {
            root.style.setProperty("--link-hover", theme.distinct);
        }
        if (theme.pop) {
            root.style.setProperty("--color-pop", theme.pop);
        }
        if (theme.urdu) {
            root.style.setProperty("--color-urdu", theme.urdu);
        }
        if (theme.urduFont) {
            const family = typeof theme.urduFont === "string" ? theme.urduFont : theme.urduFont.family;
            const query = typeof theme.urduFont === "string"
                ? theme.urduFont.trim().replace(/\s+/g, "+")
                : (theme.urduFont.googleFonts || (family ? family.trim().replace(/\s+/g, "+") : ""));

            if (family) {
                root.style.setProperty(
                    "--font-urdu",
                    `'${family}', 'Urdu Typesetting', 'Jameel Noori Nastaleeq', 'Geeza Pro', Tahoma, serif`
                );
            }
            if (query && document.head && document.createElement) {
                const href = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
                let link = document.getElementById ? document.getElementById("kitchen-urdu-font") : null;
                if (!link) {
                    link = document.createElement("link");
                    link.id = "kitchen-urdu-font";
                    link.rel = "stylesheet";
                    link.href = href;
                    document.head.appendChild(link);
                } else if (link.href !== href) {
                    link.href = href;
                }
            }
        }
    }

    KITCHEN_CONFIG.applyTheme = applyTheme;

    if (typeof document !== "undefined" && document.documentElement) {
        applyTheme();
    }
    if (typeof document !== "undefined" && document.addEventListener) {
        document.addEventListener("DOMContentLoaded", applyTheme);
    }
})();
