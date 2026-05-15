import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
import { getRoleForEmail } from "../lib/rbac-config";

interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'admin' | 'ceo' | 'user';
  fullName?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
    landingPage?: string;
  };
  notifications?: {
    emailOnRecognition?: boolean;
    emailOnArticle?: boolean;
    ceoUpdates?: boolean;
    systemAlerts?: boolean;
  };
  updatedAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCEO: boolean;
  hasDashboardAccess: boolean;
  canManageArticles: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  executeProtectedAction: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Execute any pending action once the user is authenticated
  useEffect(() => {
    if (user && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [user, pendingAction]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setError(null);

      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            // ✅ READ ONLY — never write role from the client
            const userData = userSnap.data() as AuthUser;
            setUser({
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              ...userData,
            });
          } else {
            // First-time sign-in: create the user document
            await initializeNewUser(firebaseUser);
          }
        } catch (err) {
          // Log once and fail gracefully — no retries
          console.error("Failed to load user profile:", err);
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);

          // Fall back to minimal user object so the app still functions
          setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            role: "user",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  /**
   * Called once for brand-new users only.
   * Role defaults to whatever getRoleForEmail returns, but is ONLY set on creation.
   * Subsequent role changes must go through Firebase Admin SDK / Cloud Functions.
   */
  const initializeNewUser = async (firebaseUser: FirebaseUser) => {
    const defaultRole = getRoleForEmail(firebaseUser.email);
    const newUser: AuthUser = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email || "unknown@baobabbrands.com",
      photoURL: firebaseUser.photoURL,
      role: defaultRole,
    };

    try {
      await setDoc(doc(db, "users", firebaseUser.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
      });
      setUser(newUser);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
      // Still set a minimal user so the app doesn't break
      setUser(newUser);
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password);
  };

  const registerWithEmail = async (email: string, password: string, displayName: string) => {
    const isWorkEmail =
      email.endsWith("@baobabbrands.com") || email.endsWith("@kfcbaobab.com");
    if (!isWorkEmail) {
      throw new Error(
        "Only @baobabbrands.com or @kfcbaobab.com emails are allowed for registration."
      );
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.toLowerCase().trim(),
      password
    );
    await updateProfile(userCredential.user, { displayName });
    // initializeNewUser is called automatically by onAuthStateChanged
  };

  const logout = async () => {
    await signOut(auth);
  };

  const executeProtectedAction = (action: () => void) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setShowLoginModal(true);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithEmail,
    registerWithEmail,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isCEO: user?.role === "ceo",
    hasDashboardAccess: user?.role === "admin" || user?.role === "ceo",
    canManageArticles: user?.role === "admin" || user?.role === "ceo",
    showLoginModal,
    setShowLoginModal,
    executeProtectedAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
