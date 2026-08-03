
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { MARKET_CATEGORIES } from '../constants/marketCategories';

export default function MarketplaceScreen({ navigation }: any) {
  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('AdPost', { categoryName: item.name })}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.subCount}>{item.subcategories.length} Subcategories</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Scrapo Marketplace</Text>
      <Text style={styles.subtitle}>Explore categories or post your ad</Text>

      <FlatList
        data={MARKET_CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
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
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 6,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 100,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 4,
  },
  subCount: {
    fontSize: 11,
    color: '#888',
  },
});

