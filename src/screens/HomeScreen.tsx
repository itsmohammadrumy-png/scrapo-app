import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getGreenCoins } from '../services/userService';
import { auth } from '../config/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreen({ navigation }: any) {
  const [greenCoins, setGreenCoins] = useState(0);
  const currentUser = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      if (currentUser?.uid) {
        getGreenCoins(currentUser.uid).then(setGreenCoins);
      }
    }, [currentUser])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'there'}!
        </Text>
        <Text style={styles.subtitle}>Recycle scrap easily & earn cash</Text>
      </View>

      <View style={styles.coinCard}>
        <Ionicons name="leaf" size={24} color="#fff" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.coinLabel}>Green Coins</Text>
          <Text style={styles.coinValue}>{greenCoins}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Sell')}>
        <View style={styles.cardIconCircle}>
          <Ionicons name="leaf-outline" size={26} color="#2e7d32" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Have Scrap to Sell?</Text>
          <Text style={styles.cardDesc}>Get the best prices for iron, plastic, paper and more.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Marketplace')}>
        <View style={styles.cardIconCircle}>
          <Ionicons name="cart-outline" size={26} color="#2e7d32" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Browse Marketplace</Text>
          <Text style={styles.cardDesc}>Mobiles, cars, furniture, jobs and more near you.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ScrapListings')}>
        <View style={styles.cardIconCircle}>
          <Ionicons name="cube-outline" size={26} color="#2e7d32" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Buy Scrap Nearby</Text>
          <Text style={styles.cardDesc}>Browse scrap listings posted by sellers near you.</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { marginTop: 20, marginBottom: 16 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  coinCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e7d32',
    borderRadius: 12, padding: 16, marginBottom: 16,
  },
  coinLabel: { color: '#e8f5e9', fontSize: 12 },
  coinValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
    padding: 16, marginBottom: 12, elevation: 2,
  },
  cardIconCircle: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#e8f5e9',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 12, color: '#666', marginTop: 4 },
});
