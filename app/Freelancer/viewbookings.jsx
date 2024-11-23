import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, FlatList, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import { COLORS, FONT, SIZES } from '../../constants';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { useGlobalStore } from '../store/GlobalStore';

const BookingsScreen = () => {
  const router = useRouter();
  const { userId } = useGlobalStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/appointment/freelancer/${userId}`);
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedBooking) return;
    console.log(newStatus)
    setIsUpdating(true);
    console.log(selectedBooking)
    console.log(newStatus)
    try {
      await axios.patch(`${REACT_APP_API_URL_NEW}/api/appointment/updateStatus`, {
        status: newStatus,
        appointmentId : selectedBooking._id
      });

      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === selectedBooking._id 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );

      setStatusModalVisible(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const showStatusUpdateModal = (booking) => {
    setSelectedBooking(booking);
    setStatusModalVisible(true);
  };

  const StatusUpdateModal = () => (
    <Modal
      transparent={true}
      visible={isStatusModalVisible}
      animationType="slide"
      onRequestClose={() => setStatusModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update Booking Status</Text>
          <Text style={styles.modalSubtitle}>{selectedBooking?.gigTitle}</Text>
          
          {isUpdating ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <View style={styles.statusButtonsWrapper}>
              <TouchableOpacity 
                style={[styles.statusButton, styles.confirmedButton]}
                onPress={() => handleUpdateStatus('Confirmed')}
              >
                <Text style={styles.statusButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statusButton, styles.completedButton]}
                onPress={() => handleUpdateStatus('Completed')}
              >
                <Text style={styles.statusButtonText}>Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statusButton, styles.cancelButton]}
                onPress={() => handleUpdateStatus('Cancelled')}
              >
                <Text style={styles.statusButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.closeModalButton}
            onPress={() => setStatusModalVisible(false)}
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingTitle}>{item.gigTitle}</Text>
        <TouchableOpacity onPress={() => showStatusUpdateModal(item)}>
          <StatusBadge status={item.status} />
        </TouchableOpacity>
      </View>
      <View style={styles.bookingDetails}>
        {item.appointmentDates.map((appointment, index) => (
          <View style={styles.detailRow} key={index}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            <Text style={styles.detailText}>
              {appointment.date} at {appointment.time}
            </Text>
          </View>
        ))}
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={16} color={COLORS.primary} />
          <Text style={styles.detailText}>Total: SAR {item.total}</Text>
        </View>
      </View>
    </View>
  );

  const StatusBadge = ({ status }) => {
    const getStatusStyle = (status) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return { backgroundColor: COLORS.secondary };
        case 'confirmed':
          return { backgroundColor: COLORS.primary };
        case 'completed':
          return { backgroundColor: COLORS.green };
        case 'cancelled':
          return { backgroundColor: COLORS.red };
        default:
          return { backgroundColor: COLORS.gray };
      }
    };

    return (
      <View style={[styles.statusBadge, getStatusStyle(status)]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bookings found</Text>
            </View>
          }
        />
      )}

      <StatusUpdateModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: SIZES.medium,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.white,
  },
  listContent: {
    padding: SIZES.medium,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    padding: SIZES.medium,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  bookingTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
    flex: 1,
    marginRight: SIZES.small,
  },
  statusBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: SIZES.xSmall,
  },
  statusText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  bookingDetails: {
    marginTop: SIZES.small,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xSmall,
  },
  detailText: {
    marginLeft: SIZES.small,
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.xLarge,
  },
  emptyText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.large,
    color: COLORS.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
  },
  modalTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.darkGray,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  statusButtonsWrapper: {
    marginVertical: SIZES.medium,
    gap: SIZES.small,
  },
  statusButton: {
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginBottom: SIZES.xSmall,
  },
  confirmedButton: {
    backgroundColor: COLORS.primary,
  },
  completedButton: {
    backgroundColor: COLORS.secondary,
  },
  cancelButton: {
    backgroundColor: COLORS.tertiary,
  },
  statusButtonText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
  },
  closeModalButton: {
    marginTop: SIZES.small,
    padding: SIZES.small,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: COLORS.primary,
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
  },
});

export default BookingsScreen;