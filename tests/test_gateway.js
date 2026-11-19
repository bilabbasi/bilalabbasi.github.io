/**
 * tests/test_gateway.js
 *
 * Verifies core gateway markup, config structure, and gateway.css / index.css invariants.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');

// 1. Check index.html gateway markup & transition controllers
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
assert(indexHtml.includes('id="gateway-title"'), 'index.html must have #gateway-title');
assert(indexHtml.includes('id="gateway-reel"'), 'index.html must have #gateway-reel');
assert(indexHtml.includes('id="reel-track"'), 'index.html must have #reel-track');
assert(indexHtml.includes('reel-baseline-anchor'), 'index.html must have .reel-baseline-anchor');
assert(indexHtml.includes('class="gateway-divider-line"'), 'index.html must have .gateway-divider-line');
assert(indexHtml.includes('id="gateway-links"'), 'index.html must have #gateway-links');
assert(indexHtml.includes('NAVIGATION_DELAY_MS'), 'index.html must define NAVIGATION_DELAY_MS');
assert(indexHtml.includes('isNavigating'), 'index.html must manage isNavigating state');

// 2. Check config.js defines GATEWAY_CONFIG with cook & scientist targets and hex colors
const configJs = fs.readFileSync(path.join(rootDir, 'config.js'), 'utf8');
assert(configJs.includes('GATEWAY_CONFIG'), 'config.js must export GATEWAY_CONFIG');
assert(/id:\s*"scientist"[^}]*color:\s*"#[0-9a-fA-F]{6,8}"/.test(configJs), 'config.js scientist item must configure a hex color');
assert(/id:\s*"cook"[^}]*color:\s*"#[0-9a-fA-F]{6,8}"/.test(configJs), 'config.js cook item must configure a hex color');

// 3. Check gateway.css and index.css transition styles
const indexCss = fs.readFileSync(path.join(rootDir, 'index.css'), 'utf8');
const gatewayCss = fs.readFileSync(path.join(rootDir, 'gateway.css'), 'utf8');
assert(gatewayCss.includes('.gateway-divider-line'), 'gateway.css must style .gateway-divider-line');
assert(gatewayCss.includes('.gateway-card.is-exiting'), 'gateway.css must style .gateway-card.is-exiting');
assert(gatewayCss.includes('.gateway-footer.is-exiting'), 'gateway.css must style .gateway-footer.is-exiting');
assert(indexCss.includes('@keyframes page-enter'), 'index.css must define @keyframes page-enter');

console.log('PASS: test_gateway.js passed all checks.');
