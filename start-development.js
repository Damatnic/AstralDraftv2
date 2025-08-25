#!/usr/bin/env node

/**
 * Astral Draft Development Startup Script
 * Starts both backend and frontend with proper initialization
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DevelopmentStarter {
  constructor() {
    this.processes = [];
    this.isShuttingDown = false;
  }

  async start() {
    console.log('🚀 Starting Astral Draft Development Environment');
    console.log('='.repeat(60));

    try {
      // Check prerequisites
      await this.checkPrerequisites();
      
      // Setup environment
      await this.setupEnvironment();
      
      // Start services
      await this.startServices();
      
      // Setup graceful shutdown
      this.setupGracefulShutdown();
      
      console.log('\n🎉 Development environment started successfully!');
      console.log('📖 Access the application at: http://localhost:5173');
      console.log('📊 Backend API at: http://localhost:3001');
      console.log('🔍 Health check: http://localhost:3001/api/health');
      console.log('\n💡 Press Ctrl+C to stop all services');
      
    } catch (error) {
      console.error('❌ Failed to start development environment:', error.message);
      this.cleanup();
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
    
    if (majorVersion < 18) {
      throw new Error(`Node.js v18+ required, found ${nodeVersion}`);
    }
    
    console.log(`✅ Node.js ${nodeVersion}`);
    
    // Check if server directory exists
    if (!fs.existsSync(path.join(__dirname, 'server'))) {
      throw new Error('Server directory not found');
    }
    
    // Check if server package.json exists
    if (!fs.existsSync(path.join(__dirname, 'server', 'package.json'))) {
      throw new Error('Server package.json not found');
    }
    
    console.log('✅ Server files found');
    
    // Check if frontend package.json exists
    if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
      throw new Error('Frontend package.json not found');
    }
    
    console.log('✅ Frontend files found');
  }

  async setupEnvironment() {
    console.log('⚙️ Setting up environment...');
    
    // Check backend .env file
    const backendEnvPath = path.join(__dirname, 'server', '.env');
    if (!fs.existsSync(backendEnvPath)) {
      console.log('⚠️ Backend .env file not found, creating from example...');
      const examplePath = path.join(__dirname, 'server', '.env.example');
      if (fs.existsSync(examplePath)) {
        fs.copyFileSync(examplePath, backendEnvPath);
        console.log('✅ Created backend .env file');
      } else {
        console.log('⚠️ No .env.example found, you may need to configure environment variables manually');
      }
    }
    
    // Check frontend .env file
    const frontendEnvPath = path.join(__dirname, '.env.local');
    if (!fs.existsSync(frontendEnvPath)) {
      console.log('⚠️ Frontend .env.local file not found, creating...');
      const envContent = `# Astral Draft Frontend Environment
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_REAL_TIME=true
VITE_DEBUG_MODE=true
VITE_MOCK_DATA=false`;
      fs.writeFileSync(frontendEnvPath, envContent);
      console.log('✅ Created frontend .env.local file');
    }
    
    console.log('✅ Environment setup complete');
  }

  async startServices() {
    console.log('🔄 Starting services...');
    
    // Start backend server
    console.log('📡 Starting backend server...');
    const backendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'server'),
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    
    this.processes.push({
      name: 'Backend',
      process: backendProcess,
      port: 3001
    });
    
    // Handle backend output
    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('server running') || output.includes('listening')) {
        console.log('✅ Backend server started on port 3001');
      }
      // Prefix backend logs
      output.split('\n').forEach(line => {
        if (line.trim()) {
          console.log(`[BACKEND] ${line}`);
        }
      });
    });
    
    backendProcess.stderr.on('data', (data) => {
      const output = data.toString();
      output.split('\n').forEach(line => {
        if (line.trim()) {
          console.log(`[BACKEND ERROR] ${line}`);
        }
      });
    });
    
    backendProcess.on('close', (code) => {
      if (!this.isShuttingDown) {
        console.log(`❌ Backend process exited with code ${code}`);
      }
    });
    
    // Wait a moment for backend to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start frontend
    console.log('🎨 Starting frontend...');
    const frontendProcess = spawn('npm', ['run', 'dev'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    
    this.processes.push({
      name: 'Frontend',
      process: frontendProcess,
      port: 5173
    });
    
    // Handle frontend output
    frontendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('localhost:5173')) {
        console.log('✅ Frontend started on port 5173');
      }
      // Prefix frontend logs
      output.split('\n').forEach(line => {
        if (line.trim()) {
          console.log(`[FRONTEND] ${line}`);
        }
      });
    });
    
    frontendProcess.stderr.on('data', (data) => {
      const output = data.toString();
      output.split('\n').forEach(line => {
        if (line.trim()) {
          console.log(`[FRONTEND ERROR] ${line}`);
        }
      });
    });
    
    frontendProcess.on('close', (code) => {
      if (!this.isShuttingDown) {
        console.log(`❌ Frontend process exited with code ${code}`);
      }
    });
    
    // Wait for frontend to start
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  setupGracefulShutdown() {
    const shutdown = () => {
      if (this.isShuttingDown) return;
      
      console.log('\n🛑 Shutting down development environment...');
      this.isShuttingDown = true;
      
      this.cleanup();
      
      setTimeout(() => {
        console.log('✅ Shutdown complete');
        process.exit(0);
      }, 1000);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('SIGQUIT', shutdown);
  }

  cleanup() {
    this.processes.forEach(({ name, process }) => {
      if (process && !process.killed) {
        console.log(`🛑 Stopping ${name}...`);
        process.kill('SIGTERM');
        
        // Force kill after 5 seconds
        setTimeout(() => {
          if (!process.killed) {
            process.kill('SIGKILL');
          }
        }, 5000);
      }
    });
  }
}

// Run if called directly
if (require.main === module) {
  const starter = new DevelopmentStarter();
  starter.start().catch(error => {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  });
}

module.exports = DevelopmentStarter;