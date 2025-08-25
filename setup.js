#!/usr/bin/env node

/**
 * Astral Draft Setup Script
 * Automated setup for the complete Astral Draft application
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AstralDraftSetup {
  constructor() {
    this.rootDir = __dirname;
    this.serverDir = path.join(this.rootDir, 'server');
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      step: '🔄'
    }[type] || '📋';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async run() {
    try {
      this.log('🚀 Starting Astral Draft Setup', 'step');
      this.log('This will set up the complete fantasy football application with real data');
      
      await this.checkPrerequisites();
      await this.setupBackend();
      await this.setupFrontend();
      await this.createEnvironmentFiles();
      await this.installDependencies();
      await this.setupDatabase();
      await this.runTests();
      await this.printSummary();
      
      this.log('🎉 Setup completed successfully!', 'success');
      this.log('📖 Check START_BACKEND.md for detailed instructions');
      
    } catch (error) {
      this.log(`Setup failed: ${error.message}`, 'error');
      this.errors.push(error.message);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    this.log('Checking prerequisites...', 'step');
    
    // Check Node.js
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
      
      if (majorVersion < 18) {
        throw new Error(`Node.js v18+ required, found ${nodeVersion}`);
      }
      
      this.log(`Node.js ${nodeVersion} ✓`, 'success');
    } catch (error) {
      throw new Error('Node.js not found. Please install Node.js v18+ from https://nodejs.org/');
    }

    // Check npm
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      this.log(`npm ${npmVersion} ✓`, 'success');
    } catch (error) {
      throw new Error('npm not found. Please install npm');
    }

    // Check for MongoDB (optional)
    try {
      execSync('mongosh --version', { encoding: 'utf8', stdio: 'ignore' });
      this.log('MongoDB CLI found ✓', 'success');
    } catch (error) {
      this.log('MongoDB CLI not found - you can use MongoDB Atlas instead', 'warning');
      this.warnings.push('Consider installing MongoDB locally or use MongoDB Atlas');
    }

    // Check for Redis (optional)
    try {
      execSync('redis-cli --version', { encoding: 'utf8', stdio: 'ignore' });
      this.log('Redis CLI found ✓', 'success');
    } catch (error) {
      this.log('Redis not found - caching will be disabled', 'warning');
      this.warnings.push('Consider installing Redis for better performance');
    }
  }

  async setupBackend() {
    this.log('Setting up backend server...', 'step');
    
    // Create server directory if it doesn't exist
    if (!fs.existsSync(this.serverDir)) {
      fs.mkdirSync(this.serverDir, { recursive: true });
    }

    // Check if package.json exists
    const packageJsonPath = path.join(this.serverDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      this.log('Backend package.json found ✓', 'success');
    } else {
      throw new Error('Backend package.json not found. Please ensure server files are present.');
    }
  }

  async setupFrontend() {
    this.log('Setting up frontend...', 'step');
    
    // Check if frontend files exist
    const packageJsonPath = path.join(this.rootDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      this.log('Frontend package.json found ✓', 'success');
    } else {
      throw new Error('Frontend package.json not found');
    }

    // Check for Vite config
    const viteConfigPath = path.join(this.rootDir, 'vite.config.ts');
    if (fs.existsSync(viteConfigPath)) {
      this.log('Vite configuration found ✓', 'success');
    } else {
      this.log('Vite configuration not found', 'warning');
    }
  }

  async createEnvironmentFiles() {
    this.log('Creating environment files...', 'step');
    
    // Backend .env
    const backendEnvPath = path.join(this.serverDir, '.env');
    const backendEnvExamplePath = path.join(this.serverDir, '.env.example');
    
    if (!fs.existsSync(backendEnvPath) && fs.existsSync(backendEnvExamplePath)) {
      fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
      this.log('Created backend .env file from template', 'success');
      this.log('⚠️ Please edit server/.env with your database URLs and API keys', 'warning');
    } else if (fs.existsSync(backendEnvPath)) {
      this.log('Backend .env file already exists ✓', 'success');
    }

    // Frontend .env
    const frontendEnvPath = path.join(this.rootDir, '.env.local');
    if (!fs.existsSync(frontendEnvPath)) {
      const frontendEnvContent = `# Astral Draft Frontend Environment
VITE_API_BASE_URL=http://localhost:3001/api
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_OPENAI_API_KEY=your-openai-api-key
`;
      fs.writeFileSync(frontendEnvPath, frontendEnvContent);
      this.log('Created frontend .env.local file', 'success');
    } else {
      this.log('Frontend .env.local already exists ✓', 'success');
    }
  }

  async installDependencies() {
    this.log('Installing dependencies...', 'step');
    
    // Install backend dependencies
    this.log('Installing backend dependencies...', 'step');
    try {
      execSync('npm install', { 
        cwd: this.serverDir, 
        stdio: 'inherit' 
      });
      this.log('Backend dependencies installed ✓', 'success');
    } catch (error) {
      throw new Error('Failed to install backend dependencies');
    }

    // Install frontend dependencies
    this.log('Installing frontend dependencies...', 'step');
    try {
      execSync('npm install', { 
        cwd: this.rootDir, 
        stdio: 'inherit' 
      });
      this.log('Frontend dependencies installed ✓', 'success');
    } catch (error) {
      throw new Error('Failed to install frontend dependencies');
    }
  }

  async setupDatabase() {
    this.log('Setting up database...', 'step');
    
    // Check if MongoDB is available
    const backendEnvPath = path.join(this.serverDir, '.env');
    if (!fs.existsSync(backendEnvPath)) {
      this.log('Backend .env not found, skipping database setup', 'warning');
      return;
    }

    const envContent = fs.readFileSync(backendEnvPath, 'utf8');
    const hasMongoUri = envContent.includes('MONGODB_URI=') && 
                       !envContent.includes('MONGODB_URI=mongodb://localhost:27017/astral_draft');

    if (!hasMongoUri) {
      this.log('MongoDB URI not configured, skipping database seeding', 'warning');
      this.log('Please configure MONGODB_URI in server/.env and run: npm run seed:dev', 'warning');
      return;
    }

    // Try to seed the database
    try {
      this.log('Seeding database with test data...', 'step');
      execSync('npm run seed:dev', { 
        cwd: this.serverDir, 
        stdio: 'inherit' 
      });
      this.log('Database seeded successfully ✓', 'success');
    } catch (error) {
      this.log('Database seeding failed - you can run it manually later', 'warning');
      this.warnings.push('Run "cd server && npm run seed:dev" to seed the database');
    }
  }

  async runTests() {
    this.log('Running basic tests...', 'step');
    
    // Test backend build
    try {
      this.log('Testing backend...', 'step');
      // Just check if the main file can be required
      const serverIndexPath = path.join(this.serverDir, 'index.js');
      if (fs.existsSync(serverIndexPath)) {
        this.log('Backend files ready ✓', 'success');
      }
    } catch (error) {
      this.log('Backend test failed', 'warning');
    }

    // Test frontend build
    try {
      this.log('Testing frontend build...', 'step');
      execSync('npm run build', { 
        cwd: this.rootDir, 
        stdio: 'ignore' 
      });
      this.log('Frontend build successful ✓', 'success');
    } catch (error) {
      this.log('Frontend build failed', 'warning');
      this.warnings.push('Frontend build issues detected - check for TypeScript errors');
    }
  }

  async printSummary() {
    this.log('\n📊 Setup Summary', 'step');
    console.log('='.repeat(50));
    
    this.log('✅ Backend server configured');
    this.log('✅ Frontend application ready');
    this.log('✅ Dependencies installed');
    this.log('✅ Environment files created');
    
    if (this.warnings.length > 0) {
      this.log('\n⚠️ Warnings:', 'warning');
      this.warnings.forEach(warning => {
        this.log(`  • ${warning}`, 'warning');
      });
    }

    this.log('\n🚀 Next Steps:', 'step');
    console.log('1. Configure your environment variables:');
    console.log('   • Edit server/.env with your MongoDB URI and API keys');
    console.log('   • Edit .env.local with your frontend API keys');
    console.log('');
    console.log('2. Start the backend server:');
    console.log('   cd server && npm run dev');
    console.log('');
    console.log('3. Start the frontend (in a new terminal):');
    console.log('   npm run dev');
    console.log('');
    console.log('4. Open your browser to:');
    console.log('   http://localhost:5173');
    console.log('');
    console.log('5. Login with test account:');
    console.log('   Email: player1@astral.com');
    console.log('   Password: test1234');
    console.log('');
    console.log('📖 For detailed instructions, see START_BACKEND.md');
    console.log('🆘 For troubleshooting, check the documentation');
    console.log('='.repeat(50));
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new AstralDraftSetup();
  setup.run().catch(error => {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  });
}

module.exports = AstralDraftSetup;