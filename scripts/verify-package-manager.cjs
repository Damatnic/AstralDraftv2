#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📦 Verifying package manager configuration...\n');

// Check for package-lock.json (npm)
const hasPackageLock = fs.existsSync('package-lock.json');
console.log(`npm (package-lock.json): ${hasPackageLock ? '✅ Found' : '❌ Missing'}`);

// Check for yarn.lock
const hasYarnLock = fs.existsSync('yarn.lock');
console.log(`yarn (yarn.lock): ${hasYarnLock ? '⚠️  Found (should remove)' : '✅ Not found'}`);

// Check for pnpm-lock.yaml
const hasPnpmLock = fs.existsSync('pnpm-lock.yaml');
console.log(`pnpm (pnpm-lock.yaml): ${hasPnpmLock ? '⚠️  Found (should remove)' : '✅ Not found'}`);

// Check for Ruby files that might trigger gem detection
const rubyFiles = [
  'Gemfile',
  'Gemfile.lock',
  '.ruby-version',
  '.rvmrc',
  '.rbenv-version',
  '.mise.toml',
  '.tool-versions'
];

console.log('\n🔍 Checking for Ruby/gem files that might trigger detection:');
let foundRubyFiles = false;
rubyFiles.forEach(file => {
  const exists = fs.existsSync(file);
  if (exists) {
    console.log(`❌ ${file}: Found (should remove)`);
    foundRubyFiles = true;
  } else {
    console.log(`✅ ${file}: Not found`);
  }
});

// Verify package.json scripts
console.log('\n📋 Verifying package.json build scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const buildScript = packageJson.scripts?.build;
  const buildNetlifyScript = packageJson.scripts?.['build:netlify'];
  
  console.log(`build script: ${buildScript ? '✅ Found' : '❌ Missing'}`);
  console.log(`build:netlify script: ${buildNetlifyScript ? '✅ Found' : '❌ Missing'}`);
  
  if (buildNetlifyScript) {
    console.log(`build:netlify command: ${buildNetlifyScript}`);
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

// Summary
console.log('\n📊 Summary:');
if (hasPackageLock && !hasYarnLock && !hasPnpmLock && !foundRubyFiles) {
  console.log('✅ Package manager configuration is correct for Netlify');
  console.log('✅ No Ruby/gem files detected');
  console.log('✅ Ready for Node.js-only deployment');
} else {
  console.log('⚠️  Issues detected:');
  if (!hasPackageLock) console.log('   - Missing package-lock.json (run: npm install)');
  if (hasYarnLock) console.log('   - Remove yarn.lock to prevent yarn detection');
  if (hasPnpmLock) console.log('   - Remove pnpm-lock.yaml to prevent pnpm detection');
  if (foundRubyFiles) console.log('   - Remove Ruby files to prevent gem detection');
}

console.log('\n🎯 Netlify will use: npm (Node.js only)');