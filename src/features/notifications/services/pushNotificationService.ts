import { getToken } from 'firebase/messaging';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, getClientMessaging } from '../../../firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

export type NotificationSupportState =
  | 'unsupported'   // browser doesn't support notifications at all
  | 'needs-install' // iOS but not in standalone mode — must install PWA first
  | 'ready'         // can request permission
  | 'granted'
  | 'denied';

export const pushNotificationService = {
  getSupportState(): NotificationSupportState {
    if (typeof window === 'undefined') return 'unsupported';
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return 'unsupported';

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    // iOS requires the PWA to be installed and opened in standalone mode
    if (isIOS && !isStandalone) return 'needs-install';

    const perm = Notification.permission;
    if (perm === 'granted') return 'granted';
    if (perm === 'denied') return 'denied';
    return 'ready';
  },

  // Must be called from a direct user-gesture handler (button click).
  async requestAndSaveToken(userId: string): Promise<string | null> {
    if (!VAPID_KEY) {
      console.warn('Push notifications: VITE_FIREBASE_VAPID_KEY is not set.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    try {
      const messaging = await getClientMessaging();
      if (!messaging) return null;

      const registration = await navigator.serviceWorker.ready;
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        await setDoc(
          doc(db, 'fcm_tokens', userId),
          { token, userId, updatedAt: new Date() },
          { merge: true }
        );
      }
      return token;
    } catch (error) {
      console.error('Push notifications: failed to get FCM token:', error);
      return null;
    }
  },

  async removeToken(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'fcm_tokens', userId));
    } catch {
      // non-critical
    }
  },
};
