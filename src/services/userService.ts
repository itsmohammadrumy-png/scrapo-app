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

export const applyReferralCode = async (code: string, newUserId: string) => {
  const { collection, query, where, getDocs } = require('@react-native-firebase/firestore');
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('referralCode', '==', code));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const referrerDoc = snapshot.docs[0];
    if (referrerDoc.id !== newUserId) {
      await addGreenCoins(referrerDoc.id, 50);
    }
  }
};

export const getReferralCode = (uid: string) => uid.substring(0, 6).toUpperCase();
