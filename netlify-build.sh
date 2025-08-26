#!/bin/bash
# Simple Netlify build script that only uses Node.js/npm

echo "🚀 Starting Netlify Node.js-only build..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Clean install dependencies
echo "📦 Installing dependencies with npm ci..."
npm ci

# Build the project
echo "🏗️ Building project..."
npx vite build --mode production

echo "✅ Build complete!"