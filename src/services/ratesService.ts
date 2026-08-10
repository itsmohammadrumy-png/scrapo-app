import { collection, getDocs, orderBy, query } from '@react-native-firebase/firestore';
import { db } from '../config/firebase';

export const getScrapRates = async (): Promise<any[]> => {
  const q = query(collection(db, 'scrapRates'), orderBy('category', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};
