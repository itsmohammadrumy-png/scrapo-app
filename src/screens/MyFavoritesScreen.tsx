import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { db, auth } from '../config/firebase';

export default function MyFavoritesScreen({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUid = auth.currentUser?.uid;

  const fetchFavorites = async () => {
    if (!currentUid) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'marketplaceListings'), where('wishlistedBy', 'array-contains', currentUid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, listingType: 'marketplace', ...d.data() }));
      setItems(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [currentUid])
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AdDetail', { item })}>
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]} />
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>₹ {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet.</Text>
          <Text style={styles.emptySubText}>Tap the heart icon on any ad to save it here.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
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
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 10, elevation: 2 },
  image: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#f0f0f0' },
  noImage: {},
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 14, color: '#2e7d32', fontWeight: 'bold', marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyText: { color: '#555', fontSize: 15, fontWeight: 'bold' },
  emptySubText: { color: '#999', fontSize: 12, textAlign: 'center', marginTop: 6 },
});
