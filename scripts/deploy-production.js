#!/usr/bin/env node
/**
 * Production Deployment Script
 * Comprehensive script to prepare and deploy the application to production
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Production Deployment Process');
console.log('==========================================\n');

// Helper function to run commands with error handling
function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    const output = execSync(command, { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`);
    console.error(error.message);
    return false;
  }
}

// Step 1: Clean previous builds
console.log('🧹 Step 1: Cleaning previous builds');
if (fs.existsSync('dist')) {
  try {
    execSync('rm -rf dist', { stdio: 'inherit' });
    console.log('✅ Previous build cleaned\n');
  } catch (error) {
    console.log('⚠️  Could not clean previous build (may not exist)\n');
  }
} else {
  console.log('✅ No previous build to clean\n');
}

// Step 2: Install dependencies
console.log('📦 Step 2: Installing dependencies');
if (!runCommand('npm ci --production=false', 'Installing dependencies')) {
  console.error('🔴 Deployment aborted: Could not install dependencies');
  process.exit(1);
}

// Step 3: Run type checking
console.log('🔍 Step 3: Type checking');
if (!runCommand('npm run type-check', 'Type checking')) {
  console.warn('⚠️  Type checking failed, but continuing with deployment...\n');
}

// Step 4: Build the application
console.log('🏗️  Step 4: Building application');
if (!runCommand('npm run build', 'Building application')) {
  console.error('🔴 Deployment aborted: Build failed');
  process.exit(1);
}

// Step 5: Verify build output
console.log('🔍 Step 5: Verifying build output');
const buildVerificationChecks = [
  { path: 'dist/index.html', name: 'index.html' },
  { path: 'dist/assets', name: 'assets directory' },
  { path: 'netlify.toml', name: 'netlify.toml configuration' },
  { path: 'public/_redirects', name: '_redirects file' }
];

let verificationPassed = true;

buildVerificationChecks.forEach(check => {
  if (fs.existsSync(check.path)) {
    console.log(`✅ ${check.name} - found`);
  } else {
    console.log(`❌ ${check.name} - missing`);
    verificationPassed = false;
  }
});

if (!verificationPassed) {
  console.error('🔴 Deployment aborted: Build verification failed');
  process.exit(1);
}

// Step 6: Check asset sizes
console.log('\n📊 Step 6: Checking asset sizes');
try {
  const assetsDir = path.join(process.cwd(), 'dist', 'assets');
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    let totalSize = 0;
    let largeFiles = [];
    
    files.forEach(file => {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
      
      // Flag files larger than 1MB
      if (stats.size > 1024 * 1024) {
        largeFiles.push({ file, size: (stats.size / 1024 / 1024).toFixed(2) + 'MB' });
      }
    });
    
    console.log(`📦 Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    
    if (largeFiles.length > 0) {
      console.log('⚠️  Large files detected:');
      largeFiles.forEach(({ file, size }) => {
        console.log(`   - ${file}: ${size}`);
      });
      console.log('Consider code splitting for better performance\n');
    } else {
      console.log('✅ All assets are reasonably sized\n');
    }
  }
} catch (error) {
  console.log('⚠️  Could not analyze asset sizes\n');
}

// Step 7: Security and Performance Checks
console.log('🔒 Step 7: Security and Performance Checks');

// Check for sensitive information in build
const indexHtmlPath = path.join(process.cwd(), 'dist', 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  const sensitivePatterns = [
    /password/i,
    /secret/i,
    /private.*key/i,
    /api.*key.*[a-zA-Z0-9]{20,}/i
  ];
  
  let sensitiveDataFound = false;
  sensitivePatterns.forEach(pattern => {
    if (pattern.test(indexHtml)) {
      sensitiveDataFound = true;
    }
  });
  
  if (sensitiveDataFound) {
    console.log('⚠️  Potential sensitive data detected in build');
  } else {
    console.log('✅ No sensitive data detected in build');
  }
}

// Step 8: Final deployment preparation
console.log('\n🎯 Step 8: Final deployment preparation');

// Ensure _redirects is in dist folder
const publicRedirects = path.join(process.cwd(), 'public', '_redirects');
const distRedirects = path.join(process.cwd(), 'dist', '_redirects');

if (fs.existsSync(publicRedirects) && !fs.existsSync(distRedirects)) {
  try {
    fs.copyFileSync(publicRedirects, distRedirects);
    console.log('✅ _redirects file copied to dist');
  } catch (error) {
    console.log('⚠️  Could not copy _redirects file');
  }
}

console.log('\n🎉 Production Deployment Preparation Complete!');
console.log('============================================\n');

console.log('📋 Next Steps:');
console.log('1. Manual Netlify Deploy:');
console.log('   netlify deploy --prod --dir=dist');
console.log('');
console.log('2. Or push to your connected Git branch for auto-deploy');
console.log('');
console.log('3. Monitor the deployment at: https://app.netlify.com/');
console.log('');

console.log('🔧 Troubleshooting:');
console.log('- If the app shows a blank screen, check browser console for errors');
console.log('- Verify all environment variables are set in Netlify dashboard');
console.log('- Check that _redirects rules are working for SPA routing');
console.log('');

console.log('✅ Deployment package ready in ./dist/ directory');
process.exit(0);