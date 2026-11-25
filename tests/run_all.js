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
    'test_nav.js',
    'test_gateway.js',
    'test_links.js',
    'test_recipes.js'
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

// Run Python ingredient catalog unit tests
try {
    execSync('python3 -m unittest tests/test_ingredients.py', {
        cwd: path.resolve(__dirname, '..'),
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log('PASS: test_ingredients.py passed all checks.');
} catch (err) {
    console.error('\nFAILED: test_ingredients.py');
    if (err.stdout) process.stdout.write(err.stdout);
    if (err.stderr) process.stderr.write(err.stderr);
    failed = true;
}

if (failed) {
    console.error('\n❌ Some tests failed.');
    process.exit(1);
} else {
    console.log('\n✨ All tests passed successfully.');
}
