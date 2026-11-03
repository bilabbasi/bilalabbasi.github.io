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
assert.ok(scope.KITCHEN_CONFIG.theme.anchor, 'theme.anchor should be defined');
assert.ok(scope.KITCHEN_CONFIG.theme.distinct, 'theme.distinct should be defined');
assert.ok(scope.KITCHEN_CONFIG.theme.pop, 'theme.pop should be defined');

// Assert dynamic CSS variable injection matches config
assert.strictEqual(styles['--link-color'], scope.KITCHEN_CONFIG.theme.anchor, '--link-color should match theme.anchor');
assert.strictEqual(styles['--text-subtitle'], scope.KITCHEN_CONFIG.theme.anchor, '--text-subtitle should match theme.anchor');
assert.strictEqual(styles['--link-hover'], scope.KITCHEN_CONFIG.theme.distinct, '--link-hover should match theme.distinct');
assert.strictEqual(styles['--color-pop'], scope.KITCHEN_CONFIG.theme.pop, '--color-pop should match theme.pop');

console.log('PASS: test_theme_config.js passed all checks.');
