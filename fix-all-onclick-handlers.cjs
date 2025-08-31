const fs = require('fs');

const filePath = 'C:\\Users\\damat\\_REPOS\\AD\\views\\LeagueDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Fixing all onClick handlers in LeagueDashboard.tsx...');

// Pattern 1: onClick={() => dispatch({ ... })} where the closing )} is missing
let fixes = 0;

// Fix various onClick patterns that are missing closing parentheses and braces
const patterns = [
  // Pattern: onClick={() => dispatch({ type: 'string', payload: 'string' as View }
  {
    pattern: /onClick=\{(\(\) => dispatch\(\{ type: '[^']+', payload: '[^']+' as View )\}/g,
    replacement: 'onClick={$1)}'
  },
  // Pattern: onClick={() => dispatch({ type: 'string', payload: variable as View }
  {
    pattern: /onClick=\{(\(\) => dispatch\(\{ type: '[^']+', payload: [^}]+ as View )\}/g,
    replacement: 'onClick={$1)}'
  },
  // Pattern: onClick={() => dispatch({ type: 'LOGOUT' }
  {
    pattern: /onClick=\{(\(\) => dispatch\(\{ type: 'LOGOUT' )\}/g,
    replacement: 'onClick={$1})}'
  },
];

patterns.forEach((patternConfig, index) => {
  const matches = content.match(patternConfig.pattern);
  if (matches) {
    console.log(`Pattern ${index + 1}: Found ${matches.length} matches`);
    matches.forEach(match => console.log(`  - ${match.substring(0, 80)}...`));
    content = content.replace(patternConfig.pattern, patternConfig.replacement);
    fixes += matches.length;
  }
});

console.log(`Total fixes applied: ${fixes}`);

if (fixes > 0) {
  fs.writeFileSync(filePath, content);
  console.log('Fixed LeagueDashboard.tsx onClick handlers');
} else {
  console.log('No onClick handlers needed fixing');
}