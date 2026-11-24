/* =========================================================================
   URDU QALAM PROGRESS BAR (qalam-progress.js)
   =========================================================================
   Manages the desktop vertical qalam progress bar, mobile horizontal qalam
   progress track, ink-blot step markers, scrubbing, and mobile swipe sync.
   ========================================================================= */

(function () {
    let progressSlides = [];
    let lastHighlightedIdx = -1;
    let milestoneHideTimer = null;
    let isHoveringMarker = false;

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

    function positionQalamProgressBar() {
        const container = document.getElementById("qalam-progress-container");
        if (!container) return;
        if (window.innerWidth <= 900) {
            container.style.left = "";
            container.style.right = "";
            container.style.transform = "";
            return;
        }
        const topTab = document.querySelector("#recipe-top-tab") || document.querySelector(".navbar .nav-links .active");
        if (topTab) {
            const tabRect = topTab.getBoundingClientRect();
            if (tabRect.width > 0) {
                const centerX = tabRect.left + (tabRect.width / 2);
                container.style.left = `${centerX.toFixed(1)}px`;
                container.style.right = "auto";
                container.style.transform = "translate(-50%, -50%)";
            }
        }
    }

    function setupQalamProgressBar() {
        const container = document.getElementById("qalam-progress-container");
        const markersContainer = document.getElementById("qalam-progress-markers");
        const mobileMarkersContainer = document.getElementById("mobile-qalam-progress-markers");
        const track = container ? container.querySelector(".qalam-progress-track") : null;
        const tooltip = document.getElementById("qalam-progress-tooltip");
        if (!container || !markersContainer || !track) return;

        markersContainer.innerHTML = "";
        if (mobileMarkersContainer) {
            mobileMarkersContainer.innerHTML = "";
        }
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

            if (mobileMarkersContainer) {
                const mMarker = document.createElement("div");
                mMarker.className = "mobile-qalam-marker";
                mMarker.setAttribute("data-step-index", idx);
                mMarker.setAttribute("data-title", title);
                mMarker.setAttribute("aria-label", title);
                mMarker.setAttribute("role", "button");
                mMarker.innerHTML = `
                    <div class="qalam-marker-halo" aria-hidden="true"></div>
                    <svg class="ink-blot-svg" viewBox="0 0 20 20" focusable="false" aria-hidden="true">
                        <path class="ink-blot-bleed" d="${blot.bleed}" />
                        <path class="ink-blot-core" d="${blot.core}" />
                    </svg>
                `;
                mMarker.style.left = `${pct}%`;
                mMarker.addEventListener("click", (e) => {
                    e.stopPropagation();
                    slide.scrollIntoView({ behavior: "smooth" });
                });
                mMarker.addEventListener("touchend", (e) => {
                    e.stopPropagation();
                    slide.scrollIntoView({ behavior: "smooth" });
                });
                mobileMarkersContainer.appendChild(mMarker);
            }
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

        positionQalamProgressBar();
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
        const hero = document.querySelector(".hero-section");
        const isMiseEnPlaceFullyInPlace = hero ? (hero.getBoundingClientRect().bottom <= 62) : (rect.top <= 62);
        const isInView = isMiseEnPlaceFullyInPlace && rect.bottom > 120;

        if (!isInView) {
            container.classList.remove("is-visible");
            const mobileSwipeViewport = document.querySelector(".mobile-step-swipe-viewport");
            if (mobileSwipeViewport && window.innerWidth <= 900 && window.RecipeFloatingStage) {
                window.RecipeFloatingStage.updateMobileSwipeStage(mobileSwipeViewport, window.innerHeight * 0.72, progressSlides);
            }
            return;
        }

        container.classList.add("is-visible");
        positionQalamProgressBar();

        const total = progressSlides.length;
        if (total <= 1) {
            if (clipRect) clipRect.setAttribute("height", "240");
            return;
        }

        const isMobile = window.innerWidth <= 900;
        const targetY = isMobile ? window.innerHeight * 0.72 : window.innerHeight * 0.5;
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

        const mobileClip = document.getElementById("mobile-qalam-clip-rect");
        if (mobileClip) {
            const clipW = Math.max(0, Math.min(250, ratio * 250));
            mobileClip.setAttribute("width", clipW.toFixed(1));
        }

        const mobileSwipeViewport = document.querySelector(".mobile-step-swipe-viewport");
        if (mobileSwipeViewport && isMobile && window.RecipeFloatingStage) {
            window.RecipeFloatingStage.updateMobileSwipeStage(mobileSwipeViewport, targetY, progressSlides);
        }

        const mobileTrack = document.getElementById("mobile-qalam-progress-track");
        if (mobileTrack) {
            mobileTrack.setAttribute("aria-valuenow", Math.round(ratio * 100));
            if (!mobileTrack.dataset.listenerAdded) {
                mobileTrack.dataset.listenerAdded = "true";
                const handleScrub = (clientX) => {
                    const bRect = mobileTrack.getBoundingClientRect();
                    const clickX = clientX - bRect.left;
                    const clickRatio = Math.max(0, Math.min(1, clickX / bRect.width));
                    const targetIdx = Math.round(clickRatio * (progressSlides.length - 1));
                    if (progressSlides[targetIdx]) {
                        progressSlides[targetIdx].scrollIntoView({ behavior: "smooth" });
                    }
                };
                mobileTrack.addEventListener("click", (e) => handleScrub(e.clientX));
                mobileTrack.addEventListener("touchmove", (e) => {
                    if (e.touches && e.touches[0]) handleScrub(e.touches[0].clientX);
                }, { passive: true });
            }
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

        const mobileMarkersContainer = document.getElementById("mobile-qalam-progress-markers");
        if (mobileMarkersContainer) {
            const mMarkers = mobileMarkersContainer.querySelectorAll(".mobile-qalam-marker");
            mMarkers.forEach((m, idx) => {
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
        }
    }

    window.RecipeQalamProgress = {
        positionQalamProgressBar,
        setupQalamProgressBar,
        updateQalamProgress
    };
})();
