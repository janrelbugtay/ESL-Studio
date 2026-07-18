import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
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
    // Check for redirect result on mount
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect sign-in error", error);
      setAuthError(`Sign in failed: ${error.message}`);
    });

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
      
      // If popup is blocked or we have cross-origin issues, fallback to redirect
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/unauthorized-domain' || error.message.includes('cross-origin')) {
        console.log('Popup failed, falling back to redirect...');
        try {
          // This will redirect the user away from the page
          // Note: In an iframe (like AI Studio preview), this might still be blocked,
          // but for users on the custom domain (hamsterenglish.online) it will work perfectly.
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError: any) {
          console.error('Redirect sign in also failed', redirectError);
        }
      }

      let errorMessage = `Sign in failed: ${error.message}`;
      
      if (error.code === 'auth/popup-closed-by-user') {
        return; // User closed the popup, do nothing
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = `Sign in failed: Unauthorized domain.\n\nTo fix this:\n1. Go to console.firebase.google.com\n2. Open your project\n3. Go to Authentication -> Settings -> Authorized domains\n4. Add your domain to the list.\n\nNote: Changes may take a few minutes to propagate.`;
      } else {
        errorMessage = `Sign in failed: ${error.message}\n\nNote: Google Sign-In may be blocked inside the preview iframe by your browser. Please try opening the app in a new tab (using the button in the top right).`;
      }
      
      setAuthError(errorMessage);
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
