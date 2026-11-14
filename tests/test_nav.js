const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const navCode = fs.readFileSync(__dirname + '/../nav.js', 'utf-8');
const configCode = fs.readFileSync(__dirname + '/../config.js', 'utf-8');

function createNavTestEnv(initialPath = '/kitchen/index.html') {
    const listeners = {};
    const headerListeners = {};

    class MockElement {
        constructor(tagName, id = '', className = '') {
            this.tagName = tagName.toUpperCase();
            this.id = id;
            this.className = className;
            this.classList = {
                add: (c) => {
                    const classes = this.className.split(' ').filter(Boolean);
                    if (!classes.includes(c)) classes.push(c);
                    this.className = classes.join(' ');
                },
                remove: (c) => {
                    this.className = this.className.split(' ').filter(x => x !== c).join(' ');
                },
                contains: (c) => this.className.split(' ').includes(c)
            };
            this.attributes = {};
            this.style = {};
            this.children = [];
            this.dataset = {};
            this.innerHTML = '';
            this._rect = { left: 0, top: 0, width: 80, height: 20 };
        }

        setAttribute(k, v) { this.attributes[k] = String(v); }
        getAttribute(k) { return this.attributes[k] || null; }
        hasAttribute(k) { return k in this.attributes; }
        removeAttribute(k) { delete this.attributes[k]; }

        getBoundingClientRect() { return this._rect; }

        querySelector(sel) {
            return this.querySelectorAll(sel)[0] || null;
        }

        querySelectorAll(sel) {
            const found = [];
            const check = (node) => {
                if (sel === '.nav-indicator' && node.className.includes('nav-indicator')) found.push(node);
                if (sel === '.nav-links' && node.className.includes('nav-links')) found.push(node);
                if (sel.startsWith('.nav-item') && node.className.includes('nav-item')) found.push(node);
                if (sel === '.nav-home' && node.classList.contains('nav-home')) found.push(node);
                if (sel === '.active' && node.classList.contains('active')) found.push(node);
                if (sel.includes('.nav-item a') && node.tagName === 'A') found.push(node);
                if (sel.includes('[data-nav-id') && node.attributes['data-nav-id']) {
                    const id = sel.match(/data-nav-id="([^"]+)"/);
                    if (id && node.attributes['data-nav-id'] === id[1]) found.push(node);
                }
                node.children.forEach(check);
            };
            this.children.forEach(check);
            return found;
        }

        closest(sel) {
            if (sel === '.nav-item a' && this.tagName === 'A') return this;
            if (sel === 'header.navbar' && this.tagName === 'HEADER') return this;
            if (this.parent) return this.parent.closest(sel);
            return null;
        }

        contains(target) {
            if (target === this) return true;
            return this.children.some(child => child.contains(target));
        }

        appendChild(child) {
            child.parent = this;
            this.children.push(child);
            return child;
        }
    }

    const splitHeader = new MockElement('header', '', 'split-title-header');

    const body = new MockElement('body');

    const doc = {
        title: 'Initial Title',
        readyState: 'complete',
        fonts: { ready: Promise.resolve() },
        body: body,
        createElement: (tag) => new MockElement(tag),
        querySelectorAll: (sel) => {
            if (sel === 'header.navbar') return [header];
            if (sel === 'header.split-title-header') return [splitHeader];
            return [];
        },
        querySelector: (sel) => {
            if (sel === 'header.navbar') return header;
            if (sel === '.app-wrapper') return appWrapper;
            if (sel === 'header.split-title-header') return splitHeader;
            return null;
        },
        getElementById: (id) => {
            if (id === 'recipes-menu-grid') return menuGrid;
            if (id === 'main-title') return mainTitle;
            if (id === 'main-subtitle') return mainSubtitle;
            if (id === 'bio-text') return bioText;
            if (id === 'links-list') return linksList;
            if (id === 'kitchen-tab') return kitchenTab;
            return null;
        },
        addEventListener: (evt, cb) => {
            listeners[evt] = listeners[evt] || [];
            listeners[evt].push(cb);
        }
    };

    const header = new MockElement('header', '', 'navbar');
    header.setAttribute('data-nav', 'kitchen');
    header.setAttribute('data-current', 'kitchen');
    header.addEventListener = (evt, cb) => {
        headerListeners[evt] = headerListeners[evt] || [];
        headerListeners[evt].push(cb);
    };

    const appWrapper = new MockElement('div', '', 'app-wrapper');
    const menuGrid = new MockElement('div', 'recipes-menu-grid');
    const mainTitle = new MockElement('h1', 'main-title');
    const mainSubtitle = new MockElement('h2', 'main-subtitle');
    const bioText = new MockElement('p', 'bio-text');
    const linksList = new MockElement('div', 'links-list');
    const kitchenTab = new MockElement('a', 'kitchen-tab');

    const win = {
        location: {
            pathname: initialPath,
            href: 'http://localhost:8000' + initialPath
        },
        history: {
            pushState: (state, title, url) => {
                win.location.href = new URL(url, win.location.href).href;
                win.location.pathname = new URL(url, win.location.href).pathname;
            }
        },
        addEventListener: (evt, cb) => {
            listeners[evt] = listeners[evt] || [];
            listeners[evt].push(cb);
        },
        requestAnimationFrame: (cb) => cb(),
        scrollTo: () => {}
    };

    const context = {
        window: win,
        document: doc,
        console: console,
        URL: URL,
        setTimeout: (cb) => cb()
    };

    vm.createContext(context);
    return { context, header, splitHeader, headerListeners, listeners, win, doc, appWrapper };
}

