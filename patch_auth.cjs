const fs = require('fs');
const file = 'src/contexts/AuthContext.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetImport = "import { User, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';";
const replacementImport = "import { User, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, signInAnonymously, linkWithPopup, linkWithRedirect, GoogleAuthProvider, fetchSignInMethodsForEmail } from 'firebase/auth';";

code = code.replace(targetImport, replacementImport);

const targetType = `interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}`;
const replacementType = `interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  linkWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}`;

code = code.replace(targetType, replacementType);

const targetEffect = `    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
    });`;
const replacementEffect = `    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // Sign in anonymously if no user is signed in
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Anonymous auth failed", error);
        }
      } else {
        setUser(currentUser);
        setLoading(false);
        setAuthError(null);
        // Update last login
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email || 'Guest',
          displayName: currentUser.displayName || 'Guest User',
          photoURL: currentUser.photoURL || null,
          isAnonymous: currentUser.isAnonymous,
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
      }
    });`;

code = code.replace(targetEffect, replacementEffect);

const targetSignIn = `  const signInWithGoogle = async () => {`;
const replacementSignIn = `  const linkWithGoogle = async () => {
    if (!user || !user.isAnonymous) return;
    setAuthError(null);
    try {
      await linkWithPopup(user, googleProvider);
    } catch (error: any) {
      console.error('Error linking with Google', error);
      
      if (error.code === 'auth/credential-already-in-use') {
        const credential = GoogleAuthProvider.credentialFromError(error);
        if (credential) {
          try {
            await signInWithPopup(auth, googleProvider);
            return;
          } catch(e) {
             console.error("sign in with popup after link error", e);
          }
        }
      }
      
      let errorMessage = \`Link failed: \${error.message}\`;
      setAuthError(errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    if (user?.isAnonymous) {
      return linkWithGoogle();
    }
`;

code = code.replace(targetSignIn, replacementSignIn);

const targetProvider = `<AuthContext.Provider value={{ user, loading, authError, signInWithGoogle, logout }}>`;
const replacementProvider = `<AuthContext.Provider value={{ user, loading, authError, signInWithGoogle, linkWithGoogle, logout }}>`;

code = code.replace(targetProvider, replacementProvider);

fs.writeFileSync(file, code);
console.log("Patched AuthContext.tsx");
