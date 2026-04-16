import { adminMessaging, adminDb } from '../lib/firebase-admin';

export const notificationService = {
  /**
   * Send a push notification to a specific user
   */
  sendToUser: async (userId: string, title: string, body: string, url?: string) => {
    try {
      // Get user's FCM tokens from Firestore
      const userDoc = await adminDb.collection('users').doc(userId).get();
      if (!userDoc.exists) return;

      const userData = userDoc.data();
      const tokens: string[] = userData?.fcmTokens || [];

      if (tokens.length === 0) return;

      const message = {
        notification: {
          title,
          body,
        },
        data: {
          url: url || '/',
        },
        tokens: tokens,
      };

      const response = await adminMessaging.sendEachForMulticast(message);
      console.log(`Successfully sent ${response.successCount} messages to user ${userId}`);
      
      // Handle invalid tokens
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
          }
        });
        
        if (failedTokens.length > 0) {
          await adminDb.collection('users').doc(userId).update({
            fcmTokens: tokens.filter(t => !failedTokens.includes(t))
          });
        }
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  /**
   * Send a push notification to all users (broadcast)
   */
  broadcast: async (title: string, body: string, url?: string) => {
    try {
      // This is a simplified broadcast. In a real app, you'd use topics.
      // For now, we'll fetch all users with tokens.
      const usersWithTokens = await adminDb.collection('users')
        .where('fcmTokens', '!=', [])
        .get();

      const allTokens: string[] = [];
      usersWithTokens.forEach(doc => {
        const tokens = doc.data().fcmTokens || [];
        allTokens.push(...tokens);
      });

      if (allTokens.length === 0) return;

      // Send in batches of 500 (FCM limit)
      for (let i = 0; i < allTokens.length; i += 500) {
        const batch = allTokens.slice(i, i + 500);
        const message = {
          notification: { title, body },
          data: { url: url || '/' },
          tokens: batch,
        };
        await adminMessaging.sendEachForMulticast(message);
      }
      
      console.log(`Broadcasted message to ${allTokens.length} tokens`);
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  }
};
