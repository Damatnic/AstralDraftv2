// Clean minimal entry point to identify loading issues
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Import main components
import App from './App';
import MinimalApp from './MinimalApp';

// Simple error handling
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  return false;
};

window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
});

const initializeApp = () => {
  console.log('🚀 Starting clean app initialization...');
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('❌ Root element not found');
    return;
  }

  console.log('✅ Root element found');
  
  try {
    const root = createRoot(rootElement);
    
    // Use minimal app first to test basic functionality
    const useMinimalApp = true;
    
    if (useMinimalApp) {
      console.log('🎯 Loading MinimalApp...');
      root.render(<MinimalApp />);
      console.log('✅ MinimalApp rendered successfully');
    } else {
      console.log('🎯 Loading full App...');
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log('✅ Full App rendered successfully');
    }
    
  } catch (error) {
    console.error('❌ Failed to render app:', error);
    
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #dc2626; color: white; font-family: system-ui;">
        <div style="text-align: center; padding: 20px;">
          <h1>🚨 Application Error</h1>
          <p>Failed to start the application</p>
          <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; margin: 20px 0; font-size: 12px;">${error}</pre>
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