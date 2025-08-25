#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify build process...\n');

// Check if we're in Netlify environment
const isNetlify = process.env.NETLIFY === 'true';
console.log(`Environment: ${isNetlify ? 'Netlify' : 'Local'}`);

// Verify package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found');
  process.exit(1);
}

// Check if Vite is available
try {
  execSync('npx vite --version', { stdio: 'pipe' });
  console.log('✅ Vite found');
} catch (error) {
  console.log('⚠️  Vite not found in PATH, trying to install...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (installError) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
}

// Run environment verification if script exists
if (fs.existsSync('scripts/verify-env.js')) {
  try {
    console.log('\n🔍 Running environment verification...');
    execSync('node scripts/verify-env.js', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Environment verification failed, continuing with build...');
  }
} else {
  console.log('⚠️  Environment verification script not found, skipping...');
}

// Build the project
console.log('\n🏗️  Building project...');
try {
  execSync('npx vite build --mode production', { stdio: 'inherit' });
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed');
  console.error('Error:', error.message);
  process.exit(1);
}

// Verify build output
if (!fs.existsSync('dist/index.html')) {
  console.error('❌ Build verification failed: dist/index.html not found');
  process.exit(1);
}

console.log('✅ Build verification passed');
console.log('\n🎉 Netlify build completed successfully!');