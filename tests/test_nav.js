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

    const doc = {
        title: 'Initial Title',
        readyState: 'complete',
        fonts: { ready: Promise.resolve() },
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

    // Test with data-space="culture"
    splitHeader.setAttribute('data-space', 'culture');
    context.window.renderSplitHeaders();

    assert.ok(splitHeader.innerHTML.includes('<h2 class="about-title">customs</h2>'), 'Should contain title customs');
    assert.ok(splitHeader.innerHTML.includes('dir="rtl" lang="ur">رسم و رواج</div>'), 'Should contain Urdu script with dir=rtl');
    assert.ok(splitHeader.innerHTML.includes('<span class="split-title-roman">rasm-o-riwāj</span>'), 'Should contain roman transliteration');

    // Test with data-space="ammi"
    splitHeader.setAttribute('data-space', 'ammi');
    context.window.renderSplitHeaders();

    assert.ok(splitHeader.innerHTML.includes('<h2 class="about-title">mom</h2>'), 'Should contain title mom');
    assert.ok(splitHeader.innerHTML.includes('dir="rtl" lang="ur">امی</div>'), 'Should contain Urdu script for ammi');
    assert.ok(splitHeader.innerHTML.includes('<span class="split-title-roman">ammi</span>'), 'Should contain roman transliteration ammi');
    console.log('PASS: renderSplitHeaders stamps correct title, Urdu, and Roman transliteration from config.js.');
}

console.log('ALL NAV TESTS PASSED!');
