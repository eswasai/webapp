import { usePWAInstall } from './usePWAInstall';

const InstallButton = () => {
  const { canInstall, installPWA } = usePWAInstall();

  if (!canInstall) return null;

  return (
    <button 
      onClick={installPWA}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        fontSize: '16px',
        zIndex: 1000
      }}
    >
      📱 Install App
    </button>
  );
};

export default InstallButton;