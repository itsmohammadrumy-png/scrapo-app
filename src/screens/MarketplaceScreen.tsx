import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDocuments } from '../services/firestoreService';
import { MARKET_CATEGORIES } from '../constants/marketCategories';

export default function MarketplaceScreen({ navigation }: any) {
  const [listings, setListings] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Initial load
  useEffect(() => {
    fetchListings();
  }, []);

  // Refetch every time this screen comes back into focus
  // (e.g. after posting a new ad and navigating back)
  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [])
  );

  // Filtered list is derived from listings + selectedCategory,
  // so it can never get out of sync with the source data.
  const filteredListings = useMemo(() => {
    if (!selectedCategory) return listings;
    return listings.filter(
      (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [listings, selectedCategory]);

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  const handlePostAdPress = () => {
    // If the user has already picked a category on this screen, carry it
    // over to the Post Ad form. Otherwise don't force a category — let the
    // AdPost screen show its own category selector.
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

  const renderListingItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => navigation.navigate('AdDetail', { item })}
    >
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle}>{item.title || item.category}</Text>
        {/* ?? instead of || so a price of 0 still shows "₹ 0" instead of "N/A" */}
        <Text style={styles.listingPrice}>₹ {item.price ?? 'N/A'}</Text>
        <Text style={styles.listingCategory} numberOfLines={1}>
          {item.description || 'No description'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Scrapo Marketplace</Text>
          <Text style={styles.subtitle}>Browse items or filter by category</Text>
        </View>
        <TouchableOpacity style={styles.postAdButton} onPress={handlePostAdPress}>
          <Text style={styles.postAdButtonText}>+ Post Ad</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>
        Categories {selectedCategory ? `(Filtered: ${selectedCategory})` : ''}
      </Text>

      <FlatList
        data={MARKET_CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />

      <Text style={styles.sectionHeader}>
        {selectedCategory ? `${selectedCategory} Ads` : 'Recent Ads'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 20 }} />
      ) : error ? (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={styles.noDataText}>Couldn't load ads. Please try again.</Text>
          <TouchableOpacity onPress={fetchListings} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredListings.length === 0 ? (
        <Text style={styles.noDataText}>
          {selectedCategory ? `No ads found in ${selectedCategory}.` : 'No ads posted yet. Be the first to post!'}
        </Text>
      ) : (
        <FlatList
          data={filteredListings}
          renderItem={renderListingItem}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.verticalList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  postAdButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 2,
  },
  postAdButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 12,
    marginBottom: 8,
  },
  horizontalList: {
    paddingVertical: 4,
  },
  categoryCard: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  selectedCategoryCard: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  selectedCategoryTitle: {
    color: '#fff',
  },
  verticalList: {
    paddingBottom: 20,
  },
  listingCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  listingCategory: {
    fontSize: 12,
    color: '#777',
  },
  noDataText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontSize: 14,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#2e7d32',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
