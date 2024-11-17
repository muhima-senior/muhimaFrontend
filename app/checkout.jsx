import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGlobalStore } from './store/GlobalStore';
import axios from 'axios';
import BookingConfirmation from '../components/BookingConfirmation';

// Load the API URL from the environment variables
const apiUrl = process.env.REACT_APP_API_URL_NEW;

const Checkout = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, setUserId } = useGlobalStore();
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  const { serviceId, total, selectedSlots, quantity } = route.params;

  const handleCreateAppointment = async () => {
    try {
      const appointmentData = {
        gigId: serviceId,
        userId: userId,
        appointmentDates: selectedSlots,
        quantity: quantity,
        total: total
      };

      const response = await axios.post(`${apiUrl}/api/appointment/create`, appointmentData);

      setShowBookingConfirmation(true);
      console.log(response.data); // You can handle the response as needed
    } catch (error) {
      console.error("Error creating appointment:", error);
      Alert.alert("Error", "Could not create appointment. Please try again.");
    }
  };

  const handleDone = () => {
    setShowBookingConfirmation(false);
    navigation.navigate('home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      <Text style={styles.info}>Service ID: {serviceId}</Text>
      <Text style={styles.info}>Total: SAR {total}</Text>
      <Text style={styles.info}>Quantity: {quantity}</Text>
      <Text style={styles.info}>Userid: {userId}</Text>

      <Text style={styles.slotsHeader}>Selected Slots:</Text>
      {selectedSlots.map((slot, index) => (
        <Text key={index} style={styles.slot}>
          {slot.day}, {slot.date}: {slot.time}
        </Text>
      ))}

      {/* Button to create appointment */}
      <Button title="Confirm Appointment" onPress={handleCreateAppointment} />

      {/* Booking Confirmation modal */}
      {showBookingConfirmation && (
        <BookingConfirmation onDone={handleDone} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  slotsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  slot: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Checkout;
