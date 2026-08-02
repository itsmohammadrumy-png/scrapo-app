import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile')}</Text>
      
      <View style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>SD</Text>
        </View>
        <Text style={styles.userName}>Good Deeds</Text>
        <Text style={styles.userLocation}>Guntur, Andhra Pradesh</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Language / భాష ఎంచుకోండి</Text>
        <View style={styles.langRow}>
          <TouchableOpacity style={styles.langBtn} onPress={() => changeLanguage('en')}>
            <Text style={styles.langText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langBtn} onPress={() => changeLanguage('te')}>
            <Text style={styles.langText}>తెలుగు</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langBtn} onPress={() => changeLanguage('hi')}>
            <Text style={styles.langText}>हिन्दी</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.logoutBtn}
        onPress={() => Alert.alert('Logout', 'Logged out successfully')}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarLargeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 12,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  langBtn: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  langText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#c62828',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

