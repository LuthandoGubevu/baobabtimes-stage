import { useState, useEffect, useCallback } from 'react';
import { onMessage } from 'firebase/messaging';
import { getClientMessaging } from '../../../firebase';
import {
  pushNotificationService,
  type NotificationSupportState,
} from '../services/pushNotificationService';

export function usePushNotifications(userId: string | null) {
  const [supportState, setSupportState] = useState<NotificationSupportState>('unsupported');

  useEffect(() => {
    setSupportState(pushNotificationService.getSupportState());
  }, []);

  // Called from a button click — user gesture required by iOS
  const enableNotifications = useCallback(async () => {
    if (!userId || supportState !== 'ready') return;
    await pushNotificationService.requestAndSaveToken(userId);
    setSupportState(pushNotificationService.getSupportState());
  }, [userId, supportState]);

  // Handle FCM messages while the app is in the foreground
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    getClientMessaging().then((messaging) => {
      if (!messaging) return;
      unsubscribe = onMessage(messaging, (payload) => {
        const title = payload.notification?.title || 'The Baobab Times';
        const body = payload.notification?.body || '';
        const url = (payload.data?.url as string) || '/';

        if (Notification.permission === 'granted') {
          const notif = new Notification(title, {
            body,
            icon: '/icons/android-chrome-192x192.png',
            tag: 'baobab-foreground',
          });
          notif.onclick = () => {
            window.focus();
            window.location.pathname = url;
          };
        }
      });
    });

    return () => unsubscribe?.();
  }, []);

  return { supportState, enableNotifications };
}
