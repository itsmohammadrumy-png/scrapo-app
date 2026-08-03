import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';

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

  const attrs = item.attributes || {};

  // ---------------------------------------------------------------------
  // CATEGORY DETECTION (mirrors AdPostScreen so the right fields show up)
  // ---------------------------------------------------------------------
  const catLower = (item.category || '').toLowerCase();
  const isMobile = catLower.includes('mobile');
  const isCar = catLower.includes('car');
  const isBike = catLower.includes('bike') || catLower.includes('motorcycle');
  const isProperty = catLower.includes('propert');
  const isJob = catLower.includes('job');
  const isLaptop = catLower.includes('laptop') || catLower.includes('computer');
  const isFashion = catLower.includes('fashion') || catLower.includes('cloth');
  const isPet = catLower.includes('pet');
  const isService = catLower.includes('service');

  const isHiring = attrs.jobListingType === 'Hiring (Job Vacancy)';
  const isJobSeeker = attrs.jobListingType === 'Looking for Job (Job Wanted)';

  // Build an ordered list of {label, value} rows relevant to this category.
  // Empty/undefined values are skipped automatically.
  const detailRows: { label: string; value: string }[] = [];
  const addRow = (label: string, value: any) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      detailRows.push({ label, value: String(value) });
    }
  };

  if (isMobile || isCar || isBike || isLaptop) {
    addRow('Brand', item.brand);
    addRow('Model', item.model);
  }
  if (isMobile) {
    addRow('RAM', attrs.ram);
    addRow('Storage', attrs.storage);
  }
  if (isCar) {
    addRow('Fuel Type', attrs.fuelType);
    addRow('Transmission', attrs.transmission);
  }
  if (isCar || isBike) {
    addRow('Owners', attrs.owners);
    addRow('Manufacturing Year', attrs.year);
    addRow('KMs Driven', attrs.kms);
  }
  if (isProperty) {
    addRow('Listing Type', attrs.listingType);
    addRow('BHK Type', attrs.bhk);
    addRow('Built-up Area', attrs.area ? `${attrs.area} sq.ft` : '');
    addRow('Furnishing', attrs.furnishing);
  }
  if (isJob) {
    if (isHiring) {
      addRow('Company / Business', attrs.companyName);
      addRow('Job Type', attrs.jobType);
      addRow('Experience Required', attrs.experience);
      addRow('Minimum Qualification', attrs.minQualification);
    } else if (isJobSeeker) {
      addRow('Education Qualification', attrs.educationQualification);
      addRow('Skills / Specialization', attrs.skills);
      addRow('Job Type Preferred', attrs.jobType);
      addRow('Experience', attrs.experience);
      addRow('Preferred Job Location', attrs.preferredJobLocation);
    }
  }
  if (isFashion) {
    addRow('Size', attrs.size);
  }
  if (isPet) {
    addRow('Breed', attrs.petBreed);
    addRow('Age', attrs.petAge);
  }
  if (isService) {
    addRow('Service Category', attrs.serviceCategory);
    addRow('Experience', attrs.experience);
  }
  // Condition applies across several categories
  addRow('Condition', attrs.condition);
  addRow('Location', item.location);

  const validImages: string[] = Array.isArray(item.images)
    ? item.images.filter((img: string) => typeof img === 'string' && img.trim() !== '')
    : [];

  // Only URLs (http/https) render as real images in this environment;
  // local placeholder strings like "gallery_selected_image.jpg" fall back
  // to the "No Image Available" placeholder instead of a broken image.
  const renderableImages = validImages.filter((img) => /^https?:\/\//i.test(img));

  return (
    <ScrollView style={styles.container}>
      {renderableImages.length > 0 ? (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {renderableImages.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} resizeMode="cover" />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image Available</Text>
        </View>
      )}

      <View style={styles.detailsContainer}>
        {isJob && attrs.jobListingType && (
          <View style={[styles.jobBadge, isHiring ? styles.hiringBadge : styles.seekerBadge]}>
            <Text style={[styles.jobBadgeText, !isHiring && styles.seekerBadgeText]}>
              {isHiring ? 'Hiring' : 'Job Wanted'}
            </Text>
          </View>
        )}

        <Text style={styles.title}>{item.title || item.category}</Text>
        {/* ?? instead of || so a price of 0 still shows "₹ 0" instead of "N/A" */}
        <Text style={styles.price}>
          ₹ {item.price ?? 'N/A'}{isJobSeeker ? ' (expected)' : ''}
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Category: {item.category}</Text>
        </View>

        {detailRows.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              {detailRows.map((row, index) => (
                <View key={index} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{row.label}</Text>
                  <Text style={styles.detailValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          </>
        )}

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
  image: {
    width: 400,
    height: 250,
    backgroundColor: '#e0e0e0',
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
  jobBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  hiringBadge: {
    backgroundColor: '#e8f5e9',
  },
  seekerBadge: {
    backgroundColor: '#e3f2fd',
  },
  jobBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  seekerBadgeText: {
    color: '#1565c0',
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
  detailsGrid: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 13,
    color: '#777',
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
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
