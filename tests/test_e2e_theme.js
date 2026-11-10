const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const configCode = fs.readFileSync(__dirname + '/../config.js', 'utf-8');

function createEnvironment(pathname, hasKitchenStylesheet = false) {
    const styles = {};
    const context = {
        window: {
            location: {
                pathname: pathname
            }
        },
        document: {
            documentElement: {
                style: {
                    setProperty: (prop, val) => {
                        styles[prop] = val;
                    },
                    getPropertyValue: (prop) => styles[prop]
                }
            },
            querySelector: (sel) => {
                if (hasKitchenStylesheet && (sel.includes('kitchen.css') || sel.includes('recipe.css'))) {
                    return {};
                }
                return null;
            },
            addEventListener: (evt, cb) => {}
        },
        console: console
    };
    vm.createContext(context);
    return { context, styles };
}

// 1. Kitchen Page Test
{
    const { context, styles } = createEnvironment('/kitchen/index.html', true);
    vm.runInContext(configCode + '\n;globalThis.KITCHEN_CONFIG = KITCHEN_CONFIG;', context);

    assert.strictEqual(styles['--text-subtitle'], context.KITCHEN_CONFIG.theme.anchor, 'Kitchen page subtitle matches config anchor');
    assert.strictEqual(styles['--link-color'], context.KITCHEN_CONFIG.theme.anchor, 'Kitchen page link-color matches config anchor');
    assert.strictEqual(styles['--link-hover'], context.KITCHEN_CONFIG.theme.distinct, 'Kitchen page link-hover matches config distinct');
    assert.strictEqual(styles['--color-pop'], context.KITCHEN_CONFIG.theme.pop, 'Kitchen page pop color matches config pop');
    assert.strictEqual(styles['--color-urdu'], context.KITCHEN_CONFIG.theme.urdu, 'Kitchen page urdu color matches config urdu');

    // Test dynamic propagation using application code: KITCHEN_CONFIG.applyTheme()
    assert.strictEqual(typeof context.KITCHEN_CONFIG.applyTheme, 'function', 'KITCHEN_CONFIG.applyTheme should be a function');
    context.KITCHEN_CONFIG.theme.anchor = '#123456';
    context.KITCHEN_CONFIG.theme.urdu = '#ff5500';
    context.KITCHEN_CONFIG.applyTheme();
    assert.strictEqual(styles['--link-color'], '#123456', 'Propagated new color via KITCHEN_CONFIG.applyTheme()');
    assert.strictEqual(styles['--text-subtitle'], '#123456', 'Propagated new subtitle via KITCHEN_CONFIG.applyTheme()');
    assert.strictEqual(styles['--color-urdu'], '#ff5500', 'Propagated new urdu color via KITCHEN_CONFIG.applyTheme()');
}

// 2. Recipe Page Test
{
    const { context, styles } = createEnvironment('/kitchen/recipes/yellowdaal/index.html', true);
    vm.runInContext(configCode + '\n;globalThis.KITCHEN_CONFIG = KITCHEN_CONFIG;', context);

    assert.strictEqual(styles['--text-subtitle'], context.KITCHEN_CONFIG.theme.anchor, 'Recipe page subtitle matches config anchor');
    assert.strictEqual(styles['--link-color'], context.KITCHEN_CONFIG.theme.anchor, 'Recipe page anchor matches config anchor');
    assert.strictEqual(styles['--color-pop'], context.KITCHEN_CONFIG.theme.pop, 'Recipe page pop color matches config pop');
    assert.strictEqual(styles['--color-urdu'], context.KITCHEN_CONFIG.theme.urdu, 'Recipe page urdu color matches config urdu');
}

// 3. Professional Page Isolation Test (Standard URL)
{
    const { context, styles } = createEnvironment('/professional/index.html', false);
    vm.runInContext(configCode, context);

    assert.strictEqual(styles['--link-color'], undefined, 'Professional page should NOT have kitchen link-color applied');
    assert.strictEqual(styles['--text-subtitle'], undefined, 'Professional page should NOT have kitchen text-subtitle applied');
    assert.strictEqual(styles['--color-pop'], undefined, 'Professional page should NOT have kitchen color-pop applied');
    assert.strictEqual(styles['--color-urdu'], undefined, 'Professional page should NOT have kitchen color-urdu applied');
}

// 4. Professional Page Isolation on file:/// URL with "kitchen" in ancestor folder
{
    const { context, styles } = createEnvironment('/Users/bilalabbasi/kitchen-work/site/professional/index.html', false);
    vm.runInContext(configCode, context);

    assert.strictEqual(styles['--link-color'], undefined, 'Ancestor folder containing "kitchen" must not bleed into professional page');
    assert.strictEqual(styles['--text-subtitle'], undefined, 'Ancestor folder containing "kitchen" must not bleed into professional page');
}

console.log('PASS: test_e2e_theme.js passed all end-to-end integration checks.');