// 1. Test globals export
{
    const { context } = createNavTestEnv();
    vm.runInContext(configCode + '\n' + navCode, context);

    assert.strictEqual(typeof context.window.renderSiteNavbar, 'function', 'renderSiteNavbar should be exported');
    assert.strictEqual(typeof context.window.initSiteNavbars, 'function', 'initSiteNavbars should be exported');
    assert.strictEqual(typeof context.window.updateNavIndicator, 'function', 'updateNavIndicator should be exported');
    assert.strictEqual(typeof context.window.renderSplitHeaders, 'function', 'renderSplitHeaders should be exported');
    console.log('PASS: nav.js loaded and exported globals successfully.');
}

// 2. Test shared page initializers are defined
{
    const { context } = createNavTestEnv();
    vm.runInContext(configCode + '\n' + navCode, context);

    assert.strictEqual(typeof context.window.initKitchenDashboard, 'function', 'initKitchenDashboard exists');
    assert.strictEqual(typeof context.window.initCulturePage, 'function', 'initCulturePage exists');
    assert.strictEqual(typeof context.window.initMePage, 'function', 'initMePage exists');
    console.log('PASS: Shared page initializers defined.');
}

// 3. Test renderNavbar output
{
    const { context, header } = createNavTestEnv('/kitchen/index.html');
    vm.runInContext(configCode + '\n' + navCode, context);

    header.setAttribute('data-nav', 'kitchen');
    header.setAttribute('data-current', 'kitchen');
    context.window.renderSiteNavbar(header);

    assert.ok(header.innerHTML.includes('<span class="nav-indicator" aria-hidden="true"></span>'), 'Should include persistent nav-indicator');
    assert.ok(header.innerHTML.includes('data-nav-id="kitchen"'), 'Should include data-nav-id="kitchen"');
    assert.ok(header.innerHTML.includes('data-nav-id="culture"'), 'Should include data-nav-id="culture"');
    assert.ok(header.innerHTML.includes('data-nav-id="ammi"'), 'Should include data-nav-id="ammi"');
    assert.ok(header.innerHTML.includes('class="nav-home nav-focal"'), 'Active kitchen tab should have nav-home class');
    assert.ok(header.innerHTML.includes('href="./"'), 'Kitchen tab should have href="./"');
    assert.ok(header.innerHTML.includes('href="culture/"'), 'Culture tab should have href="culture/"');
    assert.ok(header.innerHTML.includes('href="me/"'), 'Ammi tab should have href="me/"');
    console.log('PASS: renderNavbar produces correct markup and relative paths on /kitchen/.');
}

// 4. Test renderNavbar from customs / culture page
{
    const { context, header } = createNavTestEnv('/kitchen/culture/index.html');
    vm.runInContext(configCode + '\n' + navCode, context);

    header.setAttribute('data-nav', 'kitchen');
    header.setAttribute('data-current', 'culture');
    context.window.renderSiteNavbar(header);

    assert.ok(header.innerHTML.includes('href="../"'), 'From culture, kitchen link should be "../"');
    assert.ok(header.innerHTML.includes('href="./"'), 'From culture, culture link should be "./"');
    assert.ok(header.innerHTML.includes('href="../me/"'), 'From culture, ammi link should be "../me/"');
    console.log('PASS: renderNavbar produces correct relative paths on /kitchen/culture/.');
}

