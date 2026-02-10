const express = require('express');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');
const { createServer } = require('node:http');
const path = require('path');

const app = express();
const server = createServer(app);
const PORT = 8080;

// 1. Serve your 'public' folder files (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Serve the Ultraviolet frontend files (the 'engine' parts)
app.use('/uv/', express.static(uvPath));

// 3. Handle the main page routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 4. Start the server
server.listen(PORT, () => {
    console.log(`\n🚀 NEXUS PROXY IS RUNNING`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`\nPress Ctrl+C to stop the server\n`);
});