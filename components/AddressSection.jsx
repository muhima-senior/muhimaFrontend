import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const AddressSection = ({ onSaveAddress }) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  console.log('onSaveAddress prop:', onSaveAddress);

  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      const fetchedAddress = `Lat: ${location.coords.latitude}, Long: ${location.coords.longitude}`;
      setManualAddress(fetchedAddress);
      Alert.alert('Location Retrieved', 'Your current location has been fetched successfully!');
      onSaveAddress(fetchedAddress); // Save the fetched address
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve your location.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleManualAddressChange = (text) => {
    setManualAddress(text);
    if (onSaveAddress) {
      onSaveAddress(text);
    } else {
      console.error('onSaveAddress is not defined!');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Address</Text>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleUseCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="location-outline" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        value={manualAddress}
        onChangeText={handleManualAddressChange}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  iconButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
});

export default AddressSection;
