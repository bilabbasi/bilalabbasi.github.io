const assert = require('assert');
const fs = require('fs');

const css = fs.readFileSync(__dirname + '/../kitchen.css', 'utf-8');

// Ensure kitchen.css relies on dynamic CSS variables and does not hardcode static :root fallbacks
assert.doesNotMatch(css, /:root\s*\{[^}]*--text-subtitle/, 'kitchen.css should not hardcode static --text-subtitle in :root');
assert.match(css, /var\(--text-subtitle\)/, 'kitchen.css should use var(--text-subtitle)');
assert.match(css, /var\(--link-color\)/, 'kitchen.css should use var(--link-color)');
assert.match(css, /var\(--link-hover\)/, 'kitchen.css should use var(--link-hover)');

// Check pop-tag / badge helper
assert.ok(css.includes('.pop-tag') || css.includes('.badge-pop'), 'Should define .pop-tag or .badge-pop class');
assert.match(css, /var\(--color-pop/, 'Pop badge should use var(--color-pop)');

// Check navbar hover and underline rules
assert.match(css, /\.nav-item a:hover/, 'All nav links should have hover rule');
assert.match(css, /\.nav-item a\.nav-focal\.nav-home\s*\{[^}]*border-bottom:\s*1\.5px solid var\(--link-hover\);/, 'The kitchen tab underline should use var(--link-hover)');

// Check qalam brush stroke underline on recipe links and culture links
assert.match(css, /\.recipe-link::after\s*\{[^}]*mask-image:\s*var\(--ink-brush-mask\)/, 'Recipe links should use --ink-brush-mask');
assert.match(css, /\.recipe-link:hover::after[^{]*\{[^}]*animation:\s*qalam-stroke-draw/, 'Recipe links should animate qalam-stroke-draw on hover');
assert.match(css, /\.culture-link::after\s*\{[^}]*mask-image:\s*var\(--ink-brush-mask\)/, 'Culture links should use --ink-brush-mask');

console.log('PASS: test_kitchen_css.js passed all checks.');
