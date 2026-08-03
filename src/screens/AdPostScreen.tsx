import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Modal, FlatList } from 'react-native';
import { addDocument } from '../services/firestoreService';

export default function AdPostScreen({ route, navigation }: any) {
  const { categoryName } = route.params || { categoryName: 'Mobiles & Tablets' };
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('Guntur, Andhra Pradesh');
  const [description, setDescription] = useState('');
  
  // Dynamic specs across all categories
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [year, setYear] = useState('');
  const [kms, setKms] = useState('');
  const [bhk, setBhk] = useState('');
  const [area, setArea] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [condition, setCondition] = useState('');

  // Images state
  const [images, setImages] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState<string[]>([]);

  // Category specific lists for floating modals
  const brandList = ['Apple', 'Samsung', 'Xiaomi/Redmi', 'OnePlus', 'Vivo', 'Oppo', 'Realme', 'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Hero', 'TVS', 'Royal Enfield', 'Yamaha', 'Sony', 'LG', 'IKEA', 'Nike', 'Adidas', 'Others'];
  const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB', 'Other'];
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB', 'Other'];
  const fuelOptions = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
  const transmissionOptions = ['Manual', 'Automatic'];
  const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Villa / Plot'];
  const furnishingOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const jobTypeList = ['Full-time', 'Part-time', 'Work from Home', 'Freelance'];
  const conditionList = ['New', 'Like New', 'Good', 'Fair', 'Needs Repair'];

  const openModal = (type: string, data: string[]) => {
    setModalType(type);
    setModalData(data);
    setModalVisible(true);
  };

  const handleSelectModalItem = (item: string) => {
    if (modalType === 'brand') setBrand(item);
    else if (modalType === 'ram') setRam(item);
    else if (modalType === 'storage') setStorage(item);
    else if (modalType === 'fuel') setFuelType(item);
    else if (modalType === 'transmission') setTransmission(item);
    else if (modalType === 'bhk') setBhk(item);
    else if (modalType === 'furnishing') setFurnishing(item);
    else if (modalType === 'jobType') setJobType(item);
    else if (modalType === 'condition') setCondition(item);
    setModalVisible(false);
  };

  const handleAddImageSlot = () => {
    if (images.length >= 10) {
      Alert.alert('Limit Reached', 'Maximum 10 images allowed.');
      return;
    }
    setImages([...images, '']);
  };

  const handleImageChange = (text: string, index: number) => {
    const newImages = [...images];
    newImages[index] = text;
    setImages(newImages);
  };

  const handlePickFromGallery = (index: number) => {
    Alert.alert('Gallery / Camera', 'Select image source', [
      { text: 'Camera', onPress: () => handleImageChange('camera_captured_image.jpg', index) },
      { text: 'Gallery', onPress: () => handleImageChange('gallery_selected_image.jpg', index) },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const handleSubmit = async () => {
    if (!title || !price) {
      Alert.alert('Error', 'Please enter item title and price');
      return;
    }

    const validImages = images.filter(img => img.trim() !== '');
    if (validImages.length < 2) {
      Alert.alert('Error', 'Please provide at least 2 images.');
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
          kms,
          bhk,
          area,
          furnishing,
          jobType,
          salaryRange,
          condition,
        },
        images: validImages,
        status: 'Active',
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Ad posted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error posting ad:', error);
      Alert.alert('Error', 'Failed to post ad');
    } finally {
      setLoading(false);
    }
  };

  const catLower = categoryName.toLowerCase();
  const isMobile = catLower.includes('mobile');
  const isCar = catLower.includes('car');
  const isBike = catLower.includes('bike');
  const isProperty = catLower.includes('propert');
  const isJob = catLower.includes('job');
  const needsCondition = isMobile || catLower.includes('electro') || catLower.includes('furnitur') || catLower.includes('books') || catLower.includes('fashion');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Post Ad: {categoryName}</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Item Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., iPhone 15 / Honda City / Data Entry Role"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        {/* Brand Selector for Mobiles, Cars, Bikes, etc. */}
        {(isMobile || isCar || isBike) && (
          <>
            <Text style={styles.label}>Brand *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('brand', brandList)}>
              <Text style={styles.dropdownButtonText}>{brand || 'Select Brand'}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Model / Variant</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Pro Max / ZXI / Classic 350"
              placeholderTextColor="#888"
              value={model}
              onChangeText={setModel}
            />
          </>
        )}

        {/* Mobiles Specific */}
        {isMobile && (
          <>
            <Text style={styles.label}>RAM *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('ram', ramOptions)}>
              <Text style={styles.dropdownButtonText}>{ram || 'Select RAM'}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Storage *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('storage', storageOptions)}>
              <Text style={styles.dropdownButtonText}>{storage || 'Select Storage'}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Cars & Bikes Specific */}
        {(isCar || isBike) && (
          <>
            {isCar && (
              <>
                <Text style={styles.label}>Fuel Type *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('fuel', fuelOptions)}>
                  <Text style={styles.dropdownButtonText}>{fuelType || 'Select Fuel Type'}</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Transmission *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('transmission', transmissionOptions)}>
                  <Text style={styles.dropdownButtonText}>{transmission || 'Select Transmission'}</Text>
                </TouchableOpacity>
              </>
            )}

            <Text style={styles.label}>Manufacturing Year</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2022"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={year}
              onChangeText={setYear}
            />

            <Text style={styles.label}>KMs Driven</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 25000"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={kms}
              onChangeText={setKms}
            />
          </>
        )}

        {/* Properties Specific */}
        {isProperty && (
          <>
            <Text style={styles.label}>BHK Type *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('bhk', bhkOptions)}>
              <Text style={styles.dropdownButtonText}>{bhk || 'Select BHK'}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Built-up Area (Sq.ft)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1200"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={area}
              onChangeText={setArea}
            />

            <Text style={styles.label}>Furnishing</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('furnishing', furnishingOptions)}>
              <Text style={styles.dropdownButtonText}>{furnishing || 'Select Furnishing'}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Jobs Specific */}
        {isJob && (
          <>
            <Text style={styles.label}>Job Type *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('jobType', jobTypeList)}>
              <Text style={styles.dropdownButtonText}>{jobType || 'Select Job Type'}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Salary / Pay Range</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 15,000 - 25,000 per month"
              placeholderTextColor="#888"
              value={salaryRange}
              onChangeText={setSalaryRange}
            />
          </>
        )}

        {/* Condition for applicable categories */}
        {needsCondition && (
          <>
            <Text style={styles.label}>Condition</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('condition', conditionList)}>
              <Text style={styles.dropdownButtonText}>{condition || 'Select Condition'}</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.label}>Price / Salary (₹) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 25000"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Pickup Location (Auto-detected)</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={location}
          editable={false}
        />

        <Text style={styles.label}>Product Images (Min 2, Max 10 Required)</Text>
        {images.map((img, index) => (
          <View key={index} style={styles.imageRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder={`Image URL or Path ${index + 1}`}
              placeholderTextColor="#888"
              value={img}
              onChangeText={(text) => handleImageChange(text, index)}
            />
            <TouchableOpacity style={styles.galleryBtn} onPress={() => handlePickFromGallery(index)}>
              <Text style={styles.galleryBtnText}>📂</Text>
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 10 && (
          <TouchableOpacity style={styles.addImageButton} onPress={handleAddImageSlot}>
            <Text style={styles.addImageText}>+ Add Another Image</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Description & Condition</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mention details, bill availability, specifications, etc."
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

      {/* Universal Floating Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Option</Text>
            <FlatList
              data={modalData}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectModalItem(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16, paddingTop: 40 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  form: { backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 2, marginBottom: 30 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14, color: '#333', backgroundColor: '#fafafa', marginBottom: 8 },
  disabledInput: { backgroundColor: '#eee', color: '#666' },
  dropdownButton: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#fafafa', marginBottom: 8, justifyContent: 'center' },
  dropdownButtonText: { fontSize: 14, color: '#333' },
  imageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  galleryBtn: { marginLeft: 8, backgroundColor: '#e8f5e9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#c8e6c9' },
  galleryBtnText: { fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  addImageButton: { paddingVertical: 8, alignItems: 'center', marginBottom: 8 },
  addImageText: { color: '#2e7d32', fontWeight: 'bold', fontSize: 14 },
  button: { backgroundColor: '#2e7d32', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '60%', padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12, textAlign: 'center' },
  modalItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 16, color: '#333' },
  closeModalBtn: { marginTop: 12, paddingVertical: 12, backgroundColor: '#f44336', borderRadius: 8, alignItems: 'center' },
  closeModalText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

