import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove } from '@react-native-firebase/firestore';
import { db, auth } from '../config/firebase';
import Ionicons from '../components/Icon';

const { width } = Dimensions.get('window');

export default function AdDetailScreen({ route, navigation }: any) {
  const { item } = route.params;
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState((item.wishlistedBy || []).includes(auth.currentUser?.uid));

  const toggleWishlist = async () => {
    if (!currentUid) {
      Alert.alert('Login Required', 'Please login to save favorites.');
      return;
    }
    try {
      const collName = item.listingType === 'scrap' ? 'scrapListings' : 'marketplaceListings';
      const ref = doc(db, collName, item.id);
      if (isWishlisted) {
        await updateDoc(ref, { wishlistedBy: arrayRemove(currentUid) });
        setIsWishlisted(false);
      } else {
        await updateDoc(ref, { wishlistedBy: arrayUnion(currentUid) });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };
  const currentUid = auth.currentUser?.uid;

  const attributes = item.attributes || {};
  const attributeEntries = Object.entries(attributes).filter(([_, v]) => v);

  const handleContactSeller = async () => {
    if (!currentUid) {
      Alert.alert('Login Required', 'Please login to contact the seller.');
      return;
    }
    if (!item.sellerId) {
      Alert.alert('Error', 'Seller information not available for this ad.');
      return;
    }
    if (item.sellerId === currentUid) {
      Alert.alert('Info', 'This is your own listing.');
      return;
    }

    setLoading(true);
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', currentUid),
        where('relatedListingId', '==', item.id)
      );
      const existing = await getDocs(q);

      let chatId = existing.empty ? null : existing.docs[0].id;

      if (!chatId) {
        const newChat = await addDoc(chatsRef, {
          participants: [currentUid, item.sellerId],
          relatedListingId: item.id,
          productTitle: item.title || item.category,
          lastMessage: '',
          lastMessageAt: serverTimestamp(),
          unreadCount: {},
          participantNames: {
            [item.sellerId]: item.sellerName || 'Seller',
          },
        });
        chatId = newChat.id;
      }

      navigation.navigate('ChatDetail', {
        chatId,
        recipientId: item.sellerId,
        recipientName: item.sellerName || 'Seller',
      });
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert('Error', 'Could not start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {item.images && item.images.length > 0 ? (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {item.images.map((img: string, idx: number) => (
            <Image key={idx} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={{ color: '#999' }}>No Image</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.price}>₹ {item.price ?? "N/A"}</Text>
          <TouchableOpacity onPress={toggleWishlist}>
            <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={26} color="#c62828" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{item.title || item.category}</Text>
        <Text style={styles.location}>📍 {item.location || 'Location not specified'}</Text>

        {item.brand ? (
          <Text style={styles.detailLine}>Brand: {item.brand} {item.model ? `• ${item.model}` : ''}</Text>
        ) : null}

        {attributeEntries.length > 0 && (
          <View style={styles.attrBox}>
            <Text style={styles.sectionTitle}>Details</Text>
            {attributeEntries.map(([key, value]) => (
              <Text key={key} style={styles.attrLine}>
                {key.charAt(0).toUpperCase() + key.slice(1)}: {String(value)}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{item.description || 'No description provided.'}</Text>

        <Text style={styles.sectionTitle}>Seller</Text>
        <Text style={styles.sellerName}>{item.sellerName || 'Scrapo User'}</Text>
      </View>

      <TouchableOpacity style={styles.contactButton} onPress={handleContactSeller} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.contactButtonText}>💬 Contact Seller</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width, height: 280, backgroundColor: '#f0f0f0' },
  noImage: { justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32' },
  title: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 4 },
  location: { fontSize: 13, color: '#777', marginTop: 6 },
  detailLine: { fontSize: 14, color: '#444', marginTop: 10 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 18, marginBottom: 6 },
  attrBox: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginTop: 10 },
  attrLine: { fontSize: 13, color: '#555', marginBottom: 4 },
  description: { fontSize: 14, color: '#555', lineHeight: 20 },
  sellerName: { fontSize: 14, color: '#333', fontWeight: '600' },
  contactButton: { backgroundColor: '#2e7d32', margin: 16, padding: 16, borderRadius: 10, alignItems: 'center' },
  contactButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
