import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// కొత్త డాక్యుమెంట్ (స్క్రాప్ ఐటమ్ లేదా పోస్ట్) యాడ్ చేయడానికి
export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// కలెక్షన్ నుండి అన్ని డాక్యుమెంట్స్ ఫెచ్ చేయడానికి
export const getDocuments = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const list = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return list;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

