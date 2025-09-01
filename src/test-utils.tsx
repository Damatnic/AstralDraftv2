/**
 * Test Utilities for Astral Draft
 * Custom render functions with providers and test helpers
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppProvider } from '../contexts/AppContext';
import { ModalProvider } from '../contexts/ModalContext';
import type { User, Player, Team } from './types';

// Mock providers for testing
const MockAppProvider: React.FC<{ children: React.ReactNode; initialState?: Partial<any> }> = ({ 
  children, 
  initialState = {} 
}) => {
  const defaultState = {
    user: global.testUtils?.mockUser || null,
    isLoading: false,
    currentView: 'DASHBOARD',
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
  return (
    <div data-testid="mock-modal-provider">
      {children}
    </div>
  );
};

// All providers wrapper
const AllTheProviders: React.FC<{ 
  children: React.ReactNode;
  initialAppState?: Partial<any>;
}> = ({ children, initialAppState }: any) => {
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
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialAppState?: Partial<any>;
  }
) => {
  const { initialAppState, ...renderOptions } = options || {};
  
  return render(ui, { 
    wrapper: (props: any) => <AllTheProviders {...props} initialAppState={initialAppState} />,
    ...renderOptions 
  });
};

// Test data factories
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  teamName: 'Test Team',
  avatar: 'avatar-url',
  isCommissioner: false,
  isAuthenticated: true,
  preferences: {
    theme: 'dark',
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
  id: 1,
  name: 'Josh Allen',
  position: 'QB',
  team: 'BUF',
  projectedPoints: 22.5,
  averageDraftPosition: 15.2,
  tier: 1,
  byeWeek: 7,
  injury: {
    status: 'healthy',
  },
  ...overrides,
});

export const createMockTeam = (overrides: Partial<Team> = {}): Team => ({
  id: 1,
  name: 'Test Team',
  owner: 'Test Owner',
  roster: [],
  record: { wins: 0, losses: 0, ties: 0 },
  totalPoints: 0,
  ...overrides,
});

// Mock API responses
export const createMockApiResponse = <T,>(data: T, success = true) => ({
  success,
  data,
  timestamp: new Date().toISOString(),
  ...(success ? {} : { error: 'Mock API error' }),
});

// Utility to wait for loading states
export const waitForLoadingToComplete = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
};

// Mock fetch responses
export const mockFetchSuccess = <T,>(data: T) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => createMockApiResponse(data),
  });
};

export const mockFetchError = (message = 'API Error', status = 500) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => createMockApiResponse(null, false),
  });
};

// Export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };