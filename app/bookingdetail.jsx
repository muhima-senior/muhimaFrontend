import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter, Stack } from "expo-router";
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import Base64Image from '../components/Base64Image';



const BookingDetailsScreen = () => {

  const router = useRouter();
  const [appointmentId, setAppointmentId] = useState(null)
  const [appointment, setAppointment] = useState(null)
  const route = useRoute();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (route.params?.id) {
      setAppointmentId(route.params.id);  // Set service_id once from route params
    }
  }, [route.params]);

  const handleReview = async () => {
    console.log("booking detail: ", appointmentId)
    router.push({
      pathname: 'addreview',
      params: { appointmentId },
    });
  }

  const getAppointmentDetails = async () => {
    if (appointmentId) {
      try {
        const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/appointment/${appointmentId}`);
        setAppointment(response.data);
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);  // Stop loading in both success and error cases
      }
    }
  };

  useEffect(() => {
    getAppointmentDetails();
  }, [appointmentId]);

  const dummyData = {
    serviceName: 'Living Room Cleaning',
    rating: 5.0,
    price: '$190',
    providerName: 'Ronald Richards',
    bookingStatus: [
      {
        status: 'Booking Confirmed',
        date: 'Mon, Oct 02, 2023',
        description: 'Service provider has accepted your booking',
        time: '10:00 AM',
      },
      {
        status: 'Vendor Out for Service',
        date: 'Mon, Oct 02, 2023',
        description: 'Service provider is on the way to your location',
        time: '09:00 AM',
      },
      {
        status: 'Service Completed',
        date: 'Tue, Oct 03, 2023',
        description: 'Service provider has completed the service',
        time: '12:00 AM',
      },
    ],
    paymentSummary: {
      itemTotal: '$200',
      discount: '$10',
      deliveryFee: 'Free',
      grandTotal: '$190',
    },
  };
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Booking Details */}
      <View style={styles.header}>
        {appointment?.gigId.pictureData ? (
        <Base64Image
          base64String={appointment.gigId.pictureData}
          style={styles.serviceImage}
        />
      ) : (
        <Text>No image available</Text>
      )}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{appointment?.gigId?.title}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{appointment.gigId.rating}</Text>
            <Icon name="star" size={16} color="#FFD700" />
          </View>
          <Text style={styles.price}>SAR {appointment.total}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.button}
        onPress={handleReview}>
          <Text style={styles.buttonText}>Write a Review</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.bookAgainButton]}>
          <Text style={[styles.buttonText, styles.bookAgainButtonText]}>Book Again</Text>
        </TouchableOpacity>
      </View>

      {/* Service Provider Info */}
      <View style={styles.providerInfo}>
      {appointment?.freelancerId.pictureData ? (
        <Base64Image
          base64String={appointment.freelancerId.pictureData}
          style={styles.serviceImage}
        />
      ) : (
        <Text>No image available</Text>
      )}
        <View style={styles.providerDetails}>
          <Text style={styles.providerName}>{appointment.freelancerId.userId.username}</Text>
          <Text style={styles.providerRole}>Service Provider</Text>
        </View>
        <View style={styles.contactIcons}>
          <Icon name="phone" size={20} color="#4A90E2" style={styles.icon} />
          <Icon name="comment" size={20} color="#4A90E2" style={styles.icon} />
        </View>
      </View>

      {/* Booking Status */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Booking Status</Text>
        {dummyData.bookingStatus.map((status, index) => (
          <View key={index} style={styles.statusItem}>
            <View style={styles.statusDot} />
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>{status.status}</Text>
              <Text style={styles.statusDate}>{status.date}</Text>
              <Text style={styles.statusDescription}>{status.description}</Text>
              <Text style={styles.statusTime}>{status.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Payment Summary */}
      <View style={styles.paymentSummary}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={[styles.paymentRow, styles.grandTotalRow]}>
          <Text style={styles.paymentLabel}>Grand Total</Text>
          <Text style={styles.paymentValue}>SAR {appointment.total}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  serviceInfo: {
    marginLeft: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    marginRight: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    borderWidth: 1,
    borderColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  bookAgainButton: {
    backgroundColor: '#4A90E2',
  },
  bookAgainButtonText: {
    color: '#fff',
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  providerDetails: {
    flex: 1,
    marginLeft: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  providerRole: {
    color: '#777',
  },
  contactIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 8,
  },
  statusSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
    marginRight: 12,
    marginTop: 4,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusDate: {
    color: '#777',
  },
  statusDescription: {
    color: '#777',
    marginVertical: 4,
  },
  statusTime: {
    color: '#777',
  },
  paymentSummary: {
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  paymentLabel: {
    color: '#777',
  },
  paymentValue: {
    fontWeight: '600',
  },
  grandTotalRow: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
});

export default BookingDetailsScreen;
