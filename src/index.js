import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// PWA SERVICE WORKER REGISTRATION - CRITICAL
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('SW registered: ', registration);
        
        // Force immediate control
        registration.update();
        if (registration.active) {
          registration.active.postMessage({ type: 'SKIP_WAITING' });
        }
      })
      .catch(function(error) {
        console.log('SW registration failed: ', error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);