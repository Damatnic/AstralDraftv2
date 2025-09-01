/**
 * Enhanced Draft Room View Integration Tests
 * Tests critical draft functionality and user interactions
 */

import { render, screen, fireEvent, waitFor } from &apos;../src/test-utils&apos;;
import { createMockUser, createMockPlayer, mockFetchSuccess } from &apos;../src/test-utils&apos;;
import EnhancedDraftRoomView from &apos;./EnhancedDraftRoomView&apos;;

// Mock draft service
const mockDraftService = {
}
  getCurrentDraft: jest.fn(),
  makeDraftPick: jest.fn(),
  getDraftBoard: jest.fn(),
  startDraft: jest.fn(),
  pauseDraft: jest.fn(),
};

jest.mock(&apos;../services/draftService&apos;, () => mockDraftService);

// Mock WebSocket service
const mockWebSocketService = {
}
  connect: jest.fn(),
  disconnect: jest.fn(),
  subscribe: jest.fn(),
  send: jest.fn(),
};

jest.mock(&apos;../services/enhancedWebSocketService&apos;, () => ({
}
  enhancedWebSocketService: mockWebSocketService,
}));

const mockDraftState = {
}
  isActive: true,
  currentPick: 1,
  currentTeamId: 1,
  picks: [],
  timePerPick: 90,
  draftType: &apos;snake&apos; as const,
  totalRounds: 16,
  leagueId: 1,
};

const mockDraftBoard = {
}
  availablePlayers: [
    createMockPlayer({ id: 1, name: &apos;Josh Allen&apos;, position: &apos;QB&apos;, tier: 1 }),
    createMockPlayer({ id: 2, name: &apos;Christian McCaffrey&apos;, position: &apos;RB&apos;, tier: 1 }),
    createMockPlayer({ id: 3, name: &apos;Cooper Kupp&apos;, position: &apos;WR&apos;, tier: 1 }),
  ],
  draftedPlayers: [],
  myTeam: {
}
    id: 1,
    name: &apos;Test Team&apos;,
    owner: &apos;Test User&apos;,
    roster: [],
    record: { wins: 0, losses: 0, ties: 0 },
    totalPoints: 0,
  },
  allTeams: [],
  currentPick: {
}
    pick: 1,
    round: 1,
    teamId: 1,
  },
  upcomingPicks: [],
};

