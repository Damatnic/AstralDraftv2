// Minimal debug version to test React mounting
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Simplified debug app
const DebugApp = () => {
  console.log('DebugApp rendering...');
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1e1e2e',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🎯 Debug App Loaded Successfully!</h1>
        <p>React is working properly</p>
        <p>Timestamp: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

// Initialize debug app
console.log('🔍 Starting debug initialization...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found');
  document.body.innerHTML = '<h1 style="color: red;">Root element missing!</h1>';
} else {
  console.log('✅ Root element found');
  try {
    const root = createRoot(rootElement);
    root.render(<DebugApp />);
    console.log('✅ Debug app rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render debug app:', error);
    rootElement.innerHTML = `
      <div style="color: red; padding: 20px;">
        <h1>Render Error</h1>
        <pre>${error}</pre>
      </div>
    `;
  }
}