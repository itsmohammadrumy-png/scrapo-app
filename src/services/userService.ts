import { doc, getDoc, setDoc, updateDoc, increment } from '@react-native-firebase/firestore';
import { db } from '../config/firebase';

export const ensureUserProfile = async (uid: string, name: string, email: string) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists) {
    await setDoc(userRef, {
      uid,
      name: name || '',
      email: email || '',
      greenCoins: 0,
      createdAt: new Date().toISOString(),
    });
  }
};

export const addGreenCoins = async (uid: string, amount: number) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists) {
    await setDoc(userRef, { uid, greenCoins: amount, createdAt: new Date().toISOString() });
  } else {
    await updateDoc(userRef, { greenCoins: increment(amount) });
  }
};

export const getGreenCoins = async (uid: string): Promise<number> => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists ? (snap.data()?.greenCoins || 0) : 0;
};
