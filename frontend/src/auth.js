import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, firebaseConfigured, googleProvider, RecaptchaVerifier } from "./firebase";

const requireAuth = () => {
  if (!firebaseConfigured || !auth) {
    throw new Error("Firebase is not configured. Add the VITE_FIREBASE_* environment variables.");
  }
  return auth;
};

export const observeAuth = (callback) => {
  if (!firebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const signIn = (email, password) => signInWithEmailAndPassword(requireAuth(), email, password);

export const register = async (name, email, password) => {
  const result = await createUserWithEmailAndPassword(requireAuth(), email, password);
  if (name.trim()) await updateProfile(result.user, { displayName: name.trim() });
  return result;
};

export const signInWithGoogle = () => signInWithPopup(requireAuth(), googleProvider);

export const startPhoneSignIn = (phoneNumber, containerId) => {
  const currentAuth = requireAuth();
  const verifier = new RecaptchaVerifier(currentAuth, containerId, { size: "invisible" });
  return signInWithPhoneNumber(currentAuth, phoneNumber, verifier).then((confirmation) => ({ confirmation, verifier }));
};

export const logout = () => signOut(requireAuth());