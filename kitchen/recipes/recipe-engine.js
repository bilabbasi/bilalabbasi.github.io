/**
 * Recipe Engine for Bilal Abbasi's Personal Website
 * Renders recipe data (YAML inside JS) into responsive Side-by-Side and Step-by-Step layouts.
 */

(function () {
    // 1. Build the base HTML markup if not already present
    function ensureBaseMarkup() {
        const root = document.getElementById("recipe-root") || document.body;
        if (root.querySelector(".app-wrapper")) {
            return; // Already present
        }

        const markup = `
        <div class="app-wrapper">
            <header class="navbar">
                <ul class="nav-links">
                    <li class="nav-item"><a href="../../" class="active" id="kitchen-tab">← the kitchen</a></li>
                </ul>
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
                    <div class="scroll-indicator" id="indicator-side-by-side" onclick="selectRecipeMode('side-by-side')">
                        <span class="scroll-text">side by side</span>
                        <svg class="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                    <div class="scroll-indicator" id="indicator-step-by-step" onclick="selectRecipeMode('step-by-step')">
                        <span class="scroll-text">step by step</span>
                        <svg class="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
            </section>

            <!-- Menu Section (Second Page / Side-by-Side View) -->
            <section class="menu-section" id="menu">
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
            <section class="step-by-step-section" id="step-by-step" style="display: none;">
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
    window.selectRecipeMode = function (mode) {
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

            sideBySideSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(updateScrollButtonVisibility, 300);
        } else if (mode === 'step-by-step') {
            sideBySideSection.style.display = 'none';
            stepByStepSection.style.display = 'block';

            if (indSide) indSide.classList.remove('active');
            if (indStep) indStep.classList.add('active');

            populateCenteredIngredients();
            stepByStepSection.scrollIntoView({ behavior: 'smooth' });
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

        if (window.location.hash === '#step-by-step') {
            window.selectRecipeMode('step-by-step');
        } else {
            const indSide = document.getElementById('indicator-side-by-side');
            if (indSide) indSide.classList.add('active');
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

    window.addEventListener('resize', updateScrollButtonVisibility);

    // Main initialization on DOM load
    document.addEventListener("DOMContentLoaded", () => {
        ensureBaseMarkup();

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
