import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  getDocFromServer, 
  doc 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Firestore with long polling to bypass potential WebSocket issues in restricted environments
const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
  ? firebaseConfig.firestoreDatabaseId 
  : undefined;

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, databaseId);

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Returns a Firebase Messaging instance only if the browser supports it (requires service workers).
export async function getClientMessaging() {
  if (typeof window === 'undefined') return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
}

// Connection test to help diagnose "client is offline" errors
if (typeof window !== 'undefined') {
  const testConnection = async () => {
    try {
      // Attempt to fetch a non-existent document from a test collection
      await getDocFromServer(doc(db, '_connection_test_', 'ping'));
      console.log("Firestore connection successful.");
    } catch (error: any) {
      if (error.message && error.message.includes('the client is offline')) {
        console.error("Firestore Error: The client is offline. This usually indicates an incorrect Firebase configuration (Project ID, API Key) or that the Firestore database has not been enabled in the Firebase Console.");
      } else {
        // Other errors (like permission denied) are expected if rules are tight, 
        // but they still prove the client is "online".
        console.log("Firestore reachability confirmed.");
      }
    }
  };
  testConnection();
}
