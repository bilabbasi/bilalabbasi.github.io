/* =========================================================================
   FLOATING INGREDIENT STAGE & APPLE WATCH LENS (floating-stage.js)
   =========================================================================
   Handles structured ingredient/tool aggregation, non-overlapping desktop
   layout, Apple Watch hover lens with depth-of-field blur, mobile 3-state
   tap-to-focus, and vertical swipe step transitions.
   ========================================================================= */

(function () {
    function getFloatingLensConfig() {
        const cfg = (typeof KITCHEN_CONFIG !== 'undefined' && KITCHEN_CONFIG.floatingLens) || {};
        return {
            maxScale: cfg.maxScale ?? 1.75,
            baseScale: cfg.baseScale ?? 0.96,
            radiusPx: cfg.radiusPx ?? 58,
            neighborPushPx: cfg.neighborPushPx ?? 26,
            maxBlurPx: cfg.maxBlurPx ?? 3.5,
            minOpacity: cfg.minOpacity ?? 0.55,
            focusThreshold: cfg.focusThreshold ?? 0.45,
            spring: cfg.spring ?? 0.10,
            heroBaseSizePx: cfg.heroBaseSizePx ?? 74,
            heroPaddingPx: cfg.heroPaddingPx ?? 18,
            stepPaddingPx: cfg.stepPaddingPx ?? 28,
            mobileFocusScale: cfg.mobileFocusScale ?? 1.42,
            mobileBgBlurPx: cfg.mobileBgBlurPx ?? 3.5,
            mobileBgOpacity: cfg.mobileBgOpacity ?? 0.38,
            mobileFocusDurationMs: cfg.mobileFocusDurationMs ?? 280,
            mobileSwipeFadeFactor: cfg.mobileSwipeFadeFactor ?? 1.15
        };
    }

    function applyFloatingLensCssVars(rootEl) {
        if (!rootEl) return;
        const lensCfg = getFloatingLensConfig();
        rootEl.style.setProperty('--mobile-focus-scale', String(lensCfg.mobileFocusScale));
        rootEl.style.setProperty('--mobile-bg-blur', `${lensCfg.mobileBgBlurPx}px`);
        rootEl.style.setProperty('--mobile-bg-opacity', String(lensCfg.mobileBgOpacity));
        rootEl.style.setProperty('--mobile-focus-duration', `${lensCfg.mobileFocusDurationMs}ms`);
    }

    function parseAmount(val) {
        if (typeof val === "number") return Number.isFinite(val) ? val : NaN;
        if (typeof val !== "string") return NaN;
        const trimmed = val.trim();
        if (!trimmed) return NaN;
        if (/^\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
        const fracMatch = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/);
        if (fracMatch) {
            const den = Number(fracMatch[2]);
            return den > 0 ? Number(fracMatch[1]) / den : NaN;
        }
        const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
        if (mixedMatch) {
            const den = Number(mixedMatch[3]);
            return den > 0 ? Number(mixedMatch[1]) + Number(mixedMatch[2]) / den : NaN;
        }
        return NaN;
    }

    function formatSummedAmount(sum, preferFraction) {
        const rounded = Math.round(sum * 100) / 100;
        if (preferFraction) {
            const whole = Math.floor(rounded);
            const rem = Math.round((rounded - whole) * 100) / 100;
            const fracMap = { 0.25: "1/4", 0.5: "1/2", 0.75: "3/4", 0.33: "1/3", 0.67: "2/3" };
            if (rem === 0) return String(whole);
            if (fracMap[rem]) return whole > 0 ? `${whole} ${fracMap[rem]}` : fracMap[rem];
        }
        return String(rounded);
    }

    function hasCompleteAssets(items, recipe) {
        if (!Array.isArray(items) || items.length === 0) return false;
        const catalog = (typeof INGREDIENT_CATALOG !== "undefined") ? INGREDIENT_CATALOG : null;
        const existingSet = (catalog && Array.isArray(catalog.existingAssets))
            ? new Set(catalog.existingAssets)
            : null;

        const allItemsReady = items.every(item => {
            if (!item.rawImgSrc) return false;
            if (existingSet && !existingSet.has(item.rawImgSrc)) return false;
            return true;
        });
        if (!allItemsReady) return false;

        // Every step must declare at least one ingredient or tool so no step renders a blank stage
        const steps = (recipe && Array.isArray(recipe.steps)) ? recipe.steps : [];
        return steps.length > 0 && steps.every(sec =>
            sec && typeof sec === "object" && (
                (Array.isArray(sec.ingredients) && sec.ingredients.length > 0) ||
                (Array.isArray(sec.tools) && sec.tools.length > 0)
            )
        );
    }

    function collectRecipeItems(recipe, resolveImagePath) {
        const catalog = (typeof INGREDIENT_CATALOG !== "undefined") ? INGREDIENT_CATALOG : { ingredients: {}, tools: {}, units: {} };
        const byId = new Map();

        (recipe.steps || []).forEach((sec, idx) => {
            if (!sec || typeof sec !== 'object') return;
            const stepNum = idx + 1;

            (sec.tools || []).forEach(toolKey => {
                const id = `tool:${toolKey}`;
                const tool = (catalog.tools && catalog.tools[toolKey]) || { en: String(toolKey).replace(/_/g, " "), ur: "", image: "" };
                if (!byId.has(id)) {
                    byId.set(id, {
                        id,
                        kind: "tool",
                        en: tool.en,
                        ur: tool.ur || tool.en,
                        form: "vessel",
                        rawImgSrc: tool.image || "",
                        imgSrc: tool.image ? resolveImagePath(tool.image) : "",
                        totalQtyEn: "",
                        totalQtyUr: "",
                        perStep: {},
                        _totals: []
                    });
                }
                const rec = byId.get(id);
                rec.perStep[stepNum] = { qtyEn: "", qtyUr: "" };
            });

            (sec.ingredients || []).forEach(entry => {
                const nameKey = entry.name || entry.id || "";
                const item = (catalog.ingredients && catalog.ingredients[nameKey]) || { en: String(nameKey).replace(/_/g, " "), ur: "", forms: {}, default_form: "whole" };
                const form = entry.form || entry.mode || item.default_form || "whole";
                const id = `ing:${nameKey}:${form}`;
                const rawImg = (item.forms && item.forms[form]) ? item.forms[form] : "";
                const unitKey = entry.unit || "";
                const unitObj = (catalog.units && catalog.units[unitKey]) || null;
                const amountVal = (entry.amount !== undefined && entry.amount !== null) ? entry.amount : "";
                const amountRaw = String(amountVal).trim();
                const amountNum = parseAmount(amountVal);
                const qtyEn = [amountRaw, unitObj ? unitObj.en : unitKey].filter(Boolean).join(" ");
                const qtyUr = [amountRaw, unitObj ? unitObj.ur : unitKey].filter(Boolean).join(" ");

                if (!byId.has(id)) {
                    byId.set(id, {
                        id,
                        kind: "ingredient",
                        en: item.en,
                        ur: item.ur || item.en,
                        form,
                        rawImgSrc: rawImg,
                        imgSrc: rawImg ? resolveImagePath(rawImg) : "",
                        totalQtyEn: "",
                        totalQtyUr: "",
                        perStep: {},
                        _totals: []
                    });
                }
                const rec = byId.get(id);
                rec.perStep[stepNum] = { qtyEn, qtyUr };
                rec._totals.push({ amountNum, amountRaw, unitKey, unitObj });
            });
        });

        const items = Array.from(byId.values());
        items.forEach(rec => {
            if (rec.kind === "ingredient" && rec._totals.length > 0) {
                if (rec._totals.length === 1) {
                    const only = rec._totals[0];
                    rec.totalQtyEn = [only.amountRaw, only.unitObj ? only.unitObj.en : only.unitKey].filter(Boolean).join(" ");
                    rec.totalQtyUr = [only.amountRaw, only.unitObj ? only.unitObj.ur : only.unitKey].filter(Boolean).join(" ");
                } else {
                    const firstUnit = rec._totals[0].unitKey;
                    const allSameUnit = rec._totals.every(t => t.unitKey === firstUnit && !Number.isNaN(t.amountNum));
                    if (allSameUnit) {
                        const sum = rec._totals.reduce((acc, t) => acc + t.amountNum, 0);
                        const preferFraction = rec._totals.some(t => t.amountRaw.includes("/"));
                        const formatted = formatSummedAmount(sum, preferFraction);
                        const unitObj = rec._totals[0].unitObj;
                        rec.totalQtyEn = [formatted, unitObj ? unitObj.en : firstUnit].filter(Boolean).join(" ");
                        rec.totalQtyUr = [formatted, unitObj ? unitObj.ur : firstUnit].filter(Boolean).join(" ");
                    } else {
                        const uniqueEn = [...new Set(rec._totals.map(t => `${t.amountRaw} ${t.unitObj ? t.unitObj.en : t.unitKey}`.trim()).filter(Boolean))];
                        const uniqueUr = [...new Set(rec._totals.map(t => `${t.amountRaw} ${t.unitObj ? t.unitObj.ur : t.unitKey}`.trim()).filter(Boolean))];
                        rec.totalQtyEn = uniqueEn.join(" + ");
                        rec.totalQtyUr = uniqueUr.join(" + ");
                    }
                }
            }
            delete rec._totals;
        });
        return items;
    }

    function layoutFloatingStage(stage, { activeOnly = false } = {}) {
        if (!stage || window.innerWidth <= 900) return;
        const W = stage.clientWidth;
        const H = stage.clientHeight;
        if (W < 120 || H < 120) return;

        const selector = activeOnly ? '.floating-item.is-active' : '.floating-item';
        const nodes = Array.from(stage.querySelectorAll(selector));
        const count = nodes.length;
        if (count === 0) return;

        const seedStr = (stage.getAttribute('data-seed') || 'recipe') + (activeOnly ? `:${count}` : '');
        let seed = 2166136261;
        for (let i = 0; i < seedStr.length; i++) {
            seed ^= seedStr.charCodeAt(i);
            seed = Math.imul(seed, 16777619);
        }
        const rand = () => {
            seed |= 0;
            seed = (seed + 0x6D2B79F5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };

        const lensCfg = getFloatingLensConfig();
        const heroBase = lensCfg.heroBaseSizePx;
        const baseSize = activeOnly
            ? (count <= 3 ? 136 : count <= 5 ? 116 : count <= 8 ? 92 : 72)
            : (count > 15 ? Math.round(heroBase * 0.72) : count > 10 ? Math.round(heroBase * 0.88) : heroBase);
        const usableH = Math.max(160, H);
        const cols = activeOnly
            ? Math.max(2, Math.min(3, Math.ceil(Math.sqrt(count * (W / usableH)))))
            : Math.max(3, Math.ceil(Math.sqrt(count * (W / usableH))));
        const rows = Math.max(1, Math.ceil(count / cols));

        const slots = [];
        if (activeOnly) {
            const marginX = Math.min(72, W * 0.12);
            const marginY = Math.min(64, usableH * 0.12);
            const basePerRow = Math.floor(count / rows);
            const extra = count % rows;
            for (let r = 0; r < rows; r++) {
                const rowCount = basePerRow + (r < extra ? 1 : 0);
                const y = ((r + 0.5) / rows) * (usableH - marginY * 2) + marginY;
                for (let c = 0; c < rowCount; c++) {
                    const x = ((c + 0.5) / rowCount) * (W - marginX * 2) + marginX;
                    slots.push({
                        x: x + (rand() - 0.5) * 14,
                        y: y + (rand() - 0.5) * 12
                    });
                }
            }
        } else {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    slots.push({
                        x: ((c + 0.5) / cols) * (W - 100) + 50 + (rand() - 0.5) * 28,
                        y: ((r + 0.5) / rows) * (usableH - 80) + 40 + (rand() - 0.5) * 22
                    });
                }
            }
            for (let i = slots.length - 1; i > 0; i--) {
                const j = Math.floor(rand() * (i + 1));
                [slots[i], slots[j]] = [slots[j], slots[i]];
            }
        }

        const boxes = nodes.map((el, idx) => {
            const kind = el.classList.contains('floating-item-tool') ? 'tool' : 'ingredient';
            const sizePx = kind === 'tool'
                ? Math.round(baseSize * 1.16)
                : Math.round(baseSize * (0.92 + rand() * 0.18));
            el.style.setProperty('--item-size', `${sizePx}px`);
            const nameEl = el.querySelector('.floating-item-name');
            const qtyEl = el.querySelector('.floating-item-qty');
            const captionW = Math.max(nameEl ? nameEl.scrollWidth * 0.5 : 0, qtyEl ? qtyEl.scrollWidth * 0.5 : 0);
            const w = Math.max(sizePx, captionW, 84);
            const h = sizePx + 46;
            const slot = slots[idx % slots.length];
            return { el, w, h, x: slot.x, y: slot.y };
        });

        const padX = activeOnly ? lensCfg.stepPaddingPx : lensCfg.heroPaddingPx;
        const padY = activeOnly ? 22 : 14;
        for (let iter = 0; iter < 240; iter++) {
            for (let i = 0; i < boxes.length; i++) {
                for (let j = i + 1; j < boxes.length; j++) {
                    const a = boxes[i];
                    const b = boxes[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const minX = (a.w + b.w) * 0.5 + padX;
                    const minY = (a.h + b.h) * 0.5 + padY;
                    const overlapX = minX - Math.abs(dx);
                    const overlapY = minY - Math.abs(dy);
                    if (overlapX > 0 && overlapY > 0) {
                        if (overlapX < overlapY) {
                            const dir = dx >= 0 ? 1 : -1;
                            const push = overlapX * 0.55;
                            a.x -= dir * push;
                            b.x += dir * push;
                        } else {
                            const dir = dy >= 0 ? 1 : -1;
                            const push = overlapY * 0.55;
                            a.y -= dir * push;
                            b.y += dir * push;
                        }
                    }
                }
                const halfW = boxes[i].w * 0.5 + 10;
                const halfH = boxes[i].h * 0.5 + 8;
                boxes[i].x = Math.max(halfW, Math.min(W - halfW, boxes[i].x));
                boxes[i].y = Math.max(halfH, Math.min(usableH - halfH, boxes[i].y));
            }
        }

        boxes.forEach(b => {
            b.el.style.left = `${Math.round(b.x)}px`;
            b.el.style.top = `${Math.round(b.y)}px`;
        });
    }

    function formatFloatingItemLabel(item) {
        const implicitForms = new Set(["whole", "dry", "liquid", "powder", "melted", "granulated"]);
        if (item.kind === "tool" || !item.form || implicitForms.has(item.form)) {
            return item.en;
        }
        return `${item.en} (${item.form})`;
    }

    function buildFloatingMediaHtml(item) {
        if (!item.imgSrc) {
            return `<div class="floating-item-placeholder"><span>${item.form}</span></div>`;
        }
        return `<img src="${item.imgSrc}" alt="${item.en} (${item.form})" class="floating-item-img" decoding="sync" loading="eager" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="floating-item-placeholder" style="display:none"><span>${item.form}</span></div>`;
    }

    function renderFloatingStageHtml(items, { isStepStage, seedKey }) {
        const itemsHtml = items.map(item => {
            const mediaHtml = buildFloatingMediaHtml(item);
            const stepKeys = Object.keys(item.perStep).join(",");
            const stepDataAttr = isStepStage
                ? `data-step-map='${JSON.stringify(item.perStep).replace(/'/g, "&#39;")}' data-total-qty-en="${item.totalQtyEn}" data-total-qty-ur="${item.totalQtyUr}" data-steps="${stepKeys}"`
                : "";
            const enLabel = formatFloatingItemLabel(item);

            return `
                <button type="button"
                    class="floating-item floating-item-${item.kind} is-active"
                    data-en-name="${enLabel}"
                    data-ur-name="${item.ur}"
                    data-current-qty-en="${item.totalQtyEn}"
                    data-current-qty-ur="${item.totalQtyUr}"
                    aria-pressed="false"
                    ${stepDataAttr}>
                    <div class="floating-item-media">${mediaHtml}</div>
                    <span class="floating-item-name">${enLabel}</span>
                    <span class="floating-item-qty">${item.totalQtyEn}</span>
                </button>
            `;
        }).join("");

        const hintHtml = !isStepStage
            ? `<p class="floating-stage-hint">select any ingredient for <span dir="rtl" lang="ur">اردو</span></p>`
            : "";

        return `
            <div class="floating-stage ${isStepStage ? 'is-step-stage' : 'is-hero-stage'}" data-seed="${seedKey}">
                ${itemsHtml}
            </div>
            ${hintHtml}
        `;
    }

    function renderMobileSwipeStageHtml(items, totalSteps) {
        const panes = [];
        for (let stepNum = 1; stepNum <= totalSteps; stepNum++) {
            const stepItems = items.filter(it => Boolean(it.perStep[stepNum]));
            const cardsHtml = stepItems.map(item => {
                const stepEntry = item.perStep[stepNum];
                const mediaHtml = buildFloatingMediaHtml(item);
                const enLabel = formatFloatingItemLabel(item);

                return `
                    <button type="button"
                        class="floating-item floating-item-${item.kind} is-active"
                        data-en-name="${enLabel}"
                        data-ur-name="${item.ur}"
                        data-current-qty-en="${stepEntry.qtyEn}"
                        data-current-qty-ur="${stepEntry.qtyUr}"
                        aria-pressed="false">
                        <div class="floating-item-media">${mediaHtml}</div>
                        <span class="floating-item-name">${enLabel}</span>
                        <span class="floating-item-qty">${stepEntry.qtyEn}</span>
                    </button>
                `;
            }).join("");
            panes.push(`<div class="mobile-step-pane" data-mobile-step="${stepNum}">${cardsHtml}</div>`);
        }
        return `
            <div class="mobile-step-swipe-viewport" data-total-steps="${totalSteps}">
                <div class="mobile-step-swipe-track">${panes.join("")}</div>
            </div>
        `;
    }

    function setFloatingItemUrdu(item, isUrdu) {
        item.classList.toggle('is-urdu', isUrdu);
        item.setAttribute('aria-pressed', isUrdu ? 'true' : 'false');
        const nameEl = item.querySelector('.floating-item-name');
        const qtyEl = item.querySelector('.floating-item-qty');
        if (nameEl) {
            nameEl.textContent = isUrdu ? (item.getAttribute('data-ur-name') || '') : (item.getAttribute('data-en-name') || '');
            if (isUrdu) { nameEl.setAttribute('dir', 'rtl'); nameEl.setAttribute('lang', 'ur'); }
            else { nameEl.removeAttribute('dir'); nameEl.removeAttribute('lang'); }
        }
        if (qtyEl) {
            qtyEl.textContent = isUrdu ? (item.getAttribute('data-current-qty-ur') || '') : (item.getAttribute('data-current-qty-en') || '');
            if (isUrdu) { qtyEl.setAttribute('dir', 'rtl'); qtyEl.setAttribute('lang', 'ur'); }
            else { qtyEl.removeAttribute('dir'); qtyEl.removeAttribute('lang'); }
        }
    }

    function toggleFloatingItemUrdu(item) {
        setFloatingItemUrdu(item, !item.classList.contains('is-urdu'));
    }

    function clearMobileFocus(scope) {
        (scope || document).querySelectorAll('.has-mobile-focus').forEach(el => {
            el.classList.remove('has-mobile-focus');
        });
        (scope || document).querySelectorAll('.floating-item.is-mobile-focused').forEach(el => {
            el.classList.remove('is-mobile-focused');
            setFloatingItemUrdu(el, false);
        });
    }

    function handleMobileItemTap(container, item) {
        if (!item) {
            clearMobileFocus(container);
            return;
        }
        if (item.classList.contains('is-mobile-focused')) {
            clearMobileFocus(document);
        } else {
            clearMobileFocus(document);
            container.classList.add('has-mobile-focus');
            item.classList.add('is-mobile-focused');
            setFloatingItemUrdu(item, true);
        }
    }

    if (!document.documentElement.dataset.mobileFocusOutsideBound) {
        document.documentElement.dataset.mobileFocusOutsideBound = "true";
        document.addEventListener('click', (e) => {
            if (window.innerWidth > 900) return;
            if (!e.target.closest('.floating-item')) {
                clearMobileFocus(document);
            }
        });
    }

    function bindMobileSwipeUrduToggles(rootEl) {
        const viewport = rootEl.querySelector('.mobile-step-swipe-viewport');
        if (!viewport || viewport.dataset.bound) return;
        viewport.dataset.bound = "true";
        viewport.addEventListener('click', (e) => {
            const item = e.target.closest('.floating-item');
            const pane = item ? item.closest('.mobile-step-pane') : viewport;
            if (pane) handleMobileItemTap(pane, item);
        });
    }

    function bindFloatingStageInteractions(rootEl) {
        const stage = rootEl.querySelector('.floating-stage');
        if (!stage || stage.dataset.floatingBound) return;
        stage.dataset.floatingBound = "true";

        stage.addEventListener('click', (e) => {
            const item = e.target.closest('.floating-item');
            if (window.innerWidth <= 900) {
                if (item && item.classList.contains('is-inactive')) return;
                handleMobileItemTap(stage, item);
                return;
            }
            if (!item || item.classList.contains('is-inactive')) return;
            toggleFloatingItemUrdu(item);
        });

        const finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!finePointer) return;

        let pointerX = null;
        let pointerY = null;
        let rafId = null;
        const animState = new WeakMap();

        function stepAppleWatchLens() {
            const lensCfg = getFloatingLensConfig();
            const { maxScale, baseScale, radiusPx: sigma, neighborPushPx: pushPx, maxBlurPx, minOpacity, focusThreshold, spring } = lensCfg;

            const items = stage.querySelectorAll('.floating-item:not(.is-inactive)');
            let anyMoving = false;
            const twoSigmaSq = 2 * sigma * sigma;

            let peakFocus = 0;
            let peakItem = null;
            const foci = [];
            items.forEach(item => {
                let st = animState.get(item);
                if (!st) {
                    st = { scale: 1, dx: 0, dy: 0, blur: 0, opacity: 1, textOpacity: 1 };
                    animState.set(item, st);
                }
                let g = 0;
                let vx = 0;
                let vy = 0;
                let dist = Infinity;
                if (pointerX !== null && pointerY !== null) {
                    const rect = item.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2 - st.dx;
                    const cy = rect.top + rect.height / 2 - st.dy;
                    vx = cx - pointerX;
                    vy = cy - pointerY;
                    dist = Math.hypot(vx, vy);
                    g = Math.exp(-(dist * dist) / twoSigmaSq);
                    if (g > peakFocus) {
                        peakFocus = g;
                        peakItem = item;
                    }
                }
                foci.push({ item, st, g, vx, vy, dist });
            });

            foci.forEach(({ item, st, g, vx, vy, dist }) => {
                let targetScale = 1;
                let targetDx = 0;
                let targetDy = 0;
                let targetBlur = 0;
                let targetOpacity = 1;
                let targetTextOpacity = 1;
                let z = 1;

                if (pointerX !== null && pointerY !== null) {
                    const isWinner = item === peakItem && peakFocus >= focusThreshold;
                    const plateauG = g >= 0.68 ? 1 : g / 0.68;
                    targetScale = baseScale + (maxScale - baseScale) * plateauG;

                    if (pushPx > 0 && !isWinner && g < focusThreshold && dist > 4 && dist < sigma * 2.5) {
                        const push = pushPx * g * (1 - g) * 4;
                        targetDx = (vx / dist) * push;
                        targetDy = (vy / dist) * push;
                    }
                    const bgWeight = isWinner ? 0 : Math.max(0, Math.min(1, (focusThreshold - g) / Math.max(0.01, focusThreshold))) * peakFocus;
                    const captionFade = isWinner ? 1 : Math.max(0, 1 - peakFocus * 1.35);
                    targetBlur = maxBlurPx * bgWeight;
                    targetOpacity = 1 - (1 - minOpacity) * bgWeight;
                    targetTextOpacity = captionFade;
                    z = isWinner ? 40 : Math.round(1 + plateauG * 25);
                }

                st.scale += (targetScale - st.scale) * spring;
                st.dx += (targetDx - st.dx) * spring;
                st.dy += (targetDy - st.dy) * spring;
                st.blur += (targetBlur - st.blur) * spring;
                st.opacity += (targetOpacity - st.opacity) * spring;
                st.textOpacity += (targetTextOpacity - st.textOpacity) * spring;

                if (
                    Math.abs(targetScale - st.scale) > 0.002 ||
                    Math.abs(targetDx - st.dx) > 0.15 ||
                    Math.abs(targetDy - st.dy) > 0.15 ||
                    Math.abs(targetBlur - st.blur) > 0.03 ||
                    Math.abs(targetOpacity - st.opacity) > 0.005 ||
                    Math.abs(targetTextOpacity - st.textOpacity) > 0.005
                ) {
                    anyMoving = true;
                }

                item.style.setProperty('--dock-scale', st.scale.toFixed(3));
                item.style.setProperty('--dock-dx', `${st.dx.toFixed(1)}px`);
                item.style.setProperty('--dock-dy', `${st.dy.toFixed(1)}px`);
                item.style.setProperty('--dock-blur', `${st.blur.toFixed(2)}px`);
                item.style.setProperty('--dock-opacity', st.opacity.toFixed(3));
                item.style.setProperty('--dock-text-opacity', st.textOpacity.toFixed(3));
                item.style.setProperty('--dock-z', String(z));
            });

            if (anyMoving || pointerX !== null) {
                rafId = requestAnimationFrame(stepAppleWatchLens);
            } else {
                rafId = null;
            }
        }

        stage.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 900) return;
            pointerX = e.clientX;
            pointerY = e.clientY;
            if (!rafId) {
                rafId = requestAnimationFrame(stepAppleWatchLens);
            }
        });

        stage.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 900) return;
            pointerX = null;
            pointerY = null;
            if (!rafId) {
                rafId = requestAnimationFrame(stepAppleWatchLens);
            }
        });
    }

    function updateMobileSwipeStage(mobileSwipeViewport, targetY, progressSlides) {
        const stepSlides = (progressSlides || []).slice(1);
        if (stepSlides.length === 0) return;

        const centers = stepSlides.map(s => {
            const r = s.getBoundingClientRect();
            return r.top + r.height / 2;
        });

        const firstTop = stepSlides[0].getBoundingClientRect().top;
        const fadeStart = window.innerHeight * 0.98;
        const fadeEnd = window.innerHeight * 0.68;
        const stageOpacity = Math.max(0, Math.min(1, (fadeStart - firstTop) / Math.max(1, fadeStart - fadeEnd)));

        let swipeIdx = 0;
        if (targetY <= centers[0]) {
            swipeIdx = 0;
        } else if (targetY >= centers[centers.length - 1]) {
            swipeIdx = centers.length - 1;
        } else {
            for (let i = 0; i < centers.length - 1; i++) {
                if (targetY >= centers[i] && targetY <= centers[i + 1]) {
                    const span = centers[i + 1] - centers[i];
                    swipeIdx = i + (span > 0 ? (targetY - centers[i]) / span : 0);
                    break;
                }
            }
        }

        mobileSwipeViewport.style.setProperty("--mobile-stage-opacity", stageOpacity.toFixed(3));
        mobileSwipeViewport.style.setProperty("--mobile-swipe-idx", swipeIdx.toFixed(4));

        const fadeFactor = getFloatingLensConfig().mobileSwipeFadeFactor;
        const panes = mobileSwipeViewport.querySelectorAll(".mobile-step-pane");
        panes.forEach((pane, idx) => {
            const dist = Math.abs(idx - swipeIdx);
            const paneOpacity = Math.max(0, Math.min(1, 1 - dist * fadeFactor));
            pane.style.opacity = paneOpacity.toFixed(3);
        });
    }

    function updateStickyFloatingLayer(floatingStageLayer, stepNum) {
        floatingStageLayer.classList.add('active');
        const effectiveStep = stepNum <= 0 ? 1 : stepNum;
        const items = floatingStageLayer.querySelectorAll('.floating-stage.is-step-stage .floating-item');
        items.forEach(item => {
            const stepMap = JSON.parse(item.getAttribute('data-step-map') || '{}');
            const qtyEl = item.querySelector('.floating-item-qty');
            const isUrdu = item.classList.contains('is-urdu');

            if (stepMap[effectiveStep]) {
                item.classList.add('is-active');
                item.classList.remove('is-inactive');
                const qEn = stepMap[effectiveStep].qtyEn || '';
                const qUr = stepMap[effectiveStep].qtyUr || '';
                item.setAttribute('data-current-qty-en', qEn);
                item.setAttribute('data-current-qty-ur', qUr);
                if (qtyEl) qtyEl.textContent = isUrdu ? qUr : qEn;
            } else {
                item.classList.remove('is-active');
                item.classList.add('is-inactive');
            }
        });
        const stage = floatingStageLayer.querySelector('.floating-stage');
        layoutFloatingStage(stage, { activeOnly: true });
    }

    window.RecipeFloatingStage = {
        getFloatingLensConfig,
        applyFloatingLensCssVars,
        parseAmount,
        formatSummedAmount,
        hasCompleteAssets,
        collectRecipeItems,
        layoutFloatingStage,
        renderFloatingStageHtml,
        renderMobileSwipeStageHtml,
        bindFloatingStageInteractions,
        bindMobileSwipeUrduToggles,
        updateMobileSwipeStage,
        updateStickyFloatingLayer
    };
})();
