// Critical: Import React first to prevent Children undefined error
import React from 'react';
import { createRoot } from 'react-dom/client';

// Browser polyfills for older browsers
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}

// Polyfill for requestIdleCallback
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function(cb: IdleRequestCallback) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1) as unknown as number;
  };
}

// Import CSS after React is established
import './index.css';
import './styles/mobile-responsive.css';

// Import error boundary first
import { ErrorBoundary } from './components/ui/ErrorBoundary';
// Import main components after React is properly initialized
import App from './App';

// Enhanced error reporting function
const reportInitializationError = (error: unknown, phase: string) => {
  const errorDetails = {
    phase,
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : String(error),
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    reactVersion: React.version,
    nodeEnv: import.meta.env.MODE || 'development'
  };

  console.error(`App initialization failed in ${phase}:`, errorDetails);
  
  // Send to production logging if available
  if (import.meta.env.PROD && window.loggingService) {
    try {
      window.loggingService.error('App initialization failed', errorDetails, 'app-init');
    } catch (loggingError) {
      console.error('Failed to log initialization error:', loggingError);
    }
  }

  return errorDetails;
};

// Graceful fallback UI
const createFallbackUI = (error: any, phase: string) => {
  const isReactError = error instanceof Error && (
    error.message.includes('React') ||
    error.message.includes('createElement') ||
    error.message.includes('render')
  );

  return `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
      <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 40px; max-width: 500px; text-align: center; color: white;">
        <div style="font-size: 48px; margin-bottom: 20px;">${isReactError ? '⚛️' : '🚨'}</div>
        <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">
          ${isReactError ? 'React Initialization Error' : 'Application Error'}
        </h1>
        <p style="margin: 0 0 24px 0; color: #ccc; line-height: 1.5;">
          ${isReactError 
            ? 'There was a problem initializing the React application. This may be due to a JavaScript runtime issue.' 
            : 'We encountered an unexpected error while starting the application.'}
        </p>
        <div style="background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 24px; font-family: 'Courier New', monospace; font-size: 12px; text-align: left; color: #ff6b6b; overflow-wrap: break-word;">
          Phase: ${phase}<br>
          Error: ${error instanceof Error ? error.message : String(error)}
        </div>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button onclick="window.location.reload()" style="background: #4f46e5; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;">
            Refresh Page
          </button>
          <button onclick="window.history.go(-1)" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;">
            Go Back
          </button>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #888;">
          If this problem persists, please contact support or try using a different browser.
        </p>
      </div>
    </div>
  `;
};

// Initialize with enhanced error handling and retry logic
const initializeApp = async () => {
  let retryCount = 0;
  const maxRetries = 3;

  const attemptInitialization = async () => {
    try {
      // Verify DOM is ready
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        throw new Error('Root element not found in DOM');
      }

      // Verify React is properly loaded
      if (!React || !React.createElement || !createRoot) {
        throw new Error('React modules not properly loaded');
      }

      // Create root with proper error handling
      const root = createRoot(rootElement, {
        onRecoverableError: (error) => {
          console.warn('Recoverable error in React root:', error);
          if (import.meta.env.PROD && window.loggingService) {
            window.loggingService.warn('React recoverable error', { error: error.message }, 'react-recoverable');
          }
        }
      });

      // Render app with error boundary in StrictMode for better error detection
      root.render(
        React.createElement(React.StrictMode, null,
          React.createElement(ErrorBoundary, {
            onError: (error, errorInfo) => {
              reportInitializationError(error, 'React Error Boundary');
            }
          },
            React.createElement(App)
          )
        )
      );

      // Mark initialization as successful
      if (import.meta.env.DEV) {
        console.log('✅ App initialized successfully');
      }

    } catch (error) {
      retryCount++;
      const errorDetails = reportInitializationError(error, 'React Initialization');

      if (retryCount < maxRetries) {
        console.warn(`Initialization attempt ${retryCount} failed, retrying in ${retryCount * 1000}ms...`);
        
        // Exponential backoff retry
        setTimeout(() => attemptInitialization(), retryCount * 1000);
        return;
      }

      // Max retries reached, show fallback UI
      console.error('Max initialization retries reached, showing fallback UI');
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = createFallbackUI(error, 'React Initialization');
      } else {
        // Last resort - create fallback in body
        document.body.innerHTML = createFallbackUI(error, 'DOM Setup');
      }
    }
  };

  await attemptInitialization();
};

// Enhanced DOM ready detection with timeout
const initialize = () => {
  // Set a maximum wait time for DOM to be ready
  const initTimeout = setTimeout(() => {
    console.error('DOM initialization timeout');
    const error = new Error('DOM failed to become ready within timeout period');
    document.body.innerHTML = createFallbackUI(error, 'DOM Ready Timeout');
  }, 10000);

  const onReady = () => {
    clearTimeout(initTimeout);
    initializeApp().catch(error => {
      console.error('Failed to initialize app:', error);
      document.body.innerHTML = createFallbackUI(error, 'App Initialization');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    // DOM is already ready
    onReady();
  }
};

// Global error handler for unhandled initialization errors
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('index.tsx')) {
    console.error('Global error in index.tsx:', event.error);
    reportInitializationError(event.error, 'Global Error Handler');
  }
});

// Start initialization
initialize();