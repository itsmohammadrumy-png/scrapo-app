import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { logoutUser } from '../services/authService';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
          <Ionicons name="chevron-forward" size={18} color="#
git add -A
git commit -m "Add SettingsScreen"
git push origin main
git push origin main
cat > src/screens/SettingsScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { logoutUser } from '../services/authService';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
          <Ionicons name="chevron-forward" size={18} color="#888" />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#d32f2f" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12 },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemText: { marginLeft: 12, fontSize: 16, color: '#333' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffebee', padding: 16, borderRadius: 8, marginTop: 20 },
  logoutText: { marginLeft: 12, fontSize: 16, color: '#d32f2f', fontWeight: 'bold' },
});
