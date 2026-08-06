import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { collection, addDoc, doc, updateDoc, query, orderBy, onSnapshot, serverTimestamp } from '@react-native-firebase/firestore';
import { db, auth } from '../config/firebase';
import RatingModal from '../components/RatingModal';

export default function ChatDetailScreen({ route, navigation }: any) {
  const { chatId, recipientName, recipientId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [ratingVisible, setRatingVisible] = useState(false);
  const currentUid = auth.currentUser?.uid;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      title: recipientName || 'Chat',
      headerRight: () => (
        <TouchableOpacity onPress={() => setRatingVisible(true)} style={{ marginRight: 12 }}>
          <Text style={{ color: '#2e7d32', fontWeight: 'bold' }}>Rate</Text>
        </TouchableOpacity>
      ),
    });

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(data);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const messageText = text.trim();
    setText('');

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        senderId: currentUid,
        text: messageText,
        timestamp: serverTimestamp(),
      });

      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: messageText,
        lastMessageAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }: any) => {
    const isMe = item.senderId === currentUid;
    return (
      <View style={[styles.bubbleRow, isMe ? styles.rowRight : styles.rowLeft]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.bubbleText, isMe && styles.myBubbleText]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <RatingModal
        visible={ratingVisible}
        onClose={() => setRatingVisible(false)}
        ratedUserId={recipientId}
        listingId={chatId}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messagesList: { padding: 12, paddingBottom: 20 },
  bubbleRow: { flexDirection: 'row', marginBottom: 8 },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '75%', padding: 10, borderRadius: 14 },
  myBubble: { backgroundColor: '#2e7d32', borderBottomRightRadius: 2 },
  theirBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2, elevation: 1 },
  bubbleText: { fontSize: 14, color: '#333' },
  myBubbleText: { color: '#fff' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', padding: 10,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee',
  },
  input: {
    flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 10, fontSize: 14, maxHeight: 100, marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#2e7d32', paddingHorizontal: 16, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
  },
  sendButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
