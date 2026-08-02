import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCdFvose4ohvsiG8aT03G0obxvjR4DVNLI",
  authDomain: "scrapo-1276.firebaseapp.com",
  projectId: "scrapo-1276",
  storageBucket: "scrapo-1276.firebasestorage.app",
  messagingSenderId: "1061769480383",
  appId: "1:1061769480383:android:01eab4ab029af144165e0a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

