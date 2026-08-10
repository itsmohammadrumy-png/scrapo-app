import React, { useState, useCallback } from 'react';
import { getUserRatings } from '../services/ratingService';
import { getReferralCode } from '../services/userService';
import { getGreenCoins } from '../services/userService';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert,
  StatusBar, Modal, TextInput, Image, ScrollView, Share,
} from 'react-native';
import { collection, query, where, getDocs, deleteDoc, doc } from '@react-native-firebase/firestore';
import { updateProfile, signOut } from '@react-native-firebase/auth';
import { db, auth } from '../config/firebase';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ navigation }: any) {
  const [userListings, setUserListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [updating, setUpdating] = useState(false);

  const [greenCoins, setGreenCoins] = useState(0);
  const [rating, setRating] = useState({ average: 0, total: 0 });
  const currentUser = auth.currentUser;

  const fetchUserDataAndListings = async () => {
    if (!currentUser) return;
    try {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');

      const marketQ = query(collection(db, "marketplaceListings"), where("sellerId", "==", currentUser.uid));
      const marketSnap = await getDocs(marketQ);
      const marketListings = marketSnap.docs.map((d) => ({ id: d.id, listingType: "marketplace", ...d.data() }));

      const scrapQ = query(collection(db, "scrapListings"), where("sellerId", "==", currentUser.uid));
      const scrapSnap = await getDocs(scrapQ);
      const scrapListingsData = scrapSnap.docs.map((d) => ({ id: d.id, listingType: "scrap", ...d.data() }));

      setUserListings([...marketListings, ...scrapListingsData]);

      if (currentUser) {
        const userRating = await getUserRatings(currentUser.uid);
        setRating(userRating);

      const coins = await getGreenCoins(currentUser.uid);
      setGreenCoins(coins);
      }
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

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    try {
      setUpdating(true);
      await updateProfile(currentUser, { displayName, photoURL });
      Alert.alert('Success', 'ప్రొఫైల్ విజయవంతంగా అప్‌డేట్ చేయబడింది!');
      setIsEditModalVisible(false);
      fetchUserDataAndListings();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'ప్రొఫైల్ అప్‌డేట్ చేయడంలో సమస్య వచ్చింది.');
    } finally {
      setUpdating(false);
    }
  };

  const handleReferralShare = async () => {
    try {
      await Share.share({
        message: `🌿 Scrapo యాప్‌లో జాయిన్ అవ్వండి మరియు గ్రీన్ కాయిన్స్ సంపాదించండి! నా రెఫరల్ కోడ్ ద్వారా సైన్ అప్ చేయండి: ${getReferralCode(currentUser?.uid || "")}`,
      });
    } catch (error) {
      console.error('Error sharing referral:', error);
    }
  };

  const handleDeleteListing = async (listingId: string, listingType: string) => {
    Alert.alert('Delete Listing', 'మీరు నిజంగా ఈ యాడ్‌ని డిలీట్ చేయాలనుకుంటున్నారా?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const coll = listingType === 'scrap' ? 'scrapListings' : 'marketplaceListings';
            await deleteDoc(doc(db, coll, listingId));
            setUserListings((prev) => prev.filter((item) => item.id !== listingId));
            Alert.alert('Success', 'యాడ్ విజయవంతంగా డిలీట్ చేయబడింది.');
          } catch (error) {
            console.error('Error deleting listing: ', error);
            Alert.alert('Error', 'యాడ్ డిలీట్ చేయడంలో సమస్య వచ్చింది.');
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'మీరు నిజంగా లాగౌట్ అవ్వాలనుకుంటున్నారా?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.topNav}>
        <Text style={styles.profileHeaderTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.headerCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarContainer}>
              {currentUser?.photoURL ? (
                <Image source={{ uri: currentUser.photoURL }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : (currentUser?.email ? currentUser.email[0].toUpperCase() : 'U')}
                  </Text>
                </View>
              )}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={12} color="#fff" />
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>{currentUser?.displayName || 'Scrapo User'}</Text>
              <Text style={styles.userPhone}>{currentUser?.phoneNumber || '+91 98765 43210'}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{currentUser?.email || ''}</Text>
              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={14} color="#2e7d32" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editProfileBtn} onPress={() => setIsEditModalVisible(true)}>
              <Ionicons name="create-outline" size={14} color="#2e7d32" style={{ marginRight: 4 }} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="document-text-outline" size={18} color="#2e7d32" />
              <Text style={styles.statNumber}>{userListings.length}</Text>
              <Text style={styles.statLabel}>Total Ads</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="star" size={18} color="#fbc02d" />
              <Text style={styles.statNumber}>{rating.average || "New"}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="leaf-outline" size={18} color="#2e7d32" />
              <Text style={styles.statNumber}>{greenCoins}</Text>
              <Text style={styles.statLabel}>Green Coins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#1565c0" />
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </View>

        <View style={styles.coinCard}>
          <View style={styles.coinInfo}>
            <Text style={styles.coinTitle}>My Green Coins</Text>
            <Text style={styles.coinCount}>{greenCoins} Coins Available</Text>
            <Text style={styles.coinSubText}>Earn coins and get exciting rewards</Text>
          </View>
          <TouchableOpacity style={styles.referBtn} onPress={handleReferralShare}>
            <Ionicons name="gift-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.referBtnText}>Refer & Earn</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.supportCard}>
          <View>
            <Text style={styles.supportTitle}>Help & Support</Text>
            <Text style={styles.supportSubText}>సహాయం కావాలా? మమ్మల్ని సంప్రదించండి.</Text>
            <Text style={styles.supportEmail}>support@scrapo.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#666" />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Posted Ads</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View All →</Text></TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 20 }} />
        ) : userListings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.plusCircle}><Ionicons name="add" size={24} color="#2e7d32" /></View>
            <Text style={styles.noDataText}>You haven't posted any ads yet.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Sell')} style={styles.postFirstAdBtn}>
              <Text style={styles.postFirstAdText}>Post Your First Ad</Text>
            </TouchableOpacity>
          </View>
        ) : (
          userListings.map((item) => (
            <View key={item.id} style={styles.listingCard}>
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle} numberOfLines={1}>{item.listingType === 'scrap' ? item.category : item.title}</Text>
                <Text style={styles.listingPrice}>{item.listingType === 'scrap' ? `${item.weightKg} KG` : `₹ ${item.price || item.expectedSalary || 'N/A'}`}</Text>
                <View style={styles.badgeContainer}>
                  <Text style={styles.listingCategory}>{item.category}</Text>
                  <Text style={styles.listingDate}>
                    {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteListing(item.id, item.listingType)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.sectionTitleAccount}>Account</Text>
        <View style={styles.accountCard}>
          <TouchableOpacity style={styles.accountItem} onPress={() => setIsEditModalVisible(true)}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="person-outline" size={18} color="#2e7d32" />
              <Text style={styles.accountItemText}>Personal Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem} onPress={() => navigation.navigate('SavedAddresses')}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="location-outline" size={18} color="#2e7d32" />
              <Text style={styles.accountItemText}>Saved Addresses</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem} onPress={() => navigation.navigate('MyBookings')}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="receipt-outline" size={18} color="#2e7d32" />
              <Text style={styles.accountItemText}>My Bookings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem} onPress={() => navigation.navigate('MyFavorites')}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="heart-outline" size={18} color="#2e7d32" />
              <Text style={styles.accountItemText}>My Favorites</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.accountItem, { borderBottomWidth: 0 }]}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="notifications-outline" size={18} color="#2e7d32" />
              <Text style={styles.accountItemText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#aaa" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#c62828" style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={isEditModalVisible} animationType="slide" transparent onRequestClose={() => setIsEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput style={styles.input} placeholder="మీ పేరు ఎంటర్ చేయండి" value={displayName} onChangeText={setDisplayName} />
            <Text style={styles.inputLabel}>Profile Picture URL</Text>
            <TextInput style={styles.input} placeholder="ఫొటో లింక్ (URL) ఇవ్వండి" value={photoURL} onChangeText={setPhotoURL} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleUpdateProfile} disabled={updating}>
                {updating ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 16 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 40, paddingBottom: 10 },
  profileHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  headerCard: { backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  profileTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2e7d32', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 60, height: 60, borderRadius: 30 },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2e7d32', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  userPhone: { fontSize: 12, color: '#555', marginTop: 2 },
  userEmail: { fontSize: 12, color: '#666', marginTop: 1 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  verifiedText: { fontSize: 11, color: '#2e7d32', fontWeight: 'bold', marginLeft: 3 },
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f5e9', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: '#c8e6c9' },
  editProfileText: { color: '#2e7d32', fontWeight: 'bold', fontSize: 11 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f9f9f9', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderColor: '#eee' },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#ddd', height: '80%', alignSelf: 'center' },
  statNumber: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 2 },
  statLabel: { fontSize: 10, color: '#666', marginTop: 1 },
  coinCard: { flexDirection: 'row', backgroundColor: '#e8f5e9', padding: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderWidth: 1, borderColor: '#c8e6c9' },
  coinInfo: { flex: 1 },
  coinTitle: { fontSize: 14, fontWeight: 'bold', color: '#2e7d32' },
  coinCount: { fontSize: 16, fontWeight: 'bold', color: '#1b5e20', marginTop: 2 },
  coinSubText: { fontSize: 11, color: '#555', marginTop: 2 },
  referBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e7d32', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  referBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  supportCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 15, alignItems: 'center', justifyContent: 'space-between', elevation: 1, borderWidth: 1, borderColor: '#eee' },
  supportTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  supportSubText: { fontSize: 12, color: '#666', marginTop: 2 },
  supportEmail: { fontSize: 11, color: '#2e7d32', fontWeight: '600', marginTop: 2 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sectionTitleAccount: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 10 },
  viewAllText: { fontSize: 13, color: '#2e7d32', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 24, borderWidth: 1, borderColor: '#e0e0e0', borderStyle: 'dashed', marginBottom: 15 },
  plusCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  noDataText: { fontSize: 13, color: '#666', marginBottom: 12 },
  postFirstAdBtn: { backgroundColor: '#2e7d32', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  postFirstAdText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  accountCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#eee', overflow: 'hidden', marginBottom: 15 },
  accountItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  accountItemLeft: { flexDirection: 'row', alignItems: 'center' },
  accountItemText: { fontSize: 14, color: '#333', marginLeft: 12, fontWeight: '500' },
  logoutButton: { flexDirection: 'row', backgroundColor: '#fff', padding: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ffcdd2' },
  logoutText: { color: '#c62828', fontWeight: 'bold', fontSize: 14 },
  listingCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  listingInfo: { flex: 1, marginRight: 10 },
  listingTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  listingPrice: { fontSize: 14, color: '#2e7d32', fontWeight: 'bold', marginTop: 3 },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  listingCategory: { fontSize: 11, color: '#666', backgroundColor: '#f1f3f5', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, overflow: 'hidden' },
  listingDate: { fontSize: 11, color: '#999', marginLeft: 8 },
  deleteButton: { backgroundColor: '#ffebee', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  deleteButtonText: { color: '#c62828', fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', width: '100%', borderRadius: 14, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  inputLabel: { fontSize: 13, color: '#555', marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 15, backgroundColor: '#f9f9f9' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#f1f3f5', marginRight: 10 },
  cancelBtnText: { color: '#555', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#2e7d32' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
});
