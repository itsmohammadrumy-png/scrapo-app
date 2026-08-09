import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { db, auth } from '../config/firebase';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUid = auth.currentUser?.uid;

  const fetchBookings = async () => {
    if (!currentUid) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'scrapListings'), where('sellerId', '==', currentUid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((item: any) => item.interestedBuyers && item.interestedBuyers.length > 0);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [currentUid])
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.weight}>{item.weightKg} KG</Text>
      <Text style={styles.interestCount}>
        {item.interestedBuyers.length} buyer interested
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pickup bookings yet.</Text>
          <Text style={styles.emptySubText}>When buyers show interest in your scrap posts, they will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, elevation: 2 },
  category: { fontSize: 15, fontWeight: 'bold', color: '#2e7d32' },
  weight: { fontSize: 13, color: '#555', marginTop: 2 },
  interestCount: { fontSize: 12, color: '#f57c00', marginTop: 6, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyText: { color: '#555', fontSize: 15, fontWeight: 'bold' },
  emptySubText: { color: '#999', fontSize: 12, textAlign: 'center', marginTop: 6 },
});
