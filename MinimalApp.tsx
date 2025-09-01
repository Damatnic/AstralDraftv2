// Minimal React app to test Netlify deployment
import React from 'react';

const MinimalApp: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      gap: '20px',
      fontFamily: 'system-ui'
    }}>
      <div style={{ fontSize: '72px' }}>🏈</div>
      <h1 style={{ margin: 0 }}>Astral Draft - Working!</h1>
      <div style={{ fontSize: '18px', opacity: 0.8 }}>
        React app is rendering correctly on Netlify
      </div>
      <div style={{ 
        padding: '20px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <div>Click counter test:</div>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '18px',
            background: '#fff',
            color: '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          Count: {count}
        </button>
      </div>
      <div style={{ fontSize: '14px', opacity: 0.6, maxWidth: '500px', textAlign: 'center' }}>
        If you can see this page and the counter works, React is functioning properly. 
        The issue may be in the main App component or its dependencies.
      </div>
    </div>
  );
};

export default MinimalApp;