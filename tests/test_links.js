/**
 * tests/test_links.js
 *
 * Verifies that all local HTML asset/script/stylesheet references,
 * navigation targets, and recipe URLs in config.js exist on disk.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

// 1. Verify all recipes and nav paths in config.js resolve to existing directories/files
const configCode = fs.readFileSync(path.join(rootDir, 'config.js'), 'utf-8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(configCode + '\n;globalThis.KITCHEN_CONFIG = KITCHEN_CONFIG;', ctx);

(ctx.KITCHEN_CONFIG.recipes || []).forEach(recipe => {
    const recipeDir = path.join(rootDir, 'kitchen', recipe.url);
    assert.ok(fs.existsSync(path.join(recipeDir, 'index.html')), `Missing index.html for recipe: ${recipe.url}`);
    assert.ok(fs.existsSync(path.join(recipeDir, 'recipe.js')), `Missing recipe.js for recipe: ${recipe.url}`);
});

(ctx.KITCHEN_CONFIG.nav || []).forEach(item => {
    if (item.isText || item.path === undefined) return;
    const target = path.join(rootDir, item.path, 'index.html');
    assert.ok(fs.existsSync(target), `Missing index.html for nav item "${item.id}": ${item.path}`);
});

// 2. Verify local href/src attributes in every HTML page resolve to real files
function findHtmlFiles(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(findHtmlFiles(full));
        } else if (entry.name.endsWith('.html')) {
            results.push(full);
        }
    }
    return results;
}

const htmlFiles = findHtmlFiles(rootDir);
for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(htmlFile, 'utf-8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    const dir = path.dirname(htmlFile);
    const matches = [...html.matchAll(/(?:href|src)="([^"]+)"/g)];
    for (const [, ref] of matches) {
        if (/^(https?:|mailto:|#|data:)/.test(ref)) continue;
        const resolved = path.resolve(dir, ref);
        assert.ok(fs.existsSync(resolved), `Broken reference "${ref}" in ${path.relative(rootDir, htmlFile)}`);
    }
}

console.log('PASS: test_links.js passed all checks.');
