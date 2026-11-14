/**
 * Recipe Engine for Bilal Abbasi's Personal Website
 * Renders recipe data (YAML inside JS) into responsive Side-by-Side and Step-by-Step layouts.
 */

(function () {
    let currentRecipeTitle = "";
    let progressSlides = [];
    let lastHighlightedIdx = -1;
    let isHoveringMarker = false;
    let milestoneHideTimer = null;

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

        let initialMode = 'side-by-side';
        try {
            if (window.location.hash === '#step-by-step' || sessionStorage.getItem('recipe_view_mode') === 'step-by-step') {
                initialMode = 'step-by-step';
            }
        } catch (e) {}
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
                <div class="recipe-indicators">
                    <div class="scroll-indicator ${!isStepMode ? 'active' : ''}" id="indicator-side-by-side" onclick="selectRecipeMode('side-by-side')">
                        <span class="scroll-text">side by side</span>
                        <svg class="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                    <div class="scroll-indicator ${isStepMode ? 'active' : ''}" id="indicator-step-by-step" onclick="selectRecipeMode('step-by-step')">
                        <span class="scroll-text">step by step</span>
                        <svg class="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
            </section>

            <!-- Menu Section (Second Page / Side-by-Side View) -->
            <section class="menu-section" id="menu" style="${isStepMode ? 'display: none;' : ''}">
                <h2 class="menu-title">the recipe</h2>

                <div class="menu-grid">
                    <!-- INGREDIENTS COLUMN -->
                    <div class="menu-column">
                        <h3 class="column-title">ingredients</h3>
                        <div class="menu-items" id="ingredients-list-container"></div>
                    </div>

                    <!-- STEPS COLUMN -->
                    <div class="menu-column steps-column">
                        <h3 class="column-title">steps</h3>
                        <div class="steps-scroll-wrapper">
                            <div class="menu-items steps-scroll-container" id="steps-scroll-container"></div>
                            <button class="scroll-down-btn" id="scroll-steps-btn" aria-label="Scroll steps down">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
                        <span>${sec.section}</span>
                        <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </h4>
                    <div class="recipe-section-content">
                        ${(sec.items || []).map(item => `
                            <div class="menu-item">
                                <p class="recipe-description">${item}</p>
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
                                <span>${sectionTitle}</span>
                                <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
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
                            <p class="recipe-description">${stepText}</p>
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

                // Visual sketch layer for this step
                const stepVisualSrc = resolveImagePath(sectionImage || defaultRecipeImg);
                sketchLayersHtml += `
                    <img src="${stepVisualSrc}" alt="Step ${globalSectionCounter} visual" class="sketch-layer" data-step="${globalSectionCounter}">
                `;
            });

            stepsScrollContainer.innerHTML = stepsSideBySideHtml;
            stepsScrollingColumn.innerHTML = stepsStepByStepHtml;
            sketchLayers.innerHTML = sketchLayersHtml;
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

            if (indSide) indSide.classList.add('active');
            if (indStep) indStep.classList.remove('active');

            try {
                sessionStorage.setItem('recipe_view_mode', 'side-by-side');
                if (window.location.hash === '#step-by-step') {
                    history.replaceState(null, '', window.location.pathname + window.location.search + '#side-by-side');
                }
            } catch (e) {}

            if (shouldScroll) {
                sideBySideSection.scrollIntoView({ behavior: 'smooth' });
            }
            setTimeout(updateScrollButtonVisibility, 300);
            setTimeout(updateRecipeNavbarState, 100);
            updateQalamProgress();
        } else if (mode === 'step-by-step') {
            sideBySideSection.style.display = 'none';
            stepByStepSection.style.display = 'block';

            if (indSide) indSide.classList.remove('active');
            if (indStep) indStep.classList.add('active');

            try {
                sessionStorage.setItem('recipe_view_mode', 'step-by-step');
                if (window.location.hash !== '#step-by-step') {
                    history.replaceState(null, '', window.location.pathname + window.location.search + '#step-by-step');
                }
            } catch (e) {}

            populateCenteredIngredients();
            if (shouldScroll) {
                stepByStepSection.scrollIntoView({ behavior: 'smooth' });
            }
            setTimeout(updateRecipeNavbarState, 100);
            updateQalamProgress();
        }
    };

    function populateCenteredIngredients() {
        const sourceIngredients = document.getElementById('ingredients-list-container');
        const destIngredients = document.getElementById('ingredients-centered-list');
        if (sourceIngredients && destIngredients && destIngredients.children.length === 0) {
            destIngredients.innerHTML = sourceIngredients.innerHTML;
        }
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

    /* =====================================================================
       RECIPE NAVBAR BREADCRUMB & SCROLL STATE
       ===================================================================== */
    function updateRecipeNavbarState() {
        const navbar = document.querySelector("header.navbar");
        if (!navbar) return;

        const hero = document.querySelector(".hero-section");
        const isPastHero = hero ? (hero.getBoundingClientRect().bottom < window.innerHeight * 0.65) : (window.scrollY > 150);

        if (typeof window.setRecipeNavbarMode === "function") {
            window.setRecipeNavbarMode(navbar, isPastHero, currentRecipeTitle, "../../");
        }
    }

    /* =====================================================================
       URDU QALAM VERTICAL PROGRESS BAR (Step-by-Step View)
       ===================================================================== */
    const INK_BLOT_PATHS = [
        {
            core: "M 10,4.2 C 13.5,4.0 16.2,6.5 15.8,10.1 C 15.4,13.8 12.8,16.0 9.2,15.7 C 5.6,15.4 3.8,12.8 4.2,9.2 C 4.6,5.6 6.8,4.4 10,4.2 Z",
            bleed: "M 10,2.5 C 14.8,2.2 18.2,5.5 17.7,10.3 C 17.2,15.2 13.7,18.0 8.8,17.6 C 4.0,17.2 1.8,13.8 2.3,9.0 C 2.8,4.2 5.5,2.7 10,2.5 Z"
        },
        {
            core: "M 10.2,4.4 C 14.0,3.8 16.4,6.8 15.7,10.6 C 15.0,14.2 12.0,16.2 8.4,15.5 C 4.8,14.8 3.5,12.0 4.2,8.4 C 4.9,4.8 6.8,4.8 10.2,4.4 Z",
            bleed: "M 10.3,2.6 C 15.2,2.0 18.5,6.0 17.6,10.8 C 16.7,15.5 12.8,18.2 7.8,17.3 C 2.9,16.4 1.5,12.8 2.4,7.9 C 3.3,3.0 5.8,3.1 10.3,2.6 Z"
        },
        {
            core: "M 9.8,4.3 C 13.6,4.3 16.1,6.6 15.9,10.2 C 15.7,13.8 13.1,16.1 9.5,15.8 C 5.8,15.5 3.7,13.0 4.0,9.4 C 4.3,5.8 6.4,4.3 9.8,4.3 Z",
            bleed: "M 9.8,2.4 C 14.7,2.4 18.1,5.5 17.8,10.4 C 17.5,15.3 14.0,18.2 9.0,17.8 C 4.1,17.4 1.7,14.1 2.1,9.2 C 2.5,4.3 5.3,2.4 9.8,2.4 Z"
        },
        {
            core: "M 10.1,4.0 C 13.8,4.2 16.0,6.7 15.6,10.3 C 15.2,13.9 12.5,16.0 8.9,15.7 C 5.3,15.4 3.7,12.7 4.1,9.1 C 4.5,5.5 6.7,3.8 10.1,4.0 Z",
            bleed: "M 10.2,2.2 C 15.1,2.5 18.0,5.8 17.5,10.6 C 17.0,15.4 13.6,18.0 8.7,17.6 C 3.8,17.2 1.9,13.7 2.4,8.9 C 2.9,4.1 5.7,2.0 10.2,2.2 Z"
        }
    ];

    function setupQalamProgressBar() {
        const container = document.getElementById("qalam-progress-container");
        const markersContainer = document.getElementById("qalam-progress-markers");
        const track = container ? container.querySelector(".qalam-progress-track") : null;
        const tooltip = document.getElementById("qalam-progress-tooltip");
        if (!container || !markersContainer || !track) return;

        markersContainer.innerHTML = "";
        progressSlides = [
            document.getElementById("step-page-ingredients"),
            ...Array.from(document.querySelectorAll("#steps-scrolling-column .step-slide"))
        ].filter(Boolean);

        const total = progressSlides.length;
        if (total === 0) return;

        progressSlides.forEach((slide, idx) => {
            const marker = document.createElement("div");
            marker.className = "qalam-step-marker";
            marker.setAttribute("data-step-index", idx);

            const blot = INK_BLOT_PATHS[idx % INK_BLOT_PATHS.length];
            marker.innerHTML = `
                <div class="qalam-marker-halo" aria-hidden="true"></div>
                <svg class="ink-blot-svg" viewBox="0 0 20 20" focusable="false" aria-hidden="true">
                    <path class="ink-blot-bleed" d="${blot.bleed}" />
                    <path class="ink-blot-core" d="${blot.core}" />
                </svg>
            `;

            let title = "";
            if (idx === 0) {
                title = "mise en place";
            } else {
                const headingEl = slide.querySelector(".step-section-heading");
                if (headingEl) {
                    title = headingEl.textContent.trim().toLowerCase();
                } else {
                    const numberEl = slide.querySelector(".step-number");
                    if (numberEl) {
                        const raw = numberEl.textContent.trim().toLowerCase();
                        title = raw.replace(/^step\s*\d*[\.\:]*\s*/i, "").trim() || raw;
                    } else {
                        title = "step";
                    }
                }
            }
            marker.setAttribute("data-title", title);
            marker.setAttribute("title", title);

            const pct = total > 1 ? (idx / (total - 1)) * 100 : 50;
            marker.style.top = `${pct}%`;

            if (tooltip) {
                marker.addEventListener("mouseenter", () => {
                    isHoveringMarker = true;
                    if (milestoneHideTimer) clearTimeout(milestoneHideTimer);
                    tooltip.textContent = title;
                    tooltip.style.top = `${pct}%`;
                    tooltip.classList.add("is-visible");
                });
                marker.addEventListener("mouseleave", () => {
                    isHoveringMarker = false;
                    tooltip.classList.remove("is-visible");
                });
            }

            marker.addEventListener("click", (e) => {
                e.stopPropagation();
                slide.scrollIntoView({ behavior: "smooth" });
            });
            markersContainer.appendChild(marker);
        });

        if (!track.dataset.listenerAdded) {
            track.dataset.listenerAdded = "true";
            track.addEventListener("click", (e) => {
                if (e.target.closest(".qalam-step-marker")) return;
                const rect = track.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const ratio = Math.max(0, Math.min(1, clickY / rect.height));
                const targetIdx = Math.round(ratio * (progressSlides.length - 1));
                if (progressSlides[targetIdx]) {
                    progressSlides[targetIdx].scrollIntoView({ behavior: "smooth" });
                }
            });
        }

        updateQalamProgress();
    }

    function updateQalamProgress() {
        const stepSection = document.getElementById("step-by-step");
        const container = document.getElementById("qalam-progress-container");
        const clipRect = document.getElementById("progress-clip-rect");
        const markersContainer = document.getElementById("qalam-progress-markers");
        if (!stepSection || !container || progressSlides.length === 0) return;

        if (stepSection.style.display === "none") {
            container.classList.remove("is-visible");
            return;
        }

        const rect = stepSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.75 && rect.bottom > 120;

        if (!isInView) {
            container.classList.remove("is-visible");
            return;
        }

        container.classList.add("is-visible");

        const total = progressSlides.length;
        if (total <= 1) {
            if (clipRect) clipRect.setAttribute("height", "240");
            return;
        }

        const targetY = window.innerHeight * 0.5;
        let closestIdx = 0;
        let closestDist = Infinity;

        progressSlides.forEach((slide, idx) => {
            const r = slide.getBoundingClientRect();
            const slideCenter = r.top + r.height / 2;
            const dist = Math.abs(slideCenter - targetY);
            if (dist < closestDist) {
                closestDist = dist;
                closestIdx = idx;
            }
        });

        const firstSlide = progressSlides[0];
        const lastSlide = progressSlides[total - 1];
        const firstCenter = firstSlide.getBoundingClientRect().top + window.scrollY + firstSlide.offsetHeight / 2;
        const lastCenter = lastSlide.getBoundingClientRect().top + window.scrollY + lastSlide.offsetHeight / 2;
        const totalDist = lastCenter - firstCenter;

        let ratio = 0;
        if (totalDist > 0) {
            const currentDist = (window.scrollY + targetY) - firstCenter;
            ratio = Math.max(0, Math.min(1, currentDist / totalDist));
        } else {
            ratio = closestIdx / (total - 1);
        }

        if (clipRect) {
            const clipHeight = Math.max(0, Math.min(240, ratio * 240));
            clipRect.setAttribute("height", clipHeight.toFixed(1));
        }

        if (markersContainer) {
            const markers = markersContainer.querySelectorAll(".qalam-step-marker");
            markers.forEach((m, idx) => {
                if (idx < closestIdx) {
                    m.classList.add("is-passed");
                    m.classList.remove("is-active");
                } else if (idx === closestIdx) {
                    m.classList.remove("is-passed");
                    m.classList.add("is-active");
                } else {
                    m.classList.remove("is-passed");
                    m.classList.remove("is-active");
                }
            });
            lastHighlightedIdx = closestIdx;
        }
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

        let initialMode = 'side-by-side';
        try {
            if (window.location.hash === '#step-by-step' || sessionStorage.getItem('recipe_view_mode') === 'step-by-step') {
                initialMode = 'step-by-step';
            }
        } catch (e) {}

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
        document.querySelectorAll('#menu .recipe-section-title').forEach(title => {
            if (title.dataset.listenerAdded) return;
            title.dataset.listenerAdded = "true";

            title.addEventListener('click', () => {
                const section = title.closest('.recipe-section');
                if (section) {
                    section.classList.toggle('collapsed');
                    updateScrollButtonVisibility();
                }
            });
        });

        // Urdu Qalam Progress Bar
        setupQalamProgressBar();

        // IntersectionObserver for step-by-step slides
        if (stepObserver) {
            stepObserver.disconnect();
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

            if (intersectingSteps.size > 0) {
                let activeStep = null;
                let closestDistance = Infinity;
                const targetY = window.innerHeight * (window.innerWidth <= 900 ? 0.7 : 0.5);

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

                if (activeStep !== null) {
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
            } else {
                updateStickyLayers(0);
            }
        }, {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0
        });

        const ingredientsPage = document.getElementById('step-page-ingredients');
        if (ingredientsPage) {
            stepObserver.observe(ingredientsPage);
        }

        document.querySelectorAll('#steps-scrolling-column .step-slide').forEach(slide => {
            stepObserver.observe(slide);
        });
    }

    function updateStickyLayers(stepNum) {
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
        updateRecipeNavbarState();
        updateQalamProgress();
    }, { passive: true });

    window.addEventListener('scroll', () => {
        updateRecipeNavbarState();
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
