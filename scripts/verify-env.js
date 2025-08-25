#!/usr/bin/env node

console.log('🔍 Environment Variables Check\n');

// Check Node environment
console.log('Node Environment:', process.env.NODE_ENV || 'not set');
console.log('Vite Environment:', process.env.VITE_ENVIRONMENT || 'not set');

// Check API keys (without exposing them)
const apiKeys = [
  'VITE_OPENAI_API_KEY',
  'VITE_GEMINI_API_KEY',
  'VITE_SPORTS_DATA_API_KEY',
  'VITE_API_BASE_URL'
];

console.log('\n📋 API Keys Status:');
apiKeys.forEach(key => {
  const value = process.env[key];
  if (value) {
    const masked = value.length > 10 
      ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}`
      : '***masked***';
    console.log(`✅ ${key}: ${masked}`);
  } else {
    console.log(`❌ ${key}: not set`);
  }
});

// Check other important variables
const otherVars = [
  'VITE_ENABLE_ANALYTICS',
  'VITE_ENABLE_PWA',
  'VITE_ENABLE_ORACLE'
];

console.log('\n⚙️  Feature Flags:');
otherVars.forEach(key => {
  const value = process.env[key];
  console.log(`${value ? '✅' : '❌'} ${key}: ${value || 'not set'}`);
});

console.log('\n🏗️  Build Configuration:');
console.log('Current working directory:', process.cwd());
console.log('Platform:', process.platform);
console.log('Node version:', process.version);

// Check if we're in Netlify build environment
if (process.env.NETLIFY) {
  console.log('\n🌐 Netlify Build Environment Detected');
  console.log('Site ID:', process.env.NETLIFY_SITE_ID || 'not set');
  console.log('Deploy ID:', process.env.DEPLOY_ID || 'not set');
  console.log('Context:', process.env.CONTEXT || 'not set');
  console.log('Branch:', process.env.BRANCH || 'not set');
} else {
  console.log('\n💻 Local Development Environment');
}

console.log('\n✅ Environment check complete!');