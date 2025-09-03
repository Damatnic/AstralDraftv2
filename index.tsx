// Application entry point
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent default browser handling
});

// Initialize the application with comprehensive debugging
const initializeApp = (): void => {
  console.log('🚀 INIT: Starting React application initialization');
  console.log('📊 INIT: Environment:', {
    mode: import.meta.env.MODE,
    prod: import.meta.env.PROD,
    dev: import.meta.env.DEV,
    ssr: import.meta.env.SSR
  });

  const container = document.getElementById('root');
  
  if (!container) {
    console.error('❌ INIT: Failed to find root element');
    throw new Error('Failed to find the root element');
  }

  console.log('✅ INIT: Root container found');
  
  // Clear loading screen immediately
  const loadingEl = document.getElementById('loading-fallback');
  if (loadingEl) {
    console.log('🧹 INIT: Clearing loading screen');
  }

  try {
    console.log('⚛️ INIT: Creating React root');
    const root = createRoot(container);
    
    console.log('🎯 INIT: Rendering App component');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ INIT: React render completed successfully');
    
    // Mark successful initialization
    setTimeout(() => {
      console.log('🎉 INIT: App fully initialized');
      window.performance?.mark?.('react-app-mounted');
    }, 100);
    
  } catch (error) {
    console.error('❌ INIT: Failed to render application:', error);
    
    // Advanced fallback error display with debugging
    container.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="text-align: center; padding: 2rem; max-width: 600px;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">🚨 Critical React Error</h1>
          <p style="margin-bottom: 1rem; opacity: 0.9; font-size: 1.1rem;">
            The React application failed to mount. This is a critical initialization error.
          </p>
          
          <div style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: left; font-family: monospace; font-size: 0.9rem;">
            <strong>Error Details:</strong><br>
            ${error instanceof Error ? error.message : String(error)}<br><br>
            <strong>Troubleshooting:</strong><br>
            • Check browser console for detailed errors<br>
            • Ensure all dependencies are loaded<br>
            • Verify network connection<br>
            • Try clearing browser cache
          </div>
          
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button 
              onclick="window.location.reload()" 
              style="
                padding: 0.75rem 1.5rem;
                background: rgba(16, 185, 129, 0.8);
                color: white;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 1rem;
                font-weight: bold;
                transition: all 0.2s;
              "
            >
              🔄 Hard Refresh
            </button>
            <button 
              onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();" 
              style="
                padding: 0.75rem 1.5rem;
                background: rgba(239, 68, 68, 0.8);
                color: white;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 1rem;
                font-weight: bold;
                transition: all 0.2s;
              "
            >
              🧹 Clear Cache & Reload
            </button>
            <button 
              onclick="window.open('https://github.com/Damatnic/AstralDraftv2/issues', '_blank')" 
              style="
                padding: 0.75rem 1.5rem;
                background: rgba(107, 114, 128, 0.8);
                color: white;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 1rem;
                font-weight: bold;
                transition: all 0.2s;
              "
            >
              🐛 Report Issue
            </button>
          </div>
          
          <div style="margin-top: 2rem; padding: 1rem; background: rgba(251, 146, 60, 0.2); border: 1px solid rgba(251, 146, 60, 0.4); border-radius: 8px; font-size: 0.9rem;">
            <strong>Need immediate access?</strong><br>
            This error prevents the full app from loading. Please try the troubleshooting steps above.
          </div>
        </div>
      </div>
    `;
  }
};

// Service Worker registration for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        // Service Worker registered successfully
      })
      .catch((error) => {
        console.warn('Service Worker registration failed:', error);
      });
  });
}

// Performance monitoring for production
if (import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perfData) {
      // Store performance mark for potential monitoring
      window.performance.mark('app-loaded');
    }
  });
}

// Start the application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}