import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from '../components/Icon';
import { SCRAP_CATEGORIES } from '../constants/scrapCategories';

export default function SellScrapScreen({ navigation }: any) {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ScrapUpload', { categoryName: item.name })}
    >
      <View style={styles.iconCircle}>
        <Icon name={item.icon} size={28} color="#2e7d32" />
      </View>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSub} numberOfLines={2}>
        {item.subcategories[0]}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>♻ Sell Scrap</Text>
      <Text style={styles.subheader}>Select a category to continue</Text>

      <FlatList
        data={SCRAP_CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16, paddingTop: 40 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subheader: { fontSize: 13, color: '#666', marginBottom: 16 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, width: '48%',
    alignItems: 'center', elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.08, shadowRadius: 3,
  },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#e8f5e9',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  cardSub: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 4 },
});
