import {
  collection, addDoc, getDocs, query, where, serverTimestamp,
} from '@react-native-firebase/firestore';
import { db } from '../config/firebase';

export const addRating = async (
  ratedUserId: string,
  raterId: string,
  stars: number,
  comment: string,
  listingId?: string
) => {
  await addDoc(collection(db, 'ratings'), {
    ratedUserId,
    raterId,
    stars,
    comment,
    listingId: listingId || null,
    createdAt: serverTimestamp(),
  });
};

export const getUserRatings = async (userId: string) => {
  const q = query(collection(db, 'ratings'), where('ratedUserId', '==', userId));
  const snapshot = await getDocs(q);
  const ratings = snapshot.docs.map((d) => d.data());
  const total = ratings.length;
  const average = total > 0 ? ratings.reduce((sum: number, r: any) => sum + r.stars, 0) / total : 0;
  return { average: Math.round(average * 10) / 10, total };
};
