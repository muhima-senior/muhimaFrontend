import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MyAddress = () => {
  const addresses = [
    { id: 1, address: '123 Main St, City, Country' },
    { id: 2, address: '456 Another St, City, Country' },
    { id: 3, address: '789 Third St, City, Country' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Addresses</Text>

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={24} color="#007bff" />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>

      {addresses.map((address) => (
        <View key={address.id} style={styles.addressItem}>
          <Text>{address.address}</Text>
          <TouchableOpacity>
            <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007bff',
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
});

export default MyAddress;