describe(&apos;EnhancedDraftRoomView&apos;, () => {
}
  beforeEach(() => {
}
    jest.clearAllMocks();
    
    mockDraftService.getCurrentDraft.mockResolvedValue({
}
      success: true,
      data: mockDraftState,
    });
    
    mockDraftService.getDraftBoard.mockResolvedValue({
}
      success: true,
      data: mockDraftBoard,
    });
  });

  test(&apos;should display draft status when active&apos;, async () => {
}
    const initialState = {
}
      user: createMockUser({ id: 1, teamName: &apos;Test Team&apos; }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByText(/draft in progress/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/round 1/i)).toBeInTheDocument();
    expect(screen.getByText(/pick 1/i)).toBeInTheDocument();
  });

  test(&apos;should display available players&apos;, async () => {
}
    const initialState = {
}
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByText(&apos;Josh Allen&apos;)).toBeInTheDocument();
      expect(screen.getByText(&apos;Christian McCaffrey&apos;)).toBeInTheDocument();
      expect(screen.getByText(&apos;Cooper Kupp&apos;)).toBeInTheDocument();
    });
  });

  test(&apos;should allow player selection when user turn&apos;, async () => {
}
    const initialState = {
}
      user: createMockUser({ id: 1, teamName: &apos;Test Team&apos; }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByText(&apos;Josh Allen&apos;)).toBeInTheDocument();
    });

    const playerCard = screen.getByTestId(&apos;player-1&apos;);
    fireEvent.click(playerCard);

    await waitFor(() => {
}
      expect(screen.getByText(/confirm selection/i)).toBeInTheDocument();
    });
  });

  test(&apos;should prevent selection when not user turn&apos;, async () => {
}
    const modifiedDraftState = {
}
      ...mockDraftState,
      currentTeamId: 2, // Different team&apos;s turn
    };
    
    mockDraftService.getCurrentDraft.mockResolvedValue({
}
      success: true,
      data: modifiedDraftState,
    });

    const initialState = {
}
      user: createMockUser({ id: 1, teamName: &apos;Test Team&apos; }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByText(/waiting for/i)).toBeInTheDocument();
    });

    const playerCards = screen.getAllByTestId(/player-/);
    playerCards.forEach((card: any) => {
}
      expect(card).toHaveAttribute(&apos;aria-disabled&apos;, &apos;true&apos;);
    });
  });

  test(&apos;should handle draft pick submission&apos;, async () => {
}
    mockDraftService.makeDraftPick.mockResolvedValue({
}
      success: true,
      data: { ...mockDraftState, currentPick: 2 },
    });

    const initialState = {
}
      user: createMockUser({ id: 1, teamName: &apos;Test Team&apos; }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByText(&apos;Josh Allen&apos;)).toBeInTheDocument();
    });

    // Select player
    const playerCard = screen.getByTestId(&apos;player-1&apos;);
    fireEvent.click(playerCard);

    // Confirm selection
    const confirmButton = screen.getByText(/confirm selection/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
}
      expect(mockDraftService.makeDraftPick).toHaveBeenCalledWith({
}
        playerId: 1,
        teamId: 1,
        pick: 1,
        round: 1,
      });
    });
  });

  test(&apos;should display draft timer&apos;, async () => {
}
    const initialState = {
}
      user: createMockUser({ id: 1, teamName: &apos;Test Team&apos; }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByText(/1:30/i)).toBeInTheDocument(); // 90 seconds
    });
  });

  test(&apos;should handle auto-pick when timer expires&apos;, async () => {
}
    jest.useFakeTimers();
    
    mockDraftService.makeDraftPick.mockResolvedValue({
}
      success: true,
      data: mockDraftState,
    });

    const initialState = {
}
      user: createMockUser({ id: 1, teamName: &apos;Test Team&apos; }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByText(/1:30/i)).toBeInTheDocument();
    });

    // Fast forward time to trigger auto-pick
    jest.advanceTimersByTime(90000); // 90 seconds

    await waitFor(() => {
}
      expect(mockDraftService.makeDraftPick).toHaveBeenCalledWith(
        expect.objectContaining({
}
          playerId: expect.any(Number),
          isAutoPick: true,
        })
      );
    });

    jest.useRealTimers();
  });

  test(&apos;should filter players by position&apos;, async () => {
}
    const initialState = {
}
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByText(&apos;Josh Allen&apos;)).toBeInTheDocument();
    });

    // Filter by RB
    const rbFilter = screen.getByRole(&apos;button&apos;, { name: /running back/i });
    fireEvent.click(rbFilter);

    await waitFor(() => {
}
      expect(screen.getByText(&apos;Christian McCaffrey&apos;)).toBeInTheDocument();
      expect(screen.queryByText(&apos;Josh Allen&apos;)).not.toBeInTheDocument();
    });
  });

  test(&apos;should search players by name&apos;, async () => {
}
    const initialState = {
}
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByText(&apos;Josh Allen&apos;)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search players/i);
    fireEvent.change(searchInput, { target: { value: &apos;Josh&apos; } });

    await waitFor(() => {
}
      expect(screen.getByText(&apos;Josh Allen&apos;)).toBeInTheDocument();
      expect(screen.queryByText(&apos;Christian McCaffrey&apos;)).not.toBeInTheDocument();
    });
  });

  test(&apos;should display my roster&apos;, async () => {
}
    const teamWithRoster = {
}
      ...mockDraftBoard.myTeam,
      roster: [createMockPlayer({ name: &apos;Drafted Player&apos; })],
    };

    mockDraftService.getDraftBoard.mockResolvedValue({
}
      success: true,
      data: { ...mockDraftBoard, myTeam: teamWithRoster },
    });

    const initialState = {
}
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByText(/my roster/i)).toBeInTheDocument();
      expect(screen.getByText(&apos;Drafted Player&apos;)).toBeInTheDocument();
    });
  });

  test(&apos;should handle WebSocket draft updates&apos;, async () => {
}
    const initialState = {
}
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    // Simulate WebSocket message for new pick
    const mockWebSocketMessage = {
}
      type: &apos;draft_pick&apos;,
      payload: {
}
        pick: {
}
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
}
      expect(screen.getByText(/pick 2/i)).toBeInTheDocument();
    });
  });

  test(&apos;should handle errors gracefully&apos;, async () => {
}
    mockDraftService.getCurrentDraft.mockResolvedValue({
}
      success: false,
      error: &apos;Draft not found&apos;,
    });

    render(<EnhancedDraftRoomView />);

    await waitFor(() => {
}
      expect(screen.getByText(/error loading draft/i)).toBeInTheDocument();
    });
  });

  test(&apos;should be accessible for screen readers&apos;, async () => {
}
    const initialState = {
}
      user: createMockUser({ id: 1 }),
    };
    
    render(<EnhancedDraftRoomView />, { initialAppState: initialState });

    await waitFor(() => {
}
      expect(screen.getByRole(&apos;main&apos;)).toBeInTheDocument();
    });

    expect(screen.getByRole(&apos;button&apos;, { name: /confirm selection/i })).toHaveAttribute(&apos;aria-describedby&apos;);
    expect(screen.getByText(/draft timer/i)).toHaveAttribute(&apos;aria-live&apos;, &apos;polite&apos;);
  });
});