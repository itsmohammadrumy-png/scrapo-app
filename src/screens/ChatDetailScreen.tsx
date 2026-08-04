import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ChatDetailScreen({ route, navigation }: any) {
  const { chatId, recipientName } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const currentUid = auth().currentUser?.uid;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({ title: recipientName || 'Chat' });

    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(data);
      });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const messageText = text.trim();
    setText('');

    try {
      await firestore().collection('chats').doc(chatId).collection('messages').add({
        senderId: currentUid,
        text: messageText,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      await firestore().collection('chats').doc(chatId).update({
        lastMessage: messageText,
        lastMessageAt: firestore.FieldValue.serverTimestamp(),
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
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#2e7d32', width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
  },
  sendButtonText: { color: '#fff', fontSize: 18 },
});
