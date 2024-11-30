import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, Image, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AvailableSlotsSelector from '../../components/AvailableSlotsSelector';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import { REACT_APP_API_URL_NEW } from '@env';
import axios from 'axios';
import { useGlobalStore } from '../store/GlobalStore';





const CreateProfileScreen = () => {

  const [profileDescription, setProfileDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [certification, setCertification] = useState('');
  const [location, setLocation] = useState(null);
  const [availableSlots, setAvailableSlots] = useState({
    monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
  });
  const { userId, setUserId, categories } = useGlobalStore();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openCategory, setOpenCategory] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [profilePictureBase64, setProfilePictureBase64] = useState(null)
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      maxFileSize: 2 * 1024 * 1024, // 2MB limit
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
      // Create a file object from the selected image
      const fileUri = result.assets[0].uri;
      const filename = fileUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      setProfilePictureFile({ uri: fileUri, name: filename, type });
    }
  };

  const requestLocationPermission = async () => {
    setIsLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      setIsLoadingLocation(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      console.log('Location:', location);
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\+?[0-9]{10,14}$/;
    return phoneRegex.test(number);
  };

  const handlePhoneNumberChange = (number) => {
    setPhoneNumber(number);
    if (number.trim() === '') {
      setPhoneNumberError('Phone number is required');
    } else if (!validatePhoneNumber(number)) {
      setPhoneNumberError('Please enter a valid phone number');
    } else {
      setPhoneNumberError('');
    }
  };

  const formatAvailableSlots = (slots) => {
    const formattedSlots = [];
    for (const day in slots) {
      slots[day].forEach(slot => {
        // Assuming slot is in format "HH:MM"
        const [hours, minutes] = slot.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        date.setSeconds(0);
        date.setMilliseconds(0);
        formattedSlots.push(date);
      });
    }
    return formattedSlots;
  };


  const handleCreateProfile = async () => {

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number before creating your profile.');
      return;
    }

    if (!location) {
      Alert.alert('Location Required', 'Please set your location before creating your profile.');
      return;
    }

    if (!profilePictureFile) {
      Alert.alert('Profile Picture Required', 'Please add a profile picture before creating your profile.');
      return;
    }

    try {
      // Prepare form data to send via POST
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('mobileNumber', phoneNumber);
      formData.append('location', JSON.stringify({
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      }));
      formData.append('profileDescription', profileDescription);
      formData.append('certifications', JSON.stringify(certification.split(',').map(cert => cert.trim())));


      // Format and append available slots
      const formattedSlots = JSON.stringify(availableSlots);
      formData.append('availableSlots', formattedSlots);
      console.log(formattedSlots)

      // Append file data
      formData.append('pictureData', profilePictureFile);

      // Make the API request
      const api = axios.create({ baseURL: REACT_APP_API_URL_NEW });

      const apiResponse = await api.post('/api/freelancer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', apiResponse.data);

      Alert.alert('Success', 'Profile created successfully!');
      router.push('Freelancer/FreelancerHome');
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      Alert.alert('Error', `Failed to create profile: ${error.message}`);
    }
  };


  


  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Create Profile",
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('signinscreen')}>
              <Ionicons name="exit-outline" size={24} color="#333333" />
            </TouchableOpacity>
          ),
        }}
      />
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      > */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      >

        <TouchableOpacity style={styles.profilePictureContainer} onPress={pickImage}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Ionicons name="camera" size={40} color={COLORS.gray} />
              <Text style={styles.profilePictureText}>Add Profile Picture</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.fieldLabel}>Profile Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe your professional experience and expertise"
          placeholderTextColor="#B0B0B0"
          value={profileDescription}
          onChangeText={setProfileDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.fieldLabel}>Phone Number</Text>
        <TextInput
          style={[styles.input, phoneNumberError ? styles.inputError : null]}
          placeholder="Enter your phone number"
          placeholderTextColor="#B0B0B0"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
        />
        {phoneNumberError ? (
          <Text style={styles.errorText}>{phoneNumberError}</Text>
        ) : null}

