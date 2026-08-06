import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { addRating } from '../services/ratingService';
import { auth } from '../config/firebase';

export default function RatingModal({ visible, onClose, ratedUserId, listingId }: any) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (stars === 0) {
      Alert.alert('Error', 'Please select a star rating.');
      return;
    }
    setSubmitting(true);
    try {
      await addRating(ratedUserId, auth.currentUser?.uid || '', stars, comment, listingId);
      Alert.alert('Thank you!', 'Your rating has been submitted.');
      setStars(0);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Rating error:', error);
      Alert.alert('Error', 'Could not submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Rate this User</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setStars(i)}>
                <Text style={[styles.star, i <= stars && styles.starActive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Add a comment (optional)"
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
              <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '100%' },
  title: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 14, textAlign: 'center' },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16, gap: 8 },
  star: { fontSize: 32, color: '#ddd' },
  starActive: { color: '#fbc02d' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, minHeight: 60, textAlignVertical: 'top', marginBottom: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { flex: 1, padding: 12, backgroundColor: '#f1f3f5', borderRadius: 8, marginRight: 8, alignItems: 'center' },
  cancelText: { color: '#555', fontWeight: 'bold' },
  submitBtn: { flex: 1, padding: 12, backgroundColor: '#2e7d32', borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold' },
});
