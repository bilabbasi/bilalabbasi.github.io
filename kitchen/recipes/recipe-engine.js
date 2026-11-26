/**
 * Recipe Engine for Bilal Abbasi's Personal Website
 * Renders recipe data (YAML inside JS) into responsive Side-by-Side and Step-by-Step layouts.
 */

(function () {
    let currentRecipeTitle = "";

    // Helper function to dynamically load nav.js if not already present
    function ensureNavComponent() {
        const navbarEl = document.querySelector("header.navbar");
        if (typeof window.renderRecipeNavbar !== "undefined") {
            if (typeof window.ensureInkFilterDefs === "function") {
                window.ensureInkFilterDefs();
            }
            if (navbarEl && currentRecipeTitle) {
                window.renderRecipeNavbar(navbarEl, currentRecipeTitle, "../../");
            }
            return;
        }
        if (document.querySelector('script[data-nav-loader]')) {
            return;
        }
        const s = document.createElement("script");
        s.setAttribute("data-nav-loader", "true");
        s.src = "../../../nav.js";
        s.defer = true;
        s.onload = () => {
            if (typeof window.ensureInkFilterDefs === "function") {
                window.ensureInkFilterDefs();
            }
            const nb = document.querySelector("header.navbar");
            if (nb && currentRecipeTitle && typeof window.renderRecipeNavbar === "function") {
                window.renderRecipeNavbar(nb, currentRecipeTitle, "../../");
            }
        };
        document.head.appendChild(s);
    }
    // 1. Build the base HTML markup if not already present
    function ensureBaseMarkup() {
        const root = document.getElementById("recipe-root") || document.body;
        if (root.querySelector(".app-wrapper")) {
            return; // Already present
        }

        let initialMode = window.location.hash === '#step-by-step' ? 'step-by-step' : 'side-by-side';
        const isStepMode = initialMode === 'step-by-step';

        const markup = `
        <div class="app-wrapper">
            <header class="navbar" data-back="../../" data-back-label="← the kitchen">
                <nav class="nav-container" aria-label="Main Navigation">
                    <ul class="nav-links">
                        <li class="nav-item"><a href="../../" class="active" id="kitchen-tab">← the kitchen</a></li>
                    </ul>
                </nav>
            </header>

            <!-- Hero Section (First Page) -->
            <section class="hero-section">
                <!-- Main Content Area: Split into two columns -->
                <main class="main-content" id="me">
                    <!-- Left Column: Biography headings and list of links -->
                    <div class="info-column">
                        <div class="heading-group">
                            <h1 class="main-title" id="main-title">loading...</h1>
                            <h2 class="main-subtitle" id="main-subtitle"></h2>
                        </div>

                        <p class="bio-paragraph" id="bio-text">loading...</p>

                        <div class="external-links" id="links-list"></div>
                    </div>

                    <!-- Right Column: Visual Sketch -->
                    <div class="visual-column">
                        <div class="sketch-container">
                            <img src="../../../assets/kitchen_sketch.png" alt="Recipe illustration" class="sketch-img">
                        </div>
                    </div>
                </main>

                <!-- Scroll indicators pointing to the recipe layouts below -->
                <div class="recipe-indicators" role="group" aria-label="Recipe layout view">
                    <button type="button" class="scroll-indicator ${!isStepMode ? 'active' : ''}" id="indicator-side-by-side" aria-pressed="${!isStepMode}" onclick="selectRecipeMode('side-by-side')">
                        <span class="scroll-text">side by side</span>
                        <svg class="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <button type="button" class="scroll-indicator ${isStepMode ? 'active' : ''}" id="indicator-step-by-step" aria-pressed="${isStepMode}" onclick="selectRecipeMode('step-by-step')">
                        <span class="scroll-text">step by step</span>
                        <svg class="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </section>

            <!-- Menu Section (Second Page / Side-by-Side View) -->
            <section class="menu-section" id="menu" style="${isStepMode ? 'display: none;' : ''}">
                <h2 class="menu-title">the recipe</h2>

                <div class="mobile-menu-tabs" id="mobile-menu-tabs" role="tablist" aria-label="Recipe sections">
                    <button type="button" class="mobile-menu-tab is-active" id="mobile-tab-ingredients" role="tab" aria-selected="true" aria-controls="menu-col-ingredients" data-pane="0">
                        <span class="mobile-menu-tab-label">ingredients</span>
                    </button>
                    <button type="button" class="mobile-menu-tab" id="mobile-tab-steps" role="tab" aria-selected="false" aria-controls="menu-col-steps" data-pane="1">
                        <span class="mobile-menu-tab-label">steps</span>
                    </button>
                    <span class="mobile-menu-tab-indicator" id="mobile-menu-tab-indicator" aria-hidden="true"></span>
                </div>

                <div class="menu-grid" id="menu-grid">
                    <!-- INGREDIENTS COLUMN -->
                    <div class="menu-column" id="menu-col-ingredients" role="tabpanel" aria-labelledby="mobile-tab-ingredients">
                        <h3 class="column-title">ingredients</h3>
                        <div class="menu-items" id="ingredients-list-container"></div>
                    </div>

                    <!-- STEPS COLUMN -->
                    <div class="menu-column steps-column" id="menu-col-steps" role="tabpanel" aria-labelledby="mobile-tab-steps">
                        <h3 class="column-title">steps</h3>
                        <div class="steps-scroll-wrapper">
                            <div class="menu-items steps-scroll-container" id="steps-scroll-container"></div>
                            <button type="button" class="scroll-down-btn" id="scroll-steps-btn" aria-label="Scroll steps down">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <polyline points="19 12 12 19 5 12"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <footer class="footer">
                    <p>&copy; 2026 Bilal Abbasi. All rights reserved.</p>
                </footer>
            </section>

            <!-- Step-by-Step Section (Alternative View / Page-per-Step Scroll View) -->
            <section class="step-by-step-section" id="step-by-step" style="${isStepMode ? 'display: block;' : 'display: none;'}">
                <!-- Centered Ingredients Page -->
                <div class="step-page ingredients-centered-page" id="step-page-ingredients" data-step="0">
                    <div class="centered-ingredients-content">
                        <h2 class="ingredients-centered-title">mise en place</h2>
                        <div class="ingredients-centered-list" id="ingredients-centered-list"></div>
                    </div>
                </div>

                <!-- Split steps layout (Sticky image on left, scrolling steps on right) -->
                <div class="split-steps-container">
                    <!-- Sticky Visual Column -->
                    <div class="visual-sticky-column">
                        <div class="sticky-sketch-container">
                            <div class="sketch-layers" id="sketch-layers"></div>
                        </div>
                        <div class="mobile-qalam-progress-track" id="mobile-qalam-progress-track" aria-label="Step progress" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                            <svg class="qalam-track-svg" viewBox="0 0 240 16" preserveAspectRatio="none" focusable="false" aria-hidden="true">
                                <defs>
                                    <clipPath id="mobile-qalam-clip">
                                        <rect id="mobile-qalam-clip-rect" x="-5" y="-10" width="0" height="40" />
                                    </clipPath>
                                </defs>
                                <!-- Incomplete Grey Calligraphic Wash Track -->
                                <g class="qalam-stroke-grey">
                                    <path class="nav-ink-bleed-path" d="M 0.8,9.3 C 5,4.9 22,3.8 60,4.4 C 108,5.0 156,5.8 200,5.4 C 219,5.3 233,6.2 239.6,7.5 C 232,9.3 214,10.1 190,10.0 C 144,9.8 96,11.2 48,11.5 C 18,11.7 5,10.9 0.8,9.3 Z" />
                                    <path class="nav-ink-wash-path" d="M 1.2,9.2 C 6,5.4 22,4.4 60,4.9 C 108,5.4 156,6.1 200,5.8 C 218,5.7 232,6.5 239.2,7.5 C 231,8.9 214,9.6 192,9.5 C 146,9.3 98,10.6 50,10.9 C 20,11.1 6,10.5 1.2,9.2 Z" />
                                    <path class="nav-ink-core-path" d="M 1.8,9.1 C 7,5.8 24,4.8 62,5.2 C 108,5.7 154,6.4 196,6.1 C 214,6.0 228,6.7 236.5,7.6 C 226,8.7 208,9.2 188,9.1 C 144,8.9 98,10.2 52,10.5 C 22,10.7 8,10.2 1.8,9.1 Z" />
                                    <path class="nav-ink-bristles-path" d="M 182,5.9 C 204,5.7 224,6.2 239.4,7.1 M 176,9.3 C 200,9.5 220,9.0 237.8,8.2 M 14,10.4 C 42,10.9 78,10.6 114,9.9" />
                                    <path class="nav-ink-dry-path" d="M 164,7.4 C 190,7.2 214,7.4 234,7.6" />
                                </g>
                                <!-- Foreground Active Terracotta Qalam Stroke (Clipped to scroll progress) -->
                                <g clip-path="url(#mobile-qalam-clip)">
                                    <g class="qalam-stroke-active">
                                        <path class="nav-ink-bleed-path" d="M 0.8,9.3 C 5,4.9 22,3.8 60,4.4 C 108,5.0 156,5.8 200,5.4 C 219,5.3 233,6.2 239.6,7.5 C 232,9.3 214,10.1 190,10.0 C 144,9.8 96,11.2 48,11.5 C 18,11.7 5,10.9 0.8,9.3 Z" />
                                        <path class="nav-ink-wash-path" d="M 1.2,9.2 C 6,5.4 22,4.4 60,4.9 C 108,5.4 156,6.1 200,5.8 C 218,5.7 232,6.5 239.2,7.5 C 231,8.9 214,9.6 192,9.5 C 146,9.3 98,10.6 50,10.9 C 20,11.1 6,10.5 1.2,9.2 Z" />
                                        <path class="nav-ink-core-path" d="M 1.8,9.1 C 7,5.8 24,4.8 62,5.2 C 108,5.7 154,6.4 196,6.1 C 214,6.0 228,6.7 236.5,7.6 C 226,8.7 208,9.2 188,9.1 C 144,8.9 98,10.2 52,10.5 C 22,10.7 8,10.2 1.8,9.1 Z" />
                                        <path class="nav-ink-bristles-path" d="M 182,5.9 C 204,5.7 224,6.2 239.4,7.1 M 176,9.3 C 200,9.5 220,9.0 237.8,8.2 M 14,10.4 C 42,10.9 78,10.6 114,9.9" />
                                        <path class="nav-ink-dry-path" d="M 164,7.4 C 190,7.2 214,7.4 234,7.6" />
                                    </g>
                                </g>
                            </svg>
                            <div class="mobile-qalam-progress-markers" id="mobile-qalam-progress-markers"></div>
                        </div>
                    </div>

                    <!-- Scrolling Steps Column -->
                    <div class="steps-scrolling-column" id="steps-scrolling-column"></div>
                </div>

                <!-- Footer for Step-by-Step view -->
                <footer class="footer">
                    <p>&copy; 2026 Bilal Abbasi. All rights reserved.</p>
                </footer>
            </section>
        </div>
        `;
        root.innerHTML = markup;

        // Ensure stationary progress bar is attached directly to document.body outside scrolling wrappers
        let progressContainer = document.getElementById("qalam-progress-container");
        if (!progressContainer) {
            progressContainer = document.createElement("aside");
            progressContainer.className = "qalam-progress-container";
            progressContainer.id = "qalam-progress-container";
            progressContainer.setAttribute("aria-label", "Step progress");
            progressContainer.innerHTML = `
                <div class="qalam-progress-tooltip" id="qalam-progress-tooltip"></div>
                <div class="qalam-progress-track">
                    <svg class="qalam-track-svg" viewBox="0 0 16 240" preserveAspectRatio="none" focusable="false" aria-hidden="true">
                        <defs>
                            <clipPath id="progress-ink-clip">
                                <rect id="progress-clip-rect" x="-50" y="0" width="100" height="0" />
                            </clipPath>
                        </defs>
                        <!-- Incomplete Track (Greyed-out procedural qalam stroke) -->
                        <g class="qalam-stroke-grey" transform="matrix(0 1 -1 0 16 0)">
                            <path class="nav-ink-bleed-path" d="M 0.8,9.3 C 5,4.9 22,3.8 60,4.4 C 108,5.0 156,5.8 200,5.4 C 219,5.3 233,6.2 239.6,7.5 C 232,9.3 214,10.1 190,10.0 C 144,9.8 96,11.2 48,11.5 C 18,11.7 5,10.9 0.8,9.3 Z" />
                            <path class="nav-ink-wash-path" d="M 1.2,9.2 C 6,5.4 22,4.4 60,4.9 C 108,5.4 156,6.1 200,5.8 C 218,5.7 232,6.5 239.2,7.5 C 231,8.9 214,9.6 192,9.5 C 146,9.3 98,10.6 50,10.9 C 20,11.1 6,10.5 1.2,9.2 Z" />
                            <path class="nav-ink-core-path" d="M 1.8,9.1 C 7,5.8 24,4.8 62,5.2 C 108,5.7 154,6.4 196,6.1 C 214,6.0 228,6.7 236.5,7.6 C 226,8.7 208,9.2 188,9.1 C 144,8.9 98,10.2 52,10.5 C 22,10.7 8,10.2 1.8,9.1 Z" />
                            <path class="nav-ink-bristles-path" d="M 182,5.9 C 204,5.7 224,6.2 239.4,7.1 M 176,9.3 C 200,9.5 220,9.0 237.8,8.2 M 14,10.4 C 42,10.9 78,10.6 114,9.9" />
                            <path class="nav-ink-dry-path" d="M 164,7.4 C 190,7.2 214,7.4 234,7.6" />
                        </g>
                        <!-- Foreground Active Track (Terracotta procedural qalam stroke, clipped to progress) -->
                        <g clip-path="url(#progress-ink-clip)">
                            <g class="qalam-stroke-active" transform="matrix(0 1 -1 0 16 0)">
                                <path class="nav-ink-bleed-path" d="M 0.8,9.3 C 5,4.9 22,3.8 60,4.4 C 108,5.0 156,5.8 200,5.4 C 219,5.3 233,6.2 239.6,7.5 C 232,9.3 214,10.1 190,10.0 C 144,9.8 96,11.2 48,11.5 C 18,11.7 5,10.9 0.8,9.3 Z" />
                                <path class="nav-ink-wash-path" d="M 1.2,9.2 C 6,5.4 22,4.4 60,4.9 C 108,5.4 156,6.1 200,5.8 C 218,5.7 232,6.5 239.2,7.5 C 231,8.9 214,9.6 192,9.5 C 146,9.3 98,10.6 50,10.9 C 20,11.1 6,10.5 1.2,9.2 Z" />
                                <path class="nav-ink-core-path" d="M 1.8,9.1 C 7,5.8 24,4.8 62,5.2 C 108,5.7 154,6.4 196,6.1 C 214,6.0 228,6.7 236.5,7.6 C 226,8.7 208,9.2 188,9.1 C 144,8.9 98,10.2 52,10.5 C 22,10.7 8,10.2 1.8,9.1 Z" />
                                <path class="nav-ink-bristles-path" d="M 182,5.9 C 204,5.7 224,6.2 239.4,7.1 M 176,9.3 C 200,9.5 220,9.0 237.8,8.2 M 14,10.4 C 42,10.9 78,10.6 114,9.9" />
                                <path class="nav-ink-dry-path" d="M 164,7.4 C 190,7.2 214,7.4 234,7.6" />
                            </g>
                        </g>
                    </svg>
                    <div class="qalam-progress-markers" id="qalam-progress-markers"></div>
                </div>
            `;
            document.body.appendChild(progressContainer);
        } else if (progressContainer.parentElement !== document.body) {
            document.body.appendChild(progressContainer);
        }
    }

    // Helper function to normalize and resolve image paths
    function resolveImagePath(imgPath) {
        if (!imgPath) return '';
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://') || imgPath.startsWith('/') || imgPath.startsWith('data:')) {
            return imgPath;
        }
        // Normalize paths pointing to shared root assets
        if (imgPath.startsWith('../../../assets/')) {
            return imgPath;
        }
        if (imgPath.startsWith('../../assets/')) {
            return '../' + imgPath;
        }
        if (imgPath.startsWith('../assets/')) {
            return '../../' + imgPath;
        }
        // If recipe references "assets/..." but file is shared root asset kitchen_sketch
        if (imgPath.includes('kitchen_sketch')) {
            return '../../../assets/' + imgPath.replace(/^(\.\/)?assets\//, '');
        }
        // Recipe-local asset (e.g., "assets/step1.png" or "./assets/step1.png")
        return imgPath;
    }

    // Render Recipe Content
    function renderRecipe(recipe) {
        currentRecipeTitle = (recipe.title || "the recipe").toLowerCase();
        const navbarEl = document.querySelector("header.navbar");
        if (navbarEl) {
            navbarEl.setAttribute("data-recipe-title", currentRecipeTitle);
            if (typeof window.renderRecipeNavbar === "function") {
                window.renderRecipeNavbar(navbarEl, currentRecipeTitle, "../../");
            }
        }
        ensureNavComponent();

        const rootEl = document.getElementById('recipe-root');
        if (window.RecipeFloatingStage) {
            window.RecipeFloatingStage.applyFloatingLensCssVars(rootEl);
        }

        // 1. Update Title and Headers
        document.title = (recipe.title || "Recipe") + " — the kitchen";
        const titleEl = document.getElementById("main-title");
        if (titleEl) titleEl.textContent = recipe.title || "Recipe Name";

        const subtitleEl = document.getElementById("main-subtitle");
        if (subtitleEl) subtitleEl.textContent = recipe.subtitle || "";

        const bioEl = document.getElementById("bio-text");
        if (bioEl) bioEl.textContent = recipe.description || "";

        const defaultRecipeImg = resolveImagePath(recipe.image || '../../../assets/kitchen_sketch.png');
        const mainImgEl = document.querySelector(".sketch-img");
        if (mainImgEl) {
            mainImgEl.src = defaultRecipeImg;
        }

        // 2. Render Ingredients Column (Side-by-Side View)
        const ingredientsContainer = document.getElementById("ingredients-list-container");
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            ingredientsContainer.innerHTML = recipe.ingredients.map(sec => `
                <div class="recipe-section">
                    <h4 class="recipe-section-title">
                        <button type="button" class="recipe-section-toggle" aria-expanded="true">
                            <span>${sec.section}</span>
                            <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </h4>
                    <div class="recipe-section-content">
                        ${(sec.items || []).map(item => `
                            <div class="menu-item">
                                <p class="recipe-description"><span class="ingredient-text">${item}</span></p>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `).join("");
        } else {
            ingredientsContainer.innerHTML = `<p class="recipe-description">No ingredients listed.</p>`;
        }

        // 3. Render Steps Column (Side-by-Side View & Step-by-Step View)
        const stepsScrollContainer = document.getElementById("steps-scroll-container");
        const sketchLayers = document.getElementById("sketch-layers");
        const stepsScrollingColumn = document.getElementById("steps-scrolling-column");

        let stepsSideBySideHtml = "";
        let stepsStepByStepHtml = "";
        let sketchLayersHtml = "";
        let globalStepCounter = 0;
        let globalSectionCounter = 0;

        if (recipe.steps && recipe.steps.length > 0) {
            const hasAnyStructuredSteps = recipe.steps.some(sec => sec && typeof sec === 'object' && (Array.isArray(sec.ingredients) || Array.isArray(sec.tools)));
            const forceFloatingPreview = typeof window !== 'undefined' &&
                window.location &&
                new URLSearchParams(window.location.search).get('floating') === '1';
            const floatingItems = (hasAnyStructuredSteps && window.RecipeFloatingStage)
                ? window.RecipeFloatingStage.collectRecipeItems(recipe, resolveImagePath)
                : [];
            const useFloatingStage = Boolean(
                hasAnyStructuredSteps &&
                window.RecipeFloatingStage &&
                (forceFloatingPreview || window.RecipeFloatingStage.hasCompleteAssets(floatingItems, recipe))
            );
            recipe.steps.forEach(sec => {
                globalSectionCounter++;
                const formattedSectionNum = String(globalSectionCounter).padStart(2, '0');

                let sectionTitle = "";
                let sectionImage = null;
                let sectionItems = [];

                if (typeof sec === 'string') {
                    sectionItems = [sec];
                } else if (sec && typeof sec === 'object') {
                    if (Array.isArray(sec.items)) {
                        sectionTitle = sec.section || "";
                        sectionImage = sec.image || (sec.items[0] && typeof sec.items[0] === 'object' && sec.items[0].image) || null;
                        sectionItems = sec.items;
                    } else {
                        sectionTitle = sec.section || sec.title || "";
                        sectionImage = sec.image || null;
                        sectionItems = [sec.text || sec.step || sec.description || ""];
                    }
                }

                // Side-by-Side View
                if (sectionTitle) {
                    stepsSideBySideHtml += `
                        <div class="recipe-section">
                            <h4 class="recipe-section-title">
                                <button type="button" class="recipe-section-toggle" aria-expanded="true">
                                    <span>${sectionTitle}</span>
                                    <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            </h4>
                            <div class="recipe-section-content">
                    `;
                }

                sectionItems.forEach(item => {
                    globalStepCounter++;
                    const stepText = typeof item === 'string' ? item : (item.text || item.step || "");
                    const formattedStepNum = String(globalStepCounter).padStart(2, '0');

                    stepsSideBySideHtml += `
                        <div class="menu-item step-card" data-step="${globalStepCounter}">
                            <span class="step-card-num">${formattedStepNum}</span>
                            <p class="recipe-description"><span class="step-card-text">${stepText}</span></p>
                        </div>
                    `;
                });

                if (sectionTitle) {
                    stepsSideBySideHtml += `
                            </div>
                        </div>
                    `;
                }

                // Step-by-Step View
                if (sectionTitle) {
                    stepsStepByStepHtml += `
                        <div class="step-slide" data-step="${globalSectionCounter}">
                            <h3 class="step-section-heading">${sectionTitle}</h3>
                            <ol class="step-section-list">
                                ${sectionItems.map(item => `
                                    <li class="step-section-item">${typeof item === 'string' ? item : (item.text || item.step || "")}</li>
                                `).join("")}
                            </ol>
                        </div>
                    `;
                } else {
                    const stepText = typeof sectionItems[0] === 'string' ? sectionItems[0] : (sectionItems[0].text || sectionItems[0].step || "");
                    stepsStepByStepHtml += `
                        <div class="step-slide" data-step="${globalSectionCounter}">
                            <span class="step-number">step ${formattedSectionNum}</span>
                            <p class="step-text">${stepText}</p>
                        </div>
                    `;
                }

                // Visual sketch layer for this step (single sketch when floating stage is inactive)
                if (!useFloatingStage) {
                    const stepVisualSrc = resolveImagePath(sectionImage || defaultRecipeImg);
                    sketchLayersHtml += `
                        <img src="${stepVisualSrc}" alt="Step ${globalSectionCounter} visual" class="sketch-layer" data-step="${globalSectionCounter}">
                    `;
                }
            });

            stepsScrollContainer.innerHTML = stepsSideBySideHtml;
            stepsScrollingColumn.innerHTML = stepsStepByStepHtml;

            if (useFloatingStage) {
                const Floating = window.RecipeFloatingStage;
                const stepSection = document.getElementById('step-by-step');
                if (stepSection) stepSection.classList.add('is-structured-steps');

                const seedKey = recipe.title || 'recipe';

                const heroSketchContainer = document.querySelector('.hero-section .sketch-container');
                if (heroSketchContainer) {
                    heroSketchContainer.classList.add('has-floating-stage');
                    heroSketchContainer.innerHTML = Floating.renderFloatingStageHtml(floatingItems, { isStepStage: false, seedKey });
                    Floating.bindFloatingStageInteractions(heroSketchContainer);
                    Floating.layoutFloatingStage(heroSketchContainer.querySelector('.floating-stage'));
                }

                sketchLayers.innerHTML = `
                    <div class="sketch-layer active step-floating-stage-layer" data-step="all">
                        ${Floating.renderFloatingStageHtml(floatingItems, { isStepStage: true, seedKey })}
                        ${Floating.renderMobileSwipeStageHtml(floatingItems, (recipe.steps || []).length)}
                    </div>
                `;
                Floating.bindFloatingStageInteractions(sketchLayers);
                Floating.bindMobileSwipeUrduToggles(sketchLayers);
                updateStickyLayers(1);
            } else {
                sketchLayers.innerHTML = sketchLayersHtml;
            }
        } else {
            stepsScrollContainer.innerHTML = `<p class="recipe-description">No steps listed.</p>`;
            stepsScrollingColumn.innerHTML = `<p class="step-text">No steps listed.</p>`;
            sketchLayers.innerHTML = `<img src="${defaultRecipeImg}" alt="Recipe visual" class="sketch-layer active" data-step="1">`;
        }

        // 4. Initialize interactions
        initInteractions();
    }

    // View mode toggling
    window.selectRecipeMode = function (mode, shouldScroll = true) {
        const sideBySideSection = document.getElementById('menu');
        const stepByStepSection = document.getElementById('step-by-step');
        const indSide = document.getElementById('indicator-side-by-side');
        const indStep = document.getElementById('indicator-step-by-step');

        if (!sideBySideSection || !stepByStepSection) return;

        if (mode === 'side-by-side') {
            sideBySideSection.style.display = 'block';
            stepByStepSection.style.display = 'none';

            if (indSide) {
                indSide.classList.add('active');
                indSide.setAttribute('aria-pressed', 'true');
            }
            if (indStep) {
                indStep.classList.remove('active');
                indStep.setAttribute('aria-pressed', 'false');
            }

            try {
                if (window.location.hash === '#step-by-step') {
                    history.replaceState(null, '', window.location.pathname + window.location.search + '#side-by-side');
                }
            } catch (e) {}

            if (shouldScroll) {
                sideBySideSection.scrollIntoView({ behavior: 'smooth' });
            }
            syncMobileMenuTabs();
            setTimeout(() => {
                updateScrollButtonVisibility();
                syncMobileMenuTabs();
            }, 300);
            updateQalamProgress();
        } else if (mode === 'step-by-step') {
            sideBySideSection.style.display = 'none';
            stepByStepSection.style.display = 'block';
            const stepStage = document.querySelector('#sketch-layers .floating-stage');
            if (stepStage && window.RecipeFloatingStage) {
                window.RecipeFloatingStage.layoutFloatingStage(stepStage, { activeOnly: Boolean(stepStage.querySelector('.floating-item.is-inactive')) });
            }

            if (indSide) {
                indSide.classList.remove('active');
                indSide.setAttribute('aria-pressed', 'false');
            }
            if (indStep) {
                indStep.classList.add('active');
                indStep.setAttribute('aria-pressed', 'true');
            }

            try {
                if (window.location.hash !== '#step-by-step') {
                    history.replaceState(null, '', window.location.pathname + window.location.search + '#step-by-step');
                }
            } catch (e) {}

            populateCenteredIngredients();
            if (shouldScroll) {
                stepByStepSection.scrollIntoView({ behavior: 'smooth' });
            }
            updateQalamProgress();
        }
    };

    function populateCenteredIngredients() {
        const sourceIngredients = document.getElementById('ingredients-list-container');
        const destIngredients = document.getElementById('ingredients-centered-list');
        if (sourceIngredients && destIngredients && destIngredients.children.length === 0) {
            destIngredients.innerHTML = sourceIngredients.innerHTML;
            destIngredients.querySelectorAll('.recipe-section').forEach(sec => sec.classList.remove('collapsed'));
            destIngredients.querySelectorAll('.menu-item.is-checked').forEach(item => item.classList.remove('is-checked'));
            destIngredients.querySelectorAll('.ingredient-qalam-strike').forEach(el => el.remove());
            destIngredients.querySelectorAll('.recipe-section-toggle').forEach(btn => {
                const label = btn.querySelector('span');
                const staticSpan = document.createElement('span');
                staticSpan.textContent = label ? label.textContent : btn.textContent.trim();
                btn.replaceWith(staticSpan);
            });
        }
    }

    function buildQalamStrikeLines(menuItem, animate = true) {
        const textEl = menuItem.querySelector('.ingredient-text, .step-card-text');
        if (!textEl) return;
        menuItem.querySelectorAll('.ingredient-qalam-strike').forEach(el => el.remove());

        const itemRect = menuItem.getBoundingClientRect();
        const rawRects = Array.from(textEl.getClientRects()).filter(r => r.width > 1 && r.height > 1);
        if (rawRects.length === 0) return;

        // Merge client rects on the same visual line (e.g. mixed English + Urdu RTL runs)
        const lines = [];
        rawRects.forEach(r => {
            const midY = r.top + r.height / 2;
            const existing = lines.find(l => Math.abs(l.midY - midY) < Math.max(8, r.height * 0.45));
            if (existing) {
                existing.left = Math.min(existing.left, r.left);
                existing.right = Math.max(existing.right, r.right);
                existing.top = Math.min(existing.top, r.top);
                existing.bottom = Math.max(existing.bottom, r.bottom);
                existing.midY = (existing.top + existing.bottom) / 2;
            } else {
                lines.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom, midY });
            }
        });

        const strokes = lines.map((line, idx) => {
            const strike = document.createElement('span');
            strike.className = 'ingredient-qalam-strike';
            strike.setAttribute('aria-hidden', 'true');
            const leftPx = Math.max(0, line.left - itemRect.left - 3);
            const widthPx = Math.max(8, (line.right - line.left) + 6);
            const topPx = line.midY - itemRect.top;
            strike.style.left = `${leftPx.toFixed(1)}px`;
            strike.style.top = `${topPx.toFixed(1)}px`;
            strike.style.width = `${widthPx.toFixed(1)}px`;
            if (animate) {
                strike.style.transitionDelay = `${idx * 75}ms`;
            } else {
                strike.classList.add('is-drawn');
            }
            menuItem.appendChild(strike);
            return strike;
        });

        if (animate) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    strokes.forEach(s => s.classList.add('is-drawn'));
                });
            });
        }
    }

    function syncCheckedIngredientStrikes() {
        if (window.innerWidth > 900) return;
        document.querySelectorAll('#ingredients-list-container .menu-item.is-checked, #steps-scroll-container .step-card.is-checked').forEach(item => {
            buildQalamStrikeLines(item, false);
        });
    }

    function syncMobileMenuTabs() {
        if (window.innerWidth > 900) return;
        const tabsBar = document.getElementById('mobile-menu-tabs');
        const indicator = document.getElementById('mobile-menu-tab-indicator');
        const menuGrid = document.getElementById('menu-grid');
        if (!tabsBar || !indicator || !menuGrid) return;

        const tabs = Array.from(tabsBar.querySelectorAll('.mobile-menu-tab'));
        if (tabs.length < 2) return;

        const barRect = tabsBar.getBoundingClientRect();
        if (barRect.width === 0) return;

        const labelRects = tabs.map(tab => {
            const lbl = tab.querySelector('.mobile-menu-tab-label') || tab;
            return lbl.getBoundingClientRect();
        });

        const maxScroll = Math.max(1, menuGrid.scrollWidth - menuGrid.clientWidth);
        const progress = Math.max(0, Math.min(1, menuGrid.scrollLeft / maxScroll));

        const x0 = labelRects[0].left - barRect.left;
        const w0 = labelRects[0].width;
        const x1 = labelRects[1].left - barRect.left;
        const w1 = labelRects[1].width;

        const curX = x0 + (x1 - x0) * progress;
        const curW = w0 + (w1 - w0) * progress;

        indicator.style.transform = `translate3d(${curX.toFixed(1)}px, 0, 0)`;
        indicator.style.width = `${curW.toFixed(1)}px`;
        indicator.style.opacity = '0.92';

        const activeIdx = progress >= 0.5 ? 1 : 0;
        tabs.forEach((tab, idx) => {
            const isActive = idx === activeIdx;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    function updateScrollButtonVisibility() {
        const stepsContainer = document.getElementById('steps-scroll-container');
        const scrollStepsBtn = document.getElementById('scroll-steps-btn');
        if (stepsContainer && scrollStepsBtn) {
            if (stepsContainer.scrollHeight > stepsContainer.clientHeight) {
                scrollStepsBtn.classList.add('visible');
            } else {
                scrollStepsBtn.classList.remove('visible');
            }
        }
    }

    function setupQalamProgressBar() {
        if (window.RecipeQalamProgress) window.RecipeQalamProgress.setupQalamProgressBar();
    }

    function updateQalamProgress() {
        if (window.RecipeQalamProgress) window.RecipeQalamProgress.updateQalamProgress();
    }

    let stepObserver = null;
    const intersectingSteps = new Set();

    function initInteractions() {
        const stepsContainer = document.getElementById('steps-scroll-container');
        const scrollStepsBtn = document.getElementById('scroll-steps-btn');

        if (scrollStepsBtn && stepsContainer) {
            scrollStepsBtn.addEventListener('click', () => {
                const scrollAmount = stepsContainer.clientHeight;
                if (stepsContainer.scrollTop + stepsContainer.clientHeight >= stepsContainer.scrollHeight - 10) {
                    stepsContainer.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    stepsContainer.scrollBy({ top: scrollAmount, behavior: 'smooth' });
                }
            });

            stepsContainer.addEventListener('scroll', () => {
                if (stepsContainer.scrollTop + stepsContainer.clientHeight >= stepsContainer.scrollHeight - 10) {
                    scrollStepsBtn.classList.add('at-end');
                } else {
                    scrollStepsBtn.classList.remove('at-end');
                }
            });
        }

        updateScrollButtonVisibility();

        const initialMode = window.location.hash === '#step-by-step' ? 'step-by-step' : 'side-by-side';

        if (initialMode === 'step-by-step') {
            window.selectRecipeMode('step-by-step', false);
        } else {
            const indSide = document.getElementById('indicator-side-by-side');
            if (indSide) indSide.classList.add('active');
        }

        if (!window.recipeModeListenerAdded) {
            window.recipeModeListenerAdded = true;
            window.addEventListener('hashchange', () => {
                if (window.location.hash === '#step-by-step') {
                    window.selectRecipeMode('step-by-step', true);
                } else if (window.location.hash === '#side-by-side' || window.location.hash === '#menu') {
                    window.selectRecipeMode('side-by-side', true);
                }
            });
        }

        // Collapsible recipe sections
        document.querySelectorAll('#menu .recipe-section-toggle').forEach(toggle => {
            if (toggle.dataset.listenerAdded) return;
            toggle.dataset.listenerAdded = "true";

            toggle.addEventListener('click', () => {
                const section = toggle.closest('.recipe-section');
                if (section) {
                    const isCollapsed = section.classList.toggle('collapsed');
                    toggle.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
                    updateScrollButtonVisibility();
                }
            });
        });

        // Mobile & tablet stationary 2-pane tabs + horizontal swipe sync
        const tabsBar = document.getElementById('mobile-menu-tabs');
        const menuGrid = document.getElementById('menu-grid');
        if (tabsBar && menuGrid && !tabsBar.dataset.listenerAdded) {
            tabsBar.dataset.listenerAdded = "true";
            tabsBar.addEventListener('click', (e) => {
                const tab = e.target.closest('.mobile-menu-tab');
                if (!tab) return;
                const paneIdx = parseInt(tab.getAttribute('data-pane'), 10) || 0;
                menuGrid.scrollTo({
                    left: paneIdx * menuGrid.clientWidth,
                    behavior: 'smooth'
                });
            });

            let tabScrollRaf = null;
            menuGrid.addEventListener('scroll', () => {
                if (tabScrollRaf) return;
                tabScrollRaf = requestAnimationFrame(() => {
                    tabScrollRaf = null;
                    syncMobileMenuTabs();
                });
            }, { passive: true });
        }
        syncMobileMenuTabs();
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                syncMobileMenuTabs();
                syncCheckedIngredientStrikes();
            });
        }

        // Mobile & tablet tap-to-cross-off ingredients and steps with qalam brush stroke
        const bindQalamStrikeContainer = (containerEl) => {
            if (!containerEl || containerEl.dataset.strikeBound) return;
            containerEl.dataset.strikeBound = "true";
            containerEl.addEventListener('click', (e) => {
                if (window.innerWidth > 900) return;
                if (e.target.closest('a, button')) return;
                const menuItem = e.target.closest('.menu-item');
                if (!menuItem) return;

                const isChecked = menuItem.classList.toggle('is-checked');
                if (isChecked) {
                    buildQalamStrikeLines(menuItem, true);
                } else {
                    const existingStrikes = menuItem.querySelectorAll('.ingredient-qalam-strike');
                    existingStrikes.forEach(s => {
                        s.style.transitionDelay = '0ms';
                        s.classList.remove('is-drawn');
                    });
                    setTimeout(() => {
                        if (!menuItem.classList.contains('is-checked')) {
                            menuItem.querySelectorAll('.ingredient-qalam-strike').forEach(s => s.remove());
                        }
                    }, 380);
                }
            });
        };
        bindQalamStrikeContainer(document.getElementById('ingredients-list-container'));
        bindQalamStrikeContainer(document.getElementById('steps-scroll-container'));

        // Urdu Qalam Progress Bar
        setupQalamProgressBar();

        // IntersectionObserver for step-by-step slides
        if (stepObserver) {
            stepObserver.disconnect();
        }

        let lastActiveStep = null;
        function evaluateActiveStep() {
            if (intersectingSteps.size === 0) {
                if (lastActiveStep !== 0) {
                    lastActiveStep = 0;
                    updateStickyLayers(0);
                }
                return;
            }

            let activeStep = null;
            let closestDistance = Infinity;
            const targetY = window.innerHeight * (window.innerWidth <= 900 ? 0.68 : 0.5);

            intersectingSteps.forEach(stepNum => {
                const slide = document.querySelector(`.step-slide[data-step="${stepNum}"]`) || document.getElementById('step-page-ingredients');
                if (slide) {
                    const rect = slide.getBoundingClientRect();
                    const slideCenter = rect.top + rect.height / 2;
                    const distance = Math.abs(slideCenter - targetY);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        activeStep = stepNum;
                    }
                }
            });

            if (activeStep !== null && activeStep !== lastActiveStep) {
                lastActiveStep = activeStep;
                updateStickyLayers(activeStep);

                const markers = document.querySelectorAll(".qalam-step-marker");
                markers.forEach((m, idx) => {
                    if (idx === activeStep) {
                        m.classList.add("is-active");
                    } else {
                        m.classList.remove("is-active");
                    }
                });
            }
        }

        stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const stepNum = parseInt(entry.target.getAttribute('data-step'), 10);
                if (!isNaN(stepNum)) {
                    if (entry.isIntersecting) {
                        intersectingSteps.add(stepNum);
                    } else {
                        intersectingSteps.delete(stepNum);
                    }
                }
            });
            evaluateActiveStep();
        }, {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0
        });

        let scrollStepRaf = null;
        window.addEventListener('scroll', () => {
            if (scrollStepRaf) return;
            scrollStepRaf = requestAnimationFrame(() => {
                scrollStepRaf = null;
                evaluateActiveStep();
            });
        }, { passive: true });

        const ingredientsPage = document.getElementById('step-page-ingredients');
        if (ingredientsPage) {
            stepObserver.observe(ingredientsPage);
        }

        document.querySelectorAll('#steps-scrolling-column .step-slide').forEach(slide => {
            stepObserver.observe(slide);
        });
    }

    function updateStickyLayers(stepNum) {
        const floatingStageLayer = document.querySelector('#sketch-layers .step-floating-stage-layer');
        if (floatingStageLayer && window.RecipeFloatingStage) {
            window.RecipeFloatingStage.updateStickyFloatingLayer(floatingStageLayer, stepNum);
            return;
        }

        const layers = document.querySelectorAll('#sketch-layers .sketch-layer');
        if (layers.length === 1 && layers[0].getAttribute('data-step') === '1') {
            layers[0].classList.add('active');
            return;
        }

        layers.forEach(layer => {
            const layerStep = parseInt(layer.getAttribute('data-step'), 10);
            if (layerStep === stepNum) {
                layer.classList.add('active');
            } else {
                layer.classList.remove('active');
            }
        });
    }

    window.addEventListener('resize', () => {
        updateScrollButtonVisibility();
        updateQalamProgress();
        syncMobileMenuTabs();
        syncCheckedIngredientStrikes();
        if (window.RecipeFloatingStage) {
            document.querySelectorAll('.floating-stage').forEach(stage => {
                window.RecipeFloatingStage.layoutFloatingStage(stage, { activeOnly: Boolean(stage.querySelector('.floating-item.is-inactive')) });
            });
        }
    }, { passive: true });

    window.addEventListener('scroll', () => {
        updateQalamProgress();
    }, { passive: true });

    // Main initialization on DOM load
    document.addEventListener("DOMContentLoaded", () => {
        ensureBaseMarkup();
        ensureNavComponent();

        // Update tab label from global config
        if (typeof KITCHEN_CONFIG !== 'undefined') {
            const kitchenTab = document.getElementById("kitchen-tab");
            if (kitchenTab) {
                kitchenTab.textContent = "← " + (KITCHEN_CONFIG.name || "the kitchen");
            }
        }

        // If RECIPE_DATA is already defined globally (loaded via <script src="recipe.js">)
        if (typeof RECIPE_DATA !== 'undefined') {
            try {
                const recipe = jsyaml.load(RECIPE_DATA);
                renderRecipe(recipe);
            } catch (err) {
                console.error("YAML parse error:", err);
            }
        }
    });
})();
