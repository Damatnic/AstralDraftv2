#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify deployment process...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if Netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'pipe' });
  console.log('✅ Netlify CLI found');
} catch (error) {
  console.log('📦 Installing Netlify CLI...');
  try {
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    console.log('✅ Netlify CLI installed');
  } catch (installError) {
    console.error('❌ Failed to install Netlify CLI. Please install manually: npm install -g netlify-cli');
    process.exit(1);
  }
}

// Verify environment variables
const requiredEnvVars = [
  'VITE_API_BASE_URL',
  'VITE_ENVIRONMENT'
];

console.log('\n🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('⚠️  Missing environment variables (will use defaults):');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
} else {
  console.log('✅ All required environment variables found');
}

// Clean and build
console.log('\n🧹 Cleaning previous build...');
try {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  console.log('✅ Clean completed');
} catch (error) {
  console.log('⚠️  Clean failed, continuing...');
}

console.log('\n📦 Installing dependencies...');
try {
  execSync('npm ci', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

console.log('\n🏗️  Building for production...');
try {
  execSync('npm run build:prod', { stdio: 'inherit' });
  console.log('✅ Build completed');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Verify build output
if (!fs.existsSync('dist/index.html')) {
  console.error('❌ Build verification failed: dist/index.html not found');
  process.exit(1);
}

console.log('✅ Build verification passed');

// Check if site is linked to Netlify
console.log('\n🔗 Checking Netlify site configuration...');
try {
  const result = execSync('netlify status', { encoding: 'utf8' });
  if (result.includes('Not linked to a Netlify site')) {
    console.log('⚠️  Site not linked to Netlify. Please run: netlify link');
    console.log('   Or create a new site: netlify init');
    process.exit(1);
  }
  console.log('✅ Site linked to Netlify');
} catch (error) {
  console.log('⚠️  Unable to check Netlify status. Continuing with deployment...');
}

// Deploy to Netlify
const isProduction = process.argv.includes('--prod');
const deployCommand = isProduction ? 'netlify deploy --prod' : 'netlify deploy';

console.log(`\n🚀 Deploying to Netlify ${isProduction ? '(PRODUCTION)' : '(PREVIEW)'}...`);
try {
  execSync(deployCommand, { stdio: 'inherit' });
  console.log(`\n✅ Deployment ${isProduction ? 'to production' : 'preview'} completed successfully!`);
  
  if (!isProduction) {
    console.log('\n💡 To deploy to production, run: npm run deploy:prod');
  }
} catch (error) {
  console.error(`❌ Deployment failed`);
  process.exit(1);
}

console.log('\n🎉 Deployment process completed!');

// Show helpful links
console.log('\n📋 Useful commands:');
console.log('   - View site: netlify open:site');
console.log('   - View admin: netlify open:admin');
console.log('   - Check logs: netlify logs');
console.log('   - Check functions: netlify functions:list');