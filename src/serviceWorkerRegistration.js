// src/serviceWorkerRegistration.js
let deferredPrompt;
let isAppInstalled = false;

export const initializePWA = () => {
  registerServiceWorker();
  setupInstallPrompt();
  checkInstallStatus();
};

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('SW registered: ', registration);

      // Check for updates immediately
      registration.update();

      // Force the waiting service worker to become active
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // Listen for claiming control
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content available; please refresh.');
            }
          });
        }
      });

      // Reload when controller changes
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

    } catch (error) {
      console.error('SW registration failed: ', error);
    }
  }
};

const setupInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('✅ PWA meets installation criteria!');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    showInstallPromotion();
    
    // You can also auto-show the prompt after user engagement
    setTimeout(() => {
      if (deferredPrompt && !isAppInstalled) {
        showInstallPrompt();
      }
    }, 30000); // Show after 30 seconds of engagement
  });

  window.addEventListener('appinstalled', (evt) => {
    console.log('PWA was installed successfully!');
    isAppInstalled = true;
    deferredPrompt = null;
    hideInstallPromotion();
  });
};

const checkInstallStatus = () => {
  // Check if app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App running in standalone mode');
    isAppInstalled = true;
  }
  
  // For iOS
  if (navigator.standalone) {
    console.log('App running in standalone mode (iOS)');
    isAppInstalled = true;
  }
};

export const showInstallPrompt = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
      deferredPrompt = null;
    }
  }
};

export const canInstallPWA = () => {
  return !!deferredPrompt;
};

const showInstallPromotion = () => {
  // Remove existing install button if any
  hideInstallPromotion();
  
  const installBtn = document.createElement('button');
  installBtn.id = 'pwa-install-btn';
  installBtn.textContent = 'Install App';
  installBtn.style.position = 'fixed';
  installBtn.style.bottom = '20px';
  installBtn.style.right = '20px';
  installBtn.style.zIndex = '1000';
  installBtn.style.padding = '12px 20px';
  installBtn.style.backgroundColor = '#007bff';
  installBtn.style.color = 'white';
  installBtn.style.border = 'none';
  installBtn.style.borderRadius = '5px';
  installBtn.style.cursor = 'pointer';
  installBtn.style.fontSize = '16px';
  installBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  
  installBtn.onclick = showInstallPrompt;
  
  document.body.appendChild(installBtn);
};

const hideInstallPromotion = () => {
  const existingBtn = document.getElementById('pwa-install-btn');
  if (existingBtn) {
    existingBtn.remove();
  }
};