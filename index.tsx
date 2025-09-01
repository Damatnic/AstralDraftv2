// Simple error logging for production debugging
if (typeof window !== 'undefined') {
  window.onerror = function(message, source, lineno, colno, error) {
    console.log('App error:', { message, source, lineno, colno, error });
    return false; // Allow default error handling
  };
  
  window.addEventListener('unhandledrejection', function(event) {
    console.log('Unhandled promise rejection:', event.reason);
  });
}

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

// Import CSS after React is established (commented out for testing)
// import './index.css';
// import './styles/mobile-responsive.css';

// Import error boundary first
import { ErrorBoundary } from './components/ui/ErrorBoundary';
// Import main components after React is properly initialized
import App from './App';
import MinimalApp from './MinimalApp';

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

// Simple app initialization
const initializeApp = () => {
  console.log('🚀 Starting app initialization...');
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }

  console.log('✅ Root element found');
  
  try {
    const root = createRoot(rootElement);
    
    // For debugging: Use minimal app first to test React rendering
    const useMinimalApp = true; // Change to false to use full app
    
    if (useMinimalApp) {
      root.render(React.createElement(MinimalApp));
      console.log('✅ Minimal app rendered successfully');
    } else {
      root.render(
        React.createElement(React.StrictMode, null,
          React.createElement(ErrorBoundary, {
            onError: (error, errorInfo) => {
              console.error('Error Boundary triggered:', error, errorInfo);
            }
          },
            React.createElement(App)
          )
        )
      );
      console.log('✅ Full app rendered successfully');
    }
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #dc2626; color: white; font-family: system-ui;">
        <div style="text-align: center; padding: 20px;">
          <h1>Application Error</h1>
          <p>Failed to start the application</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: white; color: #dc2626; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
        </div>
      </div>
    `;
  }
};

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}