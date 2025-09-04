import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { SimpleAuthProvider } from './contexts/SimpleAuthContext';
import './styles/design-system.css';

// Performance monitoring
const startTime = performance.now();

// Initialize React application
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found - ensure index.html contains <div id="root"></div>');
}

const root = createRoot(container);

// Log startup performance
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log(`🚀 Astral Draft loaded in ${loadTime.toFixed(2)}ms`);
});

// Enhanced error boundary for production
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Astral Draft Error:', error, errorInfo);
    
    // In production, you might want to report this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: reportError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-white mb-4">⚠️ Something went wrong</h1>
            <p className="text-gray-300 mb-6">
              The application encountered an unexpected error. Please refresh the page or contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <SimpleAuthProvider>
            <App />
          </SimpleAuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

// Service Worker registration for PWA features
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('🔧 Service Worker registered:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🆕 New version available - refresh to update');
              // You could show a toast notification here
            }
          });
        }
      });
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  });
}

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Log component tree in development
  console.log('🏗️ Astral Draft Development Mode');
  console.log('📱 Available routes will be logged by Router');
  
  // Performance monitoring in dev
  if ('performance' in window && 'measure' in performance) {
    performance.mark('astral-draft-start');
    
    window.addEventListener('load', () => {
      performance.mark('astral-draft-loaded');
      performance.measure('astral-draft-startup', 'astral-draft-start', 'astral-draft-loaded');
      
      const measures = performance.getEntriesByType('measure');
      measures.forEach(measure => {
        console.log(`📊 ${measure.name}: ${measure.duration.toFixed(2)}ms`);
      });
    });
  }
}