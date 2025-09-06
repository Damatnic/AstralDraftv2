#!/usr/bin/env node

// Simple Node.js build script for Netlify
// This ensures we use npm and vite correctly

const { execSync } = require('child_process');

console.log('🚀 Starting Astral Draft build...');

try {
  // Show versions
  console.log('Node version:', process.version);
  console.log('NPM version:', execSync('npm --version', { encoding: 'utf8' }).trim());
  
  // Clean install dependencies including dev dependencies
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm ci --include=dev', { stdio: 'inherit' });
  } catch (error) {
    console.log('npm ci failed, trying npm install...');
    execSync('npm install --include=dev', { stdio: 'inherit' });
  }
  
  // Verify Vite is installed
  console.log('🔍 Verifying Vite installation...');
  try {
    const viteVersion = execSync('npx vite --version', { encoding: 'utf8' }).trim();
    console.log('Vite version:', viteVersion);
  } catch (error) {
    console.log('⚠️ Vite not found, installing explicitly...');
    execSync('npm install vite@^7.0.6 --save-dev', { stdio: 'inherit' });
  }
  
  // Build with Vite
  console.log('🏗️ Building with Vite...');
  execSync('npx vite build --mode production', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}