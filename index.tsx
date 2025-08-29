// Critical: Import React first to prevent Children undefined error
import React from 'react';
import { createRoot } from 'react-dom/client';

// Browser polyfills
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}

// Import CSS after React is established
import './index.css';
import './styles/mobile-responsive.css';

// Import main components after React is properly initialized
import App from './App';

// Initialize with enhanced error handling
const initializeApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Could not find root element to mount to");
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = '<h1>Application Error</h1><p>Could not initialize the application. Please refresh the page.</p>';
    document.body.appendChild(errorDiv);
    return;
  }

  try {
    // Create root without StrictMode to avoid JSX runtime issues
    const root = createRoot(rootElement);
    root.render(React.createElement(App));
    
  } catch (error) {
    console.error('❌ Failed to render React app:', error);
    console.error('Error details:', {
      reactAvailable: !!React,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : 'No stack trace available'
    });
    
    rootElement.innerHTML = `
      <h1>Application Error</h1>
      <p>Failed to load the application. Error: ${error instanceof Error ? error.message : String(error)}</p>
      <p>Please refresh the page or contact support if the issue persists.</p>
      <details>
        <summary>Technical Details</summary>
        <pre>${error instanceof Error ? error.stack : 'No stack trace available'}</pre>
      </details>
    `;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}