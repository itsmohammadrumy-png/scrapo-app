import firestore from '@react-native-firebase/firestore';

// కొత్త డాక్యుమెంట్ యాడ్ చేయడానికి
export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await firestore().collection(collectionName).add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

// కలెక్షన్ నుండి అన్ని డాక్యుమెంట్స్ ఫెచ్ చేయడానికి
export const getDocuments = async (collectionName: string) => {
  try {
    const snapshot = await firestore().collection(collectionName).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

// ఒక్క డాక్యుమెంట్ id తో fetch చేయడానికి (AdDetailScreen కి అవసరం)
export const getDocumentById = async (collectionName: string, docId: string) => {
  try {
    const doc = await firestore().collection(collectionName).doc(docId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error getting document: ', error);
    throw error;
  }
};

// డాక్యుమెంట్ delete చేయడానికి (ProfileScreen కి అవసరం)
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await firestore().collection(collectionName).doc(docId).delete();
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw error;
  }
};

// Query తో filter చేసి fetch చేయడానికి (ProfileScreen "my listings" కి అవసరం)
export const getDocumentsWhere = async (collectionName: string, field: string, value: any) => {
  try {
    const snapshot = await firestore().collection(collectionName).where(field, '==', value).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error querying documents: ', error);
    throw error;
  }
};
