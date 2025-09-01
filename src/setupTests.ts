/**
 * Jest Setup for Astral Draft Testing
 * Configures testing environment and global utilities
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { jest } from '@jest/globals';

// Configure React Testing Library
configure({ testIdAttribute: 'data-testid' });

// Mock window.matchMedia for responsive hooks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb: any) => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();

// Mock WebSocket for real-time features
global.WebSocket = jest.fn().mockImplementation(() => ({
  send: jest.fn(),
  close: jest.fn(),
  readyState: WebSocket.OPEN,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock crypto for security tests
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'mocked-uuid'),
    getRandomValues: jest.fn((arr: any) => arr.fill(Math.random() * 255)),
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
global.sessionStorage = localStorageMock;

// Mock fetch for API tests
global.fetch = jest.fn();

// Setup console error suppression for expected errors
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const message = args.join(' ');
  // Suppress known React testing warnings
  if (
    message.includes('Warning: ReactDOM.render is no longer supported') ||
    message.includes('Warning: An invalid form control') ||
    message.includes('act()')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.REACT_APP_API_URL = 'http://localhost:3001/api';

// Global test utilities
global.testUtils = {
  mockUser: {
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
  },
  mockPlayer: {
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
  },
  mockTeam: {
    id: 1,
    name: 'Test Team',
    owner: 'Test Owner',
    roster: [],
    record: { wins: 0, losses: 0, ties: 0 },
    totalPoints: 0,
  },
};