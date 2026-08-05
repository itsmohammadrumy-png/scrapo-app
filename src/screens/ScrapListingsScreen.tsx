import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from '@react-native-firebase/firestore';
import { db, auth } from '../config/firebase';

export default function ScrapListingsScreen({ navigation }: any) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUid = auth.currentUser?.uid;

  const fetchListings = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'scrapListings'),
        where('visibilityMode', '==', 'public'),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setListings(data);
    } catch (error) {
      console.error('Error fetching scrap listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [])
  );

  const handleExpressInterest = async (item: any) => {
    if (!currentUid) {
      Alert.alert('Login Required', 'Please login to express interest.');
      return;
    }
    if (item.sellerId === currentUid) {
      Alert.alert('Info', 'This is your own listing.');
      return;
    }
    try {
      await updateDoc(doc(db, 'scrapListings', item.id), {
        interestedBuyers: arrayUnion({ buyerId: currentUid, status: 'pending' }),
      });
      Alert.alert('Success', 'Your interest has been sent to the seller!');
    } catch (error) {
      console.error('Error expressing interest:', error);
      Alert.alert('Error', 'Could not send interest. Try again.');
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {item.photos && item.photos.length > 0 ? (
        <Image source={{ uri: item.photos[0] }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={{ color: '#999' }}>No Photo</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.weight}>{item.weightKg} KG approx</Text>
        <Text style={styles.address} numberOfLines={1}>📍 {item.address}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        ) : null}
        <TouchableOpacity style={styles.interestBtn} onPress={() => handleExpressInterest(item)}>
          <Text style={styles.interestBtnText}>I'm Interested</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>♻ Scrap Listings Near You</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No scrap listings available right now.</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16, paddingTop: 40 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  card: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10,
    marginBottom: 12, elevation: 2,
  },
  image: { width: 90, height: 90, borderRadius: 8, backgroundColor: '#f0f0f0' },
  noImage: { justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  category: { fontSize: 15, fontWeight: 'bold', color: '#2e7d32' },
  weight: { fontSize: 13, color: '#444', marginTop: 2 },
  address: { fontSize: 12, color: '#777', marginTop: 2 },
  description: { fontSize: 12, color: '#666', marginTop: 4 },
  interestBtn: {
    backgroundColor: '#2e7d32', paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 6, alignSelf: 'flex-start', marginTop: 8,
  },
  interestBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#888', fontSize: 14 },
});
