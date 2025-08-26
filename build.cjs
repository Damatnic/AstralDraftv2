#!/usr/bin/env node

// Simple Node.js build script for Netlify
// This ensures we use npm and vite correctly

const { execSync } = require('child_process');

console.log('🚀 Starting Astral Draft build...');

try {
  // Show versions
  console.log('Node version:', process.version);
  console.log('NPM version:', execSync('npm --version', { encoding: 'utf8' }).trim());
  
  // Clean install dependencies
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm ci', { stdio: 'inherit' });
  } catch (error) {
    console.log('npm ci failed, trying npm install...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Build with Vite
  console.log('🏗️ Building with Vite...');
  execSync('npx vite build --mode production', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}