/**
 * Astral Draft - Comprehensive Integration Testing Suite
 * Tests all critical systems working together after major fixes
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// System imports for integration testing
import App from '../../src/App';
import { AuthProvider } from '../../contexts/SimpleAuthContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { PaymentProvider } from '../../contexts/PaymentContext';
import { OptimizedContextProvider } from '../../contexts/OptimizedContexts';

// Performance and memory utilities
import { measurePerformance } from '../../utils/performanceOptimization';
import { MemoryMonitor } from '../../utils/memoryCleanup';
import { securityHeaders } from '../../server/middleware/emergencySecurityMiddleware';

// Mock server for API testing
const server = setupServer(
  rest.get('/api/auth/session', (req, res, ctx) => {
    return res(ctx.json({ 
      user: { id: '1', email: 'test@example.com', role: 'user' },
      sessionValid: true 
    }));
  }),
  rest.get('/api/league/:leagueId', (req, res, ctx) => {
    return res(ctx.json({ 
      id: req.params.leagueId,
      name: 'Test League',
      teams: 10 
    }));
  }),
  rest.get('/api/players', (req, res, ctx) => {
    return res(ctx.json({ 
      players: Array(100).fill(null).map((_, i) => ({
        id: `player-${i}`,
        name: `Player ${i}`,
        position: ['QB', 'RB', 'WR', 'TE'][i % 4],
        team: `TEAM${i % 32}`,
        points: Math.random() * 300
      }))
    }));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Integration Test Suite - All Systems', () => {
  
  describe('1. Build Integration Validation', () => {
    test('All critical modules compile without conflicts', async () => {
      // Test that all major components can be imported without errors
      const modules = await Promise.all([
        import('../../components/auth/ProductionLoginInterface'),
        import('../../components/draft/LiveDraftRoom'),
        import('../../components/ui/accessible/AccessibleButton'),
        import('../../components/performance/PerformanceMonitor'),
        import('../../hooks/useMemoryCleanup'),
        import('../../services/webSocketManager')
      ]);
      
      expect(modules).toHaveLength(6);
      modules.forEach((mod: any) => {
        expect(mod).toBeDefined();
        expect(mod.default || mod).toBeTruthy();
      });
    });

    test('Security headers don\'t conflict with performance optimizations', () => {
      const headers = securityHeaders();
      expect(headers['Content-Security-Policy']).toBeDefined();
      expect(headers['X-Frame-Options']).toBe('DENY');
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      
      // Ensure headers don't block essential resources
      const csp = headers['Content-Security-Policy'];
      expect(csp).toContain('self');
      expect(csp).toContain('wss:'); // WebSocket support
      expect(csp).not.toContain('unsafe-inline'); // Security compliance
    });

    test('Bundle optimizations maintain component integrity', async () => {
      const { container } = render(
        <OptimizedContextProvider>
          <App />
        </OptimizedContextProvider>
      );
      
      // Check that lazy-loaded components can be resolved
      await waitFor(() => {
        expect(container.querySelector('#root')).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Verify code splitting works
      const lazyComponents = [
        'DraftRoom',
        'PlayerResearch',
        'TradeCenter',
        'Analytics'
      ];
      
      for (const component of lazyComponents) {
        const module = await import(`../../views/${component}View`);
        expect(module).toBeDefined();
      }
    });
  });

  describe('2. Cross-System Functionality', () => {
    test('Authentication + Accessibility + Performance', async () => {
      const startTime = performance.now();
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      const { container } = render(
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      );
      
      // Test accessibility during login
      const loginButton = screen.getByRole('button', { name: /sign in/i });
      expect(loginButton).toHaveAttribute('aria-label');
      expect(loginButton).toHaveAttribute('tabIndex', '0');
      
      // Test keyboard navigation
      loginButton.focus();
      expect(document.activeElement).toBe(loginButton);
      
      // Measure performance
      const loadTime = performance.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 second max
      
      // Check memory usage
      const memoryUsed = (performance.memory?.usedJSHeapSize || 0) - initialMemory;
      expect(memoryUsed).toBeLessThan(15 * 1024 * 1024); // 15MB max
      
      // Test security headers are applied
      const meta = container.querySelector('meta[http-equiv="Content-Security-Policy"]');
      expect(meta).toBeTruthy();
    });

    test('WebSocket + Memory Management + Real-time Features', async () => {
      const memoryMonitor = new MemoryMonitor();
      memoryMonitor.startMonitoring();
      
      // Import WebSocket manager
      const { WebSocketManager } = await import('../../services/webSocketManager');
      const wsManager = new WebSocketManager();
      
      // Connect and monitor memory
      await wsManager.connect('ws://localhost:3001');
      
      // Simulate real-time updates
      for (let i = 0; i < 100; i++) {
        wsManager.emit('draft-pick', { 
          player: `player-${i}`, 
          team: `team-${i % 10}` 
        });
      }
      
      // Check memory cleanup is working
      const memoryStats = memoryMonitor.getStats();
      expect(memoryStats.leaks).toHaveLength(0);
      expect(memoryStats.peakMemory).toBeLessThan(20 * 1024 * 1024); // 20MB peak
      
      // Cleanup
      wsManager.disconnect();
      memoryMonitor.stopMonitoring();
    });

    test('Performance Optimizations + Accessibility Features', async () => {
      const { container, rerender } = render(
        <OptimizedContextProvider>
          <App />
        </OptimizedContextProvider>
      );
      
      // Test that optimized contexts don't break accessibility
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button: any) => {
        // All buttons should be keyboard accessible
        expect(parseInt(button.getAttribute('tabIndex') || '0')).toBeGreaterThanOrEqual(0);
        
        // All buttons should have accessible labels
        const hasLabel = button.getAttribute('aria-label') || 
                        button.getAttribute('aria-labelledby') || 
                        button.textContent;
        expect(hasLabel).toBeTruthy();
      });
      
      // Test that performance optimizations don't break screen readers
      const liveRegions = container.querySelectorAll('[aria-live]');
      expect(liveRegions.length).toBeGreaterThan(0);
      
      // Test focus management isn't broken by optimizations
      const firstButton = buttons[0];
      if (firstButton) {
        firstButton.focus();
        expect(document.activeElement).toBe(firstButton);
      }
    });
  });

  describe('3. User Workflow End-to-End', () => {
    test('Complete Login Flow with All Systems', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <NotificationProvider>
            <OptimizedContextProvider>
              <App />
            </OptimizedContextProvider>
          </NotificationProvider>
        </AuthProvider>
      );
      
      // Find login form with accessibility
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Test form interaction
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'SecurePass123!');
      await user.click(submitButton);
      
      // Wait for authentication
      await waitFor(() => {
        expect(screen.queryByText(/dashboard/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Verify security headers are maintained
      const cookies = document.cookie;
      expect(cookies).toContain('HttpOnly');
      expect(cookies).toContain('Secure');
      expect(cookies).toContain('SameSite');
    });

    test('Draft Room with Performance + Memory + Accessibility', async () => {
      const memoryMonitor = new MemoryMonitor();
      memoryMonitor.startMonitoring();
      
      const { container } = render(
        <OptimizedContextProvider>
          <App initialRoute="/draft" />
        </OptimizedContextProvider>
      );
      
      // Wait for draft room to load
      await waitFor(() => {
        expect(screen.getByText(/draft room/i)).toBeInTheDocument();
      });
      
      // Test accessibility in draft interface
      const playerCards = screen.getAllByRole('article');
      expect(playerCards.length).toBeGreaterThan(0);
      
      playerCards.forEach((card: any) => {
        expect(card).toHaveAttribute('tabIndex');
        expect(card).toHaveAttribute('aria-label');
      });
      
      // Simulate draft activity
      for (let i = 0; i < 50; i++) {
        const player = playerCards[i % playerCards.length];
        fireEvent.click(player);
        
        // Check memory isn't growing excessively
        if (i % 10 === 0) {
          const stats = memoryMonitor.getStats();
          expect(stats.currentMemory).toBeLessThan(25 * 1024 * 1024); // 25MB limit
        }
      }
      
      // Test timer accessibility
      const timer = screen.getByRole('timer');
      expect(timer).toHaveAttribute('aria-live', 'polite');
      expect(timer).toHaveAttribute('aria-atomic', 'true');
      
      memoryMonitor.stopMonitoring();
    });

    test('Mobile Experience with All Optimizations', async () => {
      // Set mobile viewport
      window.innerWidth = 375;
      window.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));
      
      render(
        <OptimizedContextProvider>
          <App />
        </OptimizedContextProvider>
      );
      
      // Check mobile-specific components load
      await waitFor(() => {
        expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
      });
      
      // Test touch interactions
      const navButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.touchStart(navButton);
      fireEvent.touchEnd(navButton);
      
      // Check mobile menu accessibility
      const mobileMenu = await screen.findByRole('navigation');
      expect(mobileMenu).toHaveAttribute('aria-label');
      
      // Test swipe gestures don't break with optimizations
      fireEvent.touchStart(mobileMenu, { touches: [{ clientX: 300, clientY: 100 }] });
      fireEvent.touchMove(mobileMenu, { touches: [{ clientX: 100, clientY: 100 }] });
      fireEvent.touchEnd(mobileMenu);
      
      // Verify performance on mobile
      const paintTiming = performance.getEntriesByType('paint');
      const fcp = paintTiming.find((entry: any) => entry.name === 'first-contentful-paint');
      expect(fcp?.startTime).toBeLessThan(2500); // 2.5s FCP on mobile
    });
  });

  describe('4. Performance vs Security vs Accessibility Balance', () => {
    test('Core Web Vitals with Security Headers', async () => {
      const { container } = render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );
      
      // Measure LCP
      const lcpObserver = new PerformanceObserver((list: any) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        expect(lastEntry.startTime).toBeLessThan(2500); // 2.5s LCP
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Measure FID
      let fidMeasured = false;
      const fidObserver = new PerformanceObserver((list: any) => {
        if (!fidMeasured) {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            expect(entry.processingStart - entry.startTime).toBeLessThan(100); // 100ms FID
          });
          fidMeasured = true;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      
      // Simulate user interaction
      const button = await screen.findByRole('button');
      fireEvent.click(button);
      
      // Measure CLS
      let cumulativeScore = 0;
      const clsObserver = new PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cumulativeScore += entry.value;
          }
        }
        expect(cumulativeScore).toBeLessThan(0.1); // 0.1 CLS
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      
      // Clean up observers
      setTimeout(() => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      }, 5000);
    });

    test('Accessibility doesn\'t degrade performance', async () => {
      const startTime = performance.now();
      
      const { container } = render(
        <OptimizedContextProvider>
          <App />
        </OptimizedContextProvider>
      );
      
      // Load time with accessibility features
      const loadTime = performance.now() - startTime;
      expect(loadTime).toBeLessThan(1500); // 1.5s initial load
      
      // Test ARIA live regions don't cause performance issues
      const liveRegion = container.querySelector('[aria-live="polite"]');
      if (liveRegion) {
        // Update live region 100 times rapidly
        for (let i = 0; i < 100; i++) {
          liveRegion.textContent = `Update ${i}`;
        }
        
        // Check no jank occurred
        const frameTime = performance.now() - startTime;
        expect(frameTime / 100).toBeLessThan(16); // 60fps target
      }
      
      // Test focus management performance
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const focusStartTime = performance.now();
      focusableElements.forEach((el: any) => {
        el.focus();
      });
      const focusTime = performance.now() - focusStartTime;
      expect(focusTime).toBeLessThan(100); // Fast focus switching
    });

    test('Security measures don\'t break functionality', async () => {
      const { container } = render(
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      );
      
      // Test that CSP doesn't block legitimate resources
      const scripts = container.querySelectorAll('script');
      scripts.forEach((script: any) => {
        if (script.src) {
          expect(script.src).toMatch(/^(https?:\/\/localhost|\/)/);
        }
      });
      
      // Test WebSocket connections work with security
      const ws = new WebSocket('ws://localhost:3001');
      await new Promise((resolve: any) => {
        ws.onopen = resolve;
        ws.onerror = () => resolve(false);
      });
      expect(ws.readyState).toBe(WebSocket.OPEN || WebSocket.CONNECTING);
      ws.close();
      
      // Test API calls work with security headers
      const response = await fetch('/api/players', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(response.ok).toBe(true);
    });
  });

  describe('5. Integration Regression Testing', () => {
    test('All navigation routes still work', async () => {
      const { container } = render(
        <OptimizedContextProvider>
          <App />
        </OptimizedContextProvider>
      );
      
      const routes = [
        '/dashboard',
        '/draft',
        '/players',
        '/trades',
        '/league',
        '/settings'
      ];
      
      for (const route of routes) {
        window.history.pushState({}, '', route);
        window.dispatchEvent(new PopStateEvent('popstate'));
        
        await waitFor(() => {
          expect(container.querySelector('#root')).toBeInTheDocument();
        }, { timeout: 2000 });
      }
    });

    test('Error boundaries work with all systems', async () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };
      
      const { container } = render(
        <OptimizedContextProvider>
          <App>
            <ThrowError />
          </App>
        </OptimizedContextProvider>
      );
      
      // Error boundary should catch and display fallback
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
      
      // Recovery button should be accessible
      const recoveryButton = screen.getByRole('button', { name: /try again/i });
      expect(recoveryButton).toHaveAttribute('aria-label');
      expect(recoveryButton).toBeEnabled();
    });

    test('WebSocket reconnection with memory cleanup', async () => {
      const { WebSocketManager } = await import('../../services/webSocketManager');
      const wsManager = new WebSocketManager();
      const memoryMonitor = new MemoryMonitor();
      
      memoryMonitor.startMonitoring();
      
      // Connect and disconnect multiple times
      for (let i = 0; i < 5; i++) {
        await wsManager.connect('ws://localhost:3001');
        
        // Send some data
        for (let j = 0; j < 20; j++) {
          wsManager.emit('test-event', { data: `test-${i}-${j}` });
        }
        
        wsManager.disconnect();
        
        // Check memory is cleaned up
        const stats = memoryMonitor.getStats();
        expect(stats.currentMemory).toBeLessThan(10 * 1024 * 1024); // 10MB max
      }
      
      memoryMonitor.stopMonitoring();
    });

    test('Complex multi-component interaction', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <PaymentProvider>
            <NotificationProvider>
              <OptimizedContextProvider>
                <App />
              </OptimizedContextProvider>
            </NotificationProvider>
          </PaymentProvider>
        </AuthProvider>
      );
      
      // Login
      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      // Navigate to draft
      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      });
      
      const draftLink = screen.getByRole('link', { name: /draft/i });
      await user.click(draftLink);
      
      // Draft a player
      await waitFor(() => {
        expect(screen.getByText(/draft room/i)).toBeInTheDocument();
      });
      
      const playerCard = screen.getAllByRole('article')[0];
      await user.click(playerCard);
      
      // Check notification appears
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      
      // Navigate to trades
      const tradesLink = screen.getByRole('link', { name: /trades/i });
      await user.click(tradesLink);
      
      // Initiate a trade
      await waitFor(() => {
        expect(screen.getByText(/trade center/i)).toBeInTheDocument();
      });
      
      // All systems should still be working
      expect(document.querySelector('[aria-live]')).toBeInTheDocument(); // Accessibility
      expect(performance.memory.usedJSHeapSize).toBeLessThan(30 * 1024 * 1024); // Memory
    });
  });
});

// Performance metrics collection
export class PerformanceMetrics {
  private metrics: any[] = [];
  
  collect() {
    const navigation = performance.getEntriesByType('navigation')[0] as any;
    const paint = performance.getEntriesByType('paint');
    
    this.metrics.push({
      timestamp: Date.now(),
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      firstPaint: paint.find((p: any) => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find((p: any) => p.name === 'first-contentful-paint')?.startTime,
      memory: performance.memory?.usedJSHeapSize
    });
  }
  
  getReport() {
    return {
      metrics: this.metrics,
      average: {
        domContentLoaded: this.average('domContentLoaded'),
        loadComplete: this.average('loadComplete'),
        firstPaint: this.average('firstPaint'),
        firstContentfulPaint: this.average('firstContentfulPaint'),
        memory: this.average('memory')
      }
    };
  }
  
  private average(key: string) {
    const values = this.metrics.map((m: any) => m[key]).filter((v: any) => v !== undefined);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}