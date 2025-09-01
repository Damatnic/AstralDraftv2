/**
 * Player Service Tests
 * Critical API layer testing with proper mocking
 */

import { playerService } from './playerService';
import { createMockPlayer, createMockApiResponse, mockFetchSuccess, mockFetchError } from '../src/test-utils';
import type { Player } from '../src/types';

// Mock global fetch
global.fetch = jest.fn();

describe('PlayerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlayers', () => {
    test('should fetch players successfully', async () => {
      const mockPlayers: Player[] = [
        createMockPlayer({ id: 1, name: 'Josh Allen', position: 'QB' }),
        createMockPlayer({ id: 2, name: 'Christian McCaffrey', position: 'RB' }),
      ];

      mockFetchSuccess(mockPlayers);

      const result = await playerService.getPlayers();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].name).toBe('Josh Allen');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/players'),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    test('should handle API errors gracefully', async () => {
      mockFetchError('Server error', 500);

      const result = await playerService.getPlayers();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Server error');
    });

    test('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await playerService.getPlayers();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });

  describe('getPlayerById', () => {
    test('should fetch single player successfully', async () => {
      const mockPlayer = createMockPlayer({ id: 1, name: 'Josh Allen' });
      mockFetchSuccess(mockPlayer);

      const result = await playerService.getPlayerById(1);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Josh Allen');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/players/1'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    test('should handle player not found', async () => {
      mockFetchError('Player not found', 404);

      const result = await playerService.getPlayerById(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Player not found');
    });

    test('should validate player ID parameter', async () => {
      const result = await playerService.getPlayerById(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid player ID');
    });
  });

  describe('searchPlayers', () => {
    test('should search players by name', async () => {
      const mockPlayers = [
        createMockPlayer({ name: 'Josh Allen' }),
        createMockPlayer({ name: 'Josh Jacobs' }),
      ];
      mockFetchSuccess(mockPlayers);

      const result = await playerService.searchPlayers('Josh');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=Josh'),
        expect.any(Object)
      );
    });

    test('should handle empty search results', async () => {
      mockFetchSuccess([]);

      const result = await playerService.searchPlayers('NonexistentPlayer');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    test('should sanitize search query', async () => {
      const maliciousQuery = '<script>alert("XSS")</script>';
      mockFetchSuccess([]);

      await playerService.searchPlayers(maliciousQuery);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const url = fetchCall[0];
      expect(url).not.toContain('<script>');
      expect(url).not.toContain('alert');
    });

    test('should handle minimum query length', async () => {
      const result = await playerService.searchPlayers('a');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Search query must be at least 2 characters');
    });
  });

  describe('getPlayersByPosition', () => {
    test('should fetch players by position', async () => {
      const mockQBs = [
        createMockPlayer({ position: 'QB', name: 'Josh Allen' }),
        createMockPlayer({ position: 'QB', name: 'Patrick Mahomes' }),
      ];
      mockFetchSuccess(mockQBs);

      const result = await playerService.getPlayersByPosition('QB');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data.every(player => player.position === 'QB')).toBe(true);
    });

    test('should validate position parameter', async () => {
      const result = await playerService.getPlayersByPosition('INVALID');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid position');
    });
  });

  describe('getPlayerStats', () => {
    test('should fetch player statistics', async () => {
      const mockStats = {
        passingYards: 4544,
        passingTDs: 37,
        interceptions: 15,
      };
      mockFetchSuccess(mockStats);

      const result = await playerService.getPlayerStats(1, 2025);

      expect(result.success).toBe(true);
      expect(result.data.passingYards).toBe(4544);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/players/1/stats/2025'),
        expect.any(Object)
      );
    });

    test('should handle missing stats', async () => {
      mockFetchError('Stats not found', 404);

      const result = await playerService.getPlayerStats(1, 2023);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Stats not found');
    });
  });

  describe('caching', () => {
    test('should cache player data', async () => {
      const mockPlayer = createMockPlayer();
      mockFetchSuccess(mockPlayer);

      // First call
      await playerService.getPlayerById(1);
      // Second call
      await playerService.getPlayerById(1);

      // Should only make one API call due to caching
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('should invalidate cache after timeout', async () => {
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

  describe('error handling', () => {
    test('should handle malformed JSON responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const result = await playerService.getPlayers();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid JSON');
    });

    test('should handle timeout errors', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      const result = await playerService.getPlayers();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Timeout');
    });
  });
});