/**
 * Jest Setup for Astral Draft Testing
 * Configures testing environment and global utilities
 */

import &apos;@testing-library/jest-dom&apos;;
import { configure } from &apos;@testing-library/react&apos;;
import { jest } from &apos;@jest/globals&apos;;

// Configure React Testing Library
configure({ testIdAttribute: &apos;data-testid&apos; });

// Mock window.matchMedia for responsive hooks
Object.defineProperty(window, &apos;matchMedia&apos;, {
}
  writable: true,
  value: jest.fn().mockImplementation(query => ({
}
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
}
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
}
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb: any) => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();

// Mock WebSocket for real-time features
global.WebSocket = jest.fn().mockImplementation(() => ({
}
  send: jest.fn(),
  close: jest.fn(),
  readyState: WebSocket.OPEN,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock crypto for security tests
Object.defineProperty(global, &apos;crypto&apos;, {
}
  value: {
}
    randomUUID: jest.fn(() => &apos;mocked-uuid&apos;),
    getRandomValues: jest.fn((arr: any) => arr.fill(Math.random() * 255)),
  },
});

// Mock localStorage
const localStorageMock = {
}
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
}
  const message = args.join(&apos; &apos;);
  // Suppress known React testing warnings
  if (
    message.includes(&apos;Warning: ReactDOM.render is no longer supported&apos;) ||
    message.includes(&apos;Warning: An invalid form control&apos;) ||
    message.includes(&apos;act()&apos;)
  ) {
}
    return;
  }
  originalError.call(console, ...args);
};

// Mock environment variables
process.env.NODE_ENV = &apos;test&apos;;
process.env.REACT_APP_API_URL = &apos;http://localhost:3001/api&apos;;

// Global test utilities
global.testUtils = {
}
  mockUser: {
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
  },
  mockPlayer: {
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
  },
  mockTeam: {
}
    id: 1,
    name: &apos;Test Team&apos;,
    owner: &apos;Test Owner&apos;,
    roster: [],
    record: { wins: 0, losses: 0, ties: 0 },
    totalPoints: 0,
  },
};