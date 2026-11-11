/**
 * tests/test_theme.js
 *
 * Verifies that theme colors defined in config.js (theme.anchor, theme.distinct,
 * theme.pop, theme.urdu) propagate dynamically into CSS variables on kitchen and recipe
 * pages, while remaining strictly isolated from the professional page.
 */

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const configCode = fs.readFileSync(__dirname + '/../config.js', 'utf-8');

function createEnvironment(pathname, hasKitchenStylesheet = false) {
    const styles = {};
    const context = {
        window: {
            location: { pathname }
        },
        document: {
            documentElement: {
                style: {
                    setProperty: (prop, val) => { styles[prop] = val; },
                    getPropertyValue: (prop) => styles[prop]
                }
            },
            querySelector: (sel) => {
                if (hasKitchenStylesheet && (sel.includes('kitchen.css') || sel.includes('recipe.css'))) {
                    return {};
                }
                return null;
            },
            addEventListener: () => {}
        },
        console: console
    };
    vm.createContext(context);
    return { context, styles };
}

// -----------------------------------------------------------------------------
// 1. Theme Configuration & Dynamic Injection on Kitchen Pages
// -----------------------------------------------------------------------------
{
    const { context, styles } = createEnvironment('/kitchen/index.html', true);
    vm.runInContext(configCode + '\n;globalThis.KITCHEN_CONFIG = KITCHEN_CONFIG;', context);

    const theme = context.KITCHEN_CONFIG.theme;
    assert.ok(theme, 'KITCHEN_CONFIG.theme must exist');
    assert.ok(theme.anchor, 'theme.anchor must be defined');
    assert.ok(theme.distinct, 'theme.distinct must be defined');
    assert.ok(theme.pop, 'theme.pop must be defined');
    assert.ok(theme.urdu, 'theme.urdu must be defined');

    assert.strictEqual(styles['--link-color'], theme.anchor, '--link-color should match theme.anchor');
    assert.strictEqual(styles['--text-subtitle'], theme.anchor, '--text-subtitle should match theme.anchor');
    assert.strictEqual(styles['--link-hover'], theme.distinct, '--link-hover should match theme.distinct');
    assert.strictEqual(styles['--color-pop'], theme.pop, '--color-pop should match theme.pop');
    assert.strictEqual(styles['--color-urdu'], theme.urdu, '--color-urdu should match theme.urdu');

    // Test dynamic runtime color updates via KITCHEN_CONFIG.applyTheme()
    assert.strictEqual(typeof context.KITCHEN_CONFIG.applyTheme, 'function');
    theme.anchor = '#123456';
    theme.urdu = '#ff5500';
    context.KITCHEN_CONFIG.applyTheme();
    assert.strictEqual(styles['--link-color'], '#123456', 'Dynamic update propagates to --link-color');
    assert.strictEqual(styles['--text-subtitle'], '#123456', 'Dynamic update propagates to --text-subtitle');
    assert.strictEqual(styles['--color-urdu'], '#ff5500', 'Dynamic update propagates to --color-urdu');
}

// -----------------------------------------------------------------------------
// 2. Recipe Pages Theme Propagation
// -----------------------------------------------------------------------------
{
    const { context, styles } = createEnvironment('/kitchen/recipes/yellowdaal/index.html', true);
    vm.runInContext(configCode + '\n;globalThis.KITCHEN_CONFIG = KITCHEN_CONFIG;', context);

    const theme = context.KITCHEN_CONFIG.theme;
    assert.strictEqual(styles['--text-subtitle'], theme.anchor, 'Recipe page text-subtitle matches theme.anchor');
    assert.strictEqual(styles['--link-color'], theme.anchor, 'Recipe page link-color matches theme.anchor');
    assert.strictEqual(styles['--color-pop'], theme.pop, 'Recipe page color-pop matches theme.pop');
    assert.strictEqual(styles['--color-urdu'], theme.urdu, 'Recipe page color-urdu matches theme.urdu');
}

// -----------------------------------------------------------------------------
// 3. Strict Professional Page Isolation (Zero Style Bleed)
// -----------------------------------------------------------------------------
{
    const { context, styles } = createEnvironment('/professional/index.html', false);
    vm.runInContext(configCode, context);

    assert.strictEqual(styles['--link-color'], undefined, 'Professional page must not have --link-color applied');
    assert.strictEqual(styles['--text-subtitle'], undefined, 'Professional page must not have --text-subtitle applied');
    assert.strictEqual(styles['--color-pop'], undefined, 'Professional page must not have --color-pop applied');
    assert.strictEqual(styles['--color-urdu'], undefined, 'Professional page must not have --color-urdu applied');
}

// -----------------------------------------------------------------------------
// 4. Isolation on Local file:/// URLs with "kitchen" in parent directory
// -----------------------------------------------------------------------------
{
    const { context, styles } = createEnvironment('/Users/bilalabbasi/kitchen-workspace/site/professional/index.html', false);
    vm.runInContext(configCode, context);

    assert.strictEqual(styles['--link-color'], undefined, 'Ancestor folder containing "kitchen" must not bleed into professional page');
    assert.strictEqual(styles['--text-subtitle'], undefined, 'Ancestor folder containing "kitchen" must not bleed into professional page');
}

console.log('PASS: test_theme.js passed all checks.');
