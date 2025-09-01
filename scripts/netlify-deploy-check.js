#!/usr/bin/env node
/**
 * Netlify Deployment Check Script
 * Validates environment and build readiness before deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Netlify Deployment Check');
console.log('==============================\n');

// Check for critical files
const criticalFiles = [
  'netlify.toml',
  'public/_redirects', 
  'dist/index.html',
  'dist/assets'
];

console.log('📁 Critical Files Check:');
let allFilesPresent = true;

criticalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesPresent = false;
  }
});

// Check netlify.toml configuration
console.log('\n⚙️  Netlify Configuration Check:');
const netlifyTomlPath = path.join(process.cwd(), 'netlify.toml');

if (fs.existsSync(netlifyTomlPath)) {
  const netlifyConfig = fs.readFileSync(netlifyTomlPath, 'utf8');
  
  // Check for SPA routing
  if (netlifyConfig.includes('/* /index.html 200') || netlifyConfig.includes('from = "/*"')) {
    console.log('✅ SPA routing configured');
  } else {
    console.log('⚠️  SPA routing may not be properly configured');
  }
  
  // Check for build settings
  if (netlifyConfig.includes('publish = "dist"')) {
    console.log('✅ Build output directory configured');
  } else {
    console.log('⚠️  Build output directory may not be configured');
  }
  
  // Check for security headers
  if (netlifyConfig.includes('[[headers]]')) {
    console.log('✅ Security headers configured');
  } else {
    console.log('⚠️  Security headers not configured');
  }
} else {
  console.log('❌ netlify.toml not found');
}

// Check build output
console.log('\n🏗️  Build Output Check:');
const distPath = path.join(process.cwd(), 'dist');

if (fs.existsSync(distPath)) {
  const distContents = fs.readdirSync(distPath);
  
  if (distContents.includes('index.html')) {
    console.log('✅ index.html found in dist');
  } else {
    console.log('❌ index.html missing from dist');
    allFilesPresent = false;
  }
  
  if (distContents.includes('assets')) {
    console.log('✅ assets directory found in dist');
    
    // Check for JavaScript files
    const assetsPath = path.join(distPath, 'assets');
    const assetFiles = fs.readdirSync(assetsPath);
    const jsFiles = assetFiles.filter(file => file.endsWith('.js'));
    const cssFiles = assetFiles.filter(file => file.endsWith('.css'));
    
    if (jsFiles.length > 0) {
      console.log(`✅ ${jsFiles.length} JavaScript files found`);
    } else {
      console.log('⚠️  No JavaScript files found in assets');
    }
    
    if (cssFiles.length > 0) {
      console.log(`✅ ${cssFiles.length} CSS files found`);
    } else {
      console.log('⚠️  No CSS files found in assets');
    }
  } else {
    console.log('❌ assets directory missing from dist');
    allFilesPresent = false;
  }
} else {
  console.log('❌ dist directory not found - run "npm run build" first');
  allFilesPresent = false;
}

// Check package.json scripts
console.log('\n📦 Package.json Scripts Check:');
const packageJsonPath = path.join(process.cwd(), 'package.json');

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('✅ build script configured');
  } else {
    console.log('❌ build script missing');
  }
  
  if (packageJson.scripts && packageJson.scripts.preview) {
    console.log('✅ preview script available');
  } else {
    console.log('⚠️  preview script not available');
  }
} else {
  console.log('❌ package.json not found');
  allFilesPresent = false;
}

// Environment variables check
console.log('\n🌍 Environment Check:');
console.log(`Node version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);

// Final assessment
console.log('\n📊 Deployment Readiness Assessment:');
if (allFilesPresent) {
  console.log('🟢 READY FOR DEPLOYMENT');
  console.log('All critical files and configurations are present.');
  
  console.log('\n📝 Deployment Commands:');
  console.log('   Manual Deploy: netlify deploy --prod --dir=dist');
  console.log('   Or push to connected Git branch for auto-deploy');
  
  process.exit(0);
} else {
  console.log('🔴 NOT READY FOR DEPLOYMENT');
  console.log('Some critical files or configurations are missing.');
  console.log('Please resolve the issues above before deploying.');
  
  console.log('\n🛠️  Quick Fixes:');
  console.log('   1. Run "npm run build" to generate dist files');
  console.log('   2. Check netlify.toml configuration');
  console.log('   3. Verify _redirects file exists');
  
  process.exit(1);
}