import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { addDocument } from '../services/firestoreService';

export default function AdPostScreen({ route, navigation }: any) {
  const { categoryName } = route.params || { categoryName: 'Mobiles & Tablets' };
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('Guntur');
  const [description, setDescription] = useState('');
  
  // Dynamic fields state
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [year, setYear] = useState('');
  const [insurance, setInsurance] = useState('');
  
  const [images, setImages] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(false);

  const handleAddImageSlot = () => {
    if (images.length >= 10) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 10 images.');
      return;
    }
    setImages([...images, '']);
  };

  const handleImageChange = (text: string, index: number) => {
    const newImages = [...images];
    newImages[index] = text;
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (!title || !price) {
      Alert.alert('Error', 'Please enter item title and price');
      return;
    }

    const validImages = images.filter(img => img.trim() !== '');
    if (validImages.length < 2) {
      Alert.alert('Error', 'Please provide at least 2 image URLs.');
      return;
    }

    setLoading(true);
    try {
      await addDocument('marketplaceListings', {
        category: categoryName,
        title,
        price,
        brand,
        model,
        location,
        description,
        attributes: {
          ram,
          storage,
          fuelType,
          transmission,
          year,
          insurance,
        },
        images: validImages,
        status: 'Active',
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Ad posted successfully with full specifications!');
      navigation.goBack();
    } catch (error) {
      console.error('Error posting ad:', error);
      Alert.alert('Error', 'Failed to post ad');
    } finally {
      setLoading(false);
    }
  };

  // Check category type to render specific fields
  const isMobile = categoryName.toLowerCase().includes('mobile');
  const isCarOrBike = categoryName.toLowerCase().includes('car') || categoryName.toLowerCase().includes('bike');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Post Ad: {categoryName}</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Item Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., iPhone 15 Pro / Honda City"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Apple, Samsung, Maruti"
          placeholderTextColor="#888"
          value={brand}
          onChangeText={setBrand}
        />

        <Text style={styles.label}>Model / Variant</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Pro Max / ZXI"
          placeholderTextColor="#888"
          value={model}
          onChangeText={setModel}
        />

        {/* Dynamic Fields for Mobiles */}
        {isMobile && (
          <>
            <Text style={styles.label}>RAM</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 8GB / 12GB"
              placeholderTextColor="#888"
              value={ram}
              onChangeText={setRam}
            />

            <Text style={styles.label}>Storage</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 128GB / 256GB"
              placeholderTextColor="#888"
              value={storage}
              onChangeText={setStorage}
            />
          </>
        )}

        {/* Dynamic Fields for Cars & Bikes */}
        {isCarOrBike && (
          <>
            <Text style={styles.label}>Fuel Type</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Petrol, Diesel, Electric, CNG"
              placeholderTextColor="#888"
              value={fuelType}
              onChangeText={setFuelType}
            />

            <Text style={styles.label}>Transmission</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Manual, Automatic"
              placeholderTextColor="#888"
              value={transmission}
              onChangeText={setTransmission}
            />

            <Text style={styles.label}>Manufacturing Year</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2022"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={year}
              onChangeText={setYear}
            />

            <Text style={styles.label}>Insurance Status</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Valid up to 2027 / Expired"
              placeholderTextColor="#888"
              value={insurance}
              onChangeText={setInsurance}
            />
          </>
        )}

        <Text style={styles.label}>Price (₹) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 25000"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Pickup Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Guntur"
          placeholderTextColor="#888"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Product Images (Min 2, Max 10 Required)</Text>
        {images.map((img, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Image URL ${index + 1}`}
            placeholderTextColor="#888"
            value={img}
            onChangeText={(text) => handleImageChange(text, index)}
          />
        ))}

        {images.length < 10 && (
          <TouchableOpacity style={styles.addImageButton} onPress={handleAddImageSlot}>
            <Text style={styles.addImageText}>+ Add Another Image URL</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Description & Condition</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe usage, bill availability, accessories, etc."
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
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
            <Text style={styles.buttonText}>Post Ad Now</Text>
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
    elevation: 2,
    marginBottom: 30,
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
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addImageButton: {
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  addImageText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 14,
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

