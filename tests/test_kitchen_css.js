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

console.log('PASS: test_kitchen_css.js passed all checks.');
