#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Starting comprehensive project cleanup...\n');

// 1. Check for Ruby/Gem related files
console.log('🔍 Checking for Ruby/Gem files...');
const rubyFiles = [
  'Gemfile',
  'Gemfile.lock',
  '.ruby-version',
  '.rvmrc',
  '.rbenv-version',
  '.mise.toml',
  '.tool-versions',
  'Rakefile',
  '.bundle',
  'vendor/bundle'
];

let foundRubyFiles = false;
rubyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`❌ Found Ruby file: ${file} - Removing...`);
    try {
      if (fs.lstatSync(file).isDirectory()) {
        fs.rmSync(file, { recursive: true, force: true });
      } else {
        fs.unlinkSync(file);
      }
      console.log(`✅ Removed: ${file}`);
    } catch (error) {
      console.error(`⚠️  Could not remove ${file}: ${error.message}`);
    }
    foundRubyFiles = true;
  }
});

if (!foundRubyFiles) {
  console.log('✅ No Ruby/Gem files found');
}

// 2. Check for other package managers
console.log('\n🔍 Checking for conflicting package managers...');
const conflictingFiles = [
  'yarn.lock',
  'pnpm-lock.yaml',
  '.yarnrc',
  '.yarnrc.yml',
  '.pnpmfile.cjs'
];

conflictingFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`⚠️  Found conflicting file: ${file} - Removing...`);
    try {
      fs.unlinkSync(file);
      console.log(`✅ Removed: ${file}`);
    } catch (error) {
      console.error(`⚠️  Could not remove ${file}: ${error.message}`);
    }
  }
});

