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

interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'admin' | 'editor' | 'employee';
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
  isEditor: boolean;
  isCEO: boolean;
  isContributor: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setError(null);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            setUser(userDoc.data() as AuthUser);
          } else {
            // Create new user profile
            const isAdminEmail = firebaseUser.email === "keeganbaobabb@gmail.com";
            const isEditorEmail = firebaseUser.email === "luthando@baobabbrands.com" || firebaseUser.email === "luthando@baobabbrands";
            
            const newUser: AuthUser = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email || "unknown@baobabbrands.com",
              photoURL: firebaseUser.photoURL,
              role: isAdminEmail ? 'admin' : (isEditorEmail ? 'editor' : 'employee'),
            };
            
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...newUser,
                createdAt: serverTimestamp()
              });
              setUser(newUser);
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
            }
          }
        } catch (err: any) {
          console.error("Auth initialization error:", err);
          // If it's a JSON string from handleFirestoreError, try to parse it or just show the message
          let msg = err.message;
          try {
            const parsed = JSON.parse(err.message);
            msg = parsed.error || msg;
          } catch (e) {}
          setError(msg || "Failed to load user profile");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    const isEditorEmail = email === "luthando@baobabbrands.com" || email === "luthando@baobabbrands";
    
    const newUser: AuthUser = {
      uid: userCredential.user.uid,
      displayName,
      email,
      photoURL: null,
      role: isAdminEmail ? 'admin' : (isEditorEmail ? 'editor' : 'employee'),
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
    isEditor: user?.role === "editor" || user?.role === "admin",
    isCEO: user?.role === "admin", // CEO uses admin role for now
    isContributor: user?.role === "editor" || user?.role === "admin",
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
