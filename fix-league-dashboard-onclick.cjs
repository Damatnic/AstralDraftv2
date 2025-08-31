const fs = require('fs');

const filePath = 'C:\\Users\\damat\\_REPOS\\AD\\views\\LeagueDashboard.tsx';
const content = fs.readFileSync(filePath, 'utf-8');

// Fix pattern: onClick={() => dispatch({ ... }}  (missing closing parenthesis and curly brace)
const fixedContent = content.replace(
  /onClick=\{(\(\) => dispatch\(\{[^}]+\}[^}]+ as [^}]+)\}/g,
  'onClick={$1)}'
);

console.log('Looking for patterns to fix in LeagueDashboard.tsx...');

// Count how many replacements were made
const originalMatches = content.match(/onClick=\{(\(\) => dispatch\(\{[^}]+\}[^}]+ as [^}]+)\}/g);
const fixedMatches = fixedContent.match(/onClick=\{(\(\) => dispatch\(\{[^}]+\}[^}]+ as [^}]+)\)/g);

if (originalMatches) {
    console.log(`Found ${originalMatches.length} onClick handlers that need fixing`);
    console.log('Patterns found:');
    originalMatches.forEach((match, index) => {
        console.log(`${index + 1}: ${match.substring(0, 100)}...`);
    });
}

fs.writeFileSync(filePath, fixedContent);

console.log('Fixed onClick handlers in LeagueDashboard.tsx');