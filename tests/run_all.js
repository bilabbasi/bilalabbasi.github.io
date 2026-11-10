/**
 * tests/run_all.js
 *
 * Unified test runner for Bilal Abbasi's website test suite.
 * Run via: node tests/run_all.js
 */

const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
    'test_theme.js',
    'test_styles.js',
    'test_nav.js'
];

console.log('Running test suite...\n');

let failed = false;

testFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    try {
        const output = execSync(`node "${fullPath}"`, { encoding: 'utf-8' });
        process.stdout.write(output);
    } catch (err) {
        console.error(`\nFAILED: ${file}`);
        if (err.stdout) process.stdout.write(err.stdout);
        if (err.stderr) process.stderr.write(err.stderr);
        failed = true;
    }
});

if (failed) {
    console.error('\n❌ Some tests failed.');
    process.exit(1);
} else {
    console.log('\n✨ All tests passed successfully.');
}
