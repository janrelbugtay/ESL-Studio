import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        setAuthError(null);
        // Update last login
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Error signing in with Google', error);
      let errorMessage = `Sign in failed: ${error.message}`;
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup blocked by the browser. Please allow popups for this site or click the Sign In button again.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, do nothing
        return;
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = `Sign in failed: Unauthorized domain.\n\nTo fix this:\n1. Go to console.firebase.google.com\n2. Open your project\n3. Go to Authentication -> Settings -> Authorized domains\n4. Add your domain (e.g. hamsterenglish.online) to the list.`;
      } else {
        errorMessage = `Sign in failed: ${error.message}\n\nNote: Google Sign-In may be blocked inside the preview iframe by your browser. Please try opening the app in a new tab (using the button in the top right), and ensure this domain is added to your Firebase Authorized Domains.`;
      }
      
      setAuthError(errorMessage);
      alert(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
