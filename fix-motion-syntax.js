const fs = require('fs');
const path = require('path');

// Pattern to find broken motion.div/form props
const brokenMotionPattern = /(\s+onClick=\{[^}]+\}),\s+([^}]+):\s*\{[^}]*\},?\s*\}\}/g;

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalContent = content;
        
        // Fix broken motion component props pattern
        content = content.replace(
            /onClick=\{([^}]+)\},\s+animate:\s*\{\s*([^}]+)\s*\},?\s*\}\}/g,
            'onClick={$1}\n                initial={{ opacity: 0, scale: 0.9 }}\n                animate={{ $2 }}\n                transition={{ duration: 0.2 }}'
        );
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`Fixed: ${filePath}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Get all .tsx files with motion syntax issues
const problematicFiles = [
    'components/commissioner/ManageTradesModal.tsx',
    'components/commissioner/PostAnnouncementModal.tsx',
    'components/core/MobileNavMenu.tsx',
    'components/core/CreateLeagueModal.tsx',
    'components/core/CommandPalette.tsx'
];

let fixedCount = 0;
for (const file of problematicFiles) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        if (fixFile(fullPath)) {
            fixedCount++;
        }
    }
}

console.log(`Fixed ${fixedCount} files with motion syntax issues`);