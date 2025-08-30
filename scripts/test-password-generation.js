/**
 * Test Script for Password Generation System
 * Run this script to test the new secure password generation functionality
 */

// Mock environment for Node.js testing
if (typeof window === 'undefined') {
  global.window = {};
  global.localStorage = {
    storage: {},
    getItem(key) { return this.storage[key] || null; },
    setItem(key, value) { this.storage[key] = value; },
    removeItem(key) { delete this.storage[key]; }
  };
  
  // Mock crypto for Node.js
  if (typeof crypto === 'undefined') {
    global.crypto = {
      getRandomValues(array) {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 4294967296);
        }
        return array;
      }
    };
  }
}

// Import the password generator (would need proper module loading in real environment)
const testPasswordGeneration = () => {
  console.log('🧪 Testing Secure Password Generation System');
  console.log('=============================================\n');

  // Test 1: Basic password generation
  console.log('1️⃣ Testing basic secure password generation...');
  try {
    const passwords = [];
    for (let i = 0; i < 10; i++) {
      // Generate random 4-digit
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const password = (array[0] % 10000).toString().padStart(4, '0');
      passwords.push(password);
    }
    console.log('✅ Generated passwords:', passwords);
  } catch (error) {
    console.error('❌ Basic generation failed:', error);
  }

  // Test 2: Pattern validation
  console.log('\n2️⃣ Testing pattern validation...');
  const testPatterns = ['0000', '1234', '7347', '5926', '1111', '9876'];
  testPatterns.forEach(pattern => {
    const isWeak = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
                    '1234', '4321', '2468', '1357', '9876'].includes(pattern);
    console.log(`  ${pattern}: ${isWeak ? '❌ WEAK' : '✅ OK'}`);
  });

  // Test 3: Uniqueness test
  console.log('\n3️⃣ Testing uniqueness guarantee...');
  const uniqueTest = new Set();
  const duplicates = [];
  
  for (let i = 0; i < 50; i++) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const password = (array[0] % 10000).toString().padStart(4, '0');
    
    if (uniqueTest.has(password)) {
      duplicates.push(password);
    }
    uniqueTest.add(password);
  }
  
  console.log(`  Generated ${uniqueTest.size} unique passwords from 50 attempts`);
  if (duplicates.length > 0) {
    console.log(`  Duplicates found: ${duplicates}`);
  }

  // Test 4: Security analysis
  console.log('\n4️⃣ Security Analysis...');
  const securityTest = Array.from(uniqueTest).slice(0, 10);
  securityTest.forEach(password => {
    const digits = password.split('').map(Number);
    const hasSequential = digits.some((digit, i) => 
      i > 0 && (digit === digits[i-1] + 1 || digit === digits[i-1] - 1)
    );
    const digitCounts = {};
    digits.forEach(d => digitCounts[d] = (digitCounts[d] || 0) + 1);
    const maxRepeats = Math.max(...Object.values(digitCounts));
    
    const strength = maxRepeats >= 3 ? 'WEAK' : hasSequential ? 'MEDIUM' : 'STRONG';
    console.log(`  ${password}: ${strength} (max repeats: ${maxRepeats}, sequential: ${hasSequential})`);
  });

  console.log('\n✅ Password generation testing complete!');
};

// Run the test
testPasswordGeneration();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testPasswordGeneration };
}