import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export default function ChatScreen({ navigation }: any) {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUid) {
      setLoading(false);
      return;
    }

    // Real-time listener — పెద్ద apps ఇలాగే చేస్తాయి, fetch-on-focus కాదు
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUid),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setChats(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Chat listener error:', err);
        setError('చాట్‌లు లోడ్ కావడంలో సమస్య వచ్చింది.');
        setLoading(false);
      }
    );

    // Screen unmount అయినప్పుడు listener క్లీన్ చేయాలి — లేకపోతే memory leak
    return () => unsubscribe();
  }, [currentUid]);

  const formatTime = (timestamp: any) => {
    if (!timestamp?.toDate) return '';
    const d = timestamp.toDate();
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { day: '2-digit', month: 'short' });
  };

  const renderChatItem = ({ item }: any) => {
    const otherUid = item.participants?.find((uid: string) => uid !== currentUid);
    const chatTitle = item.participantNames?.[otherUid] || item.productTitle || 'Scrapo / Marketplace Chat';
    const lastMsg = item.lastMessage || 'Tap to view conversation';
    const chatTime = formatTime(item.lastMessageAt);
    const unread = item.unreadCount?.[currentUid || ''] || 0;

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() =>
          navigation.navigate('ChatDetail', {
            chatId: item.id,
            recipientId: otherUid,
            recipientName: chatTitle,
          })
        }
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{chatTitle[0] ? chatTitle[0].toUpperCase() : 'C'}</Text>
        </View>
        <View style={styles.chatInfo}>
          <Text style={[styles.chatName, unread > 0 && styles.boldText]}>{chatTitle}</Text>
          <Text
            style={[styles.chatMsg, unread > 0 && styles.boldText]}
            numberOfLines={1}
          >
            {lastMsg}
          </Text>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.chatTime}>{chatTime}</Text>
          {unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unread > 9 ? '9+' : unread}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages (Scrapo & Marketplace)</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 20 }} />
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noDataText}>{error}</Text>
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noDataText}>No active chats yet.</Text>
          <Text style={styles.subNoDataText}>Chats from marketplace listings and scrap sales will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  chatCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12,
    marginBottom: 10, alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
  },
  avatar: {
    width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#2e7d32',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  chatMsg: { fontSize: 13, color: '#666', marginTop: 4 },
  boldText: { color: '#000', fontWeight: '700' },
  rightCol: { alignItems: 'flex-end' },
  chatTime: { fontSize: 11, color: '#999' },
  unreadBadge: {
    backgroundColor: '#2e7d32', borderRadius: 10, minWidth: 20, height: 20,
    justifyContent: 'center', alignItems: 'center', marginTop: 6, paddingHorizontal: 5,
  },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  noDataText: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  subNoDataText: { fontSize: 13, color: '#888', textAlign: 'center', marginTop: 6 },
});
