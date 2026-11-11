/**
 * tests/test_styles.js
 *
 * Verifies that kitchen.css and recipe.css adhere to design system invariants:
 * - Dynamic CSS variable usage without static fallbacks in :root
 * - Pop badges and category tag styling
 * - Qalam ink brush stroke underline masks and animations
 */

const assert = require('assert');
const fs = require('fs');

const kitchenCss = fs.readFileSync(__dirname + '/../kitchen.css', 'utf-8');
const recipeCss = fs.readFileSync(__dirname + '/../kitchen/recipes/recipe.css', 'utf-8');

// -----------------------------------------------------------------------------
// 1. kitchen.css Invariants
// -----------------------------------------------------------------------------
assert.doesNotMatch(kitchenCss, /:root\s*\{[^}]*--text-subtitle/, 'kitchen.css should not hardcode static --text-subtitle in :root');
assert.match(kitchenCss, /var\(--text-subtitle\)/, 'kitchen.css should use var(--text-subtitle)');
assert.match(kitchenCss, /var\(--link-color\)/, 'kitchen.css should use var(--link-color)');
assert.match(kitchenCss, /var\(--link-hover\)/, 'kitchen.css should use var(--link-hover)');
assert.match(kitchenCss, /var\(--color-urdu/, 'kitchen.css should use var(--color-urdu)');
assert.match(kitchenCss, /\.urdu-title\s*\{[^}]*color:\s*var\(--color-urdu\)/, '.urdu-title should use var(--color-urdu) in kitchen.css');

assert.ok(kitchenCss.includes('.pop-tag') || kitchenCss.includes('.badge-pop'), 'kitchen.css should define .pop-tag or .badge-pop');
assert.match(kitchenCss, /var\(--color-pop/, 'Pop badge should use var(--color-pop)');

assert.match(kitchenCss, /\.nav-item a:hover/, 'All nav links should have hover rules');
assert.match(kitchenCss, /\.recipe-link::after\s*\{[^}]*mask-image:\s*var\(--ink-brush-mask\)/, 'Recipe links should use --ink-brush-mask');
assert.match(kitchenCss, /\.culture-link::after\s*\{[^}]*mask-image:\s*var\(--ink-brush-mask\)/, 'Culture links should use --ink-brush-mask');

// -----------------------------------------------------------------------------
// 2. recipe.css Invariants
// -----------------------------------------------------------------------------
assert.doesNotMatch(recipeCss, /:root\s*\{[^}]*--text-subtitle/, 'recipe.css should not hardcode static --text-subtitle in :root');
assert.match(recipeCss, /var\(--text-subtitle/, 'recipe.css should use var(--text-subtitle)');
assert.match(recipeCss, /var\(--link-hover/, 'recipe.css should use var(--link-hover)');
assert.match(recipeCss, /var\(--color-pop\)/, 'recipe.css should use var(--color-pop)');
assert.match(recipeCss, /var\(--color-urdu/, 'recipe.css should use var(--color-urdu)');
assert.match(recipeCss, /\.urdu-title\s*\{[^}]*color:\s*var\(--color-urdu\)/, '.urdu-title should use var(--color-urdu) in recipe.css');

assert.match(recipeCss, /\.recipe-link::after\s*\{[^}]*mask-image:\s*var\(--ink-brush-mask\)/, 'recipe.css links should use --ink-brush-mask');
assert.match(recipeCss, /\.nav-item a\.active::after\s*\{[^}]*mask-image:\s*var\(--ink-brush-mask\)/, 'Active back-link should use --ink-brush-mask');

console.log('PASS: test_styles.js passed all checks.');
