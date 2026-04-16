import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

let app: admin.app.App;

try {
  // In AI Studio, we can often use the default credentials if configured,
  // or we might need to provide a service account.
  // For this environment, we'll try to initialize with default credentials first.
  if (!admin.apps.length) {
    app = admin.initializeApp({
      // The project ID should be in the config
      projectId: JSON.parse(readFileSync(join(process.cwd(), 'firebase-applet-config.json'), 'utf8')).projectId
    });
  } else {
    app = admin.app();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminMessaging = admin.messaging();
export default admin;
