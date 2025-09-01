// Enhanced error logging with tracking service integration
if (typeof window !== &apos;undefined&apos;) {
}
  window.onerror = function(message, source, lineno, colno, error) {
}
    console.log(&apos;App error:&apos;, { message, source, lineno, colno, error });
    
    // Capture error with tracking service if available
    if (window.errorTrackingService) {
}
      try {
}
        window.errorTrackingService.captureError(
          error || new Error(String(message)),
          {
}
            component: &apos;global-error-handler&apos;,
            severity: &apos;high&apos;,
            context: { source, lineno, colno }
          }
        );
      } catch (e) {
}
        console.warn(&apos;Error tracking service failed:&apos;, e);
      }
    }
    
    return false; // Allow default error handling
  };
  
  window.addEventListener(&apos;unhandledrejection&apos;, function(event) {
}
    console.log(&apos;Unhandled promise rejection:&apos;, event.reason);
    
    // Capture promise rejection with tracking service if available
    if (window.errorTrackingService) {
}
      try {
}
        window.errorTrackingService.captureError(
          new Error(`Unhandled promise rejection: ${event.reason}`),
          {
}
            component: &apos;promise-rejection-handler&apos;,
            severity: &apos;high&apos;,
            context: { reason: event.reason }
          }
        );
      } catch (e) {
}
        console.warn(&apos;Error tracking service failed:&apos;, e);
      }
    }
  });
}

// Critical: Import React first to prevent Children undefined error
import { createRoot } from &apos;react-dom/client&apos;;

// Initialize services early
import { errorTrackingService } from &apos;./src/services/errorTrackingService&apos;;
import { performanceService } from &apos;./src/services/performanceService&apos;;
import { securityService } from &apos;./src/services/securityService&apos;;

// Make services available globally
if (typeof window !== &apos;undefined&apos;) {
}
  window.errorTrackingService = errorTrackingService;
  window.performanceService = performanceService;
  window.securityService = securityService;
  
  // Track page view for analytics
  performanceService.recordMetric(&apos;page_view_start&apos;, performance.now());
  
  // Security initialization complete
  console.log(&apos;🔒 Security service initialized&apos;);
}

// Browser polyfills for older browsers
if (typeof globalThis === &apos;undefined&apos;) {
}
  (window as typeof globalThis).globalThis = window;
}

// Polyfill for requestIdleCallback
if (!window.requestIdleCallback) {
}
  window.requestIdleCallback = function(cb: IdleRequestCallback) {
}
    const start = Date.now();
    return setTimeout(() => {
}
      cb({
}
        didTimeout: false,
        timeRemaining() {
}
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1) as unknown as number;
  };
}

// Import CSS after React is established
import &apos;./index.css&apos;;
import &apos;./styles/mobile-responsive.css&apos;;

// Import error boundary first
import { ErrorBoundary } from &apos;./components/ui/ErrorBoundary&apos;;
import DeploymentErrorBoundary from &apos;./src/components/deployment/DeploymentErrorBoundary&apos;;
// Import main components after React is properly initialized
import App from &apos;./App&apos;;
import MinimalApp from &apos;./MinimalApp&apos;;

// Enhanced error reporting function
const reportInitializationError = (error: unknown, phase: string) => {
}
  const errorDetails = {
}
    phase,
    error: error instanceof Error ? {
}
      message: error.message,
      stack: error.stack,
      name: error.name
    } : String(error),
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    reactVersion: React.version,
    nodeEnv: import.meta.env.MODE || &apos;development&apos;
  };

  console.error(`App initialization failed in ${phase}:`, errorDetails);
  
  // Use error tracking service for comprehensive error reporting
  try {
}
    errorTrackingService.captureError(
      error instanceof Error ? error : new Error(String(error)),
      {
}
        component: &apos;app-initialization&apos;,
        severity: &apos;critical&apos;,
        context: errorDetails
      }
    );
  } catch (trackingError) {
}
    console.error(&apos;Failed to track initialization error:&apos;, trackingError);
  }

  return errorDetails;
};

// Graceful fallback UI
const createFallbackUI = (error: unknown, phase: string) => {
}
  const isReactError = error instanceof Error && (
    error.message.includes(&apos;React&apos;) ||
    error.message.includes(&apos;createElement&apos;) ||
    error.message.includes(&apos;render&apos;)
  );

  return `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%); font-family: -apple-system, BlinkMacSystemFont, &apos;Segoe UI&apos;, Roboto, sans-serif; padding: 20px;">
      <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 40px; max-width: 500px; text-align: center; color: white;">
        <div style="font-size: 48px; margin-bottom: 20px;">${isReactError ? &apos;⚛️&apos; : &apos;🚨&apos;}</div>
        <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">
          ${isReactError ? &apos;React Initialization Error&apos; : &apos;Application Error&apos;}
        </h1>
        <p style="margin: 0 0 24px 0; color: #ccc; line-height: 1.5;">
          ${isReactError 
}
            ? &apos;There was a problem initializing the React application. This may be due to a JavaScript runtime issue.&apos; 
            : &apos;We encountered an unexpected error while starting the application.&apos;}
        </p>
        <div style="background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 24px; font-family: &apos;Courier New&apos;, monospace; font-size: 12px; text-align: left; color: #ff6b6b; overflow-wrap: break-word;">
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

// Enhanced app initialization with performance tracking
const initializeApp = () => {
}
  const initStartTime = performance.now();
  console.log(&apos;🚀 Starting app initialization...&apos;);
  
  // Track initialization start
  performanceService.recordMetric(&apos;app_init_start&apos;, initStartTime);
  
  const rootElement = document.getElementById(&apos;root&apos;);
  if (!rootElement) {
}
    console.error(&apos;Root element not found!&apos;);
    performanceService.recordMetric(&apos;app_init_error&apos;, 1, { error: &apos;root_element_not_found&apos; });
    return;
  }

  console.log(&apos;✅ Root element found&apos;);
  
  try {
}
    const root = createRoot(rootElement);
    
    // For debugging: Use minimal app first to test React rendering
    const useMinimalApp = false; // Change to false to use full app - FIXED: Now using full app
    
    if (useMinimalApp) {
}
      root.render(React.createElement(MinimalApp));
      console.log(&apos;✅ Minimal app rendered successfully&apos;);
    } else {
}
      root.render(
        React.createElement(React.StrictMode, null,
          React.createElement(DeploymentErrorBoundary, null,
            React.createElement(ErrorBoundary, {
}
              onError: (error, errorInfo) => {
}
                console.error(&apos;Error Boundary triggered:&apos;, error, errorInfo);
                performanceService.recordMetric(&apos;error_boundary_triggered&apos;, 1, {
}
                  error: error.message,
//                   errorInfo
                });
              }
            },
              React.createElement(App)
            )
          )
        )
      );
      console.log(&apos;✅ Full app rendered successfully&apos;);
    }
    
    // Track successful initialization
    const initDuration = performance.now() - initStartTime;
    performanceService.measureComponentRender(&apos;app_initialization&apos;, initStartTime);
    console.log(`✅ App initialized in ${initDuration.toFixed(2)}ms`);
    
  } catch (error) {
}
    console.error(&apos;Failed to render app:&apos;, error);
    
    // Track initialization failure
    performanceService.recordMetric(&apos;app_init_error&apos;, 1, {
}
      error: error instanceof Error ? error.message : String(error)
    });
    
    reportInitializationError(error, &apos;react-render&apos;);
    
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
if (document.readyState === &apos;loading&apos;) {
}
  document.addEventListener(&apos;DOMContentLoaded&apos;, initializeApp);
} else {
}
  initializeApp();
}