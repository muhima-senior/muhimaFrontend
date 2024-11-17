import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const BookingConfirmation = ({ onDone }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <Text style={styles.title}>Booking Confirm Successfully</Text>
        <Text style={styles.message}>Congratulations! Your booking has been confirmed.</Text>
        <TouchableOpacity style={styles.button} onPress={onDone}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    color: 'rgb(0, 123, 255)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  message: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: 8,
  },
  button: {
    backgroundColor: 'rgb(0, 123, 255)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingConfirmation;