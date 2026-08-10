import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, orderBy, getDocs } from '@react-native-firebase/firestore';
import { db, auth } from '../config/firebase';
import Ionicons from '../components/Icon';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUid = auth.currentUser?.uid;

  const fetchNotifications = async () => {
    if (!currentUid) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', currentUid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [currentUid])
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Ionicons name="notifications-outline" size={20} color="#2e7d32" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
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
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, elevation: 2 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  body: { fontSize: 13, color: '#666', marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#999', fontSize: 14, marginTop: 10 },
});
