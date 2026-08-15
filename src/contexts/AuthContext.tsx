import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, linkWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  linkWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const isAuthenticatingRef = useRef(false);

  useEffect(() => {
    // Check for redirect result on mount
    getRedirectResult(auth).catch((error) => {
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        console.error("Redirect sign-in error", error);
        setAuthError(`Sign in failed: ${error.message}`);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
      } else {
        setUser(currentUser);
        setLoading(false);
        setAuthError(null);
        try {
          // Update last login
          const userRef = doc(db, 'users', currentUser.uid);
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email || 'User',
            displayName: currentUser.displayName || 'User',
            photoURL: currentUser.photoURL || null,
            isAnonymous: currentUser.isAnonymous,
            lastLoginAt: serverTimestamp(),
          }, { merge: true });
        } catch (error) {
          console.error("Error setting user document:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const linkWithGoogle = async () => {
    if (!user || !user.isAnonymous) return;
    if (isAuthenticatingRef.current) return;

    isAuthenticatingRef.current = true;
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      await linkWithPopup(user, googleProvider);
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        console.log('User cancelled Google linking popup.');
        return;
      }

      if (error?.code === 'auth/credential-already-in-use') {
        const credential = GoogleAuthProvider.credentialFromError(error);
        if (credential) {
          try {
            await signInWithPopup(auth, googleProvider);
            return;
          } catch(e: any) {
             if (e?.code !== 'auth/popup-closed-by-user' && e?.code !== 'auth/cancelled-popup-request') {
               console.error("sign in with popup after link error", e);
             }
             return;
          }
        }
      }
      
      console.error('Error linking with Google', error);
      let errorMessage = `Link failed: ${error.message}`;
      setAuthError(errorMessage);
    } finally {
      isAuthenticatingRef.current = false;
      setIsAuthenticating(false);
    }
  };

  const signInWithGoogle = async () => {
    if (user?.isAnonymous) {
      return linkWithGoogle();
    }

    if (isAuthenticatingRef.current) {
      console.log('Authentication is already in progress.');
      return;
    }

    isAuthenticatingRef.current = true;
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        console.log('User closed Google Sign-In popup or request was cancelled.');
        return;
      }

      // If popup is blocked or we have cross-origin issues, fallback to redirect
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/unauthorized-domain' || error?.message?.includes('cross-origin')) {
        console.log('Popup failed, falling back to redirect...');
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError: any) {
          if (redirectError?.code !== 'auth/popup-closed-by-user' && redirectError?.code !== 'auth/cancelled-popup-request') {
            console.error('Redirect sign in also failed', redirectError);
          }
        }
      } else {
        console.error('Error signing in with Google', error);
      }

      let errorMessage = `Sign in failed: ${error.message}`;
      
      if (error?.code === 'auth/unauthorized-domain') {
        errorMessage = `Sign in failed: Unauthorized domain.\n\nTo fix this:\n1. Go to console.firebase.google.com\n2. Open your project\n3. Go to Authentication -> Settings -> Authorized domains\n4. Add your domain to the list.\n\nNote: Changes may take a few minutes to propagate.`;
      } else {
        errorMessage = `Sign in failed: ${error.message}\n\nNote: Google Sign-In may be blocked inside the preview iframe by your browser. Please try opening the app in a new tab (using the button in the top right).`;
      }
      
      setAuthError(errorMessage);
    } finally {
      isAuthenticatingRef.current = false;
      setIsAuthenticating(false);
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
    <AuthContext.Provider value={{ user, loading, isAuthenticating, authError, signInWithGoogle, linkWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

