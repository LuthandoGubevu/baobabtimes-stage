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
  await adminAuth.setCustomUserClaims(uid, { role });

  // 2. Update/Create User Document in Firestore
  const userRef = adminDb.collection("users").doc(uid);
  const userSnap = await userRef.get();

  const userData = {
    email: email.toLowerCase().trim(),
    role,
    updatedAt: new Date().toISOString(),
  };

  if (!userSnap.exists) {
    // If user doesn't exist in Firestore yet (first sign-up)
    await userRef.set({
      ...userData,
      uid,
      fullName: "", // Default empty, to be filled by user
      createdAt: new Date().toISOString(),
    });
  } else {
    // Update existing user document
    await userRef.update(userData);
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
