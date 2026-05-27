import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

let isInitialized = false;

function initializeFirebaseAdmin() {
  if (isInitialized || admin.apps.length > 0) {
    isInitialized = true;
    return;
  }

  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    let firebaseConfig: any = {};
    
    try {
      firebaseConfig = JSON.parse(readFileSync(configPath, "utf-8"));
    } catch (readError) {
      console.warn(">>> Could not read firebase-applet-config.json, falling back to ADC.", readError);
    }

    const options: admin.AppOptions = {};
    if (firebaseConfig.projectId) {
      options.projectId = firebaseConfig.projectId;
    }
    if (firebaseConfig.storageBucket) {
      options.storageBucket = firebaseConfig.storageBucket;
    }

    admin.initializeApp(options);
    console.log(">>> Firebase Admin initialized successfully.");
    isInitialized = true;
  } catch (error) {
    console.error(">>> Failed to initialize Firebase Admin:", error);
    // If it fails, any subsequent call to adminAuth or adminDb will fail, 
    // but at least the server won't crash on startup.
  }
}

// Function to get Auth instance lazily
export const getAdminAuth = () => {
  initializeFirebaseAdmin();
  return admin.auth();
};

// Function to get Firestore instance lazily
export const getAdminDb = () => {
  initializeFirebaseAdmin();
  return admin.firestore();
};

export const getAdminMessaging = () => {
  initializeFirebaseAdmin();
  return admin.messaging();
};

// For backward compatibility while refactoring, but exported as functions to prevent crashes at module load
export const adminAuth = () => getAdminAuth();
export const adminDb = () => getAdminDb();
