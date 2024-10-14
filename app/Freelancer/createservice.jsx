import React, { useState } from 'react';
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
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { useGlobalStore } from '../store/GlobalStore';


const categories = [
  { label: 'Electrician', value: 'electrician' },
  { label: 'Painter', value: 'painter' },
  { label: 'Cleaner', value: 'cleaner' },
  { label: 'Hairdresser', value: 'hairdresser' },
  { label: 'AC Repair', value: 'ac_repair' },
  { label: 'Plumber', value: 'plumber' },
  { label: 'Carpenter', value: 'carpenter' },
  { label: 'Gardener', value: 'gardener' },
];

const getIconForCategory = (category) => {
  const iconMap = {
    electrician: 'bulb-outline',
    painter: 'color-palette-outline',
    cleaner: 'brush-outline',
    hairdresser: 'cut-outline',
    ac_repair: 'construct-outline',
    plumber: 'water-outline',
    carpenter: 'hammer-outline',
    gardener: 'leaf-outline',
  };
  return iconMap[category] || 'help-outline';
};

const CreateServiceScreen = () => {
  const router = useRouter();

  // Form state
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [serviceImage, setServiceImage] = useState(null);
  const { userId, setUserId } = useGlobalStore();

  // UI state
  const [openCategory, setOpenCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      description: '',
      price: '',
      category: '',
      image: ''
    };

    if (!serviceTitle.trim()) {
      newErrors.title = 'Service title is required';
      isValid = false;
    }

    if (!serviceDescription.trim()) {
      newErrors.description = 'Service description is required';
      isValid = false;
    }

    if (!servicePrice.trim()) {
      newErrors.price = 'Service price is required';
      isValid = false;
    } else if (isNaN(parseFloat(servicePrice)) || parseFloat(servicePrice) <= 0) {
      newErrors.price = 'Please enter a valid price';
      isValid = false;
    }

    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }

    if (!serviceImage) {
      newErrors.image = 'Service image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please grant access to your photo library to upload a service image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        maxFileSize: 2 * 1024 * 1024, // 2MB limit
      });

      if (!result.canceled) {
        setServiceImage(result.assets[0].uri);
        setErrors(prev => ({ ...prev, image: '' }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const createFormData = (imageUri) => {
    const formData = new FormData();

    if (imageUri) {
      const localUri = imageUri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('pictureData', {
        uri: localUri,
        name: filename,
        type
      });
    }
    formData.append('userId', userId)
    formData.append('title', serviceTitle.trim());
    formData.append('description', serviceDescription.trim());
    formData.append('price', parseFloat(servicePrice));
    formData.append('category', selectedCategory);

    return formData;
  };

  const handleCreateService = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    //setIsLoading(true);

    try {
      const formData = createFormData(serviceImage);

      const api = axios.create({ baseURL: REACT_APP_API_URL_NEW });

      const apiResponse = await api.post('/api/service', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      if (apiResponse.status === 201) {
        console.log('Service created successfully');
      } else {
        console.log('Unexpected status code:', apiResponse.status);
      }
      var data = (new Array(6666145 >> 2)).fill(0)
      data = apiResponse.data
      Alert.alert(
        'Success',
        'Service created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back({
                params: { newService: data }
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create service. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Create Service",
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Ionicons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  // 'height' for Android
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}  // Adjust vertical offset as needed
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[styles.imageContainer, errors.image && styles.errorBorder]}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            {serviceImage ? (
              <Image
                source={{ uri: serviceImage }}
                style={styles.serviceImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={40} color={COLORS.gray} />
                <Text style={styles.imagePlaceholderText}>Add Service Image</Text>
                {errors.image && (
                  <Text style={styles.errorText}>{errors.image}</Text>
                )}
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Service Title</Text>
            <TextInput
              style={[styles.input, errors.title && styles.errorBorder]}
              placeholder="Enter service title"
              placeholderTextColor="#B0B0B0"
              value={serviceTitle}
              onChangeText={(text) => {
                setServiceTitle(text);
                setErrors(prev => ({ ...prev, title: '' }));
              }}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Service Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.errorBorder]}
              placeholder="Enter service description"
              placeholderTextColor="#B0B0B0"
              multiline
              value={serviceDescription}
              onChangeText={(text) => {
                setServiceDescription(text);
                setErrors(prev => ({ ...prev, description: '' }));
              }}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Service Price (in SAR)</Text>
            <TextInput
              style={[styles.input, errors.price && styles.errorBorder]}
              placeholder="Enter service price"
              placeholderTextColor="#B0B0B0"
              keyboardType="numeric"
              value={servicePrice}
              onChangeText={(text) => {
                setServicePrice(text);
                setErrors(prev => ({ ...prev, price: '' }));
              }}
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Service Category</Text>
            <DropDownPicker
              open={openCategory}
              value={selectedCategory}
              items={categories}
              setOpen={setOpenCategory}
              setValue={setSelectedCategory}
              placeholder="Select a category"
              containerStyle={styles.dropdown}
              zIndex={5000}
            />
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.disabledButton]}
            onPress={handleCreateService}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.createButtonText}>Create Service</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: "#333333",
  },
  headerButton: {
    marginLeft: 8,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SIZES.medium,
  },
  scrollViewContent: {
    paddingBottom: SIZES.xxLarge,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
    backgroundColor: COLORS.lightGray,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.medium,
  },
  formField: {
    marginBottom: SIZES.medium,
  },
  fieldLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    marginBottom: 5,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dropdown: {
    zIndex: 5000,
    height: 48,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    paddingVertical: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.large,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  createButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.white,
  },
  errorText: {
    color: 'red',
    fontSize: SIZES.small,
    marginTop: 5,
  },
  errorBorder: {
    borderColor: 'red',
  },
});

export default CreateServiceScreen;
