import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuth();

  if (!showLoginModal) return null;

  const handleGoogleLogin = async () => {
    try {
      await login();
      setShowLoginModal(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLoginModal(false)}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-4 mb-10">
              <div className="w-16 h-16 bg-stone-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg rotate-3">
                <LogIn size={32} />
              </div>
              <h2 className="text-3xl font-serif font-bold italic text-stone-900">Welcome Back</h2>
              <p className="text-stone-500 font-light">
                Please log in to continue with your action on The Baobab Times.
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-3 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-white px-4 text-stone-400 font-bold">Internal Access Only</span>
                </div>
              </div>

              <p className="text-center text-xs text-stone-400 font-medium leading-relaxed">
                By logging in, you agree to our <a href="/terms" className="text-stone-900 underline">Terms of Service</a> and <a href="/privacy" className="text-stone-900 underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
