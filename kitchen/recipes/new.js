#!/usr/bin/env node

/**
 * Recipe scaffolder for The Kitchen.
 *
 * Usage:
 *   node kitchen/recipes/new.js <slug> path/to/recipe.yaml
 *   node kitchen/recipes/new.js <slug> "Dish Title" "Short description"
 *   node kitchen/recipes/new.js <slug>
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const force = args.includes('--force');
const positional = args.filter(a => a !== '--force');

if (positional.length === 0 || args.includes('-h') || args.includes('--help')) {
    console.log(`
Usage:
  node kitchen/recipes/new.js <slug> path/to/recipe.yaml
  node kitchen/recipes/new.js <slug> "Dish Title" "Short description"
  node kitchen/recipes/new.js <slug>

Options:
  --force    Overwrite existing recipe folder if it already exists
  -h, --help Show this help message
`);
    process.exit(positional.length === 0 ? 1 : 0);
}

const slug = positional[0].trim();
if (!/^[a-z0-9_-]+$/i.test(slug)) {
    console.error(`Error: slug "${slug}" should contain only letters, numbers, underscores, or hyphens.`);
    process.exit(1);
}

const recipesRoot = __dirname;
const targetDir = path.join(recipesRoot, slug);
const assetsDir = path.join(targetDir, 'assets');

if (fs.existsSync(targetDir) && !force) {
    console.error(`Error: ${path.relative(process.cwd(), targetDir)} already exists. Pass --force to overwrite.`);
    process.exit(1);
}

function readYamlScalar(yamlText, key) {
    const match = yamlText.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    if (!match) return '';
    return match[1].trim().replace(/^["']|["']$/g, '');
}

function escapeHtmlAttr(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeTemplateLiteral(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');
}

let title = slug.replace(/[-_]/g, ' ');
let description = 'A family recipe from Ammi’s kitchen.';
let category = 'veg';
let categoryUrdu = 'سبزی';
let recipeJsContent = '';
const imagesToCopy = [];

function processYamlImages(yamlText) {
    const usedNames = new Map();
    const lines = yamlText.split(/\r?\n/);

    const updatedLines = lines.map(line => {
        const match = line.match(/^(\s*image:\s*)(.+)$/);
        if (!match) return line;

        const prefix = match[1];
        let rawVal = match[2].trim();
        let comment = '';
        const commentMatch = rawVal.match(/^((?:"[^"]*"|'[^']*'|[^\s#]+))(\s+#.*)$/);
        if (commentMatch) {
            rawVal = commentMatch[1];
            comment = commentMatch[2];
        }

        const imgPath = rawVal.replace(/^["']|["']$/g, '').trim();
        if (!imgPath) return line;

        if (!path.isAbsolute(imgPath)) {
            console.error(`Error: image path "${imgPath}" must be an absolute path.`);
            process.exit(1);
        }
        if (!fs.existsSync(imgPath)) {
            console.error(`Error: image file not found: ${imgPath}`);
            process.exit(1);
        }

        let destName = usedNames.get(imgPath);
        if (!destName) {
            const base = path.basename(imgPath);
            destName = base;
            let counter = 2;
            while ([...usedNames.values()].includes(destName)) {
                const ext = path.extname(base);
                const stem = path.basename(base, ext);
                destName = `${stem}_${counter}${ext}`;
                counter++;
            }
            usedNames.set(imgPath, destName);
            imagesToCopy.push({ src: imgPath, destName });
        }

        return `${prefix}"assets/${destName}"${comment}`;
    });

    return updatedLines.join('\n');
}

const secondArg = positional[1];
if (secondArg && /\.(ya?ml)$/i.test(secondArg)) {
    const yamlPath = path.resolve(process.cwd(), secondArg);
    if (!fs.existsSync(yamlPath)) {
        console.error(`Error: YAML file not found: ${yamlPath}`);
        process.exit(1);
    }
    const rawYaml = fs.readFileSync(yamlPath, 'utf8').trim();
    const yamlText = processYamlImages(rawYaml);
    title = readYamlScalar(yamlText, 'title') || title;
    description = readYamlScalar(yamlText, 'description') || description;
    category = readYamlScalar(yamlText, 'category') || category;
    categoryUrdu = readYamlScalar(yamlText, 'categoryUrdu') || categoryUrdu;

    recipeJsContent = `const RECIPE_DATA = \`\n${escapeTemplateLiteral(yamlText)}\n\`;\n`;
} else {
    if (secondArg) title = secondArg;
    if (positional[2]) description = positional[2];

    recipeJsContent = `const RECIPE_DATA = \`
title: "${title}"
subtitle: ""
description: "${description}"
image: "../../../assets/kitchen_sketch.png"

ingredients:
  - section: "Main Ingredients"
    items:
      - "1 cup ..."

steps:
  - section: "Preparation"
    image: "../../../assets/kitchen_sketch_step1.png"
    items:
      - "Step 1..."
\`;
`;
}

const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../../../assets/favicon_ba_urdu_orange.png">
    <title>${escapeHtmlAttr(title)} — the kitchen</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="${escapeHtmlAttr(description)}">
    <meta name="author" content="Bilal Abbasi">
    <meta name="robots" content="index, follow">

    <!-- Fonts: Lora, Inter, and Noto Nastaliq Urdu -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Nastaliq+Urdu:wght@400..700&display=swap">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="../../../index.css">
    <link rel="stylesheet" href="../css/recipe-base.css">
    <link rel="stylesheet" href="../css/recipe-side-by-side.css">
    <link rel="stylesheet" href="../css/recipe-step-by-step.css">
    <link rel="stylesheet" href="../css/recipe-progress-bar.css">

    <!-- YAML Parser Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script>

    <!-- Configuration Data -->
    <script src="../../../config.js"></script>
    <script src="../../../js/theme.js"></script>

    <!-- Navigation Component -->
    <script src="../../../nav.js" defer></script>

    <!-- Recipe Data & Ingredient Catalog -->
    <script src="../../ingredients/catalog.js"></script>
    <script src="recipe.js"></script>

    <!-- Shared Recipe Engine -->
    <script src="../js/floating-stage.js" defer></script>
    <script src="../js/qalam-progress.js" defer></script>
    <script src="../recipe-engine.js" defer></script>
</head>

<body>
    <div id="recipe-root"></div>
</body>

</html>
`;

fs.mkdirSync(assetsDir, { recursive: true });
for (const img of imagesToCopy) {
    fs.copyFileSync(img.src, path.join(assetsDir, img.destName));
}
fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtmlContent, 'utf8');
fs.writeFileSync(path.join(targetDir, 'recipe.js'), recipeJsContent, 'utf8');

console.log(`Created recipe in kitchen/recipes/${slug}/`);
console.log(`  - index.html`);
console.log(`  - recipe.js`);
console.log(`  - assets/${imagesToCopy.length ? ` (${imagesToCopy.length} image${imagesToCopy.length === 1 ? '' : 's'} copied)` : ''}\n`);
console.log(`Next, add this entry to KITCHEN_CONFIG.recipes in config.js:\n`);
console.log(`        {
            category: "${category}",
            categoryUrdu: "${categoryUrdu}",
            name: "${title.toLowerCase()}",
            url: "recipes/${slug}/",
            description: "${description}"
        }`);
