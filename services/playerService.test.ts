/**
 * Player Service Tests
 * Critical API layer testing with proper mocking
 */

import { playerService } from &apos;./playerService&apos;;
import { createMockPlayer, createMockApiResponse, mockFetchSuccess, mockFetchError } from &apos;../src/test-utils&apos;;
import type { Player } from &apos;../src/types&apos;;

// Mock global fetch
global.fetch = jest.fn();

describe(&apos;PlayerService&apos;, () => {
}
  beforeEach(() => {
}
    jest.clearAllMocks();
  });

  describe(&apos;getPlayers&apos;, () => {
}
    test(&apos;should fetch players successfully&apos;, async () => {
}
      const mockPlayers: Player[] = [
        createMockPlayer({ id: 1, name: &apos;Josh Allen&apos;, position: &apos;QB&apos; }),
        createMockPlayer({ id: 2, name: &apos;Christian McCaffrey&apos;, position: &apos;RB&apos; }),
      ];

      mockFetchSuccess(mockPlayers);

      const result = await playerService.getPlayers();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].name).toBe(&apos;Josh Allen&apos;);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(&apos;/players&apos;),
        expect.objectContaining({
}
          method: &apos;GET&apos;,
        })
      );
    });

    test(&apos;should handle API errors gracefully&apos;, async () => {
}
      mockFetchError(&apos;Server error&apos;, 500);

      const result = await playerService.getPlayers();

      expect(result.success).toBe(false);
      expect(result.error).toBe(&apos;Server error&apos;);
    });

    test(&apos;should handle network errors&apos;, async () => {
}
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(&apos;Network error&apos;));

      const result = await playerService.getPlayers();

      expect(result.success).toBe(false);
      expect(result.error).toContain(&apos;Network error&apos;);
    });
  });

  describe(&apos;getPlayerById&apos;, () => {
}
    test(&apos;should fetch single player successfully&apos;, async () => {
}
      const mockPlayer = createMockPlayer({ id: 1, name: &apos;Josh Allen&apos; });
      mockFetchSuccess(mockPlayer);

      const result = await playerService.getPlayerById(1);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe(&apos;Josh Allen&apos;);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(&apos;/players/1&apos;),
        expect.objectContaining({ method: &apos;GET&apos; })
      );
    });

    test(&apos;should handle player not found&apos;, async () => {
}
      mockFetchError(&apos;Player not found&apos;, 404);

      const result = await playerService.getPlayerById(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe(&apos;Player not found&apos;);
    });

    test(&apos;should validate player ID parameter&apos;, async () => {
}
      const result = await playerService.getPlayerById(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBe(&apos;Invalid player ID&apos;);
    });
  });

  describe(&apos;searchPlayers&apos;, () => {
}
    test(&apos;should search players by name&apos;, async () => {
}
      const mockPlayers = [
        createMockPlayer({ name: &apos;Josh Allen&apos; }),
        createMockPlayer({ name: &apos;Josh Jacobs&apos; }),
      ];
      mockFetchSuccess(mockPlayers);

      const result = await playerService.searchPlayers(&apos;Josh&apos;);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(&apos;search=Josh&apos;),
        expect.any(Object)
      );
    });

    test(&apos;should handle empty search results&apos;, async () => {
}
      mockFetchSuccess([]);

      const result = await playerService.searchPlayers(&apos;NonexistentPlayer&apos;);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    test(&apos;should sanitize search query&apos;, async () => {
}
      const maliciousQuery = &apos;<script>alert("XSS")</script>&apos;;
      mockFetchSuccess([]);

      await playerService.searchPlayers(maliciousQuery);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const url = fetchCall[0];
      expect(url).not.toContain(&apos;<script>&apos;);
      expect(url).not.toContain(&apos;alert&apos;);
    });

    test(&apos;should handle minimum query length&apos;, async () => {
}
      const result = await playerService.searchPlayers(&apos;a&apos;);

      expect(result.success).toBe(false);
      expect(result.error).toBe(&apos;Search query must be at least 2 characters&apos;);
    });
  });

  describe(&apos;getPlayersByPosition&apos;, () => {
}
    test(&apos;should fetch players by position&apos;, async () => {
}
      const mockQBs = [
        createMockPlayer({ position: &apos;QB&apos;, name: &apos;Josh Allen&apos; }),
        createMockPlayer({ position: &apos;QB&apos;, name: &apos;Patrick Mahomes&apos; }),
      ];
      mockFetchSuccess(mockQBs);

      const result = await playerService.getPlayersByPosition(&apos;QB&apos;);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data.every((player: any) => player.position === &apos;QB&apos;)).toBe(true);
    });

    test(&apos;should validate position parameter&apos;, async () => {
}
      const result = await playerService.getPlayersByPosition(&apos;INVALID&apos;);

      expect(result.success).toBe(false);
      expect(result.error).toBe(&apos;Invalid position&apos;);
    });
  });

  describe(&apos;getPlayerStats&apos;, () => {
}
    test(&apos;should fetch player statistics&apos;, async () => {
}
      const mockStats = {
}
        passingYards: 4544,
        passingTouchdowns: 37,
        interceptions: 15,
      };
      mockFetchSuccess(mockStats);

      const result = await playerService.getPlayerStats(1, 2025);

      expect(result.success).toBe(true);
      expect(result.data.passingYards).toBe(4544);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(&apos;/players/1/stats/2025&apos;),
        expect.any(Object)
      );
    });

    test(&apos;should handle missing stats&apos;, async () => {
}
      mockFetchError(&apos;Stats not found&apos;, 404);

      const result = await playerService.getPlayerStats(1, 2023);

      expect(result.success).toBe(false);
      expect(result.error).toBe(&apos;Stats not found&apos;);
    });
  });

  describe(&apos;caching&apos;, () => {
}
    test(&apos;should cache player data&apos;, async () => {
}
      const mockPlayer = createMockPlayer();
      mockFetchSuccess(mockPlayer);

      // First call
      await playerService.getPlayerById(1);
      // Second call
      await playerService.getPlayerById(1);

      // Should only make one API call due to caching
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test(&apos;should invalidate cache after timeout&apos;, async () => {
}
      jest.useFakeTimers();
      
      const mockPlayer = createMockPlayer();
      mockFetchSuccess(mockPlayer);

      // First call
      await playerService.getPlayerById(1);
      
      // Fast forward time beyond cache expiry
      jest.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
      
      mockFetchSuccess(mockPlayer);
      
      // Second call after cache expiry
      await playerService.getPlayerById(1);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      
      jest.useRealTimers();
    });
  });

  describe(&apos;error handling&apos;, () => {
}
    test(&apos;should handle malformed JSON responses&apos;, async () => {
}
      (global.fetch as jest.Mock).mockResolvedValueOnce({
}
        ok: true,
        json: () => Promise.reject(new Error(&apos;Invalid JSON&apos;)),
      });

      const result = await playerService.getPlayers();

      expect(result.success).toBe(false);
      expect(result.error).toContain(&apos;Invalid JSON&apos;);
    });

    test(&apos;should handle timeout errors&apos;, async () => {
}
      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise((_, reject) => 
          setTimeout(() => reject(new Error(&apos;Timeout&apos;)), 100)
        )
      );

      const result = await playerService.getPlayers();

      expect(result.success).toBe(false);
      expect(result.error).toContain(&apos;Timeout&apos;);
    });
  });
});