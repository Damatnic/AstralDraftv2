#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix corrupted icon files
function fixCorruptedIcon(content, filename) {
    // Extract icon name from filename
    const iconName = path.basename(filename, '.tsx');
    const displayName = iconName.replace('Icon', '').replace(/([A-Z])/g, ' $1').trim().toLowerCase();
    
    // Check if the file is corrupted (contains ariaLabel ||)
    if (!content.includes('ariaLabel ||')) {
        return content; // Not corrupted, return as-is
    }
    
    // Extract SVG paths/content between first opening tag and closing </svg>
    const svgMatch = content.match(/<svg[^>]*>(.*?)<\/svg>/s);
    if (!svgMatch) {
        console.warn(`⚠️ Could not extract SVG content from ${filename}`);
        return content;
    }
    
    // Extract just the inner SVG content (paths, polygons, etc.)
    const innerSvgContent = svgMatch[1].trim();
    
    // Create clean icon template
    const cleanIcon = `
interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;
}

import React from 'react';

export const ${iconName}: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="${displayName} icon">
        ${innerSvgContent}
    </svg>
);`.trim();
    
    return cleanIcon;
}

// Get all icon files
const iconFiles = glob.sync('components/icons/*.tsx', {
    cwd: path.join(__dirname, '..'),
});

console.log(`Found ${iconFiles.length} icon files to check...`);

let fixedFiles = 0;
let errorFiles = 0;

iconFiles.forEach((file, index) => {
    const fullPath = path.join(__dirname, '..', file);
    
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const fixedContent = fixCorruptedIcon(content, file);
        
        if (fixedContent !== content) {
            fs.writeFileSync(fullPath, fixedContent);
            fixedFiles++;
            console.log(`✅ Fixed corrupted: ${file}`);
        }
        
        if ((index + 1) % 20 === 0) {
            console.log(`Progress: ${index + 1}/${iconFiles.length} icon files processed...`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        errorFiles++;
    }
});

console.log(`\n🎉 Icon fixing complete!`);
console.log(`✅ Fixed: ${fixedFiles} corrupted icons`);
console.log(`❌ Errors: ${errorFiles} files`);
console.log(`📄 Total: ${iconFiles.length} icon files processed`);