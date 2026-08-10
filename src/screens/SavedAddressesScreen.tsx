import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSavedAddresses, addSavedAddress, removeSavedAddress } from '../services/userService';
import { auth } from '../config/firebase';
import Ionicons from '@react-native-vector-icons/ionicons';

export default function SavedAddressesScreen() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const currentUid = auth.currentUser?.uid;

  const fetchAddresses = async () => {
    if (!currentUid) return;
    setLoading(true);
    try {
      const data = await getSavedAddresses(currentUid);
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [currentUid])
  );

  const handleAdd = async () => {
    if (!newAddress.trim() || !currentUid) return;
    setAdding(true);
    try {
      const updated = await addSavedAddress(currentUid, newAddress.trim());
      setAddresses(updated);
      setNewAddress('');
    } catch (error) {
      Alert.alert('Error', 'Could not save address.');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!currentUid) return;
    try {
      const updated = await removeSavedAddress(currentUid, id);
      setAddresses(updated);
    } catch (error) {
      Alert.alert('Error', 'Could not remove address.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter new address"
          placeholderTextColor="#999"
          value={newAddress}
          onChangeText={setNewAddress}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} disabled={adding}>
          {adding ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="add" size={22} color="#fff" />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 30 }} />
      ) : addresses.length === 0 ? (
        <Text style={styles.emptyText}>No saved addresses yet.</Text>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.addressCard}>
              <Ionicons name="location-outline" size={18} color="#2e7d32" style={{ marginRight: 10 }} />
              <Text style={styles.addressText}>{item.text}</Text>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Ionicons name="trash-outline" size={18} color="#c62828" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  inputRow: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', padding: 12, marginRight: 8 },
  addBtn: { backgroundColor: '#2e7d32', width: 44, height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 30 },
  addressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10 },
  addressText: { flex: 1, fontSize: 14, color: '#333' },
});
