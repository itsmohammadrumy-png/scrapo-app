import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function PickupRequestScreen({ route, navigation }: any) {
  const { selectedCategory } = route.params || { selectedCategory: 'General Scrap' };
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePickupSubmit = () => {
    if (!address.trim() || !phone.trim()) {
      Alert.alert('Error', 'தயவுசெய்து முகவரி மற்றும் தொலைபேசி எண்ணை உள்ளிடவும் (Please fill address and phone number)');
      return;
    }

    setLoading(true);
    // Simulate saving request (Firebase Firestore integration can be plugged here)
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success! 🎉',
        `Your pickup request for ${selectedCategory} has been successfully placed!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Text style={style.headerTitle}>Schedule Scrap Pickup</Text>
      <Text style={style.subtitle}>Selected Category: <Text style={style.highlight}>{selectedCategory}</Text></Text>

      <View style={style.formGroup}>
        <Text style={style.label}>Pickup Address</Text>
        <TextInput
          style={[style.input, style.textArea]}
          placeholder="Enter complete address with landmark"
          placeholderTextColor="#888"
          multiline
          numberOfLines={3}
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <View style={style.formGroup}>
        <Text style={style.label}>Contact Phone Number</Text>
        <TextInput
          style={style.input}
          placeholder="Enter 10-digit mobile number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={style.formGroup}>
        <Text style={style.label}>Additional Notes (Optional)</Text>
        <TextInput
          style={style.input}
          placeholder="e.g., Heavy items, call before coming"
          placeholderTextColor="#888"
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <TouchableOpacity 
        style={style.submitBtn} 
        onPress={handlePickupSubmit}
        disabled={loading}
      >
        <Text style={style.submitBtnText}>{loading ? 'Submitting...' : 'Confirm Pickup Request'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f9f9f9', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  highlight: { color: '#2e7d32', fontWeight: 'bold' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14, color: '#333' },
  textArea: { height: 80, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#2e7d32', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10, elevation: 2 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