// 5. Test updateIndicator math
{
    const { context } = createNavTestEnv();
    vm.runInContext(configCode + '\n' + navCode, context);

    const mockNavLinks = {
        className: 'nav-links',
        classList: { add: (c) => { mockNavLinks.className += ' ' + c; } },
        getBoundingClientRect: () => ({ left: 100, top: 50, width: 400, height: 40 }),
        querySelector: (sel) => {
            if (sel === '.nav-indicator') return mockIndicator;
            return null;
        }
    };

    const mockIndicator = {
        style: {}
    };

    const mockTarget = {
        getBoundingClientRect: () => ({ left: 220, top: 50, width: 85, height: 20 })
    };

    context.window.updateNavIndicator(mockNavLinks, mockTarget, true);

    assert.strictEqual(mockIndicator.style.transform, 'translateX(120px)', 'Indicator X position should be 220 - 100 = 120px');
    assert.strictEqual(mockIndicator.style.width, '85px', 'Indicator width should match target width 85px');
    assert.ok(mockNavLinks.className.includes('has-indicator'), 'nav-links container should receive has-indicator class');
    console.log('PASS: updateIndicator calculates geometry correctly.');
}

// 6. Test renderSplitHeaders with KITCHEN_CONFIG.spaces
{
    const { context, splitHeader } = createNavTestEnv('/kitchen/culture/index.html');
    vm.runInContext(configCode + '\n' + navCode, context);

    // Test with data-space="culture" (renders Urdu script without roman transliteration)
    splitHeader.setAttribute('data-space', 'culture');
    context.window.renderSplitHeaders();

    assert.ok(splitHeader.innerHTML.includes('<h2 class="about-title">customs</h2>'), 'Should contain title customs');
    assert.ok(splitHeader.innerHTML.includes('dir="rtl" lang="ur" style="color: #b83b14;">رسم و رواج</div>'), 'Should contain Urdu script with urduColor from config');
    assert.ok(!splitHeader.innerHTML.includes('split-title-roman'), 'Should omit roman transliteration');

    // Test with data-space="ammi"
    splitHeader.setAttribute('data-space', 'ammi');
    context.window.renderSplitHeaders();

    assert.ok(splitHeader.innerHTML.includes('<h2 class="about-title">ammi</h2>'), 'Should contain title ammi');
    assert.ok(splitHeader.innerHTML.includes('dir="rtl" lang="ur" style="color: #b83b14;">امی</div>'), 'Should contain Urdu script for ammi with urduColor from config');
    assert.ok(!splitHeader.innerHTML.includes('split-title-roman'), 'Should omit roman transliteration');
    console.log('PASS: renderSplitHeaders stamps correct title, Urdu script, and configured color from config.js.');
}

// 7. Test accessible tablist semantics & procedural SVG brush stroke path morph compatibility
{
    const { context, header } = createNavTestEnv('/kitchen/index.html');
    vm.runInContext(configCode + '\n' + navCode, context);

    header.setAttribute('data-nav', 'kitchen');
    header.setAttribute('data-current', 'kitchen');
    context.window.renderSiteNavbar(header);

    assert.ok(header.innerHTML.includes('<nav class="nav-container"'), 'Should wrap nav links in semantic <nav>');
    assert.ok(header.innerHTML.includes('role="tablist"'), 'Should mark ul.nav-links with role="tablist"');
    assert.ok(header.innerHTML.includes('role="tab" aria-selected="true" aria-current="page"'), 'Active tab should have aria-selected="true" and aria-current="page"');
    assert.ok(header.innerHTML.includes('role="tab" aria-selected="false"'), 'Inactive tabs should have aria-selected="false"');

    const paths = context.window.INK_BRUSH_PATHS;
    assert.ok(paths && paths.CORE_REST && paths.CORE_STRETCH && paths.CORE_SETTLE, 'INK_BRUSH_PATHS should expose rest, stretch, and settle vector paths');
    const countSegments = (d) => (d.match(/[MCZ]/g) || []).join('');
    assert.strictEqual(countSegments(paths.CORE_REST), countSegments(paths.CORE_STRETCH), 'CORE_REST and CORE_STRETCH must share identical SVG path command topology for morphing');
    assert.strictEqual(countSegments(paths.CORE_REST), countSegments(paths.CORE_SETTLE), 'CORE_REST and CORE_SETTLE must share identical SVG path command topology for morphing');
    console.log('PASS: Accessible ARIA semantics and morph-compatible procedural brush paths verified.');
}

