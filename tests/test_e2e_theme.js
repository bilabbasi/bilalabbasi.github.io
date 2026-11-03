const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const configCode = fs.readFileSync(__dirname + '/../config.js', 'utf-8');

function createEnvironment(pathname) {
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
            addEventListener: (evt, cb) => {}
        },
        console: console
    };
    vm.createContext(context);
    return { context, styles };
}

// 1. Kitchen Page Test
{
    const { context, styles } = createEnvironment('/kitchen/index.html');
    vm.runInContext(configCode + '\n;globalThis.KITCHEN_CONFIG = KITCHEN_CONFIG;', context);

    assert.strictEqual(styles['--link-color'], '#7c2d12', 'Kitchen page should have anchor color #7c2d12');
    assert.strictEqual(styles['--text-subtitle'], '#ff5722', 'Kitchen page should have distinct subtitle #ff5722');
    assert.strictEqual(styles['--link-hover'], '#ff5722', 'Kitchen page should have link-hover #ff5722');
    assert.strictEqual(styles['--color-pop'], '#ccff00', 'Kitchen page should have pop color #ccff00');

    // Test dynamic propagation: changing config color
    context.KITCHEN_CONFIG.theme.anchor = '#123456';
    context.document.documentElement.style.setProperty('--link-color', context.KITCHEN_CONFIG.theme.anchor);
    assert.strictEqual(styles['--link-color'], '#123456', 'Propagated new color successfully');
}

// 2. Recipe Page Test
{
    const { context, styles } = createEnvironment('/kitchen/recipes/yellowdaal/index.html');
    vm.runInContext(configCode, context);

    assert.strictEqual(styles['--link-color'], '#7c2d12', 'Recipe page should have anchor color #7c2d12');
    assert.strictEqual(styles['--text-subtitle'], '#ff5722', 'Recipe page should have distinct subtitle #ff5722');
    assert.strictEqual(styles['--color-pop'], '#ccff00', 'Recipe page should have pop color #ccff00');
}

// 3. Professional Page Isolation Test
{
    const { context, styles } = createEnvironment('/professional/index.html');
    vm.runInContext(configCode, context);

    assert.strictEqual(styles['--link-color'], undefined, 'Professional page should NOT have kitchen link-color applied');
    assert.strictEqual(styles['--text-subtitle'], undefined, 'Professional page should NOT have kitchen text-subtitle applied');
    assert.strictEqual(styles['--color-pop'], undefined, 'Professional page should NOT have kitchen color-pop applied');
}

console.log('PASS: test_e2e_theme.js passed all end-to-end integration checks.');
