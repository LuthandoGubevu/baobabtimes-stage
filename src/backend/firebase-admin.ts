import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

/**
 * Initializes Firebase Admin SDK.
 * 
 * In production (Cloud Run), this defaults to Application Default Credentials.
 * In development, we can use the project ID from the config.
 */

if (!admin.apps.length) {
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    const firebaseConfig = JSON.parse(readFileSync(configPath, "utf-8"));

    admin.initializeApp({
      projectId: firebaseConfig.projectId,
      // For local development with a service account, you would add credential: admin.credential.cert(...)
      // But in this environment, ADC or the project ID is usually sufficient for emulated/managed access.
    });
    
    console.log(">>> Firebase Admin initialized for project:", firebaseConfig.projectId);
  } catch (error) {
    console.error(">>> Failed to initialize Firebase Admin:", error);
    // Fallback for basic initialization
    admin.initializeApp();
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