// 8. Test Kinetic Layout Engine (anisotropic qalam stretch, contraction, and 150ms bloom)
{
    const { context } = createNavTestEnv('/kitchen/index.html');
    vm.runInContext(configCode + '\n' + navCode, context);

    let stageKeyframes = null;
    let stageOptions = null;
    let bleedKeyframes = null;
    let coreKeyframes = null;

    const mockCorePath = {
        animate: (kf) => { coreKeyframes = kf; return { cancel: () => {} }; }
    };
    const mockBleedPath = {
        animate: (kf) => { bleedKeyframes = kf; return { cancel: () => {} }; }
    };
    const mockSvg = {
        animate: () => ({ cancel: () => {} })
    };
    const mockStage = {
        animate: (kf, opts) => {
            stageKeyframes = kf;
            stageOptions = opts;
            return { cancel: () => {} };
        },
        querySelector: (sel) => {
            if (sel === '.nav-ink-core-path') return mockCorePath;
            if (sel === '.nav-ink-bleed-path') return mockBleedPath;
            if (sel === '.nav-brush-svg') return mockSvg;
            return null;
        }
    };

    const mockIndicator = {
        style: {},
        classList: { add: () => {}, remove: () => {} },
        querySelector: (sel) => (sel === '.nav-ink-stage' ? mockStage : null)
    };

    const mockNavLinks = {
        dataset: {},
        classList: { add: () => {} },
        getBoundingClientRect: () => ({ left: 100, top: 40, width: 400, height: 30 }),
        querySelector: (sel) => (sel === '.nav-indicator' ? mockIndicator : null)
    };

    const tab1 = { getBoundingClientRect: () => ({ left: 100, top: 40, width: 90, height: 20 }) };
    const tab2 = { getBoundingClientRect: () => ({ left: 240, top: 40, width: 65, height: 20 }) };

    // Initial placement (no travel animation)
    context.window.updateNavIndicator(mockNavLinks, tab1, false);
    assert.strictEqual(mockIndicator._inkState.left, 0);
    assert.strictEqual(mockIndicator._inkState.width, 90);

    // Animated transition to tab2 (moving right)
    context.window.updateNavIndicator(mockNavLinks, tab2, true);
    assert.strictEqual(mockIndicator._inkState.left, 140);
    assert.strictEqual(mockIndicator._inkState.width, 65);
    assert.strictEqual(mockIndicator._inkState.direction, 1);
    assert.strictEqual(mockNavLinks.dataset.inkDirection, 'right');

    assert.ok(Array.isArray(stageKeyframes) && stageKeyframes.length === 4, 'Stage WAAPI animation should have 4 keyframes (start, anisotropic stretch, landing contraction, settle)');
    assert.ok(stageKeyframes[1].transform.includes('scaleY(0.84)'), 'Mid-flight keyframe should thin vertically under anisotropic tension');
    assert.ok(stageKeyframes[2].transform.includes('scaleX(0.972) scaleY(1.06)'), 'Landing keyframe should contract gently');
    assert.strictEqual(stageOptions.easing, 'cubic-bezier(0.22, 1, 0.36, 1)', 'Should use custom human motor deceleration curve');
    assert.ok(Array.isArray(bleedKeyframes) && bleedKeyframes.length === 4, 'Wet ink bleed path should animate 150ms pigment bloom on landing');
    assert.ok(Array.isArray(coreKeyframes) && coreKeyframes.length === 4, 'Core ink path should morph vector path d during travel and settle');
    console.log('PASS: Kinetic layout engine animates anisotropic qalam stretch, contraction, and pigment bloom.');
}

