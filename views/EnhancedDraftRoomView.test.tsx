/**
 * Enhanced Draft Room View Integration Tests
 * Tests critical draft functionality and user interactions
 */

import { render, screen, fireEvent, waitFor } from '../src/test-utils';
import { createMockUser, createMockPlayer, mockFetchSuccess } from '../src/test-utils';
import EnhancedDraftRoomView from './EnhancedDraftRoomView';

// Mock draft service
const mockDraftService = {
  getCurrentDraft: jest.fn(),
  makeDraftPick: jest.fn(),
  getDraftBoard: jest.fn(),
  startDraft: jest.fn(),
  pauseDraft: jest.fn(),
};

jest.mock('../services/draftService', () => mockDraftService);

// Mock WebSocket service
const mockWebSocketService = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  subscribe: jest.fn(),
  send: jest.fn(),
};

jest.mock('../services/enhancedWebSocketService', () => ({
  enhancedWebSocketService: mockWebSocketService,
}));

const mockDraftState = {
  isActive: true,
  currentPick: 1,
  currentTeamId: 1,
  picks: [],
  timePerPick: 90,
  draftType: 'snake' as const,
  totalRounds: 16,
  leagueId: 1,
};

const mockDraftBoard = {
  availablePlayers: [
    createMockPlayer({ id: 1, name: 'Josh Allen', position: 'QB', tier: 1 }),
    createMockPlayer({ id: 2, name: 'Christian McCaffrey', position: 'RB', tier: 1 }),
    createMockPlayer({ id: 3, name: 'Cooper Kupp', position: 'WR', tier: 1 }),
  ],
  draftedPlayers: [],
  myTeam: {
    id: 1,
    name: 'Test Team',
    owner: 'Test User',
    roster: [],
    record: { wins: 0, losses: 0, ties: 0 },
    totalPoints: 0,
  },
  allTeams: [],
  currentPick: {
    pick: 1,
    round: 1,
    teamId: 1,
  },
  upcomingPicks: [],
};

