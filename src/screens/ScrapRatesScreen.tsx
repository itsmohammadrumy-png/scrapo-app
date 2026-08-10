import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getScrapRates } from '../services/ratesService';

export default function ScrapRatesScreen() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getScrapRates()
        .then(setRates)
        .finally(() => setLoading(false));
    }, [])
  );

  const maxRate = rates.length > 0 ? Math.max(...rates.map((r) => r.ratePerKg || 0)) : 1;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Today's Scrap Rates</Text>
      <Text style={styles.subHeader}>Prices per KG (updated by admin)</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 30 }} />
      ) : rates.length === 0 ? (
        <Text style={styles.emptyText}>Rates not available yet. Check back soon.</Text>
      ) : (
        rates.map((item) => {
          const barWidth = maxRate > 0 ? (item.ratePerKg / maxRate) * 100 : 0;
          return (
            <View key={item.id} style={styles.row}>
              <View style={styles.labelRow}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.price}>₹{item.ratePerKg}/kg</Text>
              </View>
              <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${barWidth}%` }]} />
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 10 },
  subHeader: { fontSize: 12, color: '#888', marginBottom: 20 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 30 },
  row: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  category: { fontSize: 14, fontWeight: '600', color: '#333' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#2e7d32' },
  barBackground: { height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: 10, backgroundColor: '#2e7d32', borderRadius: 5 },
});
