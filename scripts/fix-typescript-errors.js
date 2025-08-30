#!/usr/bin/env node

/**
 * Automated TypeScript Error Fixer
 * This script helps fix common TypeScript errors in the codebase
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class TypeScriptErrorFixer {
  constructor() {
    this.fixCount = 0;
    this.errorPatterns = {
      // Pattern for implicit any parameters
      implicitAny: /Parameter '(\w+)' implicitly has an 'any' type/,
      // Pattern for missing properties
      missingProp: /Property '(\w+)' does not exist on type/,
      // Pattern for type mismatches
      typeMismatch: /Type '(.+)' is not assignable to type '(.+)'/,
      // Pattern for destructive -> error
      destructive: /'destructive' is not assignable to type/,
      // Pattern for secondary -> default
      secondary: /'secondary' is not assignable to type/
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async getTypeScriptErrors() {
    try {
      const { stdout } = await execPromise('npx tsc --noEmit 2>&1', { maxBuffer: 10 * 1024 * 1024 });
      return stdout.split('\n').filter(line => line.includes('error TS'));
    } catch (error) {
      // TypeScript exits with error code when there are compilation errors
      if (error.stdout) {
        return error.stdout.split('\n').filter(line => line.includes('error TS'));
      }
      return [];
    }
  }

  parseError(errorLine) {
    const match = errorLine.match(/(.+)\((\d+),(\d+)\): error (TS\d+): (.+)/);
    if (match) {
      return {
        file: match[1],
        line: parseInt(match[2]),
        column: parseInt(match[3]),
        code: match[4],
        message: match[5]
      };
    }
    return null;
  }

  async fixImplicitAnyInFile(filePath) {
    if (!fs.existsSync(filePath)) return 0;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fixes = 0;

    // Fix arrow function parameters
    content = content.replace(/\((\w+)\) =>/g, (match, param) => {
      if (!match.includes(':')) {
        fixes++;
        return `(${param}: any) =>`;
      }
      return match;
    });

    // Fix function parameters in .map, .filter, .forEach, etc.
    content = content.replace(/\.(map|filter|forEach|reduce|find|some|every)\((\w+) =>/g, (match, method, param) => {
      if (!match.includes(':')) {
        fixes++;
        return `.${method}((${param}: any) =>`;
      }
      return match;
    });

    // Fix function parameters with destructuring
    content = content.replace(/\(\{([^}]+)\}\) =>/g, (match, params) => {
      if (!match.includes(':')) {
        fixes++;
        return `({${params}}: any) =>`;
      }
      return match;
    });

    if (fixes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      this.log(`  Fixed ${fixes} implicit any errors in ${path.basename(filePath)}`, 'green');
    }

    return fixes;
  }

  async fixBadgeVariants(filePath) {
    if (!fs.existsSync(filePath)) return 0;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fixes = 0;

    // Replace destructive with error
    const destructiveCount = (content.match(/variant="destructive"/g) || []).length;
    if (destructiveCount > 0) {
      content = content.replace(/variant="destructive"/g, 'variant="error"');
      fixes += destructiveCount;
    }

    // Replace secondary with default
    const secondaryCount = (content.match(/variant="secondary"/g) || []).length;
    if (secondaryCount > 0) {
      content = content.replace(/variant="secondary"/g, 'variant="default"');
      fixes += secondaryCount;
    }

    if (fixes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      this.log(`  Fixed ${fixes} Badge variant errors in ${path.basename(filePath)}`, 'green');
    }

    return fixes;
  }

  async fixPropertyNames(filePath) {
    if (!fs.existsSync(filePath)) return 0;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fixes = 0;

    // Common property name fixes
    const replacements = [
      { from: /passingTDs:/g, to: 'passingTouchdowns:' },
      { from: /rushingTDs:/g, to: 'rushingTouchdowns:' },
      { from: /receivingTDs:/g, to: 'receivingTouchdowns:' },
      { from: /injuryStatus: ['"]HEALTHY['"]/g, to: "injuryStatus: 'healthy'" },
      { from: /injuryStatus: ['"]QUESTIONABLE['"]/g, to: "injuryStatus: 'questionable'" },
      { from: /injuryStatus: ['"]DOUBTFUL['"]/g, to: "injuryStatus: 'doubtful'" },
      { from: /injuryStatus: ['"]OUT['"]/g, to: "injuryStatus: 'out'" }
    ];

    for (const { from, to } of replacements) {
      const matches = content.match(from);
      if (matches) {
        content = content.replace(from, to);
        fixes += matches.length;
      }
    }

    if (fixes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      this.log(`  Fixed ${fixes} property name errors in ${path.basename(filePath)}`, 'green');
    }

    return fixes;
  }

  async analyzeErrors() {
    this.log('\n=== TypeScript Error Analysis ===\n', 'bright');
    
    const errors = await this.getTypeScriptErrors();
    this.log(`Total errors found: ${errors.length}`, 'yellow');

    // Count errors by type
    const errorCounts = {};
    const fileErrors = {};

    for (const errorLine of errors) {
      const parsed = this.parseError(errorLine);
      if (parsed) {
        errorCounts[parsed.code] = (errorCounts[parsed.code] || 0) + 1;
        fileErrors[parsed.file] = (fileErrors[parsed.file] || 0) + 1;
      }
    }

    // Display error type summary
    this.log('\nError types:', 'cyan');
    const sortedErrors = Object.entries(errorCounts).sort((a, b) => b[1] - a[1]);
    for (const [code, count] of sortedErrors.slice(0, 10)) {
      this.log(`  ${code}: ${count} errors`);
    }

    // Display files with most errors
    this.log('\nFiles with most errors:', 'cyan');
    const sortedFiles = Object.entries(fileErrors).sort((a, b) => b[1] - a[1]);
    for (const [file, count] of sortedFiles.slice(0, 10)) {
      this.log(`  ${path.basename(file)}: ${count} errors`);
    }

    return { errors, errorCounts, fileErrors };
  }

  async runAutoFixes() {
    this.log('\n=== Running Automated Fixes ===\n', 'bright');

    // Get all TypeScript files
    const files = this.getAllTypeScriptFiles('.');
    
    let totalFixes = 0;

    // Fix implicit any errors
    this.log('Fixing implicit any errors...', 'cyan');
    for (const file of files) {
      const fixes = await this.fixImplicitAnyInFile(file);
      totalFixes += fixes;
    }

    // Fix Badge variant errors
    this.log('\nFixing Badge variant errors...', 'cyan');
    for (const file of files) {
      const fixes = await this.fixBadgeVariants(file);
      totalFixes += fixes;
    }

    // Fix property name errors
    this.log('\nFixing property name errors...', 'cyan');
    for (const file of files) {
      const fixes = await this.fixPropertyNames(file);
      totalFixes += fixes;
    }

    this.log(`\nTotal fixes applied: ${totalFixes}`, 'green');
    return totalFixes;
  }

  getAllTypeScriptFiles(dir, files = []) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      
      // Skip node_modules and other build directories
      if (item === 'node_modules' || item === 'dist' || item === '.git') {
        continue;
      }

      if (fs.statSync(fullPath).isDirectory()) {
        this.getAllTypeScriptFiles(fullPath, files);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  async generateReport() {
    const { errors, errorCounts, fileErrors } = await this.analyzeErrors();
    
    const report = {
      timestamp: new Date().toISOString(),
      totalErrors: errors.length,
      errorTypes: errorCounts,
      topFiles: Object.entries(fileErrors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([file, count]) => ({ file: path.basename(file), count })),
      recommendations: this.generateRecommendations(errorCounts)
    };

    fs.writeFileSync('typescript-error-report.json', JSON.stringify(report, null, 2));
    this.log('\nReport saved to typescript-error-report.json', 'green');
    
    return report;
  }

  generateRecommendations(errorCounts) {
    const recommendations = [];

    if (errorCounts['TS7006'] > 10) {
      recommendations.push({
        issue: 'Many implicit any type errors',
        solution: 'Run this script with --fix-implicit-any flag',
        priority: 'high'
      });
    }

    if (errorCounts['TS2339'] > 10) {
      recommendations.push({
        issue: 'Many missing property errors',
        solution: 'Review type definitions and interfaces',
        priority: 'high'
      });
    }

    if (errorCounts['TS2322'] > 10) {
      recommendations.push({
        issue: 'Many type assignment errors',
        solution: 'Check component prop types and interfaces',
        priority: 'medium'
      });
    }

    return recommendations;
  }
}

// Main execution
async function main() {
  const fixer = new TypeScriptErrorFixer();
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
${colors.bright}TypeScript Error Fixer${colors.reset}

Usage: node fix-typescript-errors.js [options]

Options:
  --analyze      Analyze errors without fixing
  --fix          Run automated fixes
  --report       Generate detailed error report
  --help         Show this help message

Examples:
  node fix-typescript-errors.js --analyze
  node fix-typescript-errors.js --fix
  node fix-typescript-errors.js --report
    `);
    return;
  }

  if (args.includes('--analyze')) {
    await fixer.analyzeErrors();
  } else if (args.includes('--fix')) {
    await fixer.runAutoFixes();
    console.log('\nRe-analyzing errors after fixes...');
    await fixer.analyzeErrors();
  } else if (args.includes('--report')) {
    await fixer.generateReport();
  } else {
    // Default: analyze and show options
    await fixer.analyzeErrors();
    console.log('\nRun with --fix to apply automated fixes');
    console.log('Run with --report to generate detailed report');
  }
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
});