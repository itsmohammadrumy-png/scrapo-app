import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { addDocument } from '../services/firestoreService';

export default function ScrapUploadScreen({ route, navigation }: any) {
  const { categoryName } = route.params || { categoryName: 'General Scrap' };
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!weight || !address) {
      Alert.alert('Error', 'Please enter estimated weight and pickup address');
      return;
    }

    setLoading(true);
    try {
      await addDocument('scrapListings', {
        category: categoryName,
        weight,
        address,
        description,
        status: 'Active',
        createdAt: new Date().toISOString(),
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
          placeholder="Enter complete address in Guntur"
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

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Pickup Request</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

