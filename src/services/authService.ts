import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../config/firebase';

GoogleSignin.configure({
  webClientId: '360685510749-cu960merc1j36qbi569mu0uv6in318ai.apps.googleusercontent.com',
});

export const loginUser = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const registerUser = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const loginWithGoogle = async () => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const signInResult: any = await GoogleSignin.signIn();
  const idToken = signInResult?.data?.idToken || signInResult?.idToken;
  if (!idToken) throw new Error('Google Sign-In: No ID token found');
  const googleCredential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, googleCredential);
  return result.user;
};

export const sendOtp = async (phoneNumber: string) => {
  const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
  return confirmation;
};

export const verifyOtp = async (confirmation: any, code: string) => {
  const result = await confirmation.confirm(code);
  return result.user;
};

export const logoutUser = async () => {
  await GoogleSignin.signOut().catch(() => {});
  await signOut(auth);
};

export const getCurrentUser = () => auth.currentUser;

export const subscribeToAuthChanges = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};
