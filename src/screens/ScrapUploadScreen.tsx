import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { addDocument } from '../services/firestoreService';
import { auth } from '../config/firebase';

export default function ScrapUploadScreen({ route, navigation }: any) {
  const { categoryName } = route.params || { categoryName: 'General Scrap' };
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [visibilityMode, setVisibilityMode] = useState<'public' | 'pickup_booking'>('public');
  const [loading, setLoading] = useState(false);

  const currentUser = auth.currentUser;

  const handleSubmit = async () => {
    if (!weight || !address) {
      Alert.alert('Error', 'Please enter estimated weight and pickup address');
      return;
    }
    if (!currentUser) {
      Alert.alert('Login Required', 'Please login to post a scrap listing.');
      return;
    }

    setLoading(true);
    try {
      await addDocument('scrapListings', {
        sellerId: currentUser.uid,
        sellerName: currentUser.displayName || currentUser.email || 'Scrapo User',
        sellerPhone: currentUser.phoneNumber || '',
        category: categoryName,
        weight,
        address,
        description,
        visibilityMode,
        interestedBuyers: [],
        status: 'Active',
      });
      Alert.alert('Success', 'Scrap listing posted successfully!');
      navigation.navigate('MainApp');
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
          placeholder="Mention condition, quantity, etc."
          placeholderTextColor="#888"
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Who can see this listing?</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, visibilityMode === 'public' && styles.toggleBtnActive]}
            onPress={() => setVisibilityMode('public')}
          >
            <Text style={[styles.toggleText, visibilityMode === 'public' && styles.toggleTextActive]}>
              🌍 Everyone
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, visibilityMode === 'pickup_booking' && styles.toggleBtnActive]}
            onPress={() => setVisibilityMode('pickup_booking')}
          >
            <Text style={[styles.toggleText, visibilityMode === 'pickup_booking' && styles.toggleTextActive]}>
              🚚 Nearby Buyers Only (Pickup)
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>
          {visibilityMode === 'public'
            ? 'Anyone using Scrapo can see and contact you.'
            : 'Only verified nearby buyers can see this and book a pickup slot.'}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Pickup Request</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16, paddingTop: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  form: { backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 2 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14, color: '#333', backgroundColor: '#fafafa' },
  textArea: { height: 80, textAlignVertical: 'top' },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#e8f5e9', borderColor: '#2e7d32' },
  toggleText: { fontSize: 12, color: '#555', textAlign: 'center' },
  toggleTextActive: { color: '#2e7d32', fontWeight: 'bold' },
  helperText: { fontSize: 12, color: '#888', marginTop: 8, fontStyle: 'italic' },
  button: { backgroundColor: '#2e7d32', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
