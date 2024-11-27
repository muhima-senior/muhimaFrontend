import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../components/Home/BottomNavbar';

const ProfileScreen = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const router = useRouter();
  const toggleDarkMode = () => {
setIsDarkMode(!isDarkMode);
  };

  const handleNavigation = (screen) => {
    const currentRoute = router.pathname;

  switch (screen) {
    case 'EditProfile':
      if (currentRoute !== '/Freelancer/createprofile') {
        router.push('/Freelancer/createprofile');
      }
      break;
    case 'ChangePassword':
      if (currentRoute !== '/changepass') {
        router.push('/Pages/changepass');
      }
      break;
    case 'MyBookings':
      if (currentRoute !== '/mybooking') {
        router.push({
          pathname: '/Pages/mybooking',
          query: { type: 'homeowner' }, // Use query for params
        });
      }
      break;
    case 'MyAddresses':
      if (currentRoute !== '/myaddress') {
        router.push('/Pages/myaddress');
      }
      break;
    case 'PrivacyPolicy':
      if (currentRoute !== '/privacy') {
        router.push('/Pages/privacy');
      }
      break;
    case 'TermsConditions':
      if (currentRoute !== '/terms') {
        router.push('/Pages/terms');
      }
      break;
    case 'Logout':
      if (currentRoute !== '/signinscreen') {
        router.push('/signinscreen');
      }
      break;
    default:
      console.warn(`Unknown route: ${screen}`);
  }

  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIcon}>
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.profileName}>Nouf</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option} onPress={() => handleNavigation('EditProfile')}>
            <Ionicons name="create-outline" size={24} color="#333" />
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handleNavigation('ChangePassword')}>
            <Ionicons name="lock-closed-outline" size={24} color="#333" />
            <Text style={styles.optionText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handleNavigation('MyBookings')}>
            <MaterialIcons name="event-note" size={24} color="#333" />
            <Text style={styles.optionText}>My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handleNavigation('MyAddresses')}>
            <Ionicons name="location-outline" size={24} color="#333" />
            <Text style={styles.optionText}>My Addresses</Text>
          </TouchableOpacity>

          <View style={styles.option}>
            <Ionicons name="eye-outline" size={24} color="#333" />
            <Text style={styles.optionText}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
              trackColor={{ false: '#ccc', true: '#333' }}
              style={{ marginLeft: 'auto' }}
            />
          </View>

          <TouchableOpacity style={styles.option} onPress={() => handleNavigation('PrivacyPolicy')}>
            <FontAwesome name="shield" size={24} color="#333" />
            <Text style={styles.optionText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handleNavigation('TermsConditions')}>
            <MaterialIcons name="gavel" size={24} color="#333" />
            <Text style={styles.optionText}>Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, styles.logoutOption]} onPress={() => handleNavigation('Logout')}>
            <Ionicons name="log-out-outline" size={24} color="#ff4d4d" />
            <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
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
    position: 'absolute',
    bottom: 50,
    right: 140,
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 5,
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
    paddingVertical: 12,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  navItem: {
    alignItems: 'center',
  },
});

export default ProfileScreen;