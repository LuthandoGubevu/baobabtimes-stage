import { getToken } from 'firebase/messaging';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, getClientMessaging } from '../../../firebase';

// Set VITE_FIREBASE_VAPID_KEY in your .env / Netlify environment variables.
// Generate it in Firebase Console → Project Settings → Cloud Messaging → Web Push Certificates.
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

export const pushNotificationService = {
  async requestAndSaveToken(userId: string): Promise<string | null> {
    if (!VAPID_KEY) {
      console.warn('Push notifications: VITE_FIREBASE_VAPID_KEY is not set.');
      return null;
    }

    if (!('Notification' in window) || !('serviceWorker' in navigator)) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    try {
      const messaging = await getClientMessaging();
      if (!messaging) return null;

      // Use the already-registered sw.js instead of the default firebase-messaging-sw.js
      const registration = await navigator.serviceWorker.ready;
      const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });

      if (token) {
        await setDoc(doc(db, 'fcm_tokens', userId), { token, userId, updatedAt: new Date() }, { merge: true });
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
  }
};