describe('EnhancedDraftRoomView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockDraftService.getCurrentDraft.mockResolvedValue({
      success: true,
      data: mockDraftState,
    });
    
    mockDraftService.getDraftBoard.mockResolvedValue({
      success: true,
      data: mockDraftBoard,
    });
  });

  test('should display draft status when active', async () => {
    const initialState = {
      user: createMockUser({ id: 1, teamName: 'Test Team' }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByText(/draft in progress/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/round 1/i)).toBeInTheDocument();
    expect(screen.getByText(/pick 1/i)).toBeInTheDocument();
  });

  test('should display available players', async () => {
    const initialState = {
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Josh Allen')).toBeInTheDocument();
      expect(screen.getByText('Christian McCaffrey')).toBeInTheDocument();
      expect(screen.getByText('Cooper Kupp')).toBeInTheDocument();
    });
  });

  test('should allow player selection when user turn', async () => {
    const initialState = {
      user: createMockUser({ id: 1, teamName: 'Test Team' }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Josh Allen')).toBeInTheDocument();
    });

    const playerCard = screen.getByTestId('player-1');
    fireEvent.click(playerCard);

    await waitFor(() => {
      expect(screen.getByText(/confirm selection/i)).toBeInTheDocument();
    });
  });

  test('should prevent selection when not user turn', async () => {
    const modifiedDraftState = {
      ...mockDraftState,
      currentTeamId: 2, // Different team's turn
    };
    
    mockDraftService.getCurrentDraft.mockResolvedValue({
      success: true,
      data: modifiedDraftState,
    });

    const initialState = {
      user: createMockUser({ id: 1, teamName: 'Test Team' }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByText(/waiting for/i)).toBeInTheDocument();
    });

    const playerCards = screen.getAllByTestId(/player-/);
    playerCards.forEach((card: any) => {
      expect(card).toHaveAttribute('aria-disabled', 'true');
    });
  });

  test('should handle draft pick submission', async () => {
    mockDraftService.makeDraftPick.mockResolvedValue({
      success: true,
      data: { ...mockDraftState, currentPick: 2 },
    });

    const initialState = {
      user: createMockUser({ id: 1, teamName: 'Test Team' }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Josh Allen')).toBeInTheDocument();
    });

    // Select player
    const playerCard = screen.getByTestId('player-1');
    fireEvent.click(playerCard);

    // Confirm selection
    const confirmButton = screen.getByText(/confirm selection/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDraftService.makeDraftPick).toHaveBeenCalledWith({
        playerId: 1,
        teamId: 1,
        pick: 1,
        round: 1,
      });
    });
  });

  test('should display draft timer', async () => {
    const initialState = {
      user: createMockUser({ id: 1, teamName: 'Test Team' }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByText(/1:30/i)).toBeInTheDocument(); // 90 seconds
    });
  });

  test('should handle auto-pick when timer expires', async () => {
    jest.useFakeTimers();
    
    mockDraftService.makeDraftPick.mockResolvedValue({
      success: true,
      data: mockDraftState,
    });

    const initialState = {
      user: createMockUser({ id: 1, teamName: 'Test Team' }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByText(/1:30/i)).toBeInTheDocument();
    });

    // Fast forward time to trigger auto-pick
    jest.advanceTimersByTime(90000); // 90 seconds

    await waitFor(() => {
      expect(mockDraftService.makeDraftPick).toHaveBeenCalledWith(
        expect.objectContaining({
          playerId: expect.any(Number),
          isAutoPick: true,
        })
      );
    });

    jest.useRealTimers();
  });

  test('should filter players by position', async () => {
    const initialState = {
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Josh Allen')).toBeInTheDocument();
    });

    // Filter by RB
    const rbFilter = screen.getByRole('button', { name: /running back/i });
    fireEvent.click(rbFilter);

    await waitFor(() => {
      expect(screen.getByText('Christian McCaffrey')).toBeInTheDocument();
      expect(screen.queryByText('Josh Allen')).not.toBeInTheDocument();
    });
  });

  test('should search players by name', async () => {
    const initialState = {
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Josh Allen')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search players/i);
    fireEvent.change(searchInput, { target: { value: 'Josh' } });

    await waitFor(() => {
      expect(screen.getByText('Josh Allen')).toBeInTheDocument();
      expect(screen.queryByText('Christian McCaffrey')).not.toBeInTheDocument();
    });
  });

  test('should display my roster', async () => {
    const teamWithRoster = {
      ...mockDraftBoard.myTeam,
      roster: [createMockPlayer({ name: 'Drafted Player' })],
    };

    mockDraftService.getDraftBoard.mockResolvedValue({
      success: true,
      data: { ...mockDraftBoard, myTeam: teamWithRoster },
    });

    const initialState = {
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByText(/my roster/i)).toBeInTheDocument();
      expect(screen.getByText('Drafted Player')).toBeInTheDocument();
    });
  });

  test('should handle WebSocket draft updates', async () => {
    const initialState = {
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    // Simulate WebSocket message for new pick
    const mockWebSocketMessage = {
      type: 'draft_pick',
      payload: {
        pick: {
          pick: 2,
          round: 1,
          teamId: 2,
          playerId: 2,
        },
      },
    };

    // Trigger WebSocket subscription callback
    const subscriptionCallback = mockWebSocketService.subscribe.mock.calls[0][1];
    subscriptionCallback(mockWebSocketMessage);

    await waitFor(() => {
      expect(screen.getByText(/pick 2/i)).toBeInTheDocument();
    });
  });

  test('should handle errors gracefully', async () => {
    mockDraftService.getCurrentDraft.mockResolvedValue({
      success: false,
      error: 'Draft not found',
    });

    render(<EnhancedDraftRoomView />);

    await waitFor(() => {
      expect(screen.getByText(/error loading draft/i)).toBeInTheDocument();
    });
  });

  test('should be accessible for screen readers', async () => {
    const initialState = {
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /confirm selection/i })).toHaveAttribute('aria-describedby');
    expect(screen.getByText(/draft timer/i)).toHaveAttribute('aria-live', 'polite');
  });
});