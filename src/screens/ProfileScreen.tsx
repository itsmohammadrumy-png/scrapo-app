import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  StatusBar,
  Modal,
  TextInput,
  Image,
  ScrollView,
  Share
} from 'react-native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }: any) {
  const [userListings, setUserListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ప్రొఫైల్ ఎడిటింగ్ స్టేట్స్
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [updating, setUpdating] = useState(false);

  // గ్రీన్ కాయిన్స్ & రెఫరల్ స్టేట్
  const [greenCoins, setGreenCoins] = useState(150);

  const currentUser = auth.currentUser;

  // యూజర్ వివరాలు మరియు యాడ్స్ ఫెచ్ చేయడం
  const fetchUserDataAndListings = async () => {
    if (!currentUser) return;
    try {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');

      const q = query(
        collection(db, 'marketplaceListings'),
        where('sellerId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      let listings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (listings.length === 0) {
        const qAlt = query(
          collection(db, 'marketplaceListings'),
          where('userId', '==', currentUser.uid)
        );
        const snapshotAlt = await getDocs(qAlt);
        listings = snapshotAlt.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      setUserListings(listings);
    } catch (error) {
      console.error('Error fetching user listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserDataAndListings();
    }, [currentUser])
  );

  // ప్రొఫైల్ అప్‌డేట్ చేయడానికి ఫంక్షన్
  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    try {
      setUpdating(true);
      await updateProfile(currentUser, {
        displayName: displayName,
        photoURL: photoURL
      });
      Alert.alert("Success", "ప్రొఫైల్ విజయవంతంగా అప్‌డేట్ చేయబడింది!");
      setIsEditModalVisible(false);
      fetchUserDataAndListings();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "ప్రొఫైల్ అప్‌డేట్ చేయడంలో సమస్య వచ్చింది.");
    } finally {
      setUpdating(false);
    }
  };

  // రెఫరల్ లింక్ షేర్ చేయడానికి ఫంక్షన్
  const handleReferralShare = async () => {
    try {
      await Share.share({
        message: `🌿 Scrapo యాప్‌లో జాయిన్ అవ్వండి మరియు గ్రీన్ కాయిన్స్ సంపాదించండి! నా రెఫరల్ కోడ్ ద్వారా సైన్ అప్ చేయండి: SCRAPO123`,
      });
    } catch (error) {
      console.error('Error sharing referral:', error);
    }
  };

  // యాడ్‌ని డిలీట్ చేయడానికి ఫంక్షన్
  const handleDeleteListing = async (listingId: string) => {
    Alert.alert(
      "Delete Listing",
      "మీరు నిజంగా ఈ యాడ్‌ని డిలీట్ చేయాలనుకుంటున్నారా?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'marketplaceListings', listingId));
              setUserListings(prev => prev.filter(item => item.id !== listingId));
              Alert.alert("Success", "యాడ్ విజయవంతంగా డిలీట్ చేయబడింది.");
            } catch (error) {
              console.error("Error deleting listing: ", error);
              Alert.alert("Error", "యాడ్ డిలీట్ చేయడంలో సమస్య వచ్చింది.");
            }
          }
        }
      ]
    );
  };

  // లాగౌట్ హ్యాండ్లర్
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "మీరు నిజంగా లాగౌట్ అవ్వాలనుకుంటున్నారా?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.listingCard}>
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listingPrice}>₹ {item.price || item.expectedSalary || 'N/A'}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.listingCategory}>{item.category}</Text>
          <Text style={styles.listingDate}>
            {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDeleteListing(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2e7d32" barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* ప్రొఫైల్ హెడర్ కార్డ్ */}
        <View style={styles.headerCard}>
          {currentUser?.photoURL ? (
            <Image source={{ uri: currentUser.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : (currentUser?.email ? currentUser.email[0].toUpperCase() : 'U')}
              </Text>
            </View>
          )}
          
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {currentUser?.displayName || 'Scrapo User'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>{currentUser?.email || ''}</Text>
            
            <View style={styles.statsBadge}>
              <Text style={styles.statsText}>Total Ads: {userListings.length}</Text>
            </View>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🌿 Green Coins Wallet & Referral Banner */}
        <View style={styles.coinCard}>
          <View style={styles.coinInfo}>
            <Text style={styles.coinTitle}>🌿 My Green Coins</Text>
            <Text style={styles.coinCount}>{greenCoins} Coins Available</Text>
          </View>
          <TouchableOpacity style={styles.referBtn} onPress={handleReferralShare}>
            <Text style={styles.referBtnText}>Refer & Earn</Text>
          </TouchableOpacity>
        </View>

        {/* సహాయం & సపోర్ట్ సెక్షన్ */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>💡 Help & Support</Text>
          <Text style={styles.supportText}>
            స్నేహితులకు రెఫర్ చేయడం ద్వారా గ్రీన్ కాయిన్స్ పొందండి. సందేహాల కోసం support@scrapoapp.com ని సంప్రదించండి.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>My Posted Ads</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 20 }} />
        ) : userListings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.noDataText}>మీరు ఇంకా ఎలాంటి యాడ్స్ పోస్ట్ చేయలేదు.</Text>
          </View>
        ) : (
          <FlatList
            data={userListings}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* ప్రొఫైల్ ఎడిట్ మోడల్ */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="మీ పేరు ఎంటర్ చేయండి"
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Text style={styles.inputLabel}>Profile Picture URL</Text>
            <TextInput
              style={styles.input}
              placeholder="ఫొటో లింక్ (URL) ఇవ్వండి"
              value={photoURL}
              onChangeText={setPhotoURL}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]} 
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.saveBtn]} 
                onPress={handleUpdateProfile}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, paddingTop: 30 },
  headerCard: {
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 14, 
    borderRadius: 12,
    alignItems: 'center', 
    marginBottom: 15, 
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4,
  },
  avatar: {
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#2e7d32',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userInfo: { flex: 1, marginRight: 5 },
  userName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 11, color: '#666', marginTop: 1 },
  statsBadge: { 
    marginTop: 4, 
    backgroundColor: '#e8f5e9', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  statsText: { fontSize: 10, color: '#2e7d32', fontWeight: 'bold' },
  headerButtons: { justifyContent: 'space-between', height: 60 },
  editButton: { 
    backgroundColor: '#e3f2fd', 
    paddingVertical: 4, 
    paddingHorizontal: 10, 
    borderRadius: 5,
    alignItems: 'center'
  },
  editText: { color: '#1565c0', fontWeight: 'bold', fontSize: 11 },
  logoutButton: { 
    backgroundColor: '#ffebee', 
    paddingVertical: 4, 
    paddingHorizontal: 10, 
    borderRadius: 5,
    alignItems: 'center'
  },
  logoutText: { color: '#c62828', fontWeight: 'bold', fontSize: 11 },
  coinCard: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9'
  },
  coinInfo: { flex: 1 },
  coinTitle: { fontSize: 14, fontWeight: 'bold', color: '#2e7d32' },
  coinCount: { fontSize: 16, fontWeight: 'bold', color: '#1b5e20', marginTop: 2 },
  referBtn: {
    backgroundColor: '#2e7d32',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  referBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  supportCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  supportTitle: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  supportText: { fontSize: 11, color: '#666', lineHeight: 16 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  listingCard: {
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 14, 
    borderRadius: 10,
    alignItems: 'center', 
    marginBottom: 10, 
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 2,
  },
  listingInfo: { flex: 1, marginRight: 10 },
  listingTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  listingPrice: { fontSize: 14, color: '#2e7d32', fontWeight: 'bold', marginTop: 3 },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  listingCategory: { fontSize: 11, color: '#666', backgroundColor: '#f1f3f5', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, overflow: 'hidden' },
  listingDate: { fontSize: 11, color: '#999', marginLeft: 8 },
  deleteButton: { 
    backgroundColor: '#ffebee', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 6 
  },
  deleteButtonText: { color: '#c62828', fontSize: 12, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  noDataText: { fontSize: 14, color: '#666', textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 12,
    padding: 20,
    elevation: 5
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  inputLabel: { fontSize: 13, color: '#555', marginBottom: 5, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#f1f3f5', marginRight: 10 },
  cancelBtnText: { color: '#555', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#2e7d32' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' }
});
