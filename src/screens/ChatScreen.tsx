import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ChatScreen() {
  const { t } = useTranslation();

  // తాత్కాలిక చాట్ లిస్ట్
  const chats = [
    { id: '1', name: 'Scrap Buyer - Ramesh', lastMessage: 'When can you deliver the iron scrap?', time: '10:30 AM' },
    { id: '2', name: 'Recycling Hub Guntur', lastMessage: 'Price updated for old newspapers.', time: 'Yesterday' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('chats')}</Text>
      
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chatCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.chatMsg} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <Text style={styles.chatTime}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatMsg: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  chatTime: {
    fontSize: 11,
    color: '#999',
  },
});

