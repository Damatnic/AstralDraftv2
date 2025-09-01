/**
 * Astral Draft - Comprehensive Integration Testing Suite
 * Tests all critical systems working together after major fixes
 */

import { describe, test, expect, beforeAll, afterAll } from &apos;vitest&apos;;
import { render, screen, waitFor, fireEvent } from &apos;@testing-library/react&apos;;
import userEvent from &apos;@testing-library/user-event&apos;;
import { setupServer } from &apos;msw/node&apos;;
import { rest } from &apos;msw&apos;;

// System imports for integration testing
import App from &apos;../../src/App&apos;;
import { AuthProvider } from &apos;../../contexts/SimpleAuthContext&apos;;
import { NotificationProvider } from &apos;../../contexts/NotificationContext&apos;;
import { PaymentProvider } from &apos;../../contexts/PaymentContext&apos;;
import { OptimizedContextProvider } from &apos;../../contexts/OptimizedContexts&apos;;

// Performance and memory utilities
import { measurePerformance } from &apos;../../utils/performanceOptimization&apos;;
import { MemoryMonitor } from &apos;../../utils/memoryCleanup&apos;;
import { securityHeaders } from &apos;../../server/middleware/emergencySecurityMiddleware&apos;;

// Mock server for API testing
const server = setupServer(
  rest.get(&apos;/api/auth/session&apos;, (req, res, ctx) => {
}
    return res(ctx.json({ 
}
      user: { id: &apos;1&apos;, email: &apos;test@example.com&apos;, role: &apos;user&apos; },
      sessionValid: true 
    }));
  }),
  rest.get(&apos;/api/league/:leagueId&apos;, (req, res, ctx) => {
}
    return res(ctx.json({ 
}
      id: req.params.leagueId,
      name: &apos;Test League&apos;,
      teams: 10 
    }));
  }),
  rest.get(&apos;/api/players&apos;, (req, res, ctx) => {
}
    return res(ctx.json({ 
}
      players: Array(100).fill(null).map((_, i) => ({
}
        id: `player-${i}`,
        name: `Player ${i}`,
        position: [&apos;QB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;][i % 4],
        team: `TEAM${i % 32}`,
        points: Math.random() * 300
      }))
    }));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe(&apos;Integration Test Suite - All Systems&apos;, () => {
}
  
  describe(&apos;1. Build Integration Validation&apos;, () => {
}
    test(&apos;All critical modules compile without conflicts&apos;, async () => {
}
      // Test that all major components can be imported without errors
      const modules = await Promise.all([
        import(&apos;../../components/auth/ProductionLoginInterface&apos;),
        import(&apos;../../components/draft/LiveDraftRoom&apos;),
        import(&apos;../../components/ui/accessible/AccessibleButton&apos;),
        import(&apos;../../components/performance/PerformanceMonitor&apos;),
        import(&apos;../../hooks/useMemoryCleanup&apos;),
        import(&apos;../../services/webSocketManager&apos;)
      ]);
      
      expect(modules).toHaveLength(6);
      modules.forEach((mod: any) => {
}
        expect(mod).toBeDefined();
        expect(mod.default || mod).toBeTruthy();
      });
    });

    test(&apos;Security headers don\&apos;t conflict with performance optimizations&apos;, () => {
}
      const headers = securityHeaders();
      expect(headers[&apos;Content-Security-Policy&apos;]).toBeDefined();
      expect(headers[&apos;X-Frame-Options&apos;]).toBe(&apos;DENY&apos;);
      expect(headers[&apos;X-Content-Type-Options&apos;]).toBe(&apos;nosniff&apos;);
      
      // Ensure headers don&apos;t block essential resources
      const csp = headers[&apos;Content-Security-Policy&apos;];
      expect(csp).toContain(&apos;self&apos;);
      expect(csp).toContain(&apos;wss:&apos;); // WebSocket support
      expect(csp).not.toContain(&apos;unsafe-inline&apos;); // Security compliance
    });

    test(&apos;Bundle optimizations maintain component integrity&apos;, async () => {
}
      const { container } = render(
        <OptimizedContextProvider>
          <App />
        </OptimizedContextProvider>
      );
      
      // Check that lazy-loaded components can be resolved
      await waitFor(() => {
}
        expect(container.querySelector(&apos;#root&apos;)).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Verify code splitting works
      const lazyComponents = [
        &apos;DraftRoom&apos;,
        &apos;PlayerResearch&apos;,
        &apos;TradeCenter&apos;,
        &apos;Analytics&apos;
      ];
      
      for (const component of lazyComponents) {
}
        const module = await import(`../../views/${component}View`);
        expect(module).toBeDefined();
      }
    });
  });

  describe(&apos;2. Cross-System Functionality&apos;, () => {
}
    test(&apos;Authentication + Accessibility + Performance&apos;, async () => {
}
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
      const loginButton = screen.getByRole(&apos;button&apos;, { name: /sign in/i });
      expect(loginButton).toHaveAttribute(&apos;aria-label&apos;);
      expect(loginButton).toHaveAttribute(&apos;tabIndex&apos;, &apos;0&apos;);
      
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
      const meta = container.querySelector(&apos;meta[http-equiv="Content-Security-Policy"]&apos;);
      expect(meta).toBeTruthy();
    });

    test(&apos;WebSocket + Memory Management + Real-time Features&apos;, async () => {
}
      const memoryMonitor = new MemoryMonitor();
      memoryMonitor.startMonitoring();
      
      // Import WebSocket manager
      const { WebSocketManager } = await import(&apos;../../services/webSocketManager&apos;);
      const wsManager = new WebSocketManager();
      
      // Connect and monitor memory
      await wsManager.connect(&apos;ws://localhost:3001&apos;);
      
      // Simulate real-time updates
      for (let i = 0; i < 100; i++) {
}
        wsManager.emit(&apos;draft-pick&apos;, { 
}
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

    test(&apos;Performance Optimizations + Accessibility Features&apos;, async () => {
}
      const { container, rerender } = render(
        <OptimizedContextProvider>
          <App />
        </OptimizedContextProvider>
      );
      
      // Test that optimized contexts don&apos;t break accessibility
      const buttons = container.querySelectorAll(&apos;button&apos;);
      buttons.forEach((button: any) => {
}
        // All buttons should be keyboard accessible
        expect(parseInt(button.getAttribute(&apos;tabIndex&apos;) || &apos;0&apos;)).toBeGreaterThanOrEqual(0);
        
        // All buttons should have accessible labels
        const hasLabel = button.getAttribute(&apos;aria-label&apos;) || 
                        button.getAttribute(&apos;aria-labelledby&apos;) || 
                        button.textContent;
        expect(hasLabel).toBeTruthy();
      });
      
      // Test that performance optimizations don&apos;t break screen readers
      const liveRegions = container.querySelectorAll(&apos;[aria-live]&apos;);
      expect(liveRegions.length).toBeGreaterThan(0);
      
      // Test focus management isn&apos;t broken by optimizations
      const firstButton = buttons[0];
      if (firstButton) {
}
        firstButton.focus();
        expect(document.activeElement).toBe(firstButton);
      }
    });
  });

  describe(&apos;3. User Workflow End-to-End&apos;, () => {
}
    test(&apos;Complete Login Flow with All Systems&apos;, async () => {
}
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
      const submitButton = screen.getByRole(&apos;button&apos;, { name: /sign in/i });
      
      // Test form interaction
      await user.type(emailInput, &apos;test@example.com&apos;);
      await user.type(passwordInput, &apos;SecurePass123!&apos;);
      await user.click(submitButton);
      
      // Wait for authentication
      await waitFor(() => {
}
        expect(screen.queryByText(/dashboard/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Verify security headers are maintained
      const cookies = document.cookie;
      expect(cookies).toContain(&apos;HttpOnly&apos;);
      expect(cookies).toContain(&apos;Secure&apos;);
      expect(cookies).toContain(&apos;SameSite&apos;);
    });

    test(&apos;Draft Room with Performance + Memory + Accessibility&apos;, async () => {
}
      const memoryMonitor = new MemoryMonitor();
      memoryMonitor.startMonitoring();
      
      const { container } = render(
        <OptimizedContextProvider>
          <App initialRoute="/draft" />
        </OptimizedContextProvider>
      );
      
      // Wait for draft room to load
      await waitFor(() => {
}
        expect(screen.getByText(/draft room/i)).toBeInTheDocument();
      });
      
      // Test accessibility in draft interface
      const playerCards = screen.getAllByRole(&apos;article&apos;);
      expect(playerCards.length).toBeGreaterThan(0);
      
      playerCards.forEach((card: any) => {
}
        expect(card).toHaveAttribute(&apos;tabIndex&apos;);
        expect(card).toHaveAttribute(&apos;aria-label&apos;);
      });
      
      // Simulate draft activity
      for (let i = 0; i < 50; i++) {
}
        const player = playerCards[i % playerCards.length];
        fireEvent.click(player);
        
        // Check memory isn&apos;t growing excessively
        if (i % 10 === 0) {
}
          const stats = memoryMonitor.getStats();
          expect(stats.currentMemory).toBeLessThan(25 * 1024 * 1024); // 25MB limit
        }
      }
      
      // Test timer accessibility
      const timer = screen.getByRole(&apos;timer&apos;);
      expect(timer).toHaveAttribute(&apos;aria-live&apos;, &apos;polite&apos;);
      expect(timer).toHaveAttribute(&apos;aria-atomic&apos;, &apos;true&apos;);
      
      memoryMonitor.stopMonitoring();
    });

    test(&apos;Mobile Experience with All Optimizations&apos;, async () => {
}
      // Set mobile viewport
      window.innerWidth = 375;
      window.innerHeight = 667;
      window.dispatchEvent(new Event(&apos;resize&apos;));
      
      render(
        <OptimizedContextProvider>
          <App />
        </OptimizedContextProvider>
      );
      
      // Check mobile-specific components load
      await waitFor(() => {
}
        expect(screen.getByTestId(&apos;mobile-nav&apos;)).toBeInTheDocument();
      });
      
      // Test touch interactions
      const navButton = screen.getByRole(&apos;button&apos;, { name: /menu/i });
      fireEvent.touchStart(navButton);
      fireEvent.touchEnd(navButton);
      
      // Check mobile menu accessibility
      const mobileMenu = await screen.findByRole(&apos;navigation&apos;);
      expect(mobileMenu).toHaveAttribute(&apos;aria-label&apos;);
      
      // Test swipe gestures don&apos;t break with optimizations
      fireEvent.touchStart(mobileMenu, { touches: [{ clientX: 300, clientY: 100 }] });
      fireEvent.touchMove(mobileMenu, { touches: [{ clientX: 100, clientY: 100 }] });
      fireEvent.touchEnd(mobileMenu);
      
      // Verify performance on mobile
      const paintTiming = performance.getEntriesByType(&apos;paint&apos;);
      const fcp = paintTiming.find((entry: any) => entry.name === &apos;first-contentful-paint&apos;);
      expect(fcp?.startTime).toBeLessThan(2500); // 2.5s FCP on mobile
    });
  });

  describe(&apos;4. Performance vs Security vs Accessibility Balance&apos;, () => {
}
    test(&apos;Core Web Vitals with Security Headers&apos;, async () => {
}
      const { container } = render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );
      
      // Measure LCP
      const lcpObserver = new PerformanceObserver((list: any) => {
}
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        expect(lastEntry.startTime).toBeLessThan(2500); // 2.5s LCP
      });
      lcpObserver.observe({ entryTypes: [&apos;largest-contentful-paint&apos;] });
      
      // Measure FID
      let fidMeasured = false;
      const fidObserver = new PerformanceObserver((list: any) => {
}
        if (!fidMeasured) {
}
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
}
            expect(entry.processingStart - entry.startTime).toBeLessThan(100); // 100ms FID
          });
          fidMeasured = true;
        }
      });
      fidObserver.observe({ entryTypes: [&apos;first-input&apos;] });
      
      // Simulate user interaction
      const button = await screen.findByRole(&apos;button&apos;);
      fireEvent.click(button);
      
      // Measure CLS
      let cumulativeScore = 0;
      const clsObserver = new PerformanceObserver((list: any) => {
}
        for (const entry of list.getEntries()) {
}
          if (!entry.hadRecentInput) {
}
            cumulativeScore += entry.value;
          }
        }
        expect(cumulativeScore).toBeLessThan(0.1); // 0.1 CLS
      });
      clsObserver.observe({ entryTypes: [&apos;layout-shift&apos;] });
      
      // Clean up observers
      setTimeout(() => {
}
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      }, 5000);
    });

    test(&apos;Accessibility doesn\&apos;t degrade performance&apos;, async () => {
}
      const startTime = performance.now();
      
      const { container } = render(
        <OptimizedContextProvider>
          <App />
        </OptimizedContextProvider>
      );
      
      // Load time with accessibility features
      const loadTime = performance.now() - startTime;
      expect(loadTime).toBeLessThan(1500); // 1.5s initial load
      
      // Test ARIA live regions don&apos;t cause performance issues
      const liveRegion = container.querySelector(&apos;[aria-live="polite"]&apos;);
      if (liveRegion) {
}
        // Update live region 100 times rapidly
        for (let i = 0; i < 100; i++) {
}
          liveRegion.textContent = `Update ${i}`;
        }
        
        // Check no jank occurred
        const frameTime = performance.now() - startTime;
        expect(frameTime / 100).toBeLessThan(16); // 60fps target
      }
      
      // Test focus management performance
      const focusableElements = container.querySelectorAll(
        &apos;button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])&apos;
      );
      
      const focusStartTime = performance.now();
      focusableElements.forEach((el: any) => {
}
        el.focus();
      });
      const focusTime = performance.now() - focusStartTime;
      expect(focusTime).toBeLessThan(100); // Fast focus switching
    });

    test(&apos;Security measures don\&apos;t break functionality&apos;, async () => {
}
      const { container } = render(
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      );
      
      // Test that CSP doesn&apos;t block legitimate resources
      const scripts = container.querySelectorAll(&apos;script&apos;);
      scripts.forEach((script: any) => {
}
        if (script.src) {
}
          expect(script.src).toMatch(/^(https?:\/\/localhost|\/)/);
        }
      });
      
      // Test WebSocket connections work with security
      const ws = new WebSocket(&apos;ws://localhost:3001&apos;);
      await new Promise((resolve: any) => {
}
        ws.onopen = resolve;
        ws.onerror = () => resolve(false);
      });
      expect(ws.readyState).toBe(WebSocket.OPEN || WebSocket.CONNECTING);
      ws.close();
      
      // Test API calls work with security headers
      const response = await fetch(&apos;/api/players&apos;, {
}
        credentials: &apos;include&apos;,
        headers: {
}
          &apos;Content-Type&apos;: &apos;application/json&apos;
        }
      });
      expect(response.ok).toBe(true);
    });
  });

  describe(&apos;5. Integration Regression Testing&apos;, () => {
}
    test(&apos;All navigation routes still work&apos;, async () => {
}
      const { container } = render(
        <OptimizedContextProvider>
          <App />
        </OptimizedContextProvider>
      );
      
      const routes = [
        &apos;/dashboard&apos;,
        &apos;/draft&apos;,
        &apos;/players&apos;,
        &apos;/trades&apos;,
        &apos;/league&apos;,
        &apos;/settings&apos;
      ];
      
      for (const route of routes) {
}
        window.history.pushState({}, &apos;&apos;, route);
        window.dispatchEvent(new PopStateEvent(&apos;popstate&apos;));
        
        await waitFor(() => {
}
          expect(container.querySelector(&apos;#root&apos;)).toBeInTheDocument();
        }, { timeout: 2000 });
      }
    });

    test(&apos;Error boundaries work with all systems&apos;, async () => {
}
      const ThrowError = () => {
}
        throw new Error(&apos;Test error&apos;);
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
}
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
      
      // Recovery button should be accessible
      const recoveryButton = screen.getByRole(&apos;button&apos;, { name: /try again/i });
      expect(recoveryButton).toHaveAttribute(&apos;aria-label&apos;);
      expect(recoveryButton).toBeEnabled();
    });

    test(&apos;WebSocket reconnection with memory cleanup&apos;, async () => {
}
      const { WebSocketManager } = await import(&apos;../../services/webSocketManager&apos;);
      const wsManager = new WebSocketManager();
      const memoryMonitor = new MemoryMonitor();
      
      memoryMonitor.startMonitoring();
      
      // Connect and disconnect multiple times
      for (let i = 0; i < 5; i++) {
}
        await wsManager.connect(&apos;ws://localhost:3001&apos;);
        
        // Send some data
        for (let j = 0; j < 20; j++) {
}
          wsManager.emit(&apos;test-event&apos;, { data: `test-${i}-${j}` });
        }
        
        wsManager.disconnect();
        
        // Check memory is cleaned up
        const stats = memoryMonitor.getStats();
        expect(stats.currentMemory).toBeLessThan(10 * 1024 * 1024); // 10MB max
      }
      
      memoryMonitor.stopMonitoring();
    });

    test(&apos;Complex multi-component interaction&apos;, async () => {
}
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
      await user.type(emailInput, &apos;test@example.com&apos;);
      await user.type(passwordInput, &apos;password123&apos;);
      await user.click(screen.getByRole(&apos;button&apos;, { name: /sign in/i }));
      
      // Navigate to draft
      await waitFor(() => {
}
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      });
      
      const draftLink = screen.getByRole(&apos;link&apos;, { name: /draft/i });
      await user.click(draftLink);
      
      // Draft a player
      await waitFor(() => {
}
        expect(screen.getByText(/draft room/i)).toBeInTheDocument();
      });
      
      const playerCard = screen.getAllByRole(&apos;article&apos;)[0];
      await user.click(playerCard);
      
      // Check notification appears
      await waitFor(() => {
}
        expect(screen.getByRole(&apos;alert&apos;)).toBeInTheDocument();
      });
      
      // Navigate to trades
      const tradesLink = screen.getByRole(&apos;link&apos;, { name: /trades/i });
      await user.click(tradesLink);
      
      // Initiate a trade
      await waitFor(() => {
}
        expect(screen.getByText(/trade center/i)).toBeInTheDocument();
      });
      
      // All systems should still be working
      expect(document.querySelector(&apos;[aria-live]&apos;)).toBeInTheDocument(); // Accessibility
      expect(performance.memory.usedJSHeapSize).toBeLessThan(30 * 1024 * 1024); // Memory
    });
  });
});

// Performance metrics collection
export class PerformanceMetrics {
}
  private metrics: any[] = [];
  
  collect() {
}
    const navigation = performance.getEntriesByType(&apos;navigation&apos;)[0] as any;
    const paint = performance.getEntriesByType(&apos;paint&apos;);
    
    this.metrics.push({
}
      timestamp: Date.now(),
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      firstPaint: paint.find((p: any) => p.name === &apos;first-paint&apos;)?.startTime,
      firstContentfulPaint: paint.find((p: any) => p.name === &apos;first-contentful-paint&apos;)?.startTime,
      memory: performance.memory?.usedJSHeapSize
    });
  }
  
  getReport() {
}
    return {
}
      metrics: this.metrics,
      average: {
}
        domContentLoaded: this.average(&apos;domContentLoaded&apos;),
        loadComplete: this.average(&apos;loadComplete&apos;),
        firstPaint: this.average(&apos;firstPaint&apos;),
        firstContentfulPaint: this.average(&apos;firstContentfulPaint&apos;),
        memory: this.average(&apos;memory&apos;)
      }
    };
  }
  
  private average(key: string) {
}
    const values = this.metrics.map((m: any) => m[key]).filter((v: any) => v !== undefined);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}