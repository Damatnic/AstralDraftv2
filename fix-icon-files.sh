#!/bin/bash

echo "Fixing corrupted icon files..."

# Fix the pattern with size variables and duplicated attributes
find components/icons -name "*.tsx" -type f -exec sed -i 's/width={size} height={size}/width="24" height="24"/g' {} \;

# Fix the corrupted aria-label attributes
find components/icons -name "*.tsx" -type f -exec sed -i 's/aria-label={ariaLabel || " xmlns="http:\/\/www\.w3\.org\/2000\/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "[^"]*"} icon"}/aria-label="Icon"/g' {} \;

# Fix remaining duplicated className attributes
find components/icons -name "*.tsx" -type f -exec sed -i 's/} className={className}>/>/g' {} \;

echo "Fixed all icon files."