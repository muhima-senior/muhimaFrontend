import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import BottomNavBar from '../components/Home/BottomNavbar';
import Base64Image from '@/components/Base64Image';
import { useGlobalStore } from './store/GlobalStore';
import { MaterialIcons, FontAwesome,Ionicons } from '@expo/vector-icons';


const ProfileScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [homeowner, setHomeowner] = useState({});
  const router = useRouter();
  const { userId,user } = useGlobalStore();
  const API_URL = `${process.env.REACT_APP_API_URL_NEW}/api/homeowner/user/${userId}`;

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_URL);
        setHomeowner(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        Alert.alert('Error', 'Failed to load profile information.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [API_URL]);

  const handleNavigation = (screen) => {
    const currentRoute = router.pathname;

    const routes = {
      EditProfile: '/ProfilePages/editprofile',
      ChangePassword: '/ProfilePages/changepass',
      MyBookings: { pathname: 'Homeowner/mybooking', params: { type: 'homeowner' } },
      PrivacyPolicy: '/ProfilePages/privacy',
      TermsConditions: '/ProfilePages/terms',
      Logout: '/landingpage',
    };

    const route = routes[screen];
    if (route && currentRoute !== route) {
      router.push(route);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#312651" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          {homeowner?.pictureData ? (
            <Base64Image base64String={homeowner.pictureData} style={styles.profileImage} />
          ) : (
            <TouchableOpacity style={styles.cameraIcon}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={styles.profileName}>{user || 'Guest User'}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {[
            { screen: 'EditProfile', icon: 'create-outline', text: 'Edit Profile' },
            // { screen: 'ChangePassword', icon: 'lock-closed-outline', text: 'Change Password' },
            { screen: 'MyBookings', icon: 'calendar-outline', text: 'My Bookings' },
            { screen: 'PrivacyPolicy', icon: 'shield', text: 'Privacy Policy' },
            { screen: 'TermsConditions', icon: 'book-outline', text: 'Terms & Conditions' },
            { screen: 'Logout', icon: 'log-out-outline', text: 'Logout', color: '#ff4d4d' },
          ].map(({ screen, icon, text, color }, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.option, screen === 'Logout' && styles.logoutOption]}
              onPress={() => handleNavigation(screen)}
            >
              <Ionicons name={icon} size={24} color={color || '#333'} />
              <Text style={[styles.optionText, screen === 'Logout' && styles.logoutText]}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIcon: {
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 5,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  optionsContainer: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ff4d4d',
  },
});

export default ProfileScreen;
