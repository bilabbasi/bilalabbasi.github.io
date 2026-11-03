const assert = require('assert');
const fs = require('fs');

const css = fs.readFileSync(__dirname + '/../kitchen.css', 'utf-8');

// Check root variables
assert.match(css, /--text-subtitle:\s*#b45309;/, '--text-subtitle should be #b45309 in :root');
assert.match(css, /--link-color:\s*#b45309;/, '--link-color should be #b45309 in :root');
assert.match(css, /--link-hover:\s*#ff5722;/, '--link-hover should be #ff5722 in :root');
assert.match(css, /--color-pop:\s*#ccff00;/, '--color-pop should be #ccff00 in :root');

// Check pop-tag / badge helper
assert.ok(css.includes('.pop-tag') || css.includes('.badge-pop'), 'Should define .pop-tag or .badge-pop class');
assert.match(css, /var\(--color-pop/, 'Pop badge should use var(--color-pop)');

console.log('PASS: test_kitchen_css.js passed all checks.');
