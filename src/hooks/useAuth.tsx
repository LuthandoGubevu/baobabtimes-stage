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
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

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
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setError(null);
      
      if (firebaseUser) {
        // Set up real-time listener for the user document
        unsubscribeDoc = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          async (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data() as AuthUser;
              
              // Repair logic: Ensure CEO role is set for the specific email
              if (firebaseUser.email === "grant@baobabbrands.com" && userData.role !== 'ceo') {
                console.log("Repairing CEO role for:", firebaseUser.email);
                await setDoc(doc(db, 'users', firebaseUser.uid), {
                  ...userData,
                  role: 'ceo'
                }, { merge: true });
                return;
              }

              // Repair logic: Ensure Admin role is set for the specific email
              if (firebaseUser.email === "keeganbaobabb@gmail.com" && userData.role !== 'admin') {
                console.log("Repairing Admin role for:", firebaseUser.email);
                await setDoc(doc(db, 'users', firebaseUser.uid), {
                  ...userData,
                  role: 'admin'
                }, { merge: true });
                return;
              }

              setUser(userData);
              setLoading(false);
            } else {
              // Handle new user creation
              initializeNewUser(firebaseUser);
            }
          },
          (err) => {
            console.error("Firestore listener error:", err);
            handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
            setLoading(false);
          }
        );
      } else {
        if (unsubscribeDoc) unsubscribeDoc();
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const initializeNewUser = async (firebaseUser: FirebaseUser) => {
    const isAdminEmail = firebaseUser.email === "keeganbaobabb@gmail.com";
    const isCeoEmail = firebaseUser.email === "grant@baobabbrands.com";
    
    const newUser: AuthUser = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email || "unknown@baobabbrands.com",
      photoURL: firebaseUser.photoURL,
      role: isAdminEmail ? 'admin' : (isCeoEmail ? 'ceo' : 'user'),
    };
    
    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        createdAt: serverTimestamp()
      });
      // setUser is handled by onSnapshot
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    // The onAuthStateChanged listener will handle the Firestore document creation
    // but we might need to ensure the displayName is available immediately
    const isAdminEmail = email === "keeganbaobabb@gmail.com";
    const isCeoEmail = email === "grant@baobabbrands.com";
    
    const newUser: AuthUser = {
      uid: userCredential.user.uid,
      displayName,
      email,
      photoURL: null,
      role: isAdminEmail ? 'admin' : (isCeoEmail ? 'ceo' : 'user'),
    };
    
    try {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...newUser,
        createdAt: serverTimestamp()
      });
      setUser(newUser);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userCredential.user.uid}`);
    }
  };

  const logout = async () => {
    await signOut(auth);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * @returns {Object}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
