import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { getClientMessaging } from '../../../firebase';
import { pushNotificationService } from '../services/pushNotificationService';

export function usePushNotifications(userId: string | null) {
  // Request permission and register FCM token when user logs in
  useEffect(() => {
    if (!userId) return;
    pushNotificationService.requestAndSaveToken(userId);
  }, [userId]);

  // Show a system notification for messages received while the app is in the foreground
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
            tag: 'baobab-foreground'
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
}
