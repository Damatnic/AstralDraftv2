# 🧪 Comprehensive Testing Implementation Plan
## From 3% to 80%+ Test Coverage

## Current Status
- **Current Coverage**: ~3% (mostly placeholder tests)
- **Target Coverage**: 80%+ with meaningful assertions
- **Test Files**: 200+ exist but need real implementations

## Phase 1: Test Infrastructure Setup (30 minutes)

### 1. Update Jest configuration (`jest.config.js`):
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@services/(.*)$': '<rootDir>/services/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 2. Setup test utilities (`src/test-utils.tsx`):
```typescript
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppProvider } from './contexts/AppContext';
import { ModalProvider } from './contexts/ModalContext';

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </AppProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## Phase 2: Critical Path Testing (4 hours)

### 1. Authentication Tests (`components/auth/SimplePlayerLogin.test.tsx`):
```typescript
import { render, screen, fireEvent, waitFor } from '../test-utils';
import SimplePlayerLogin from './SimplePlayerLogin';

describe('SimplePlayerLogin', () => {
  test('should render login form', () => {
    render(<SimplePlayerLogin />);
    expect(screen.getByLabelText(/team name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join league/i })).toBeInTheDocument();
  });

  test('should handle form submission', async () => {
    const mockOnLogin = jest.fn();
    render(<SimplePlayerLogin onLogin={mockOnLogin} />);
    
    const input = screen.getByLabelText(/team name/i);
    const button = screen.getByRole('button', { name: /join league/i });
    
    fireEvent.change(input, { target: { value: 'Test Team' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          teamName: 'Test Team'
        })
      );
    });
  });

  test('should validate required fields', async () => {
    render(<SimplePlayerLogin />);
    
    const button = screen.getByRole('button', { name: /join league/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/team name is required/i)).toBeInTheDocument();
    });
  });
});
```

### 2. Draft Flow Tests (`views/EnhancedDraftRoomView.test.tsx`):
```typescript
import { render, screen, fireEvent, waitFor } from '../test-utils';
import EnhancedDraftRoomView from './EnhancedDraftRoomView';
import * as draftService from '../services/draftService';

jest.mock('../services/draftService');
const mockDraftService = draftService as jest.Mocked<typeof draftService>;

describe('EnhancedDraftRoomView', () => {
  beforeEach(() => {
    mockDraftService.getCurrentDraft.mockResolvedValue({
      success: true,
      data: {
        isActive: true,
        currentPick: 1,
        currentTeamId: 1,
        picks: [],
        timePerPick: 90,
        draftType: 'snake'
      }
    });
  });

  test('should display draft status', async () => {
    render(<EnhancedDraftRoomView />);
    
    await waitFor(() => {
      expect(screen.getByText(/draft in progress/i)).toBeInTheDocument();
    });
  });

  test('should allow player selection when user turn', async () => {
    render(<EnhancedDraftRoomView />);
    
    const playerCard = await screen.findByTestId('player-1');
    fireEvent.click(playerCard);
    
    await waitFor(() => {
      expect(screen.getByText(/confirm selection/i)).toBeInTheDocument();
    });
  });
});
```

### 3. Service Layer Tests (`services/playerService.test.ts`):
```typescript
import { PlayerService } from './playerService';
import { ApiResponse, Player } from '../types';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('PlayerService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should fetch players successfully', async () => {
    const mockPlayers: Player[] = [
      {
        id: 1,
        name: 'Josh Allen',
        position: 'QB',
        team: 'BUF',
        projectedPoints: 22.5,
        averageDraftPosition: 15.2,
        tier: 1,
        byeWeek: 7
      }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockPlayers })
    } as Response);

    const result = await PlayerService.getPlayers();
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Josh Allen');
  });

  test('should handle API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ success: false, error: 'Server error' })
    } as Response);

    const result = await PlayerService.getPlayers();
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Server error');
  });
});
```

## Phase 3: Security Testing (2 hours)

### XSS Prevention Tests:
```typescript
describe('Security Tests', () => {
  test('should prevent XSS in user input', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitized = sanitizeHTML(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert(');
  });

  test('should validate authentication tokens', () => {
    const invalidToken = 'invalid.token.here';
    const result = validateAuthToken(invalidToken);
    
    expect(result.valid).toBe(false);
  });
});
```

## Phase 4: E2E Testing Setup (2 hours)

### Cypress setup (`cypress/e2e/draft-flow.cy.ts`):
```typescript
describe('Complete Draft Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete a full draft simulation', () => {
    // Login
    cy.get('[data-testid="team-name-input"]').type('Test Team');
    cy.get('[data-testid="join-league-button"]').click();
    
    // Navigate to draft
    cy.get('[data-testid="draft-room-link"]').click();
    
    // Make first pick
    cy.get('[data-testid="player-1"]').click();
    cy.get('[data-testid="confirm-pick"]').click();
    
    // Verify pick was made
    cy.get('[data-testid="my-roster"]').should('contain', 'Josh Allen');
  });
});
```

## Commands to Run

### 1. Run tests with coverage:
```bash
npm test -- --coverage --watchAll=false
```

### 2. Run specific test suites:
```bash
# Unit tests only
npm test -- --testPathPattern="\.test\.(ts|tsx)$"

# Integration tests
npm test -- --testPathPattern="\.integration\.test\.(ts|tsx)$"

# E2E tests
npx cypress run
```

### 3. Generate coverage report:
```bash
npm test -- --coverage --coverageReporters=html
open coverage/index.html
```

## Coverage Targets

| Component Type | Coverage Target | Priority |
|----------------|----------------|----------|
| Auth Components | 95%+ | Critical |
| Draft Logic | 90%+ | Critical |
| Services/API | 85%+ | High |
| UI Components | 80%+ | Medium |
| Utilities | 90%+ | High |

## Expected Timeline
- **Day 1**: Infrastructure setup, critical path tests
- **Day 2**: Service layer tests, security tests
- **Day 3**: E2E tests, coverage optimization
- **Result**: 80%+ coverage with meaningful assertions