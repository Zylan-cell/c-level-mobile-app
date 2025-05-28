'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if the device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default install prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install button
      setIsInstallable(true);
    };

    // Handle appinstalled event
    const handleAppInstalled = () => {
      // Hide the install button after installation
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA was successfully installed');
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Function to install the PWA
  const installApp = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's choice
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA installation');
    } else {
      console.log('User declined the PWA installation');
    }
    
    // Clear the saved event
    setDeferredPrompt(null);
  };

  // If the app can't be installed, don't show anything
  if (!isInstallable && !isIOS) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Install App</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {isIOS 
            ? 'Install this app on your iPhone: tap the Share button and then "Add to Home Screen"'
            : 'Install this app on your device for quick access even when offline'}
        </p>
        {!isIOS && (
          <button 
            onClick={installApp} 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Install
          </button>
        )}
        <button 
          onClick={() => setIsInstallable(false)} 
          className="w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
