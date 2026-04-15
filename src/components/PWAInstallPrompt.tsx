import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share, PlusSquare, Smartphone } from 'lucide-react';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

  useEffect(() => {
    // Detect platform
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    if (isIOS && !isStandalone) {
      setPlatform('ios');
      // Show iOS prompt after a short delay
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setPlatform('android');
      // Show prompt after a short delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the native prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-6 left-4 right-4 z-[100] md:left-auto md:right-8 md:w-96"
      >
        <div className="bg-zinc-900 text-white p-5 rounded-3xl shadow-2xl border border-zinc-800 relative overflow-hidden">
          {/* Background Accent */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          
          <button 
            onClick={() => setShowPrompt(false)}
            className="absolute top-3 right-3 p-1.5 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 border border-zinc-700">
              <Smartphone className="text-blue-400" size={24} />
            </div>
            
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-sm mb-1">Install Baobab Times</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {platform === 'ios' 
                  ? "Add to your home screen for the best experience and offline access."
                  : "Install our app for faster access and a better mobile experience."}
              </p>
            </div>
          </div>

          <div className="mt-5">
            {platform === 'android' ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 bg-white text-zinc-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2"
              >
                <Download size={16} />
                <span>Install Now</span>
              </button>
            ) : (
              <div className="space-y-3 bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50">
                <div className="flex items-center space-x-3 text-xs text-zinc-300">
                  <div className="w-6 h-6 rounded-lg bg-zinc-700 flex items-center justify-center">
                    <Share size={14} />
                  </div>
                  <span>1. Tap the Share button in Safari</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-zinc-300">
                  <div className="w-6 h-6 rounded-lg bg-zinc-700 flex items-center justify-center">
                    <PlusSquare size={14} />
                  </div>
                  <span>2. Select "Add to Home Screen"</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
