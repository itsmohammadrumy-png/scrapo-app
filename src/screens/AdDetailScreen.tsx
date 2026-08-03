import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function AdDetailScreen({ route, navigation }: any) {
  const { item } = route.params || {};

  const handleContactSeller = () => {
    Alert.alert('Contact Seller', 'Redirecting to chat with the seller...');
    navigation.navigate('Chats');
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>No Image Available</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title || item.category}</Text>
        <Text style={styles.price}>₹ {item.price || 'N/A'}</Text>
        
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Category: {item.category}</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{item.description || 'No description provided.'}</Text>

        <TouchableOpacity style={styles.chatButton} onPress={handleContactSeller}>
          <Text style={styles.chatButtonText}>Chat with Seller</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#777',
    fontSize: 16,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 6,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 30,
  },
  chatButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 50,
  },
});

