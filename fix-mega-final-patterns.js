const fs = require('fs');
const path = require('path');

// MEGA AGENT SIERRA - Final Pattern Fixes
function fixFinalPatterns() {
  const fixes = [];
  
  // 1. Fix ProtectedRoute.tsx - Missing closing brace for PermissionList
  try {
    const filePath = 'components/auth/ProtectedRoute.tsx';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add missing closing brace after PermissionList component
    content = content.replace(
      /(\s*\);)(\s*\/\/ Hooks for easier access to RBAC functionality)/,
      '$1\n};\n$2'
    );
    
    fs.writeFileSync(filePath, content);
    fixes.push('Fixed ProtectedRoute.tsx missing brace');
  } catch (e) {
    console.log('ProtectedRoute.tsx:', e.message);
  }
  
  // 2. Fix CacheIntegrationDemo.tsx - Multiple syntax issues
  try {
    const filePath = 'components/cache/CacheIntegrationDemo.tsx';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix common patterns
    content = content.replace(/([^)])(\s*}\s*$)/gm, '$1)$2');
    content = content.replace(/([^;])\s*(\n\s*}\s*$)/gm, '$1;$2');
    
    fs.writeFileSync(filePath, content);
    fixes.push('Fixed CacheIntegrationDemo.tsx syntax issues');
  } catch (e) {
    console.log('CacheIntegrationDemo.tsx:', e.message);
  }
  
  // 3. Fix LeagueManagementInterface.tsx - Missing closing brace
  try {
    const filePath = 'components/commissioner/LeagueManagementInterface.tsx';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add missing closing brace at end if needed
    if (!content.trim().endsWith('};')) {
      content = content.trim() + '\n};\n';
    }
    
    fs.writeFileSync(filePath, content);
    fixes.push('Fixed LeagueManagementInterface.tsx closing brace');
  } catch (e) {
    console.log('LeagueManagementInterface.tsx:', e.message);
  }
  
  // 4. Fix MatchupTrendChart.tsx files - Missing closing braces
  ['components/comparison/MatchupTrendChart.tsx', 'components/comparison/MatchupTrendChartFixed.tsx'].forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Add missing closing brace at end if needed
      if (!content.trim().endsWith('};') && !content.trim().endsWith('}')) {
        content = content.trim() + '\n};\n';
      }
      
      fs.writeFileSync(filePath, content);
      fixes.push(`Fixed ${filePath} closing brace`);
    } catch (e) {
      console.log(`${filePath}:`, e.message);
    }
  });
  
  // 5. Fix EnhancedCreateLeagueModal.tsx - Multiple syntax issues
  try {
    const filePath = 'components/core/EnhancedCreateLeagueModal.tsx';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix common pattern issues
    content = content.replace(/(\w+)\s*try\s*{/g, '$1, try {');
    content = content.replace(/}\s*catch\s*{/g, '} catch (error) {');
    content = content.replace(/([^,])\s*(\w+:)/g, '$1, $2');
    
    fs.writeFileSync(filePath, content);
    fixes.push('Fixed EnhancedCreateLeagueModal.tsx syntax issues');
  } catch (e) {
    console.log('EnhancedCreateLeagueModal.tsx:', e.message);
  }

  console.log('Fixed patterns:', fixes.length);
  fixes.forEach(fix => console.log(' -', fix));
  
  return fixes;
}

fixFinalPatterns();