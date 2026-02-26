const fs = require('fs');
const path = require('path');

const gameFolder = process.argv[2]; // Fixed: process.argv[2] gets the path

if (!gameFolder) {
    console.error("Usage: node css-stitch.js C:\\Path\\To\\Game");
    process.exit(1);
}

// 1. Read 'css_order.txt' from the game folder
const orderPath = path.join(gameFolder, 'css_order.txt');
if (!fs.existsSync(orderPath)) {
    console.error("Error: Could not find css_order.txt in " + gameFolder);
    process.exit(1);
}

const files = fs.readFileSync(orderPath, 'utf-8').split('\n').map(f => f.trim()).filter(f => f);
let bundledContent = "/* Merged Stylesheet */\n";

// 2. Stitch CSS files together
files.forEach(fileName => {
    const filePath = path.join(gameFolder, fileName);
    if (fs.existsSync(filePath)) {
        console.log('Stitching CSS: ' + fileName);
        const content = fs.readFileSync(filePath, 'utf-8');
        // Add a newline and comment for clarity
        bundledContent += `\n/* --- SOURCE: ${fileName} --- */\n${content}\n`;
    } else {
        console.warn('WARNING: File not found: ' + filePath);
    }
});

// 3. Save to styles.css in the game folder
fs.writeFileSync(path.join(gameFolder, 'styles.css'), bundledContent);
console.log('\nSUCCESS! Created styles.css in: ' + gameFolder);
