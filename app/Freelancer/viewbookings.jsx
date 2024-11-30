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
  const [selectedTab, setSelectedTab] = useState('All'); // New state for selected tab

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/appointment/freelancer/${userId}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedBooking) return;
    setIsUpdating(true);

    try {
      await axios.patch(`${REACT_APP_API_URL_NEW}/api/appointment/updateStatus`, {
        status: newStatus,
        appointmentId: selectedBooking._id,
      });

      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === selectedBooking._id ? { ...booking, status: newStatus } : booking
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
              <TouchableOpacity style={[styles.statusButton, styles.confirmedButton]} onPress={() => handleUpdateStatus('Confirmed')}>
                <Text style={styles.statusButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statusButton, styles.completedButton]} onPress={() => handleUpdateStatus('Completed')}>
                <Text style={styles.statusButtonText}>Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statusButton, styles.cancelButton]} onPress={() => handleUpdateStatus('Cancelled')}>
                <Text style={styles.statusButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setStatusModalVisible(false)}>
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
            <Text style={styles.detailText}>{appointment.date} at {appointment.time}</Text>
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
        case 'pending': return { backgroundColor: COLORS.yellow };
        case 'confirmed': return { backgroundColor: COLORS.primary };
        case 'completed': return { backgroundColor: COLORS.secondary };
        case 'cancelled': return { backgroundColor: COLORS.tertiary };
        default: return { backgroundColor: COLORS.gray };
      }
    };

    return (
      <View style={[styles.statusBadge, getStatusStyle(status)]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  const filterBookingsByStatus = () => {
    if (selectedTab === 'All') return bookings;
    return bookings.filter(booking => booking.status.toLowerCase() === selectedTab.toLowerCase());
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(tab => (
          <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => setSelectedTab(tab)}>
            <Text style={selectedTab === tab ? styles.activeTabText : styles.inactiveTabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Booking List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : (
        <FlatList
          data={filterBookingsByStatus()}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No bookings found</Text>}
        />
      )}

      <StatusUpdateModal />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: COLORS.lightGray,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTabText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },
  inactiveTabText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },
  bookingDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: SIZES.small,
    fontFamily: FONT.medium,
    color: COLORS.darkGray,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.small,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  statusButtonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: SIZES.small,
    alignItems: 'center',
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
    fontSize: SIZES.small,
    fontFamily: FONT.bold,
  },
  closeModalButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: SIZES.small,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.darkGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.darkGray,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
    marginTop: 20,
  },
});

export default BookingsScreen;