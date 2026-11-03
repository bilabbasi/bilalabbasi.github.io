const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

// Mock DOM environment
const styles = {};
const context = {
    document: {
        documentElement: {
            style: {
                setProperty: (prop, value) => {
                    styles[prop] = value;
                },
                getPropertyValue: (prop) => styles[prop]
            }
        }
    },
    console: console,
    styles: styles
};
vm.createContext(context);

// Read and execute config.js in context
const code = fs.readFileSync(__dirname + '/../config.js', 'utf-8');
const scope = vm.runInContext(code + '\n;({ KITCHEN_CONFIG, styles })', context);

// Assert theme object exists
assert.ok(scope.KITCHEN_CONFIG, 'KITCHEN_CONFIG should exist');
assert.ok(scope.KITCHEN_CONFIG.theme, 'KITCHEN_CONFIG.theme should exist');
assert.strictEqual(scope.KITCHEN_CONFIG.theme.anchor, '#b45309', 'theme.anchor should match original subtitle #b45309');
assert.strictEqual(scope.KITCHEN_CONFIG.theme.distinct, '#ff5722', 'theme.distinct should be #ff5722');
assert.strictEqual(scope.KITCHEN_CONFIG.theme.pop, '#ccff00', 'theme.pop should be #ccff00');

// Assert CSS variable injection happened
assert.strictEqual(styles['--link-color'], '#b45309', '--link-color should be injected');
assert.strictEqual(styles['--text-subtitle'], '#b45309', '--text-subtitle should be injected');
assert.strictEqual(styles['--link-hover'], '#ff5722', '--link-hover should be injected');
assert.strictEqual(styles['--color-pop'], '#ccff00', '--color-pop should be injected');

console.log('PASS: test_theme_config.js passed all checks.');