<Text style={styles.fieldLabel}>Select Service Category</Text>
        <DropDownPicker
          listMode="SCROLLVIEW"
          open={openCategory}
          value={selectedCategory}
          items={categories.map((category) => ({
            label: (
              <View style={styles.categoryItem}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryLabel}>{category.name}</Text>
              </View>
            ),
            value: category.id, // Pass ID as value
          }))}
          setOpen={setOpenCategory}
          setValue={setSelectedCategory}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholderStyle={styles.dropdownPlaceholder}
          labelStyle={styles.dropdownLabel}
          listItemLabelStyle={styles.dropdownListItemLabel}
          placeholder="Select a category"
          ArrowUpIconComponent={() => (
            <Ionicons name="chevron-up-outline" size={24} color="#333333" />
          )}
          ArrowDownIconComponent={() => (
            <Ionicons name="chevron-down-outline" size={24} color="#333333" />
          )}
        />
        <Text style={styles.fieldLabel}>Certification (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your certifications(Comma separated)"
          placeholderTextColor="#B0B0B0"
          value={certification}
          onChangeText={setCertification}
        />

        <Text style={styles.fieldLabel}>Location</Text>
        <TouchableOpacity style={styles.mapContainer} onPress={requestLocationPermission}>
          {isLoadingLocation ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
          ) : location ? (
            <MapView
              style={styles.map}
              initialRegion={location}
            >
              <Marker coordinate={location} />
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location" size={40} color={COLORS.gray} />
              <Text style={styles.mapPlaceholderText}>Tap to set your location</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.fieldLabel}>Available Slots</Text>
        <Text style={styles.infoText}>Set your available time slots for each day of the week</Text>
        <AvailableSlotsSelector
          availableSlots={availableSlots}
          setAvailableSlots={setAvailableSlots}
        />

        <TouchableOpacity style={styles.createProfileButton} onPress={handleCreateProfile}>
          <Text style={styles.createProfileButtonText}>Create Profile</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },
  content: {
    flexGrow: 1,
    padding: SIZES.medium,
  },
  fieldLabel: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
    marginBottom: SIZES.xSmall,
    marginTop: SIZES.medium,
  },
  input: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: 50,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.primary,
    ...SHADOWS.small,
  },
  textArea: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: 120,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.small,
    marginBottom: SIZES.medium,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.primary,
    textAlignVertical: 'top',
    ...SHADOWS.small,
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.small,
    overflow: 'hidden',
    marginBottom: SIZES.medium,
    ...SHADOWS.medium,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    marginTop: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontFamily: FONT.regular,
  },
  infoText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: SIZES.small,
    fontFamily: FONT.regular,
  },
  createProfileButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.large,
    marginBottom: SIZES.large,
    ...SHADOWS.medium,
  },
  createProfileButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
  },
  profilePictureContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: SIZES.large,
    overflow: 'hidden',
    backgroundColor: COLORS.lightWhite,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  profilePicturePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    marginTop: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontFamily: FONT.regular,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderWidth: 0,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    height: 50,
    ...SHADOWS.small,
  },
  dropdownContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 0,
    borderRadius: SIZES.small,
    ...SHADOWS.medium,
  },
  dropdownPlaceholder: {
    color: COLORS.gray,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
  },
  dropdownLabel: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
  },
  dropdownListItemLabel: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: SIZES.small,
  },
  categoryLabel: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontFamily: FONT.regular,
  },
  errorText: {
    color: COLORS.tertiary,
    fontSize: SIZES.small,
    marginTop: -SIZES.xSmall,
    marginBottom: SIZES.small,
    fontFamily: FONT.regular,
  },
  debugText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
  },
  loadingText: {
    marginTop: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontFamily: FONT.medium,
  },
});

export default CreateProfileScreen;