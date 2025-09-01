/**
 * Test Utilities for Astral Draft
 * Custom render functions with providers and test helpers
 */

import { render, RenderOptions } from &apos;@testing-library/react&apos;;
import { AppProvider } from &apos;../contexts/AppContext&apos;;
import { ModalProvider } from &apos;../contexts/ModalContext&apos;;
import type { User, Player, Team } from &apos;./types&apos;;

// Mock providers for testing
const MockAppProvider: React.FC<{ children: React.ReactNode; initialState?: Partial<any> }> = ({ 
}
  children, 
  initialState = {} 
}) => {
}
  const defaultState = {
}
    user: global.testUtils?.mockUser || null,
    isLoading: false,
    currentView: &apos;DASHBOARD&apos;,
    leagues: [],
    activeLeagueId: null,
    ...initialState
  };

  return (
    <div data-testid="mock-app-provider">
      {children}
    </div>
  );
};

const MockModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }: any) => {
}
  return (
    <div data-testid="mock-modal-provider">
      {children}
    </div>
  );
};

// All providers wrapper
const AllTheProviders: React.FC<{ 
}
  children: React.ReactNode;
  initialAppState?: Partial<any>;
}> = ({ children, initialAppState }: any) => {
}
  return (
    <MockAppProvider initialState={initialAppState}>
      <MockModalProvider>
        {children}
      </MockModalProvider>
    </MockAppProvider>
  );
};

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, &apos;wrapper&apos;> & {
}
    initialAppState?: Partial<any>;
  }
) => {
}
  const { initialAppState, ...renderOptions } = options || {};
  
  return render(ui, { 
}
    wrapper: (props: any) => <AllTheProviders {...props} initialAppState={initialAppState} />,
    ...renderOptions 
  });
};

// Test data factories
export const createMockUser = (overrides: Partial<User> = {}): User => ({
}
  id: 1,
  name: &apos;Test User&apos;,
  email: &apos;test@example.com&apos;,
  teamName: &apos;Test Team&apos;,
  avatar: &apos;avatar-url&apos;,
  isCommissioner: false,
  isAuthenticated: true,
  preferences: {
}
    theme: &apos;dark&apos;,
    notifications: true,
    autoRefresh: true,
    draftReminders: true,
    emailUpdates: false,
    soundEffects: true,
  },
  createdAt: new Date(),
  lastLoginAt: new Date(),
  ...overrides,
});

export const createMockPlayer = (overrides: Partial<Player> = {}): Player => ({
}
  id: 1,
  name: &apos;Josh Allen&apos;,
  position: &apos;QB&apos;,
  team: &apos;BUF&apos;,
  projectedPoints: 22.5,
  averageDraftPosition: 15.2,
  tier: 1,
  byeWeek: 7,
  injury: {
}
    status: &apos;healthy&apos;,
  },
  ...overrides,
});

export const createMockTeam = (overrides: Partial<Team> = {}): Team => ({
}
  id: 1,
  name: &apos;Test Team&apos;,
  owner: &apos;Test Owner&apos;,
  roster: [],
  record: { wins: 0, losses: 0, ties: 0 },
  totalPoints: 0,
  ...overrides,
});

// Mock API responses
export const createMockApiResponse = <T,>(data: T, success = true) => ({
}
  success,
  data,
  timestamp: new Date().toISOString(),
  ...(success ? {} : { error: &apos;Mock API error&apos; }),
});

// Utility to wait for loading states
export const waitForLoadingToComplete = async () => {
}
  await new Promise(resolve => setTimeout(resolve, 100));
};

// Mock fetch responses
export const mockFetchSuccess = <T,>(data: T) => {
}
  (global.fetch as jest.Mock).mockResolvedValueOnce({
}
    ok: true,
    status: 200,
    json: async () => createMockApiResponse(data),
  });
};

export const mockFetchError = (message = &apos;API Error&apos;, status = 500) => {
}
  (global.fetch as jest.Mock).mockResolvedValueOnce({
}
    ok: false,
    status,
    json: async () => createMockApiResponse(null, false),
  });
};

// Export everything from React Testing Library
export * from &apos;@testing-library/react&apos;;
export { customRender as render };