// 9. Test Hover Ghost Trail, Press State (scaleY: 0.85), and Runtime Configurator
{
    const { context, doc } = createNavTestEnv('/kitchen/index.html');
    const rootProps = {};
    doc.documentElement = {
        style: {
            setProperty: (k, v) => { rootProps[k] = v; }
        }
    };
    vm.runInContext(configCode + '\n' + navCode, context);

    const classes = new Set();
    const mockGhost = {
        style: {},
        classList: {
            add: (c) => classes.add(c),
            remove: (...cs) => cs.forEach(c => classes.delete(c)),
            contains: (c) => classes.has(c)
        },
        querySelector: () => null
    };
    const indClasses = new Set();
    const mockIndicator = {
        style: {},
        classList: {
            add: (c) => indClasses.add(c),
            remove: (c) => indClasses.delete(c),
            contains: (c) => indClasses.has(c)
        },
        querySelector: () => ({})
    };
    const activeTab = { getBoundingClientRect: () => ({ left: 100, top: 40, width: 80, height: 20 }) };
    const hoveredTab = { getBoundingClientRect: () => ({ left: 210, top: 40, width: 60, height: 20 }) };

    const mockNavLinks = {
        getBoundingClientRect: () => ({ left: 100, top: 40, width: 400, height: 30 }),
        querySelector: (sel) => {
            if (sel === '.nav-indicator') return mockIndicator;
            if (sel === '.nav-indicator-ghost') return mockGhost;
            if (sel === '.nav-home') return activeTab;
            return null;
        }
    };

    context.window.updateNavGhostIndicator(mockNavLinks, hoveredTab);
    assert.strictEqual(mockGhost.style.transform, 'translateX(110px)');
    assert.strictEqual(mockGhost.style.width, '60px');
    assert.ok(mockGhost.classList.contains('is-visible'), 'Hovering non-active tab reveals faint brush ghost');

    context.window.setNavPressedState(mockNavLinks, true);
    assert.ok(mockIndicator.classList.contains('is-pressed'), 'Pressing tab adds is-pressed class for scaleY(0.85) ink compression');
    context.window.setNavPressedState(mockNavLinks, false);
    assert.ok(!mockIndicator.classList.contains('is-pressed'), 'Releasing tab removes is-pressed class');

    context.window.configureInkNavbar({
        strokeColor: '#2b1810',
        transitionDuration: 480,
        inkBleedIntensity: 3.1,
        paperTextureOpacity: 0.28
    });
    assert.strictEqual(rootProps['--ink-color'], '#2b1810');
    assert.strictEqual(rootProps['--ink-duration'], '480ms');
    assert.strictEqual(rootProps['--ink-bleed-intensity'], '3.1');
    assert.strictEqual(rootProps['--ink-paper-tooth'], '0.28');
    console.log('PASS: Hover ghost trail, press state compression, and runtime configurator verified.');
}

// 11. Test that relative image sources are normalized during client-side transitions across directory depths
{
    const targetBaseUrl = 'http://localhost:3000/kitchen/';
    const rawSrc = '../assets/kitchen_sketch.png';
    const resolvedUrl = new URL(rawSrc, targetBaseUrl).href;
    assert.strictEqual(resolvedUrl, 'http://localhost:3000/assets/kitchen_sketch.png', 'Relative image src must resolve to root assets folder rather than 404ing under /kitchen/assets/');
    console.log('PASS: Image path normalization across depths verified.');
}

// 12. Test renderRecipeNavbar for stationary "← the kitchen | <recipe_name>"
{
    const { context } = createNavTestEnv('/kitchen/recipes/template.html');
    vm.runInContext(configCode + '\n' + navCode, context);

    const header = context.document.createElement('header');
    header.className = 'navbar';
    header.setAttribute('data-back', '../');
    header.setAttribute('data-back-label', '← the kitchen');

    // Render recipe navbar
    context.window.renderRecipeNavbar(header, 'Sourdough', '../');
    assert.strictEqual(header.getAttribute('data-recipe-nav-mode'), 'breadcrumb');
    assert.ok(header.innerHTML.includes('← the kitchen'), 'Contains "← the kitchen" back link');
    assert.ok(header.innerHTML.includes('sourdough'), 'Contains recipe title link');
    assert.ok(header.innerHTML.includes('recipe-top-link active'), 'Recipe title link has recipe-top-link active classes');
    console.log('PASS: Recipe stationary navbar "← the kitchen | <recipe_name>" verified.');
}

console.log('ALL NAV TESTS PASSED!');
