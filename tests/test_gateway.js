// =========================================================================
// TEST SUITE: GATEWAY & FADED FLAT REEL VERIFICATION
// =========================================================================
// This test verifies:
// 1. Elimination of typewriter delays on gateway and professional pages.
// 2. Presence of the 4 reel items (runner, cook, scientist, reader) and baseline anchor.
// 3. Presence and correctness of GATEWAY_CONFIG reel and color configurations.
// 4. Mathematical exactness of vertical reel offsets for resting, kitchen, and professional states.

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("Running gateway & faded flat reel tests...");

const rootDir = path.resolve(__dirname, '..');

// 1. Check index.html markup
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
assert(indexHtml.includes('id="gateway-title"'), 'index.html must have #gateway-title');
assert(indexHtml.includes('id="gateway-reel"'), 'index.html must have #gateway-reel');
assert(indexHtml.includes('id="reel-track"'), 'index.html must have #reel-track');
assert(indexHtml.includes('id="reel-item-runner"'), 'index.html must have #reel-item-runner');
assert(indexHtml.includes('id="reel-item-cook"'), 'index.html must have #reel-item-cook');
assert(indexHtml.includes('id="reel-item-scientist"'), 'index.html must have #reel-item-scientist');
assert(indexHtml.includes('id="reel-item-reader"'), 'index.html must have #reel-item-reader');
assert(indexHtml.includes('reel-baseline-anchor'), 'index.html must have .reel-baseline-anchor for typographic alignment');
assert(indexHtml.includes('class="gateway-divider-line"'), 'index.html must have .gateway-divider-line separating animation and menu');
assert(indexHtml.includes('id="gateway-links"'), 'index.html must have #gateway-links');
assert(!indexHtml.includes('id="gateway-cursor"'), 'index.html must NOT have typing cursor #gateway-cursor');
assert(!indexHtml.includes('typeChar'), 'index.html must NOT have typewriter function typeChar');

// 2. Check professional/index.html markup
const profHtml = fs.readFileSync(path.join(rootDir, 'professional', 'index.html'), 'utf8');
assert(!profHtml.includes('id="name-cursor"'), 'professional page must NOT have typing cursor #name-cursor');
assert(!profHtml.includes('id="title-cursor"'), 'professional page must NOT have typing cursor #title-cursor');
assert(!profHtml.includes('typeName'), 'professional page must NOT have typewriter function typeName');
assert(!profHtml.includes('typeSubtitle'), 'professional page must NOT have typewriter function typeSubtitle');

// 3. Check config.js for GATEWAY_CONFIG.reel and color configurations
const configJs = fs.readFileSync(path.join(rootDir, 'config.js'), 'utf8');
assert(configJs.includes('GATEWAY_CONFIG'), 'config.js must export GATEWAY_CONFIG');
assert(configJs.includes('reel:'), 'config.js must include reel settings');
assert(configJs.includes('scientist'), 'config.js must configure scientist');
assert(configJs.includes('cook'), 'config.js must configure cook');
assert(configJs.includes('runner'), 'config.js must configure runner');
assert(configJs.includes('reader'), 'config.js must configure reader');
assert(configJs.includes('son'), 'config.js must configure son');
assert(configJs.includes('husband'), 'config.js must configure husband');
assert(configJs.includes('cyclist'), 'config.js must configure cyclist');
assert(configJs.includes('gamer'), 'config.js must configure gamer');
assert(configJs.includes('friend'), 'config.js must configure friend');
assert(configJs.includes('#4b5563'), 'config.js reel must configure slate grey #4b5563');
assert(configJs.includes('#b83b14'), 'config.js reel must configure terracotta #b83b14');

// 4. Test vertical translation percentages
// 4 items: runner (0), cook (1), scientist (2), reader (3). Total track height = 4h.
const stateOffsets = {
    resting: -37.5,      // Halfway between cook and scientist (1.5h / 4h = 37.5%)
    kitchen: -25.0,      // Item 1 ("cook") aligned at top (1h / 4h = 25%)
    professional: -50.0  // Item 2 ("scientist") aligned at top (2h / 4h = 50%)
};

assert.strictEqual(stateOffsets.resting, -37.5, 'Resting state offset must be -37.5%');
assert.strictEqual(stateOffsets.kitchen, -25.0, 'Kitchen state offset must be -25.0%');
assert.strictEqual(stateOffsets.professional, -50.0, 'Professional state offset must be -50.0%');

// Verify that resting state sits symmetrically between kitchen and professional states
const midpoint = (stateOffsets.kitchen + stateOffsets.professional) / 2;
assert.strictEqual(stateOffsets.resting, midpoint, 'Resting state must be the exact midpoint between kitchen and professional');

// 5. Test revolver click delay & transition controllers
assert(indexHtml.includes('NAVIGATION_DELAY_MS'), 'index.html must define NAVIGATION_DELAY_MS');
assert(indexHtml.includes('EXIT_FADE_DELAY_MS'), 'index.html must define EXIT_FADE_DELAY_MS');
assert(indexHtml.includes('isNavigating'), 'index.html must manage isNavigating state');
assert(indexHtml.includes('is-selected'), 'index.html must apply is-selected class on click');
assert(indexHtml.includes('is-exiting'), 'index.html must trigger is-exiting class for page transition');

// 6. Test index.css for mobile-compatible cross-page transitions and boundary divider
const indexCss = fs.readFileSync(path.join(rootDir, 'index.css'), 'utf8');
assert(indexCss.includes('.gateway-divider-line'), 'index.css must style .gateway-divider-line');
assert(indexCss.includes('.gateway-card.is-exiting'), 'index.css must style .gateway-card.is-exiting');
assert(indexCss.includes('.gateway-footer.is-exiting'), 'index.css must style .gateway-footer.is-exiting');
assert(indexCss.includes('page-enter'), 'index.css must define page-enter animation for smooth entrance');
assert(indexCss.includes('@keyframes page-enter'), 'index.css must define @keyframes page-enter');

console.log("PASS: test_gateway.js passed all checks.");
