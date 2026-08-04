import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { db } from '../config/firebase';

export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

export const getDocuments = async (collectionName: string) => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

export const getDocumentById = async (collectionName: string, docId: string) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error getting document: ', error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw error;
  }
};

export const getDocumentsWhere = async (collectionName: string, field: string, value: any) => {
  try {
    const q = query(collection(db, collectionName), where(field, '==', value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error querying documents: ', error);
    throw error;
  }
};
