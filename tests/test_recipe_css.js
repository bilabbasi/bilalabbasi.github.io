const assert = require('assert');
const fs = require('fs');

const css = fs.readFileSync(__dirname + '/../kitchen/recipes/recipe.css', 'utf-8');

// Ensure recipe.css relies on dynamic CSS variables and does not hardcode static :root fallbacks
assert.doesNotMatch(css, /:root\s*\{[^}]*--text-subtitle/, 'recipe.css should not hardcode static --text-subtitle in :root');
assert.match(css, /var\(--text-subtitle/, 'recipe.css should use var(--text-subtitle)');
assert.match(css, /var\(--link-hover/, 'recipe.css should use var(--link-hover)');
assert.match(css, /var\(--color-pop\)/, 'recipe.css should use var(--color-pop)');

// Ensure recipe links, active back link, and view mode indicators use the qalam brush stroke
assert.match(css, /\.recipe-link::after\s*\{[^}]*mask-image:\s*var\(--ink-brush-mask\)/, 'recipe.css .recipe-link::after should use --ink-brush-mask');
assert.match(css, /\.nav-item a\.active::after\s*\{[^}]*mask-image:\s*var\(--ink-brush-mask\)/, 'recipe.css .nav-item a.active::after should use --ink-brush-mask');
assert.match(css, /\.recipe-indicators \.scroll-indicator\.active \.scroll-text::after/, 'recipe.css active mode toggle should show brush stroke');

console.log('PASS: test_recipe_css.js passed all checks.');
