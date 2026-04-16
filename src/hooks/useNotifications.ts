import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    if (!messaging || !user) return;

    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      if (payload.notification) {
        toast(payload.notification.title, {
          description: payload.notification.body,
          action: payload.data?.url ? {
            label: 'View',
            onClick: () => window.open(payload.data?.url, '_blank')
          } : undefined
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const requestPermission = async () => {
    if (!messaging) return false;

    try {
      const status = await Notification.requestPermission();
      setPermission(status);

      if (status === 'granted') {
        const fcmToken = await getToken(messaging, {
          vapidKey: (import.meta as any).env.VITE_FIREBASE_VAPID_KEY
        });

        if (fcmToken) {
          setToken(fcmToken);
          // Save token to user profile
          if (user) {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
              fcmTokens: arrayUnion(fcmToken)
            });
          }
          return true;
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
    return false;
  };

  return {
    permission,
    token,
    requestPermission,
    isSupported: !!messaging
  };
};
