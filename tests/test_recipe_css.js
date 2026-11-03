const assert = require('assert');
const fs = require('fs');

const css = fs.readFileSync(__dirname + '/../kitchen/recipes/recipe.css', 'utf-8');

// Check root variables
assert.match(css, /--link-color:\s*#7c2d12;/, '--link-color should be #7c2d12 in :root');
assert.match(css, /--text-subtitle:\s*#ff5722;/, '--text-subtitle should be #ff5722 in :root');
assert.match(css, /--link-hover:\s*#ff5722;/, '--link-hover should be #ff5722 in :root');
assert.match(css, /--color-pop:\s*#ccff00;/, '--color-pop should be #ccff00 in :root');

console.log('PASS: test_recipe_css.js passed all checks.');
