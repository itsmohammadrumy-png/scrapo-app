import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert,
  ScrollView, ActivityIndicator, Image, FlatList,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { addDocument } from '../services/firestoreService';
import { uploadMultipleImages } from '../services/storageService';
import { auth } from '../config/firebase';

export default function ScrapUploadScreen({ route, navigation }: any) {
  const { categoryName } = route.params || { categoryName: 'General Scrap' };
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [visibilityMode, setVisibilityMode] = useState<'public' | 'pickup_booking'>('public');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePickImage = () => {
    if (photos.length >= 5) {
      Alert.alert('Limit Reached', 'Maximum 5 photos allowed.');
      return;
    }
    Alert.alert('Add Photo', 'Choose source', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await launchCamera({ mediaType: 'photo', quality: 0.7 });
          if (result.assets && result.assets[0]?.uri) {
            setPhotos((prev) => [...prev, result.assets![0].uri!]);
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7, selectionLimit: 5 - photos.length });
          if (result.assets) {
            const uris = result.assets.map((a) => a.uri!).filter(Boolean);
            setPhotos((prev) => [...prev, ...uris].slice(0, 5));
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!weight || !address) {
      Alert.alert('Error', 'Please enter estimated weight and pickup address');
      return;
    }
    if (photos.length === 0) {
      Alert.alert('Error', 'Please add at least 1 photo of the scrap item');
      return;
    }

    setLoading(true);
    try {
      const uploadedUrls = await uploadMultipleImages(photos, 'scrapListings');

      await addDocument('scrapListings', {
        sellerId: auth.currentUser?.uid,
        sellerName: auth.currentUser?.displayName || auth.currentUser?.email || 'Scrapo User',
        category: categoryName,
        weightKg: weight,
        address,
        description,
        photos: uploadedUrls,
        visibilityMode,
        status: 'active',
        interestedBuyers: [],
      });

      Alert.alert('Success', 'Scrap pickup request posted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error posting scrap:', error);
      Alert.alert('Error', 'Failed to post scrap request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upload Scrap: {categoryName}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Photos (1-5 required)</Text>
        <FlatList
          data={[...photos, 'add']}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) =>
            item === 'add' ? (
              photos.length < 5 ? (
                <TouchableOpacity style={styles.addPhotoBox} onPress={handlePickImage}>
                  <Text style={styles.addPhotoText}>+ Add</Text>
                </TouchableOpacity>
              ) : null
            ) : (
              <View style={styles.photoBox}>
                <Image source={{ uri: item }} style={styles.photoImage} />
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemovePhoto(index)}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            )
          }
        />

        <Text style={styles.label}>Estimated Weight (KGs)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 25"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <Text style={styles.label}>Pickup Address / Location</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter complete address"
          placeholderTextColor="#888"
          multiline
          numberOfLines={3}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Description / Condition</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mention condition, e.g., old newspapers tied in bundles"
          placeholderTextColor="#888"
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Who can see this post?</Text>
        <View style={styles.visibilityRow}>
          <TouchableOpacity
            style={[styles.visibilityBtn, visibilityMode === 'public' && styles.visibilityBtnActive]}
            onPress={() => setVisibilityMode('public')}
          >
            <Text style={[styles.visibilityText, visibilityMode === 'public' && styles.visibilityTextActive]}>
              🌍 Public (Everyone)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.visibilityBtn, visibilityMode === 'pickup_booking' && styles.visibilityBtnActive]}
            onPress={() => setVisibilityMode('pickup_booking')}
          >
            <Text style={[styles.visibilityText, visibilityMode === 'pickup_booking' && styles.visibilityTextActive]}>
              🔒 Nearby Registered Buyers Only
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Pickup Request</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16, paddingTop: 40 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  form: { backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 2 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14, color: '#333', backgroundColor: '#fafafa' },
  textArea: { height: 80, textAlignVertical: 'top' },
  addPhotoBox: {
    width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: '#fafafa',
  },
  addPhotoText: { color: '#2e7d32', fontSize: 12, fontWeight: 'bold' },
  photoBox: { position: 'relative', marginRight: 10 },
  photoImage: { width: 80, height: 80, borderRadius: 8 },
  removeBtn: {
    position: 'absolute', top: -6, right: -6, backgroundColor: '#c62828', width: 20, height: 20,
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  removeBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  visibilityRow: { gap: 10 },
  visibilityBtn: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 8 },
  visibilityBtnActive: { borderColor: '#2e7d32', backgroundColor: '#e8f5e9' },
  visibilityText: { fontSize: 13, color: '#555' },
  visibilityTextActive: { color: '#2e7d32', fontWeight: 'bold' },
  button: { backgroundColor: '#2e7d32', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
