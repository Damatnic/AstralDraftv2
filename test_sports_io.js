/**
 * Quick test script to validate Sports.io API integration
 */

// Test the environment variable
console.log('🔑 Testing Sports.io API Key Configuration:');
console.log('API Key present:', process.env.VITE_SPORTS_IO_API_KEY ? '✅ Yes' : '❌ No');
console.log('API Key value:', process.env.VITE_SPORTS_IO_API_KEY || 'Not found');

// Test the API client
import { apiClient } from './services/apiClient.js';

async function testSportsIOAPI() {
  console.log('\n🧪 Testing Sports.io API Connection:');
  
  try {
    console.log('Attempting to fetch NFL games...');
    const games = await apiClient.getSportsIOGames();
    console.log('✅ Games fetch result:', games.length > 0 ? `${games.length} games found` : 'No games returned');
    
    console.log('\nAttempting to fetch NFL players...');
    const players = await apiClient.getSportsIOPlayers();
    console.log('✅ Players fetch result:', players.length > 0 ? `${players.length} players found` : 'No players returned');
    
    // Test specific position
    console.log('\nAttempting to fetch QBs...');
    const qbs = await apiClient.getSportsIOPlayers('QB');
    console.log('✅ QB fetch result:', qbs.length > 0 ? `${qbs.length} QBs found` : 'No QBs returned');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

// Run the test
testSportsIOAPI().then(() => {
  console.log('\n✅ Sports.io API test completed');
}).catch(error => {
  console.error('❌ Test execution failed:', error);
});