import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '360685510749-cu960merc1j36qbi569mu0uv6in318ai.apps.googleusercontent.com',
});

// Email + Password Login
export const loginUser = async (email: string, password: string) => {
  const result = await auth().signInWithEmailAndPassword(email, password);
  return result.user;
};

// Email + Password Register
export const registerUser = async (email: string, password: string) => {
  const result = await auth().createUserWithEmailAndPassword(email, password);
  return result.user;
};

// Google Sign-In
export const loginWithGoogle = async () => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const signInResult: any = await GoogleSignin.signIn();
  const idToken = signInResult?.data?.idToken || signInResult?.idToken;
  if (!idToken) throw new Error('Google Sign-In: No ID token found');
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const result = await auth().signInWithCredential(googleCredential);
  return result.user;
};

// Phone OTP - Step 1: Send OTP
export const sendOtp = async (phoneNumber: string) => {
  const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  return confirmation;
};

// Phone OTP - Step 2: Verify OTP
export const verifyOtp = async (confirmation: any, code: string) => {
  const result = await confirmation.confirm(code);
  return result.user;
};

// Logout
export const logoutUser = async () => {
  await GoogleSignin.signOut().catch(() => {});
  await auth().signOut();
};

// Current logged-in user
export const getCurrentUser = () => auth().currentUser;

// Listen to auth state changes
export const subscribeToAuthChanges = (callback: (user: any) => void) => {
  return auth().onAuthStateChanged(callback);
};
