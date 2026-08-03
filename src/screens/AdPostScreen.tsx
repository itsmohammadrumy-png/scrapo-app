import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Modal, FlatList } from 'react-native';
import { addDocument } from '../services/firestoreService';
import { MARKET_CATEGORIES } from '../constants/marketCategories';

export default function AdPostScreen({ route, navigation }: any) {
  // If a categoryName was passed in (e.g. user had a category selected on
  // the Marketplace screen), start with that. Otherwise start empty and
  // let the user pick a category from a selector at the top of the form.
  const initialCategory = route.params?.categoryName || '';
  const [categoryName, setCategoryName] = useState(initialCategory);

  const [title, setTitle] = useState('');
  const [priceOrSalary, setPriceOrSalary] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('Guntur, Andhra Pradesh');
  const [description, setDescription] = useState('');

  // Dynamic fields
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [year, setYear] = useState('');
  const [kms, setKms] = useState('');
  const [owners, setOwners] = useState('');
  const [bhk, setBhk] = useState('');
  const [area, setArea] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [listingType, setListingType] = useState('');
  const [jobType, setJobType] = useState('');
  const [experience, setExperience] = useState('');
  const [jobListingType, setJobListingType] = useState(''); // 'Hiring' or 'Looking for Job'
  const [educationQualification, setEducationQualification] = useState(''); // job seeker's education
  const [minQualification, setMinQualification] = useState(''); // employer's requirement
  const [companyName, setCompanyName] = useState('');
  const [skills, setSkills] = useState('');
  const [preferredJobLocation, setPreferredJobLocation] = useState('');
  const [condition, setCondition] = useState('');
  const [size, setSize] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');

  // Manual "Others" text entries — one per field that supports a custom typed value
  const [customValues, setCustomValues] = useState<{ [key: string]: string }>({});
  const isOther = (val: string) => val === 'Others' || val === 'Other';
  const setCustomValue = (field: string, text: string) => {
    setCustomValues(prev => ({ ...prev, [field]: text }));
  };

  // Images state
  const [images, setImages] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState<string[]>([]);

  // ---------------------------------------------------------------------
  // BRAND LISTS (category-specific, no longer mixed together)
  // ---------------------------------------------------------------------
  const mobileBrandList = ['Apple', 'Samsung', 'Xiaomi/Redmi', 'OnePlus', 'Vivo', 'Oppo', 'Realme', 'Google', 'Motorola', 'Others'];
  const laptopBrandList = ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI', 'Microsoft', 'Others'];
  const carBrandList = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Mahindra', 'Toyota', 'Kia', 'Renault', 'Volkswagen', 'MG', 'Skoda', 'Citroen', 'Nissan', 'Jeep', 'BYD', 'Mercedes-Benz', 'BMW', 'Audi', 'Volvo', 'Others'];
  const bikeBrandList = ['Hero MotoCorp', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha', 'Suzuki', 'Ola Electric', 'Ather', 'Others'];

  // ---------------------------------------------------------------------
  // MODEL LISTS keyed by brand (dependent dropdown data)
  // ---------------------------------------------------------------------
  const mobileModels: { [key: string]: string[] } = {
    'Apple': ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16', 'iPhone 16e', 'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini', 'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini', 'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11', 'iPhone SE (2022)', 'iPhone SE (2020)', 'iPhone XR', 'iPhone XS Max', 'iPhone XS', 'iPhone X', 'Others'],
    'Samsung': ['Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25', 'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S23 FE', 'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22', 'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21', 'Galaxy S21 FE', 'Galaxy Z Fold 5', 'Galaxy Z Fold 4', 'Galaxy Z Fold 3', 'Galaxy Z Flip 5', 'Galaxy Z Flip 4', 'Galaxy Z Flip 3', 'Galaxy A55', 'Galaxy A54', 'Galaxy A35', 'Galaxy A34', 'Galaxy A25', 'Galaxy A24', 'Galaxy A16', 'Galaxy A15', 'Galaxy A14', 'Galaxy A05', 'Galaxy M55', 'Galaxy M54', 'Galaxy M34', 'Galaxy M14', 'Galaxy F54', 'Galaxy F34', 'Galaxy F16', 'Others'],
    'Xiaomi/Redmi': ['Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi Note 12 Pro+', 'Redmi Note 12 Pro', 'Redmi Note 12', 'Redmi Note 11 Pro', 'Redmi Note 11', 'Redmi 13C', 'Redmi 12C', 'Redmi 12', 'Xiaomi 14', 'Xiaomi 13 Pro', 'Xiaomi 13', 'Xiaomi 12', 'POCO X6 Pro', 'POCO X6', 'POCO X5 Pro', 'POCO F5', 'POCO F6', 'POCO M6 Pro', 'Others'],
    'OnePlus': ['OnePlus 12', 'OnePlus 12R', 'OnePlus 11', 'OnePlus 11R', 'OnePlus 10 Pro', 'OnePlus 10R', 'OnePlus 9 Pro', 'OnePlus 9', 'OnePlus 9R', 'Nord 4', 'Nord CE 4', 'Nord 3', 'Nord CE 3', 'Nord 2T', 'Nord 2', 'Others'],
    'Vivo': ['V30 Pro', 'V30', 'V29 Pro', 'V29', 'V27 Pro', 'V27', 'Y200', 'Y100', 'Y56', 'Y36', 'Y27', 'T3', 'T2', 'X100', 'X90', 'Others'],
    'Oppo': ['Reno 12 Pro', 'Reno 11 Pro', 'Reno 11', 'Reno 10 Pro+', 'Reno 10 Pro', 'Reno 8T', 'F25', 'F23', 'F21', 'A98', 'A78', 'A58', 'A38', 'A18', 'Others'],
    'Realme': ['Realme 12 Pro+', 'Realme 12 Pro', 'Realme 12', 'Realme 11 Pro+', 'Realme 11 Pro', 'Realme 11', 'GT 6', 'GT 5', 'Narzo 70 Pro', 'Narzo 60 Pro', 'Narzo 50', 'C67', 'C65', 'C55', 'C53', 'Others'],
    'Google': ['Pixel 9 Pro', 'Pixel 9', 'Pixel 8a', 'Pixel 8', 'Others'],
    'Motorola': ['Edge 50 Pro', 'Edge 50', 'Moto G85', 'Moto G73', 'Moto G54', 'Razr 50', 'Others'],
    'Others': ['Others'],
  };

  const laptopModels: { [key: string]: string[] } = {
    'Dell': ['Inspiron 15', 'Inspiron 14', 'Inspiron 3000 series', 'Inspiron 5000 series', 'Inspiron 7000 series', 'Vostro', 'Latitude', 'XPS 13', 'XPS 15', 'Alienware', 'Others'],
    'HP': ['Pavilion', 'Pavilion Gaming', 'Envy', 'Omen', '15s', '14s', 'Victus', 'Spectre', 'ProBook', 'EliteBook', 'Others'],
    'Lenovo': ['IdeaPad Slim 3', 'IdeaPad Slim 5', 'ThinkPad E14', 'ThinkPad T14', 'ThinkPad X1 Carbon', 'Legion 5', 'Legion 7', 'Yoga series', 'V15', 'Others'],
    'Asus': ['VivoBook 15', 'VivoBook 14', 'Zenbook', 'ROG Strix', 'TUF Gaming', 'ExpertBook', 'Others'],
    'Acer': ['Aspire 3', 'Aspire 5', 'Aspire 7', 'Nitro 5', 'Predator', 'Swift', 'TravelMate', 'Others'],
    'Apple': ['MacBook Air M1', 'MacBook Air M2', 'MacBook Air M3', 'MacBook Pro 13"', 'MacBook Pro 14"', 'MacBook Pro 16"', 'Others'],
    'MSI': ['Modern 14', 'Katana', 'Cyborg', 'Others'],
    'Microsoft': ['Surface Laptop', 'Surface Pro', 'Others'],
    'Others': ['Others'],
  };

  const carModels: { [key: string]: string[] } = {
    'Maruti Suzuki': ['Swift', 'Baleno', 'Dzire', 'Alto K10', 'WagonR', 'Celerio', 'Ignis', 'S-Presso', 'Fronx', 'Brezza', 'Ertiga', 'XL6', 'Grand Vitara', 'Ciaz', 'Eeco', 'Jimny', 'Invicto', 'Victoris', 'e-Vitara', 'Others'],
    'Hyundai': ['i10 Nios', 'i20', 'Aura', 'Verna', 'Venue', 'Creta', 'Alcazar', 'Tucson', 'Exter', 'Ioniq 5', 'Others'],
    'Tata': ['Tiago', 'Tigor', 'Altroz', 'Punch', 'Nexon', 'Harrier', 'Safari', 'Curvv', 'Nexon EV', 'Tigor EV', 'Sierra', 'Sierra EV', 'Harrier EV', 'Others'],
    'Honda': ['Amaze', 'City', 'Elevate', 'WR-V', 'Jazz', 'ZR-V', 'Others'],
    'Mahindra': ['Bolero', 'Bolero Neo', 'XUV300', 'XUV400', 'XUV700', 'Scorpio', 'Scorpio-N', 'Thar', 'Marazzo', 'KUV100', 'TUV300', 'Others'],
    'Toyota': ['Glanza', 'Urban Cruiser Taisor', 'Innova Crysta', 'Innova Hycross', 'Fortuner', 'Camry', 'Hyryder', 'Rumion', 'Hilux', 'Land Cruiser Prado', 'Others'],
    'Kia': ['Sonet', 'Seltos', 'Carens', 'EV6', 'Syros', 'Syros EV', 'Sorento', 'Others'],
    'Renault': ['Kwid', 'Triber', 'Kiger', 'Others'],
    'Volkswagen': ['Virtus', 'Taigun', 'Polo', 'Vento', 'Others'],
    'MG': ['Comet', 'Astor', 'Hector', 'Gloster', 'Windsor EV', 'ZS EV', 'Others'],
    'Skoda': ['Slavia', 'Kushaq', 'Kodiaq', 'Others'],
    'Citroen': ['C3', 'C3 Aircross', 'Basalt', 'Others'],
    'Nissan': ['Magnite', 'Tekton', 'Others'],
    'Jeep': ['Compass', 'Meridian', 'Others'],
    'BYD': ['Atto 3', 'Seal', 'e6', 'Others'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'Others'],
    'BMW': ['3 Series', '5 Series', 'X1', 'Others'],
    'Audi': ['A4', 'Q3', 'Q5', 'Others'],
    'Volvo': ['XC40', 'XC60', 'Others'],
    'Others': ['Others'],
  };

  const bikeModels: { [key: string]: string[] } = {
    'Hero MotoCorp': ['Splendor Plus', 'Splendor+ XTEC', 'HF Deluxe', 'Passion Pro', 'Glamour', 'Xtreme 125R', 'Xtreme 160R', 'Xpulse 200', 'Karizma XMR', 'Destini 125', 'Pleasure+', 'Maestro Edge', 'Others'],
    'Honda': ['Shine 100', 'Shine 125', 'SP 125', 'Unicorn', 'Hornet 2.0', 'CB350', 'CB300F', 'Activa 6G', 'Activa 125', 'Dio', 'Others'],
    'Bajaj': ['Pulsar 125', 'Pulsar 150', 'Pulsar 220F', 'Pulsar NS200', 'Pulsar N250', 'Pulsar N160', 'Platina 100', 'Platina 110', 'CT 100', 'Avenger Street 160', 'Dominar 250', 'Dominar 400', 'Chetak (EV)', 'Others'],
    'TVS': ['Apache RTR 160', 'Apache RTR 180', 'Apache RTR 200 4V', 'Raider 125', 'Sport', 'Radeon', 'Star City+', 'Jupiter', 'NTorq 125', 'iQube (EV)', 'Others'],
    'Royal Enfield': ['Classic 350', 'Bullet 350', 'Meteor 350', 'Hunter 350', 'Himalayan 450', 'Continental GT 650', 'Interceptor 650', 'Scram 411', 'Guerrilla 450', 'Others'],
    'Yamaha': ['FZ-S', 'FZ25', 'MT-15', 'R15 V4', 'RayZR', 'Fascino', 'Others'],
    'Suzuki': ['Gixxer', 'Gixxer SF', 'Access 125', 'Burgman Street', 'Avenis', 'Others'],
    'Ola Electric': ['S1 Pro', 'S1 Air', 'S1X', 'Others'],
    'Ather': ['450X', '450S', 'Rizta', 'Others'],
    'Others': ['Others'],
  };

  // ---------------------------------------------------------------------
  // OTHER OPTION LISTS
  // ---------------------------------------------------------------------
  const ramOptions = ['2GB', '4GB', '6GB', '8GB', '12GB', '16GB', '32GB+', 'Other'];
  const storageOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB+', 'Other'];
  const fuelOptions = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
  const transmissionOptions = ['Manual', 'Automatic'];
  const ownersOptions = ['1st Owner', '2nd Owner', '3rd Owner', '3+ Owners'];
  const listingTypeOptions = ['Sell', 'Rent', 'PG'];
  const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK', 'Villa / Plot'];
  const furnishingOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const jobTypeList = ['Full-time', 'Part-time', 'Internship', 'Work from Home', 'Freelance'];
  const experienceOptions = ['Fresher', '1-3 yrs', '3-5 yrs', '5+ yrs'];
  const jobListingTypeOptions = ['Hiring (Job Vacancy)', 'Looking for Job (Job Wanted)'];
  const educationOptions = ['No Formal Education', 'Below 10th', '10th Pass', 'Intermediate / 12th', 'ITI / Diploma', 'Graduate (B.A/B.Com/B.Sc etc.)', 'B.Tech / Engineering', 'Post Graduate', 'Others'];
  const conditionList = ['New', 'Excellent', 'Good', 'Fair', 'Needs Repair'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Other'];
  const petBreedOptions = ['Labrador', 'German Shepherd', 'Golden Retriever', 'Pug', 'Beagle', 'Pomeranian', 'Shih Tzu', 'Rottweiler', 'Dobermann', 'Husky', 'Indie/Mixed Breed', 'Persian Cat', 'Siamese Cat', 'Indie Cat', 'Parrot', 'Love Bird', 'Other'];
  const petAgeOptions = ['< 3 months', '3-12 months', '1-3 yrs', '3+ yrs'];
  const serviceCategoryOptions = ['Education', 'Repair Services', 'Beauty & Wellness', 'Travel', 'Legal / Documents', 'Home Renovation'];

  const openModal = (type: string, data: string[]) => {
    setModalType(type);
    setModalData(data);
    setModalVisible(true);
  };

  const handleSelectModalItem = (item: string) => {
    if (modalType === 'category') {
      setCategoryName(item);
      // Category changed — reset fields that only made sense for the old category
      setBrand('');
      setModel('');
    }
    else if (modalType === 'brand') {
      setBrand(item);
      setModel(''); // reset dependent model when brand changes
    }
    else if (modalType === 'model') setModel(item);
    else if (modalType === 'ram') setRam(item);
    else if (modalType === 'storage') setStorage(item);
    else if (modalType === 'fuel') setFuelType(item);
    else if (modalType === 'transmission') setTransmission(item);
    else if (modalType === 'owners') setOwners(item);
    else if (modalType === 'listingType') setListingType(item);
    else if (modalType === 'bhk') setBhk(item);
    else if (modalType === 'furnishing') setFurnishing(item);
    else if (modalType === 'jobType') setJobType(item);
    else if (modalType === 'experience') setExperience(item);
    else if (modalType === 'jobListingType') {
      setJobListingType(item);
      // Listing type changed — reset fields that only applied to the other side
      setEducationQualification('');
      setMinQualification('');
      setCompanyName('');
      setSkills('');
      setPreferredJobLocation('');
      setJobType('');
      setExperience('');
    }
    else if (modalType === 'educationQualification') setEducationQualification(item);
    else if (modalType === 'minQualification') setMinQualification(item);
    else if (modalType === 'condition') setCondition(item);
    else if (modalType === 'size') setSize(item);
    else if (modalType === 'petBreed') setPetBreed(item);
    else if (modalType === 'petAge') setPetAge(item);
    else if (modalType === 'serviceCategory') setServiceCategory(item);
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
    Alert.alert('Image Upload', 'Select image source', [
      { text: 'Camera', onPress: () => handleImageChange('camera_captured_image.jpg', index) },
      { text: 'Gallery', onPress: () => handleImageChange('gallery_selected_image.jpg', index) },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  // ---------------------------------------------------------------------
  // CATEGORY DETECTION
  // ---------------------------------------------------------------------
  const catLower = categoryName.toLowerCase();
  const isMobile = catLower.includes('mobile');
  const isCar = catLower.includes('car');
  const isBike = catLower.includes('bike') || catLower.includes('motorcycle');
  const isProperty = catLower.includes('propert');
  const isJob = catLower.includes('job');
  const isLaptop = catLower.includes('laptop') || catLower.includes('computer');
  const isFashion = catLower.includes('fashion') || catLower.includes('cloth');
  const isPet = catLower.includes('pet');
  const isService = catLower.includes('service');
  const needsCondition = isMobile || isLaptop || catLower.includes('electro') || catLower.includes('furnitur') || isFashion;
  const isHiring = isJob && jobListingType === 'Hiring (Job Vacancy)';
  const isJobSeeker = isJob && jobListingType === 'Looking for Job (Job Wanted)';

  // pick correct brand/model list for the current category
  const currentBrandList = isMobile ? mobileBrandList
    : isLaptop ? laptopBrandList
    : isCar ? carBrandList
    : isBike ? bikeBrandList
    : [];

  const currentModelMap = isMobile ? mobileModels
    : isLaptop ? laptopModels
    : isCar ? carModels
    : isBike ? bikeModels
    : {};

  const currentModelOptions = brand ? (currentModelMap[brand] || ['Others']) : [];

  // Category-specific placeholder text for the Item Title field
  const titlePlaceholder = isMobile ? 'e.g., iPhone 15 Pro / Samsung Galaxy S24'
    : isLaptop ? 'e.g., Dell Inspiron 15 / MacBook Air M2'
    : isCar ? 'e.g., Honda City VX / Maruti Swift ZXI'
    : isBike ? 'e.g., Royal Enfield Classic 350 / Pulsar NS200'
    : isProperty ? 'e.g., 2 BHK Flat for Rent in Gachibowli'
    : isHiring ? 'e.g., Data Entry Executive / Delivery Boy Required'
    : isJobSeeker ? 'e.g., Experienced Data Entry Operator Available'
    : isJob ? 'e.g., Data Entry Executive Required / Available'
    : isFashion ? 'e.g., Men\'s Formal Shirt / Women\'s Kurti Set'
    : isPet ? 'e.g., Labrador Puppies for Sale'
    : isService ? 'e.g., Home AC Repair / Home Tuition Classes'
    : 'e.g., Sofa Set 3+2 / Study Table';

  const handleSubmit = async () => {
    if (!categoryName) {
      Alert.alert('Error', 'Please select a category first.');
      return;
    }
    if (!title || !priceOrSalary) {
      Alert.alert('Error', 'Please enter item title and price/salary');
      return;
    }
    if (isJob && !jobListingType) {
      Alert.alert('Error', 'Please select whether you are Hiring or Looking for a Job.');
      return;
    }
    if (isJobSeeker && !educationQualification) {
      Alert.alert('Error', 'Please select your Education Qualification.');
      return;
    }

    // Resolve "Others" selections to whatever the user manually typed
    const finalBrand = isOther(brand) ? (customValues.brand || '').trim() : brand;
    const finalModel = isOther(model) ? (customValues.model || '').trim() : model;
    const finalRam = isOther(ram) ? (customValues.ram || '').trim() : ram;
    const finalStorage = isOther(storage) ? (customValues.storage || '').trim() : storage;
    const finalSize = isOther(size) ? (customValues.size || '').trim() : size;
    const finalPetBreed = isOther(petBreed) ? (customValues.petBreed || '').trim() : petBreed;

    if ((isMobile || isCar || isBike || isLaptop) && isOther(brand) && !finalBrand) {
      Alert.alert('Error', 'Please type the Brand name.');
      return;
    }
    if ((isMobile || isCar || isBike || isLaptop) && isOther(model) && !finalModel) {
      Alert.alert('Error', 'Please type the Model name.');
      return;
    }

    const validImages = images.filter(img => img.trim() !== '');
    if (!isJob && !isService && validImages.length < 2) {
      Alert.alert('Error', 'Please provide at least 2 product images.');
      return;
    }

    setLoading(true);
    try {
      await addDocument('marketplaceListings', {
        category: categoryName,
        title,
        price: priceOrSalary,
        brand: finalBrand,
        model: finalModel,
        location,
        description,
        attributes: {
          ram: finalRam,
          storage: finalStorage,
          fuelType,
          transmission,
          owners,
          year,
          kms,
          listingType,
          bhk,
          area,
          furnishing,
          jobListingType,
          jobType,
          experience,
          educationQualification,
          minQualification,
          companyName,
          skills,
          preferredJobLocation,
          condition,
          size: finalSize,
          petBreed: finalPetBreed,
          petAge,
          serviceCategory,
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Post Ad{categoryName ? `: ${categoryName}` : ''}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Category *</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => openModal('category', MARKET_CATEGORIES.map((c: any) => c.name))}
        >
          <Text style={styles.dropdownButtonText}>{categoryName || 'Select Category'}</Text>
        </TouchableOpacity>

        {!categoryName ? (
          <Text style={styles.helperText}>Please select a category above to continue.</Text>
        ) : (
        <>
        <Text style={styles.label}>Item Title *</Text>
        <TextInput
          style={styles.input}
          placeholder={titlePlaceholder}
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        {/* Brand + dependent Model (Mobile / Laptop / Car / Bike) */}
        {(isMobile || isCar || isBike || isLaptop) && (
          <>
            <Text style={styles.label}>Brand *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('brand', currentBrandList)}>
              <Text style={styles.dropdownButtonText}>{brand || 'Select Brand'}</Text>
            </TouchableOpacity>
            {isOther(brand) && (
              <TextInput
                style={styles.input}
                placeholder="Type Brand name (not in the list)"
                placeholderTextColor="#888"
                value={customValues.brand || ''}
                onChangeText={(text) => setCustomValue('brand', text)}
              />
            )}

            <Text style={styles.label}>Model *</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, !brand && styles.disabledInput]}
              disabled={!brand}
              onPress={() => openModal('model', currentModelOptions)}
            >
              <Text style={styles.dropdownButtonText}>
                {model || (brand ? 'Select Model' : 'Select Brand First')}
              </Text>
            </TouchableOpacity>
            {isOther(model) && (
              <TextInput
                style={styles.input}
                placeholder="Type Model name (not in the list)"
                placeholderTextColor="#888"
                value={customValues.model || ''}
                onChangeText={(text) => setCustomValue('model', text)}
              />
            )}
          </>
        )}

        {/* Mobile Specific */}
        {isMobile && (
          <>
            <Text style={styles.label}>RAM *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('ram', ramOptions)}>
              <Text style={styles.dropdownButtonText}>{ram || 'Select RAM'}</Text>
            </TouchableOpacity>
            {isOther(ram) && (
              <TextInput
                style={styles.input}
                placeholder="Type RAM size (e.g., 3GB)"
                placeholderTextColor="#888"
                value={customValues.ram || ''}
                onChangeText={(text) => setCustomValue('ram', text)}
              />
            )}

            <Text style={styles.label}>Storage *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('storage', storageOptions)}>
              <Text style={styles.dropdownButtonText}>{storage || 'Select Storage'}</Text>
            </TouchableOpacity>
            {isOther(storage) && (
              <TextInput
                style={styles.input}
                placeholder="Type Storage size (e.g., 16GB)"
                placeholderTextColor="#888"
                value={customValues.storage || ''}
                onChangeText={(text) => setCustomValue('storage', text)}
              />
            )}
          </>
        )}

        {/* Cars & Bikes */}
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

            <Text style={styles.label}>Owners</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('owners', ownersOptions)}>
              <Text style={styles.dropdownButtonText}>{owners || 'Select Owners'}</Text>
            </TouchableOpacity>

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

        {/* Property */}
        {isProperty && (
          <>
            <Text style={styles.label}>Listing Type *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('listingType', listingTypeOptions)}>
              <Text style={styles.dropdownButtonText}>{listingType || 'Select Listing Type'}</Text>
            </TouchableOpacity>

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

        {/* Jobs */}
        {isJob && (
          <>
            <Text style={styles.label}>Job Listing Type *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('jobListingType', jobListingTypeOptions)}>
              <Text style={styles.dropdownButtonText}>{jobListingType || 'Are you Hiring or Looking for a Job?'}</Text>
            </TouchableOpacity>

            {/* ---------- Employer posting a vacancy ---------- */}
            {isHiring && (
              <>
                <Text style={styles.label}>Company / Business Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Sri Sai Traders"
                  placeholderTextColor="#888"
                  value={companyName}
                  onChangeText={setCompanyName}
                />

                <Text style={styles.label}>Job Type *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('jobType', jobTypeList)}>
                  <Text style={styles.dropdownButtonText}>{jobType || 'Select Job Type'}</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Experience Required</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('experience', experienceOptions)}>
                  <Text style={styles.dropdownButtonText}>{experience || 'Select Experience'}</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Minimum Qualification Required</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('minQualification', educationOptions)}>
                  <Text style={styles.dropdownButtonText}>{minQualification || 'Select Minimum Qualification'}</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ---------- Job seeker looking for work ---------- */}
            {isJobSeeker && (
              <>
                <Text style={styles.label}>Education Qualification *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('educationQualification', educationOptions)}>
                  <Text style={styles.dropdownButtonText}>{educationQualification || 'Select Education Qualification'}</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Skills / Specialization</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Tally, MS Excel, Typing 40wpm, Driving"
                  placeholderTextColor="#888"
                  value={skills}
                  onChangeText={setSkills}
                />

                <Text style={styles.label}>Job Type Preferred *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('jobType', jobTypeList)}>
                  <Text style={styles.dropdownButtonText}>{jobType || 'Select Job Type'}</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Experience</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('experience', experienceOptions)}>
                  <Text style={styles.dropdownButtonText}>{experience || 'Select Experience'}</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Preferred Job Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Guntur, Vijayawada, Any"
                  placeholderTextColor="#888"
                  value={preferredJobLocation}
                  onChangeText={setPreferredJobLocation}
                />
              </>
            )}
          </>
        )}

        {/* Fashion */}
        {isFashion && (
          <>
            <Text style={styles.label}>Size *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('size', sizeOptions)}>
              <Text style={styles.dropdownButtonText}>{size || 'Select Size'}</Text>
            </TouchableOpacity>
            {isOther(size) && (
              <TextInput
                style={styles.input}
                placeholder="Type Size (e.g., UK 9, 34 waist)"
                placeholderTextColor="#888"
                value={customValues.size || ''}
                onChangeText={(text) => setCustomValue('size', text)}
              />
            )}
          </>
        )}

        {/* Pets */}
        {isPet && (
          <>
            <Text style={styles.label}>Breed *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('petBreed', petBreedOptions)}>
              <Text style={styles.dropdownButtonText}>{petBreed || 'Select Breed'}</Text>
            </TouchableOpacity>
            {isOther(petBreed) && (
              <TextInput
                style={styles.input}
                placeholder="Type Breed name (not in the list)"
                placeholderTextColor="#888"
                value={customValues.petBreed || ''}
                onChangeText={(text) => setCustomValue('petBreed', text)}
              />
            )}

            <Text style={styles.label}>Age</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('petAge', petAgeOptions)}>
              <Text style={styles.dropdownButtonText}>{petAge || 'Select Age'}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Services */}
        {isService && (
          <>
            <Text style={styles.label}>Service Category *</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('serviceCategory', serviceCategoryOptions)}>
              <Text style={styles.dropdownButtonText}>{serviceCategory || 'Select Service Category'}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Experience</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('experience', experienceOptions)}>
              <Text style={styles.dropdownButtonText}>{experience || 'Select Experience'}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Condition (Mobile / Laptop / Electronics / Furniture / Fashion) */}
        {needsCondition && (
          <>
            <Text style={styles.label}>Condition</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('condition', conditionList)}>
              <Text style={styles.dropdownButtonText}>{condition || 'Select Condition'}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Price or Salary */}
        <Text style={styles.label}>
          {isJobSeeker ? 'Expected Salary (₹) *' : isJob ? 'Salary / Pay Range (₹) *' : 'Price (₹) *'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={isJob ? 'e.g., 15,000 - 25,000 / month' : 'e.g., 25000'}
          placeholderTextColor="#888"
          keyboardType={isJob ? 'default' : 'numeric'}
          value={priceOrSalary}
          onChangeText={setPriceOrSalary}
        />

        <Text style={styles.label}>Pickup Location (Auto-detected)</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={location}
          editable={false}
        />

        {/* Images (Not strictly required for Jobs/Services) */}
        {!isJob && !isService && (
          <>
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
          </>
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
        </>
        )}
      </View>

      {/* Floating Modal */}
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
  helperText: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 8, fontStyle: 'italic' },
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
