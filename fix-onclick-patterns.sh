#!/bin/bash

# Fix malformed onClick patterns in TypeScript React files
echo "Starting to fix malformed onClick patterns..."

# Pattern 1: onClick={() = aria-label="Action button"> FUNCTION} onTouchStart={() = aria-label="Action button"> FUNCTION}
find . -name "*.tsx" -type f -exec sed -i 's/onClick={() = aria-label="Action button"> \([^}]*\)} onTouchStart={() = aria-label="Action button"> \1}/onClick={() => \1}/g' {} \;

# Pattern 2: onClick={() = aria-label="Action button"> FUNCTION}
find . -name "*.tsx" -type f -exec sed -i 's/onClick={() = aria-label="Action button"> \([^}]*\)}/onClick={() => \1}/g' {} \;

# Pattern 3: onTouchStart={() = aria-label="Action button"> FUNCTION}
find . -name "*.tsx" -type f -exec sed -i 's/onTouchStart={() = aria-label="Action button"> \([^}]*\)}/onClick={() => \1}/g' {} \;

echo "Fixed all malformed onClick patterns."