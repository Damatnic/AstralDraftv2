#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix malformed function parameters
function fixFunctionParameters(content) {
    // Pattern 1: Fix `}: any) =>` to `}) =>`
    content = content.replace(/}\s*:\s*any\)\s*=>/g, '}) =>');
    
    // Pattern 2: Fix `}: SomeType) =>` to `}) =>` when there's already a React.FC<SomeType>
    content = content.replace(/React\.FC<([^>]+)>\s*=\s*\(\{([^}]+)\}\s*:\s*\w+\)\s*=>/g, 
        'React.FC<$1> = ({$2}) =>');
    
    // Pattern 3: Fix other malformed destructuring patterns
    content = content.replace(/}\s*:\s*[A-Z][a-zA-Z]*Props?\)\s*=>/g, '}) =>');
    content = content.replace(/}\s*:\s*[A-Z][a-zA-Z]*\)\s*=>/g, '}) =>');
    
    // Pattern 4: Fix cases where types are duplicated in function parameters
    content = content.replace(/: React\.FC<([^>]+)>\s*=\s*\(\{([^}]+)\}\s*:\s*\1\)\s*=>/g, 
        ': React.FC<$1> = ({$2}) =>');
    
    return content;
}

// Function to fix corrupted icon files specifically
function fixIconFile(content) {
    // Check if this is a corrupted icon file
    if (content.includes('ariaLabel ||') && content.includes('xmlns="http://www.w3.org/2000/svg"')) {
        // Extract the icon name from the export statement
        const iconNameMatch = content.match(/export const (\w+Icon)/);
        if (!iconNameMatch) return content;
        
        const iconName = iconNameMatch[1];
        
        // Standard icon template
        const standardTemplate = `
interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;
}

import React from 'react';

export const ${iconName}: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="${iconName.replace('Icon', '')} icon">
        <!-- SVG content will be preserved -->
    </svg>
);`;

        // Extract the actual SVG path/content between the first <svg> and </svg>
        const svgContentMatch = content.match(/<svg[^>]*>(.*?)<\/svg>/s);
        if (svgContentMatch) {
            const svgContent = svgContentMatch[1];
            return standardTemplate.replace('<!-- SVG content will be preserved -->', svgContent.trim());
        }
    }
    
    // Apply standard parameter fixes
    return fixFunctionParameters(content);
}

// Get all TypeScript/JSX files
const files = glob.sync('**/*.{ts,tsx}', {
    cwd: path.join(__dirname, '..'),
    ignore: ['node_modules/**', 'dist/**', '.next/**', 'build/**']
});

console.log(`Found ${files.length} files to process...`);

let fixedFiles = 0;
let errorFiles = 0;

files.forEach((file, index) => {
    const fullPath = path.join(__dirname, '..', file);
    
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        let fixedContent;
        
        // Special handling for icon files
        if (file.includes('/icons/') && file.endsWith('.tsx')) {
            fixedContent = fixIconFile(content);
        } else {
            fixedContent = fixFunctionParameters(content);
        }
        
        if (fixedContent !== content) {
            fs.writeFileSync(fullPath, fixedContent);
            fixedFiles++;
            console.log(`✅ Fixed: ${file}`);
        }
        
        if ((index + 1) % 50 === 0) {
            console.log(`Progress: ${index + 1}/${files.length} files processed...`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        errorFiles++;
    }
});

console.log(`\n🎉 Processing complete!`);
console.log(`✅ Fixed: ${fixedFiles} files`);
console.log(`❌ Errors: ${errorFiles} files`);
console.log(`📄 Total: ${files.length} files processed`);