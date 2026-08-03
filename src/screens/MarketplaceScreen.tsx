import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDocuments } from '../services/firestoreService';
import { MARKET_CATEGORIES } from '../constants/marketCategories';

export default function MarketplaceScreen({ navigation }: any) {
  const [listings, setListings] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getDocuments('marketplaceListings');
      setListings(data);
    } catch (err) {
      console.error('Error fetching marketplace listings:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [])
  );

  // కేటగిరీ మరియు సెర్చ్ క్వెరీ ఆధారంగా ఫిల్టర్ చేయడం
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesCategory = !selectedCategory || item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [listings, selectedCategory, searchQuery]);

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  const handlePostAdPress = () => {
    if (selectedCategory) {
      navigation.navigate('AdPost', { categoryName: selectedCategory });
    } else {
      navigation.navigate('AdPost');
    }
  };

  const renderCategoryItem = ({ item }: any) => {
    const isSelected = selectedCategory === item.name;
    return (
      <TouchableOpacity
        style={[styles.categoryCard, isSelected && styles.selectedCategoryCard]}
        onPress={() => handleCategoryPress(item.name)}
      >
        <Text style={[styles.categoryTitle, isSelected && styles.selectedCategoryTitle]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderListingItem = ({ item }: any) => {
    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;

    return (
      <TouchableOpacity
        style={styles.gridCard}
        onPress={() => navigation.navigate('AdDetail', { item })}
        activeOpacity={0.8}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.noImageView]}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardPrice}>₹ {item.price ?? 'N/A'}</Text>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title || item.category}</Text>
          <Text style={styles.cardLocation} numberOfLines={1}>📍 {item.location || 'Guntur'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* టాప్ హెడర్ & పోస్ట్ యాడ్ బటన్ */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Scrapo Marketplace</Text>
          <Text style={styles.subtitle}>మీకు నచ్చినవి కొనండి & అమ్మండి</Text>
        </View>
        <TouchableOpacity style={styles.postAdButton} onPress={handlePostAdPress}>
          <Text style={styles.postAdButtonText}>+ Sell</Text>
        </TouchableOpacity>
      </View>

      {/* సెర్చ్ బార్ */}
      <TextInput
        style={styles.searchInput}
        placeholder="ప్రొడక్ట్ లేదా లొకేషన్ వెతకండి..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* కేటగిరీస్ లిస్ట్ */}
      <FlatList
        data={MARKET_CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />

      <Text style={styles.sectionHeader}>
        {selectedCategory ? `${selectedCategory} ప్రొడక్ట్స్` : 'అన్ని ప్రకటనలు (Recent Ads)'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>డేటా లోడ్ అవ్వడంలో సమస్య వచ్చింది.</Text>
          <TouchableOpacity onPress={fetchListings} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>మళ్ళీ ప్రయత్నించు</Text>
          </TouchableOpacity>
        </View>
      ) : filteredListings.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.noDataText}>ఎలాంటి ప్రకటనలు దొరకలేదు.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          renderItem={renderListingItem}
          keyExtractor={(item, index) => item.id || index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.rowWrapper}
          contentContainerStyle={styles.verticalList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 12,
    paddingTop: 35,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  postAdButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
  },
  postAdButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 42,
    fontSize: 14,
    marginBottom: 12,
    elevation: 1,
  },
  horizontalList: {
    paddingVertical: 4,
    marginBottom: 10,
  },
  categoryCard: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
  },
  selectedCategoryCard: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  selectedCategoryTitle: {
    color: '#fff',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  verticalList: {
    paddingBottom: 20,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '48%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  noImageView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 11,
    color: '#999',
  },
  cardContent: {
    padding: 10,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 11,
    color: '#777',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyEmoji: {
    fontSize: 35,
    marginBottom: 8,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 13,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#2e7d32',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
