import { adminAuth, adminDb } from "../../firebase-admin";
import { getRoleForEmail } from "../../../lib/rbac-config";

/**
 * Syncs user data with calculated roles based on the allowlist.
 * 
 * @param uid The Firebase UID of the user
 * @param email The user's email
 * @returns The updated user document data
 */
export async function syncUserRole(uid: string, email: string) {
  const role = getRoleForEmail(email);

  console.log(`>>> Syncing role for ${email}: Determined role = ${role}`);

  // 1. Update Custom Claims in Firebase Auth (Most secure for backend/cloud functions)
  // This allows the role to be present in the user's ID token.
  try {
    await adminAuth.setCustomUserClaims(uid, { role });
  } catch (error: any) {
    // Handle the specific error where Identity Toolkit API is disabled or permissions are missing
    if (error.code === "auth/internal-error" || error.code === "permission-denied" || error.code === 7 || error.message.includes("identitytoolkit") || error.message.includes("PERMISSION_DENIED")) {
      console.warn(`>>> Identity Toolkit API is disabled for ${email}. Falling back to Firestore-based RBAC.`);
    } else {
      console.error(`>>> Unexpected Auth sync error for ${email}:`, error.message || error);
    }
  }

  // 2. Update/Create User Document in Firestore
  try {
    console.log(`>>> Attempting Firestore sync for ${uid}...`);
    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();

    const userData = {
      email: email.toLowerCase().trim(),
      role,
      updatedAt: new Date().toISOString(),
    };

    if (!userSnap.exists) {
      console.log(`>>> Creating new user document in Firestore for ${uid}`);
      await userRef.set({
        ...userData,
        uid,
        fullName: "", // Default empty, to be filled by user
        createdAt: new Date().toISOString(),
      });
    } else {
      console.log(`>>> Updating existing user document in Firestore for ${uid}`);
      await userRef.update(userData);
    }
  } catch (error: any) {
    if (error.code === 7 || error.message.includes("PERMISSION_DENIED") || error.message.includes("insufficient permissions")) {
      console.warn(`>>> WARNING: Firestore Sync Permission Denied for ${email}. Access will rely on getRoleForEmail client-side.`);
      console.warn(">>> This usually means the service account lacks 'Cloud Datastore User' or 'Firebase Admin' permissions.");
    } else {
      console.error(`>>> Firestore sync error for ${email}:`, error);
      // We don't throw here to allow the endpoint to return the role we determined anyway
    }
  }

  return { uid, email, role };
}

/**
 * Middleware to verify Firebase ID token and attach user info to request.
 */
export async function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}
