/**
 * tests/test_recipes.js
 *
 * Verifies recipe engine accessibility/performance invariants, recipe shell
 * consistency across all recipe directories, and single-definition hygiene.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const recipesDir = path.join(rootDir, 'kitchen', 'recipes');

// 1. Verify recipe-engine.js uses semantic buttons for mode toggles & collapsible sections
const engineJs = fs.readFileSync(path.join(recipesDir, 'recipe-engine.js'), 'utf8');
assert.match(engineJs, /<button type="button" class="scroll-indicator/, 'Recipe mode toggles must be semantic <button> elements');
assert.match(engineJs, /aria-pressed="\$\{!isStepMode\}"/, 'Mode toggles must expose aria-pressed state');
assert.match(engineJs, /<button type="button" class="recipe-section-toggle" aria-expanded="true">/, 'Collapsible recipe headings must use semantic <button> with aria-expanded');
assert.doesNotMatch(engineJs, /updateRecipeNavbarState/, 'Scroll handler must not rebuild recipe navbar on scroll');

// 2. Verify nav.js has no duplicate renderRecipeNavbar / setRecipeNavbarMode definitions
const navJs = fs.readFileSync(path.join(rootDir, 'nav.js'), 'utf8');
assert.strictEqual((navJs.match(/function renderRecipeNavbar\(/g) || []).length, 1, 'nav.js must define renderRecipeNavbar exactly once');
assert.strictEqual((navJs.match(/function setRecipeNavbarMode\(/g) || []).length, 1, 'nav.js must define setRecipeNavbarMode exactly once');

// 3. Verify all recipe shells load the full modular stack and have unique titles
const seenTitles = new Map();
for (const entry of fs.readdirSync(recipesDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'css' || entry.name === 'js') continue;
    const htmlPath = path.join(recipesDir, entry.name, 'index.html');
    if (!fs.existsSync(htmlPath)) continue;

    const html = fs.readFileSync(htmlPath, 'utf8');
    const rel = path.relative(rootDir, htmlPath);
    assert.ok(html.includes('fonts.googleapis.com/css2'), `${rel} must link Google Fonts in <head>`);
    assert.ok(html.includes('../../ingredients/catalog.js'), `${rel} must load catalog.js`);
    assert.ok(html.includes('../js/floating-stage.js'), `${rel} must load floating-stage.js`);
    assert.ok(html.includes('../js/qalam-progress.js'), `${rel} must load qalam-progress.js`);
    assert.ok(html.includes('../recipe-engine.js'), `${rel} must load recipe-engine.js`);

    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    assert.ok(titleMatch, `${rel} must have a <title>`);
    const title = titleMatch[1].trim();
    assert.ok(!seenTitles.has(title), `Duplicate recipe <title> "${title}" in ${rel} (also in ${seenTitles.get(title)})`);
    seenTitles.set(title, rel);
}

// 4. Verify kitchen.css has no duplicate @keyframes bounce-indicator
const kitchenCss = fs.readFileSync(path.join(rootDir, 'kitchen.css'), 'utf8');
assert.strictEqual((kitchenCss.match(/@keyframes bounce-indicator/g) || []).length, 1, 'kitchen.css must define @keyframes bounce-indicator once');

// 5. Verify floating-stage.js fraction parsing, quantity aggregation, and asset gating
const vm = require('vm');
const catalogJs = fs.readFileSync(path.join(rootDir, 'kitchen', 'ingredients', 'catalog.js'), 'utf8');
const floatingJs = fs.readFileSync(path.join(recipesDir, 'js', 'floating-stage.js'), 'utf8');
const ctx = {
    window: {},
    document: {
        documentElement: { dataset: {} },
        addEventListener: () => {}
    }
};
vm.createContext(ctx);
vm.runInContext(catalogJs + '\n' + floatingJs, ctx);
const Floating = ctx.window.RecipeFloatingStage;

assert.strictEqual(Floating.parseAmount('1/2'), 0.5, 'parseAmount("1/2") should be 0.5');
assert.strictEqual(Floating.parseAmount('1/4'), 0.25, 'parseAmount("1/4") should be 0.25');
assert.strictEqual(Floating.parseAmount('1 1/2'), 1.5, 'parseAmount("1 1/2") should be 1.5');
assert.ok(Number.isNaN(Floating.parseAmount('5-6')), 'parseAmount("5-6") should stay non-numeric range');
assert.ok(Number.isNaN(Floating.parseAmount('to taste')), 'parseAmount("to taste") should stay non-numeric');

const sampleRecipe = {
    steps: [
        {
            tools: ['pressure_cooker'],
            ingredients: [
                { name: 'toor_daal', form: 'dry', amount: '1/2', unit: 'cup' },
                { name: 'onion', form: 'chopped', amount: '1/4', unit: 'medium' },
                { name: 'green_chilli', form: 'whole', amount: '5-6' },
                { name: 'salt', form: 'powder', amount: 'to taste' }
            ]
        },
        {
            tools: ['saucepan'],
            ingredients: [
                { name: 'onion', form: 'chopped', amount: '1/4', unit: 'medium' },
                { name: 'salt', form: 'powder', amount: 'to taste' }
            ]
        }
    ]
};

const collected = Floating.collectRecipeItems(sampleRecipe, p => p);
const byId = Object.fromEntries(collected.map(it => [it.id, it]));
assert.strictEqual(byId['ing:toor_daal:dry'].totalQtyEn, '1/2 cup', 'Single fraction must stay 1/2 cup (not 1 cup)');
assert.strictEqual(byId['ing:onion:chopped'].totalQtyEn, '1/2 medium', '1/4 + 1/4 must sum to 1/2 medium (not 2 medium)');
assert.strictEqual(byId['ing:green_chilli:whole'].totalQtyEn, '5-6', 'Range "5-6" must not truncate to 5');
assert.strictEqual(byId['ing:salt:powder'].totalQtyEn, 'to taste', 'Duplicate qualitative amounts must deduplicate');
assert.strictEqual(Floating.hasCompleteAssets(collected, sampleRecipe), false, 'Recipe with missing catalog PNGs must fall back to classic sketches');

const completeRecipe = {
    steps: [
        {
            tools: ['karahi'],
            ingredients: [
                { name: 'potato', form: 'diced', amount: 2, unit: 'medium' },
                { name: 'coriander_powder', form: 'powder', amount: 1.5, unit: 'tsp' }
            ]
        },
        {
            tools: ['saucepan'],
            ingredients: [
                { name: 'coriander_powder', form: 'powder', amount: 0.5, unit: 'tsp' }
            ]
        }
    ]
};
const completeCollected = Floating.collectRecipeItems(completeRecipe, p => p);
const completeById = Object.fromEntries(completeCollected.map(it => [it.id, it]));
assert.strictEqual(completeById['ing:coriander_powder:powder'].totalQtyEn, '2 tsp', 'Decimal amounts 1.5 + 0.5 must sum to 2 tsp');
assert.strictEqual(Floating.hasCompleteAssets(completeCollected, completeRecipe), true, 'Recipe with all existing PNGs and per-step items must enable floating stage');

const heroStageHtml = Floating.renderFloatingStageHtml(completeCollected, { isStepStage: false, seedKey: 'test' });
assert.ok(!heroStageHtml.includes('floating-stage-hint'), 'Hero floating stage should not render the removed Urdu hint line');
assert.ok(heroStageHtml.includes('floating-text-en') && heroStageHtml.includes('floating-text-ur'), 'Floating stage items should render stacked EN/UR bilingual spans');

console.log('PASS: test_recipes.js passed all checks.');
