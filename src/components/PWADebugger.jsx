import { useState, useEffect } from 'react';

const PWADebugger = () => {
  const [logs, setLogs] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const addLog = (message, type = 'info') => {
    const newLog = `${new Date().toLocaleTimeString()}: ${message}`;
    setLogs(prev => [newLog, ...prev].slice(0, 15));
    console.log(`[PWA] ${message}`);
  };

  useEffect(() => {
    const checkPWAStatus = async () => {
      addLog('🔍 Starting PWA Diagnosis...');
      
      // 1. Check Basic PWA Requirements
      addLog(`📱 User Agent: ${navigator.userAgent}`);
      addLog(`🔒 HTTPS: ${window.location.protocol === 'https:'}`);
      addLog(`🏠 Localhost: ${window.location.hostname === 'localhost'}`);
      
      // 2. Check Manifest
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        addLog('✅ Manifest link found');
        try {
          const response = await fetch(manifestLink.href);
          const manifest = await response.json();
          addLog(`📄 Manifest: ${manifest.name}`);
          addLog(`🎯 Display: ${manifest.display}`);
          addLog(`🚀 Start URL: ${manifest.start_url}`);
        } catch (e) {
          addLog('❌ Manifest failed to load: ' + e.message);
        }
      } else {
        addLog('❌ No manifest link found');
      }

      // 3. Check Service Worker
      if ('serviceWorker' in navigator) {
        addLog('✅ Service Worker API supported');
        
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            addLog('✅ Service Worker registered');
            addLog(`⚡ SW State: ${registration.active?.state}`);
            addLog(`🔗 SW Scope: ${registration.scope}`);
            
            // Check if controlling the page
            if (navigator.serviceWorker.controller) {
              addLog('✅ Service Worker controlling page');
            } else {
              addLog('❌ Service Worker NOT controlling page');
            }
          } else {
            addLog('❌ No Service Worker registration found');
            
            // Try to register
            addLog('🔄 Attempting to register Service Worker...');
            try {
              const newReg = await navigator.serviceWorker.register('/sw.js');
              addLog('✅ Service Worker registered successfully');
            } catch (swError) {
              addLog(`❌ SW Registration failed: ${swError.message}`);
            }
          }
        } catch (error) {
          addLog(`❌ SW Check error: ${error.message}`);
        }
      } else {
        addLog('❌ Service Worker NOT supported');
      }

      // 4. Check Icons
      const icons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
      addLog(`🖼️ Icons found: ${icons.length}`);

      // 5. Check Display Mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        addLog('✅ Running as installed PWA');
      } else if (navigator.standalone) {
        addLog('✅ Running as iOS PWA');
      } else {
        addLog('🌐 Running in browser - can be installed');
      }

      // 6. Check BeforeInstallPrompt
      window.addEventListener('beforeinstallprompt', (e) => {
        addLog('🎉 BEFOREINSTALLPROMPT FIRED! PWA can install!');
        addLog(`📱 Platforms: ${e.platforms}`);
        e.preventDefault();
      });

      // 7. Check Engagement (time on page)
      let seconds = 0;
      const timer = setInterval(() => {
        seconds += 5;
        addLog(`⏰ Time on page: ${seconds} seconds`);
        if (seconds >= 30) {
          addLog('✅ 30-second engagement criteria met');
          clearInterval(timer);
        }
      }, 5000);

      // 8. Manual Installation Check
      setTimeout(() => {
        checkManualInstallation();
      }, 10000);
    };

    const checkManualInstallation = () => {
      addLog('🔧 Manual installation check:');
      addLog('1. Open Chrome menu (3 dots)');
      addLog('2. Look for "Install App" or "Add to Home Screen"');
      addLog('3. If not shown, PWA criteria not met');
    };

    checkPWAStatus();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(0,0,0,0.95)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 10000,
      maxHeight: showDetails ? '300px' : '40px',
      overflow: 'auto',
      fontFamily: 'monospace',
      borderBottom: '2px solid #007bff'
    }}>
      <div 
        style={{ fontWeight: 'bold', marginBottom: '5px', cursor: 'pointer' }}
        onClick={() => setShowDetails(!showDetails)}
      >
        🔧 PWA Debugger ({logs.length}) - Tap to {showDetails ? 'minimize' : 'expand'}
      </div>
      
      {showDetails && logs.map((log, index) => (
        <div key={index} style={{ 
          borderBottom: '1px solid #333',
          padding: '2px 0',
          color: log.includes('❌') ? '#ff4444' : 
                 log.includes('✅') ? '#44ff44' : 
                 log.includes('🎉') ? '#ffff44' : 
                 log.includes('❌') ? '#ff4444' : '#cccccc',
          fontSize: '11px'
        }}>
          {log}
        </div>
      ))}
    </div>
  );
};

export default PWADebugger;