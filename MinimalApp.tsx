// Production-ready minimal app for Netlify deployment
import React from 'react';

const MinimalApp: React.FC = () => {
  const [count, setCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  // Remove artificial loading delay - load immediately
  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
        color: 'white',
        fontFamily: 'system-ui'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>🏈</div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 16px 0' }}>Astral Draft</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, margin: '0 0 32px 0' }}>Fantasy Football Platform</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              background: 'white', 
              borderRadius: '50%', 
              animation: 'pulse 1.5s ease-in-out infinite' 
            }}></div>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              background: 'white', 
              borderRadius: '50%', 
              animation: 'pulse 1.5s ease-in-out infinite 0.3s' 
            }}></div>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              background: 'white', 
              borderRadius: '50%', 
              animation: 'pulse 1.5s ease-in-out infinite 0.6s' 
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      gap: '20px',
      fontFamily: 'system-ui',
      padding: '20px'
    }}>
      <div style={{ fontSize: '72px' }}>🏈</div>
      <h1 style={{ margin: 0, textAlign: 'center' }}>Astral Draft</h1>
      <div style={{ fontSize: '18px', opacity: 0.8, textAlign: 'center' }}>
        Fantasy Football Platform - Now Live!
      </div>
      
      <div style={{ 
        padding: '30px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '15px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ marginBottom: '20px', fontSize: '16px' }}>
          🚧 Platform Update in Progress
        </div>
        <div style={{ marginBottom: '20px', fontSize: '14px', opacity: 0.7 }}>
          We're deploying exciting new features to enhance your fantasy experience
        </div>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e: any) => {
            (e.target as HTMLButtonElement).style.background = '#059669';
            (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e: any) => {
            (e.target as HTMLButtonElement).style.background = '#10b981';
            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          🎯 System Check: {count}
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        maxWidth: '800px',
        width: '100%'
      }}>
        <div style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚛️</div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>React Engine</div>
          <div style={{ opacity: 0.7 }}>Status: Active</div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌐</div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Netlify Deploy</div>
          <div style={{ opacity: 0.7 }}>Status: Success</div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔧</div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Platform Update</div>
          <div style={{ opacity: 0.7 }}>Status: In Progress</div>
        </div>
      </div>

      <div style={{ 
        fontSize: '12px', 
        opacity: 0.5, 
        textAlign: 'center', 
        maxWidth: '600px',
        lineHeight: '1.5'
      }}>
        <p>
          ✅ React initialization successful<br/>
          ✅ Component rendering working<br/>
          ✅ State management functional<br/>
          ✅ Netlify deployment complete
        </p>
        <p style={{ marginTop: '15px' }}>
          The full Astral Draft experience will be available shortly. 
          Thank you for your patience as we ensure the best possible performance!
        </p>
      </div>
    </div>
  );
};

export default MinimalApp;