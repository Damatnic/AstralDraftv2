// Minimal React app to test Netlify deployment
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const SimpleTestApp = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ fontSize: '72px' }}>🏈</div>
      <h1>Astral Draft - Test Build</h1>
      <div style={{ fontSize: '18px', opacity: 0.8 }}>
        React app is working correctly!
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<SimpleTestApp />);
} else {
  console.error('Root element not found');
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #ff4444; color: white;">
      <h1>Error: Root element not found</h1>
    </div>
  `;
}