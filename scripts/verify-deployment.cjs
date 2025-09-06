#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Verifies that all necessary files and configurations are ready for Netlify deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Astral Draft deployment readiness...\n');

const checks = [];

// Check 1: Essential files exist
const essentialFiles = [
  'netlify.toml',
  'build.cjs',
  'package.json',
  'vite.config.ts',
  'public/manifest.json',
  'public/sw.js',
  'public/offline.html',
  'dist/index.html'
];

essentialFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  checks.push({
    name: `Essential file: ${file}`,
    status: exists,
    message: exists ? '✅ Found' : '❌ Missing'
  });
});

// Check 2: Package.json has required scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'build:simple', 'dev'];

requiredScripts.forEach(script => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  checks.push({
    name: `Build script: ${script}`,
    status: exists,
    message: exists ? '✅ Configured' : '❌ Missing'
  });
});

// Check 3: Required dependencies
const requiredDeps = ['react', 'react-dom', 'vite', 'framer-motion'];

requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
  checks.push({
    name: `Dependency: ${dep}`,
    status: exists,
    message: exists ? '✅ Installed' : '❌ Missing'
  });
});

// Check 4: Netlify configuration
if (fs.existsSync('netlify.toml')) {
  const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
  
  const configChecks = [
    { key: 'publish = "dist"', name: 'Publish directory' },
    { key: 'command = "node build.cjs"', name: 'Build command' },
    { key: 'NODE_VERSION = "20"', name: 'Node version' },
    { key: '[[redirects]]', name: 'Redirects configured' }
  ];
  
  configChecks.forEach(check => {
    const exists = netlifyConfig.includes(check.key);
    checks.push({
      name: `Netlify config: ${check.name}`,
      status: exists,
      message: exists ? '✅ Configured' : '❌ Missing'
    });
  });
}

// Check 5: PWA files
const pwaFiles = [
  'public/manifest.json',
  'public/sw.js',
  'public/icon-192.png',
  'public/icon-512.png'
];

pwaFiles.forEach(file => {
  const exists = fs.existsSync(file);
  checks.push({
    name: `PWA file: ${path.basename(file)}`,
    status: exists,
    message: exists ? '✅ Ready' : '❌ Missing'
  });
});

// Check 6: Build output
const buildFiles = [
  'dist/index.html',
  'dist/assets'
];

buildFiles.forEach(file => {
  const exists = fs.existsSync(file);
  checks.push({
    name: `Build output: ${path.basename(file)}`,
    status: exists,
    message: exists ? '✅ Generated' : '⚠️ Run build first'
  });
});

// Display results
console.log('📋 DEPLOYMENT VERIFICATION RESULTS:\n');

let passedChecks = 0;
let totalChecks = checks.length;

checks.forEach(check => {
  console.log(`${check.message} ${check.name}`);
  if (check.status) passedChecks++;
});

console.log(`\n📊 SUMMARY: ${passedChecks}/${totalChecks} checks passed\n`);

if (passedChecks === totalChecks) {
  console.log('🎉 DEPLOYMENT READY!');
  console.log('✅ All checks passed - ready for Netlify deployment');
  console.log('\n🚀 Next steps:');
  console.log('1. Push to GitHub: git push origin master');
  console.log('2. Netlify will automatically deploy');
  console.log('3. Check deployment logs in Netlify dashboard');
  console.log('4. Verify site functionality after deployment');
} else {
  console.log('⚠️  DEPLOYMENT ISSUES DETECTED');
  console.log('❌ Some checks failed - please fix before deploying');
  console.log('\n🔧 Common fixes:');
  console.log('- Run "npm run build" to generate dist folder');
  console.log('- Ensure all required files are committed');
  console.log('- Check netlify.toml configuration');
  console.log('- Verify PWA files are in public folder');
}

console.log('\n📚 For help, see: NETLIFY_DEPLOYMENT_CHECKLIST.md');

process.exit(passedChecks === totalChecks ? 0 : 1);