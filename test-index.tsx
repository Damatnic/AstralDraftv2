// Minimal React app to test Netlify deployment
import React from &apos;react&apos;;
import { createRoot } from &apos;react-dom/client&apos;;
import &apos;./index.css&apos;;

const SimpleTestApp = () => {
}
  return (
    <div style={{ 
}
      minHeight: &apos;100vh&apos;, 
      display: &apos;flex&apos;, 
      alignItems: &apos;center&apos;, 
      justifyContent: &apos;center&apos;,
      background: &apos;linear-gradient(135deg, #667eea 0%, #764ba2 100%)&apos;,
      color: &apos;white&apos;,
      fontSize: &apos;24px&apos;,
      fontWeight: &apos;bold&apos;,
      flexDirection: &apos;column&apos;,
      gap: &apos;20px&apos;
    }}>
      <div style={{ fontSize: &apos;72px&apos; }}>🏈</div>
      <h1>Astral Draft - Test Build</h1>
      <div style={{ fontSize: &apos;18px&apos;, opacity: 0.8 }}>
        React app is working correctly!
      </div>
    </div>
  );
};

const rootElement = document.getElementById(&apos;root&apos;);
if (rootElement) {
}
  const root = createRoot(rootElement);
  root.render(<SimpleTestApp />);
} else {
}
  console.error(&apos;Root element not found&apos;);
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #ff4444; color: white;">
      <h1>Error: Root element not found</h1>
    </div>
  `;
}