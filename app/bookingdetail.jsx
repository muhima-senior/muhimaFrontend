import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import Base64Image from '../components/Base64Image';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowLeft from 'react-native-vector-icons/Feather'; // Correct import for ArrowLeft
import { COLORS } from '../constants/theme';
const BookingDetailsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [appointmentId, setAppointmentId] = useState(id);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const handleReview = () => {
    router.push({
      pathname: 'addreview',
      params: { appointmentId },
    });
  };

  const getAppointmentDetails = async () => {
    try {
      if (appointmentId) {
        const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/appointment/${appointmentId}`);
        setAppointment(response.data);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
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

  const bookingData = appointment || dummyData; // Use dummyData as fallback

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Keep Header exactly the same */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft name="arrow-left" color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>View Booking Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Enhanced Booking Details Card */}
        <View style={styles.card}>
          <View style={styles.details}>
            {bookingData.gigId?.pictureData ? (
              <Base64Image base64String={bookingData.gigId.pictureData} style={styles.serviceImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="image" size={24} color="#ccc" />
              </View>
            )}
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{bookingData.gigId?.title || bookingData.serviceName}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" style={styles.starIcon} />
                <Text style={styles.rating}>{bookingData.gigId?.rating || bookingData.rating}</Text>
              </View>
              <Text style={styles.price}>{`SAR ${bookingData.total || bookingData.price}`}</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.reviewButton} onPress={handleReview}>
            <Icon name="pencil" size={16} color="#4A90E2" style={styles.buttonIcon} />
            <Text style={styles.reviewButtonText}>Write a Review</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookAgainButton}>
            <Icon name="calendar-plus-o" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.bookAgainButtonText}>Book Again</Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Provider Info Card */}
        <View style={styles.card}>
          <View style={styles.providerInfo}>
            {bookingData.freelancerId?.pictureData ? (
              <Base64Image base64String={bookingData.freelancerId.pictureData} style={styles.providerImage} />
            ) : (
              <View style={styles.providerImagePlaceholder}>
                <Icon name="user" size={24} color="#ccc" />
              </View>
            )}
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>{bookingData.freelancerId?.userId?.username || bookingData.providerName}</Text>
              <Text style={styles.providerRole}>Service Provider</Text>
            </View>
            <View style={styles.contactIcons}>
              <TouchableOpacity style={styles.contactButton}>
                <Icon name="phone" size={20} color="#4A90E2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Icon name="comment" size={20} color="#4A90E2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Enhanced Booking Status Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booking Status</Text>
          {Array.isArray(bookingData.bookingStatus) ? (
            bookingData.bookingStatus.map((status, index) => (
              <View key={index} style={styles.statusItem}>
                <View style={styles.statusLineContainer}>
                  <View style={[styles.statusDot, { backgroundColor: '#4A90E2' }]} />
                  {index !== bookingData.bookingStatus.length - 1 && (
                    <View style={styles.statusLine} />
                  )}
                </View>
                <View style={styles.statusContent}>
                  <Text style={styles.statusTitle}>{status.status}</Text>
                  <Text style={styles.statusDate}>{status.date}</Text>
                  <Text style={styles.statusDescription}>{status.description}</Text>
                  <Text style={styles.statusTime}>{status.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No booking status available.</Text>
          )}
        </View>

        {/* Enhanced Payment Summary Card */}
        <View style={[styles.card, styles.paymentCard]}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.paymentDetails}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Item Total</Text>
              <Text style={styles.paymentValue}>{bookingData.paymentSummary?.itemTotal}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Discount</Text>
              <Text style={[styles.paymentValue, styles.discountText]}>{bookingData.paymentSummary?.discount}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Delivery Fee</Text>
              <Text style={styles.paymentValue}>{bookingData.paymentSummary?.deliveryFee}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>{`SAR ${bookingData.total || bookingData.paymentSummary?.grandTotal}`}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Keep header styles exactly the same
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starIcon: {
    marginRight: 4,
  },
  rating: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  reviewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
  },
  bookAgainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  reviewButtonText: {
    color: '#4A90E2',
    fontWeight: '600',
    fontSize: 16,
  },
  bookAgainButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  providerImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerDetails: {
    flex: 1,
    marginLeft: 12,
  },
  providerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  providerRole: {
    fontSize: 14,
    color: '#666',
  },
  contactIcons: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color:COLORS.primary,
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusLineContainer: {
    width: 24,
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  statusLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
    marginLeft: 5,
  },
  statusContent: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  statusDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statusTime: {
    fontSize: 14,
    color: '#666',
  },
  paymentCard: {
    marginBottom: 24,
  },
  paymentDetails: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 15,
    color: '#666',
  },
  paymentValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  discountText: {
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  grandTotalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A90E2',
  },
  noDataText: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default BookingDetailsScreen;
