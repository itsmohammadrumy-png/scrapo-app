
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getDocuments } from '../services/firestoreService';
import { MARKET_CATEGORIES } from '../constants/marketCategories';

export default function MarketplaceScreen({ navigation }: any) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await getDocuments('marketplaceListings');
      setListings(data);
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => navigation.navigate('AdPost', { categoryName: item.name })}
    >
      <Text style={styles.categoryTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderListingItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.listingCard}
      onPress={() => navigation.navigate('AdDetail', { item })}
    >
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle}>{item.title || item.category}</Text>
        <Text style={styles.listingPrice}>₹ {item.price || 'N/A'}</Text>
        <Text style={styles.listingCategory} numberOfLines={1}>{item.description || 'No description'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Scrapo Marketplace</Text>
      <Text style={styles.subtitle}>Browse categories or buy/sell items</Text>

      <Text style={styles.sectionHeader}>Categories</Text>
      <FlatList
        data={MARKET_CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />

      <Text style={styles.sectionHeader}>Recent Ads</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 20 }} />
      ) : listings.length === 0 ? (
        <Text style={styles.noDataText}>No ads posted yet. Be the first to post!</Text>
      ) : (
        <FlatList
          data={listings}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 16,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2e7d32',
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
});

