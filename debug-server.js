#!/usr/bin/env node

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8770;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Add debugging headers
app.use((req, res, next) => {
  // Add CORS headers for debugging
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  // Add debugging info
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  next();
});

// Custom service worker with debugging
app.get('/sw.js', (req, res) => {
  console.log('Service Worker requested');
  const swPath = path.join(__dirname, 'public', 'sw.js');
  
  if (fs.existsSync(swPath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Service-Worker-Allowed', '/');
    res.sendFile(swPath);
  } else {
    console.log('SW not found, serving minimal version');
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
console.log('[DEBUG SW] Minimal debug service worker loaded');

self.addEventListener('install', (event) => {
  console.log('[DEBUG SW] Installing');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('[DEBUG SW] Activating');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Just pass through all requests
  event.respondWith(fetch(event.request));
});
    `);
  }
});

// Catch-all handler: send back React app
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build files not found. Run "npm run build" first.');
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).send('Server error: ' + error.message);
});

app.listen(PORT, () => {
  console.log(`🚀 Debug server running at http://localhost:${PORT}`);
  console.log(`📁 Serving from: ${path.join(__dirname, 'dist')}`);
  console.log(`🔍 Service Worker debugging enabled`);
  console.log(`📊 Request logging enabled`);
});