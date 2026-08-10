import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { logoutUser } from '../services/authService';
import Ionicons from '@react-native-vector-icons/ionicons';

export default function SettingsScreen({ navigation }: any) {
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => await logoutUser() },
    ]);
  };

  const items = [
    { icon: 'language-outline', label: 'App Language' },
    { icon: 'notifications-outline', label: 'Notification Preferences' },
    { icon: 'shield-checkmark-outline', label: 'Privacy Policy' },
    { icon: 'document-text-outline', label: 'Terms & Conditions' },
    { icon: 'help-circle-outline', label: 'Help & Support' },
    { icon: 'information-circle-outline', label: 'About Scrapo' },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity key={item.label} style={styles.item}>
          <View style={styles.itemLeft}>
            <Ionicons name={item.icon} size={20} color="#2e7d32" />
            <Text style={styles.itemText}>{item.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#aaaaaa" />
        </TouchableOpacity>
      ))}

      <Text style={styles.version}>Scrapo v1.0.0</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, paddingTop: 20 },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 10,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemText: { fontSize: 14, color: '#333', marginLeft: 12, fontWeight: '500' },
  version: { textAlign: 'center', color: '#999', fontSize: 12, marginTop: 20, marginBottom: 12 },
  logoutBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ffcdd2', padding: 14, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#c62828', fontWeight: 'bold', fontSize: 14 },
});
