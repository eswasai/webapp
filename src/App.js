// src/App.js
import { useEffect, useState } from 'react';
import { initializePWA, canInstallPWA, showInstallPrompt } from './serviceWorkerRegistration';
import PWADebugger from './components/PWADebugger';

function App() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    initializePWA();
    
    // Check installation status periodically
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
      setIsInstalled(isStandalone);
      setCanInstall(canInstallPWA());
    };

    checkInstallation();
    
    // Check every 2 seconds for the first 10 seconds
    const interval = setInterval(checkInstallation, 2000);
    setTimeout(() => clearInterval(interval), 10000);

    // Set up periodic checks
    const longInterval = setInterval(checkInstallation, 30000);

    return () => {
      clearInterval(longInterval);
    };
  }, []);

  const handleManualInstall = () => {
    showInstallPrompt();
  };

  return (
    <div className="App">
      <PWADebugger />
      
      <h1>My PWA App</h1>
      <p>This should install as a proper app, not a shortcut!</p>
      
      {/* Engagement content */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Welcome to Our App!</h2>
        <p>Stay on this page to meet PWA engagement criteria.</p>
        <p>For Android installation, make sure you:</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>Stay on the site for at least 30 seconds</li>
          <li>Interact with the page (scroll, click, etc.)</li>
          <li>Have a stable internet connection</li>
        </ul>
        
        {canInstall && !isInstalled && (
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={handleManualInstall}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              📱 Install App
            </button>
          </div>
        )}
        
        {isInstalled && (
          <div style={{ marginTop: '20px', color: 'green' }}>
            ✅ App is running in standalone mode!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;