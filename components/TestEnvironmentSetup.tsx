/**
 * Test Environment Setup Component
 * Initializes the test league with 10 users on app load
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { testUsers } from &apos;../data/testUsers&apos;;
import { useAppState } from &apos;../hooks/useAppState&apos;;

export const TestEnvironmentSetup: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const { dispatch } = useAppState();
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
}
    // Check if already initialized
    const initialized = localStorage.getItem(&apos;testEnvironmentInitialized&apos;);
    
    if (!initialized || initialized !== &apos;2025&apos;) {
}
      // Mark as initialized
      localStorage.setItem(&apos;testEnvironmentInitialized&apos;, &apos;2025&apos;);
      setIsInitialized(true);
      
      // Test environment ready with 10 test users
      // Login with player1@astral.com to player10@astral.com, password: test1234
    } else {
}
      setIsInitialized(true);

  }, [dispatch]);

  // Quick user switcher for testing
  const switchUser = (userId: string) => {
}
    const user = testUsers.find((u: any) => u.id === userId);
    if (user) {
}
      localStorage.setItem(&apos;currentUser&apos;, JSON.stringify(user));
      dispatch({ type: &apos;SET_USER&apos;, payload: user });
      // Switched to user: ${user.name}

  };

  // Development panel (only show in dev mode)
  if (process.env.NODE_ENV !== &apos;development&apos;) {
}
    return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:px-4 md:px-6 lg:px-8">
      <details className="bg-gray-900 rounded-lg shadow-xl p-2 text-white sm:px-4 md:px-6 lg:px-8">
        <summary className="cursor-pointer text-xs font-bold mb-2 sm:px-4 md:px-6 lg:px-8">
          🧪 Test Environment {isInitialized ? &apos;✅&apos; : &apos;⏳&apos;}
        </summary>
        <div className="space-y-2 mt-2 sm:px-4 md:px-6 lg:px-8">
          <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Quick User Switch:</p>
          <div className="grid grid-cols-2 gap-1 sm:px-4 md:px-6 lg:px-8">
            {testUsers.map((user: any) => (
}
              <button
                key={user.id}
                onClick={() => switchUser(user.id)}
                title={`Email: ${user.email}\nPassword: test1234`}
              >
                {user.avatar} {user.name.split(&apos; &apos;)[0]}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 sm:px-4 md:px-6 lg:px-8">
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

const TestEnvironmentSetupWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TestEnvironmentSetup {...props} />
  </ErrorBoundary>
);

export default React.memo(TestEnvironmentSetupWithErrorBoundary);