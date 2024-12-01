import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import { REACT_APP_API_URL_NEW } from '@env';
import axios from 'axios';
import { useGlobalStore } from '../store/GlobalStore';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CreateProfileScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload profile pictures.');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        maxFileSize: 2 * 1024 * 1024,
      });

      if (!result.canceled) {
        setProfilePicture(result.assets[0].uri);
        const fileUri = result.assets[0].uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        setProfilePictureFile({ uri: fileUri, name: filename, type });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
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

  const handleAddressChange = (address) => {
    setAddress(address);
    if (address.trim() === '') {
      setAddressError('Address is required');
    } else {
      setAddressError('');
    }
  };

  const handleCreateProfile = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number before creating your profile.');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Invalid Address', 'Please enter a valid address before creating your profile.');
      return;
    }

    if (!profilePictureFile) {
      Alert.alert('Profile Picture Required', 'Please add a profile picture before creating your profile.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('mobileNumber', phoneNumber);
      formData.append('address', address);
      formData.append('pictureData', profilePictureFile);

      const api = axios.create({ baseURL: REACT_APP_API_URL_NEW });
      const apiResponse = await api.post('/api/homeowner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Profile created successfully!', [
        { text: 'OK', onPress: () => router.push('home') }
      ]);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Create Your Profile</Text>
        </View>

        <TouchableOpacity style={styles.profilePictureContainer} onPress={pickImage}>
          {profilePicture ? (
            <>
              <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
              <View style={styles.editIconContainer}>
                <Ionicons name="pencil" size={16} color={COLORS.white} />
              </View>
            </>
          ) : (
            <LinearGradient
              colors={[COLORS.primary, COLORS.gray]}
              style={styles.profilePicturePlaceholder}
            >
              <Ionicons name="camera" size={40} color={COLORS.white} />
              <Text style={styles.profilePictureText}>Add Photo</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        {/* Phone Number Input */}
        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, phoneNumberError ? styles.inputError : null]}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
            />
          </View>
          {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}
        </View>

        {/* Address Input */}
        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>Address</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, addressError ? styles.inputError : null]}
              placeholder="Enter your address"
              value={address}
              onChangeText={handleAddressChange}
            />
          </View>
          {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.createProfileButton, isLoading && styles.createProfileButtonDisabled]}
          onPress={handleCreateProfile}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.createProfileButtonText}>Create Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
    margin: SIZES.small,
  },
  content: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.medium,
    paddingTop: 100,
    paddingBottom: SIZES.xxLarge,
  },
  headerContainer: {
    marginBottom: SIZES.xxLarge,
  },
  headerTitle: {
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  headerSubtitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
  },
  formContainer: {
    marginTop: SIZES.large,
  },
  fieldLabel: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    ...SHADOWS.small,
  },
  inputIcon: {
    marginRight: SIZES.small,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.primary,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  profilePictureContainer: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: (width * 0.35) / 2,
    alignSelf: 'center',
    marginVertical: SIZES.large,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  profilePicturePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    marginTop: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontFamily: FONT.medium,
  },
  createProfileButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.xxLarge,
    ...SHADOWS.medium,
  },
  createProfileButtonDisabled: {
    backgroundColor: COLORS.gray2,
  },
  createProfileButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.small,
    fontFamily: FONT.regular,
    marginTop: SIZES.xSmall,
    marginLeft: SIZES.small,
  },
});

export default CreateProfileScreen;