import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export default function SellSheet({ visible, onClose, onSelectOption }: any) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <Text style={styles.title}>What would you like to do?</Text>

          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => { onClose(); onSelectOption('SellScrap'); }}
          >
            <Text style={styles.optionText}>♻ Sell Scrap (Iron, Plastic, Paper, etc.)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => { onClose(); onSelectOption('SellMarketplace'); }}
          >
            <Text style={styles.optionText}>📦 Sell Used Item (Marketplace)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  optionText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

