#!/usr/bin/env node
/**
 * Explorations Sync Server
 * 
 * A simple local server that saves exploration data to the repo.
 * Run alongside Expo with: npm run dev
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const DATA_FILE = path.join(__dirname, '..', 'data', 'explorations.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
        version: 1,
        lastUpdated: new Date().toISOString(),
        explorations: []
    }, null, 2));
}

const server = http.createServer((req, res) => {
    // CORS headers for Expo
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // GET /data - Read explorations
    if (req.method === 'GET' && req.url === '/data') {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read data' }));
        }
        return;
    }

    // POST /sync - Save explorations
    if (req.method === 'POST' && req.url === '/sync') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const fileData = {
                    version: 1,
                    lastUpdated: new Date().toISOString(),
                    explorations: data.explorations || []
                };
                fs.writeFileSync(DATA_FILE, JSON.stringify(fileData, null, 2));
                console.log(`✅ Synced ${fileData.explorations.length} explorations to repo`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, count: fileData.explorations.length }));
            } catch (error) {
                console.error('❌ Sync failed:', error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to sync' }));
            }
        });
        return;
    }

    // Health check
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', file: DATA_FILE }));
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`\n🔄 Explorations Sync Server running on http://localhost:${PORT}`);
    console.log(`📁 Data file: ${DATA_FILE}\n`);
});
