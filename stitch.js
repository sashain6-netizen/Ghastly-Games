const fs = require('fs');
const path = require('path');

// Get the game folder path from the command line
const gameFolder = process.argv[2];

if (!gameFolder) {
    console.error("Usage: node stitch.js C:\\Path\\To\\Your\\Game");
    process.exit(1);
}

// 1. Safety Headers
const safetyHeader = `
var oldIE = false;
var Dropbox = { isBrowserSupported: function() { return false; } };
function _(s) { return s; }
var AudioLibrary = { BUILD_TRAP: "", playBackgroundMusic: function(){ return Promise.resolve(); }, playSound: function(){} };
`;

// 2. Read 'order.txt' from the SPECIFIC game folder
const orderPath = path.join(gameFolder, 'order.txt');
if (!fs.existsSync(orderPath)) {
    console.error("Error: Could not find order.txt in " + gameFolder);
    process.exit(1);
}

const files = fs.readFileSync(orderPath, 'utf-8').split('\n').map(f => f.trim()).filter(f => f);
let bundledContent = safetyHeader;

// 3. Stitch files from that folder
files.forEach(fileName => {
    const filePath = path.join(gameFolder, fileName);
    if (fs.existsSync(filePath)) {
        console.log('Stitching: ' + fileName);
        const content = fs.readFileSync(filePath, 'utf-8');
        bundledContent += `\n;\n// --- SOURCE: ${fileName} ---\n${content}\n;\n`;
    } else {
        console.warn('WARNING: File not found: ' + filePath);
    }
});

// 4. Save to the game folder
fs.writeFileSync(path.join(gameFolder, 'script.js'), bundledContent);
console.log('\nSUCCESS! Created script.js in: ' + gameFolder);
