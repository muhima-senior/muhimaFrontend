import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import { COLORS, FONT, SIZES } from '../../constants';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { useGlobalStore } from '../store/GlobalStore';
import Base64Image from '../../components/Base64Image';

const FreelancerHomePage = () => {
  const router = useRouter();
  const [freelancer, setFreelancer] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(2);
  const [earnings, setEarnings] = useState(0);
  const [services, setServices] = useState([]);
  const { userId, user } = useGlobalStore();

  const getFreelancerData = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/freelancer/user/${userId}`);
      setFreelancer(response.data);
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      setUpcomingBookings(0);
    }
  };

  const getPendingBookings = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/appointment/freelancer/${userId}`);
      setUpcomingBookings(response.data.length);
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      setUpcomingBookings(0);
    }
  };

  const getBookingEarnings = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/appointment/freelancer/${userId}`);
      const bookings = response.data; // assuming response.data is an array of bookings
  
      // Calculate total earnings
      const totalEarnings = bookings.reduce((sum, booking) => sum + booking.total, 0);
      setEarnings(totalEarnings);
    } catch (error) {
      console.error('Error fetching  Earnings:', error);
      setEarnings(0); // Set earnings to 0 in case of error
    }
  };
  

  const getServices = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/service/freelancer/${userId}`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  };

  useEffect(() => {
    if (userId) {
      getFreelancerData();
      getPendingBookings();
      getServices();
      getBookingEarnings();
    }
  }, [userId]);

  const handleEditProfile = () => router.push();
  const handleViewBookings = () => router.push('Freelancer/viewbookings');
  const handleMessages = () => router.push('message');
  const handleEarnings = () => router.push('Freelancer/earnings');
  const handleAvailability = () => router.push('Freelancer/slots');
  const handleReviews = () => router.push('Freelancer/viewreviews');
  const handleAddService = () => router.push('Freelancer/createservice');

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShadowVisible: false, headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Welcome back,</Text>
          <Text style={styles.headerName}>{user}</Text>
        </View>
        <TouchableOpacity >
        {freelancer?.pictureData ? (
          <Base64Image
            base64String={freelancer.pictureData}
            style={styles.profilePic}
          />
        ) : (
          <Text>No image available</Text>
        )}                  
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardContainer}>
          <StatCard value={upcomingBookings} label="Upcoming Bookings" icon="calendar" />
          <StatCard value={`SAR ${earnings}`} label="Earnings" icon="cash" />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <ActionButton icon="calendar-outline" text="View Bookings" onPress={handleViewBookings} />
          <ActionButton icon="chatbubbles-outline" text="Messages" onPress={handleMessages} unreadMessages={unreadMessages} />
          <ActionButton icon="cash-outline" text="Earnings" onPress={handleEarnings} />
          <ActionButton icon="time-outline" text="Set Availability" onPress={handleAvailability} />
          <ActionButton icon="add-circle-outline" text="+ Add Service" onPress={handleAddService} fullWidth />
        </View>
        <ActionButton icon="star-outline" text="Reviews" onPress={handleReviews} fullWidth />

        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Your Services</Text>
          {services.map((service, index) => (
            <TouchableOpacity key={index} style={styles.serviceCard}>
              <Base64Image base64String={service.pictureData} style={styles.serviceImage} />
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <View style={styles.serviceDetails}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color={COLORS.primary} />
                    <Text style={styles.ratingText}>{service.rating || 0}</Text>
                    <Text style={styles.ratingCount}>({service.ratingCount || 0})</Text>
                  </View>
                  <Text style={styles.currentPrice}>SAR {service.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ value, label, icon }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={SIZES.xLarge} color={COLORS.primary} style={styles.cardIcon} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionButton = ({ icon, text, onPress, unreadMessages, fullWidth }) => (
  <TouchableOpacity style={[styles.actionButton, fullWidth && styles.fullWidthButton]} onPress={onPress}>
    <Ionicons name={icon} size={SIZES.large} color={COLORS.primary} />
    <Text style={styles.actionText}>{text}</Text>
    {unreadMessages > 0 && (
      <View style>
        <Text style={styles.badgeText}></Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.lightWhite,
  },
  headerName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.white,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  scrollContent: {
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
  },
  statCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '48%',
  },
  cardIcon: {
    marginBottom: SIZES.small,
  },
  statValue: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.xSmall,
  },
  statLabel: {
    fontSize: SIZES.small,
    fontFamily: FONT.medium,
    color: COLORS.gray,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.darkGray,
    marginBottom: SIZES.medium,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidthButton: {
    width: '100%',
  },
  actionText: {
    marginTop: SIZES.small,
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.darkGray,
  },
  badge: {
    position: 'absolute',
    right: SIZES.xSmall,
    top: SIZES.xSmall,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.xSmall,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: SIZES.xSmall,
    fontFamily: FONT.bold,
  },
  servicesContainer: {
    marginTop: SIZES.medium,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  serviceImage: {
    width: 80,
    height: 80,
  },
  serviceContent: {
    flex: 1,
    padding: SIZES.small,
    justifyContent: 'space-between',
  },
  serviceTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.bold,
    color: COLORS.darkGray,
    marginBottom: SIZES.xSmall,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: SIZES.small,
    fontFamily: FONT.medium,
    color: COLORS.primary,
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  currentPrice: {
    fontSize: SIZES.medium,
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },
});

export default FreelancerHomePage;