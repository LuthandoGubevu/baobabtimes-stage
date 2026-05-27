import React, { useState } from 'react';
import { Bell, BellOff, X, Smartphone } from 'lucide-react';
import { type NotificationSupportState } from '../services/pushNotificationService';

interface Props {
  supportState: NotificationSupportState;
  onEnable: () => Promise<void>;
}

export function NotificationPermissionBanner({ supportState, onEnable }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only show when there's an actionable state and user hasn't dismissed
  if (dismissed || supportState === 'unsupported' || supportState === 'granted' || supportState === 'denied') {
    return null;
  }

  const handleEnable = async () => {
    setLoading(true);
    await onEnable();
    setLoading(false);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-6 md:w-80">
      <div className="bg-stone-900 text-white rounded-2xl shadow-2xl border border-stone-700 p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          {supportState === 'needs-install' ? (
            <Smartphone size={16} className="text-stone-300" />
          ) : (
            <Bell size={16} className="text-stone-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {supportState === 'needs-install' ? (
            <>
              <p className="text-xs font-bold text-white mb-0.5">Install the app first</p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Add to your home screen via Safari's Share button to enable push notifications.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-white mb-0.5">Stay in the loop</p>
              <p className="text-[11px] text-stone-400 leading-relaxed mb-2">
                Get notified when recognitions, articles, and CEO updates are posted.
              </p>
              <button
                onClick={handleEnable}
                disabled={loading}
                className="text-[11px] font-bold bg-white text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors disabled:opacity-50"
              >
                {loading ? 'Enabling…' : 'Enable Notifications'}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-stone-500 hover:text-white transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
