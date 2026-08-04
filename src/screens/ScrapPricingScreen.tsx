import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const scrapItems = [
  { id: '1', name: 'Newspaper (పాత పేపర్లు)', price: '₹14 / kg', icon: '📰' },
  { id: '2', name: 'Iron & Steel (ఇనుము)', price: '₹28 / kg', icon: '🔩' },
  { id: '3', name: 'Plastic (ప్లాస్టిక్)', price: '₹12 / kg', icon: '🧴' },
  { id: '4', name: 'Cardboard / Books (అట్టలు / పుస్తకాలు)', price: '₹10 / kg', icon: '📦' },
  { id: '5', name: 'Copper (రాగి)', price: '₹420 / kg', icon: '⚡' },
  { id: '6', name: 'Brass (పీత్తడి)', price: '₹310 / kg', icon: '🪙' },
];

export default function ScrapPricingScreen({ navigation }: any) {
  const renderItem = ({ item }: { item: any }) => (
    <View style={style.card}>
      <Text style={style.icon}>{item.icon}</Text>
      <View style={style.info}>
        <Text style={style.name}>{item.name}</Text>
        <Text style={style.price}>{item.price}</Text>
      </View>
      <TouchableOpacity 
        style={style.sellBtn}
        onPress={() => navigation.navigate('PickupRequest', { selectedCategory: item.name })}
      >
        <Text style={style.sellText}>Sell</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={style.container}>
      <Text style={style.headerTitle}>Scrap Price List</Text>
      <Text style={style.subtitle}>Check current market rates and sell your scrap</Text>
      
      <FlatList
        data={scrapItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={style.listContainer}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  listContainer: { paddingBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, elevation: 2 },
  icon: { fontSize: 28, marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 14, color: '#2e7d32', fontWeight: 'bold', marginTop: 4 },
  sellBtn: { backgroundColor: '#2e7d32', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  sellText: { color: '#fff', fontWeight: 'bold' }
});
