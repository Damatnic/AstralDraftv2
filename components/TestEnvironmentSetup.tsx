/**
 * Test Environment Setup Component
 * Initializes the test league with 10 users on app load
 */

import React from 'react';
import { testUsers } from '../data/testUsers';
import { useAppState } from '../hooks/useAppState';

export const TestEnvironmentSetup: React.FC = () => {
  const { dispatch } = useAppState();
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    // Check if already initialized
    const initialized = localStorage.getItem('testEnvironmentInitialized');
    
    if (!initialized || initialized !== '2025') {
      // Mark as initialized
      localStorage.setItem('testEnvironmentInitialized', '2025');
      setIsInitialized(true);
      
      // Test environment ready with 10 test users
      // Login with player1@astral.com to player10@astral.com, password: test1234
    } else {
      setIsInitialized(true);
    }
  }, [dispatch]);

  // Quick user switcher for testing
  const switchUser = (userId: string) => {
    const user = testUsers.find(u => u.id === userId);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      // Switched to user: ${user.name}
    }
  };

  // Development panel (only show in dev mode)
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <details className="bg-gray-900 rounded-lg shadow-xl p-2 text-white">
        <summary className="cursor-pointer text-xs font-bold mb-2">
          🧪 Test Environment {isInitialized ? '✅' : '⏳'}
        </summary>
        <div className="space-y-2 mt-2">
          <p className="text-xs text-gray-400">Quick User Switch:</p>
          <div className="grid grid-cols-2 gap-1">
            {testUsers.map(user => (
              <button
                key={user.id}
                onClick={() => switchUser(user.id)}
                className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                title={`Email: ${user.email}\nPassword: test1234`}
              >
                {user.avatar} {user.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            <p>League: Test League Available</p>
            <p>Season: 2025</p>
            <p>Teams: 10</p>
            <p>Status: Ready</p>
          </div>
        </div>
      </details>
    </div>
  );
};

export default TestEnvironmentSetup;