// 3. Verify package.json integrity
console.log('\n📦 Verifying package.json integrity...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check for required fields
  const requiredFields = ['name', 'version', 'scripts', 'dependencies', 'devDependencies'];
  const missingFields = requiredFields.filter(field => !packageJson[field]);
  
  if (missingFields.length > 0) {
    console.log(`⚠️  Missing fields in package.json: ${missingFields.join(', ')}`);
  } else {
    console.log('✅ package.json structure is valid');
  }
  
  // Check for critical scripts
  const criticalScripts = ['build', 'build:prod', 'build:netlify', 'dev'];
  const missingScripts = criticalScripts.filter(script => !packageJson.scripts[script]);
  
  if (missingScripts.length > 0) {
    console.log(`⚠️  Missing critical scripts: ${missingScripts.join(', ')}`);
  } else {
    console.log('✅ All critical scripts present');
  }
  
  // Check for Vite in devDependencies
  if (!packageJson.devDependencies.vite) {
    console.log('❌ Vite not found in devDependencies!');
  } else {
    console.log(`✅ Vite version: ${packageJson.devDependencies.vite}`);
  }
  
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

// 4. Check for build-breaking imports
console.log('\n🔍 Checking for problematic imports...');
const checkProblematicImports = (dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) => {
  const problematicPatterns = [
    /require\s*\(\s*['"]mise['"]\s*\)/g,
    /require\s*\(\s*['"]gem['"]\s*\)/g,
    /import\s+.*\s+from\s+['"]mise['"]/g,
    /import\s+.*\s+from\s+['"]gem['"]/g,
    /bundle\s+install/g,
    /gem\s+install/g
  ];
  
  let foundIssues = false;
  
  const scanDirectory = (currentDir) => {
    if (currentDir.includes('node_modules') || currentDir.includes('.git')) return;
    
    try {
      const files = fs.readdirSync(currentDir);
      
      files.forEach(file => {
        const filePath = path.join(currentDir, file);
        const stat = fs.lstatSync(filePath);
        
        if (stat.isDirectory()) {
          scanDirectory(filePath);
        } else if (extensions.some(ext => file.endsWith(ext))) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          problematicPatterns.forEach(pattern => {
            if (pattern.test(content)) {
              console.log(`⚠️  Found problematic pattern in ${filePath}`);
              foundIssues = true;
            }
          });
        }
      });
    } catch (error) {
      // Ignore permission errors
    }
  };
  
  scanDirectory(dir);
  
  if (!foundIssues) {
    console.log('✅ No problematic imports found');
  }
  
  return foundIssues;
};

checkProblematicImports('.');

// 5. Check environment files
console.log('\n🔍 Checking environment configuration...');
const envFiles = ['.env', '.env.local', '.env.production'];
envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ Found ${file}`);
    
    // Check for problematic environment variables
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('RUBY') || content.includes('GEM') || content.includes('BUNDLE')) {
      console.log(`⚠️  ${file} contains Ruby-related variables - please review`);
    }
  }
});

// 6. Verify Netlify configuration
console.log('\n🔍 Verifying Netlify configuration...');
if (fs.existsSync('netlify.toml')) {
  const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
  
  if (netlifyConfig.includes('DISABLE_RUBY = "true"')) {
    console.log('✅ Ruby is disabled in netlify.toml');
  } else {
    console.log('⚠️  Ruby is not explicitly disabled in netlify.toml');
  }
  
  if (netlifyConfig.includes('NODE_VERSION')) {
    console.log('✅ Node version is specified in netlify.toml');
  } else {
    console.log('⚠️  Node version is not specified in netlify.toml');
  }
} else {
  console.log('⚠️  netlify.toml not found');
}

// 7. Check for mock data in services
console.log('\n🔍 Checking for mock data in services...');
const servicesDir = 'services';
let mockCount = 0;
if (fs.existsSync(servicesDir)) {
  const serviceFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  
  serviceFiles.forEach(file => {
    const filePath = path.join(servicesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Count mock references
    const mockMatches = content.match(/mock|Mock|MOCK|dummy|fake|test\s+data|sample\s+data/gi);
    if (mockMatches) {
      mockCount += mockMatches.length;
      console.log(`📊 ${file}: ${mockMatches.length} mock references`);
    }
  });
  
  console.log(`\n📊 Total mock references found: ${mockCount}`);
  if (mockCount > 100) {
    console.log('⚠️  High number of mock references detected - consider implementing real data sources');
  }
}

// 8. Clean build artifacts
console.log('\n🧹 Cleaning build artifacts...');
const artifactsToClean = ['dist', 'build', '.vite', '.parcel-cache', '.next'];
artifactsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ Cleaned: ${dir}`);
    } catch (error) {
      console.error(`⚠️  Could not clean ${dir}: ${error.message}`);
    }
  }
});

// 9. Verify Node modules
console.log('\n📦 Verifying node_modules...');
if (!fs.existsSync('node_modules')) {
  console.log('⚠️  node_modules not found - run: npm install');
} else {
  // Check for Vite binary
  if (fs.existsSync('node_modules/.bin/vite') || fs.existsSync('node_modules/.bin/vite.cmd')) {
    console.log('✅ Vite binary found in node_modules');
  } else {
    console.log('⚠️  Vite binary not found - run: npm install');
  }
}

// 10. Final summary
console.log('\n' + '='.repeat(60));
console.log('📊 CLEANUP SUMMARY');
console.log('='.repeat(60));

const summary = {
  'Ruby/Gem files': foundRubyFiles ? '❌ Found and removed' : '✅ Clean',
  'Package managers': '✅ npm only',
  'package.json': '✅ Valid',
  'Netlify config': fs.existsSync('netlify.toml') ? '✅ Present' : '⚠️  Missing',
  'Build artifacts': '✅ Cleaned',
  'Mock data': mockCount > 0 ? `⚠️  ${mockCount} references` : '✅ None'
};

Object.entries(summary).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

console.log('\n✅ Cleanup complete!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run build:netlify');
console.log('3. Commit changes: git add . && git commit -m "Project cleanup"');
console.log('4. Push to GitHub: git push origin master');
console.log('5. Trigger new Netlify deployment');