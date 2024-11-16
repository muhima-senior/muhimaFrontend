import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  Animated,
  Keyboard,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, FONT, SIZES, SHADOWS } from '../constants/theme';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import Base64Image from '@/components/Base64Image';

const NearbyFreelancersScreen = () => {
  const [location, setLocation] = useState(null);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showCoordinateInput, setShowCoordinateInput] = useState(false);
  const [tempCoords, setTempCoords] = useState({ latitude: '', longitude: '' });
  const [animation] = useState(new Animated.Value(0));
  const router = useRouter();

  const toggleCoordinateInput = () => {
    Keyboard.dismiss();
    const newValue = !showCoordinateInput;
    setShowCoordinateInput(newValue);
    Animated.timing(animation, {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setLocation(newLocation);
      setMarkerPosition(newLocation);
      setTempCoords({
        latitude: newLocation.latitude.toString(),
        longitude: newLocation.longitude.toString(),
      });
      await fetchNearbyFreelancers(newLocation.latitude, newLocation.longitude);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to get your location');
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyFreelancers = async (latitude, longitude) => {
    setLoading(true);
    try {
      console.log('Fetching freelancers for:', { latitude, longitude, searchRadius });
      const api = axios.create({ baseURL: REACT_APP_API_URL_NEW });
      const response = await api.get('/api/freelancer/location/nearby', {
        params: {
          latitude,
          longitude,
          distance: searchRadius
        }
      });
      console.log('API Response:', response.data);
      setFreelancers(response.data);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      Alert.alert('Error', 'Failed to fetch nearby freelancers');
    } finally {
      setLoading(false);
    }
  };

  const updateCoordinates = async () => {
    const newLat = parseFloat(tempCoords.latitude);
    const newLng = parseFloat(tempCoords.longitude);
    
    if (isNaN(newLat) || isNaN(newLng)) {
      Alert.alert('Invalid Coordinates', 'Please enter valid numbers');
      return;
    }

    if (newLat < -90 || newLat > 90 || newLng < -180 || newLng > 180) {
      Alert.alert('Invalid Coordinates', 'Coordinates out of valid range');
      return;
    }

    const newPosition = {
      ...markerPosition,
      latitude: newLat,
      longitude: newLng,
    };

    setMarkerPosition(newPosition);
    await fetchNearbyFreelancers(newLat, newLng);
    Keyboard.dismiss();
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const handleFreelancerServices = (id) => {
    console.log("Button clicked");
    router.push({
        pathname: 'bestservicescreen',
        params: { type: "freelancer", title: "Nearby Services", category: "None", freelanceId: id }, // Changed params to query
    });
};

const renderFreelancerItem = ({ item }) => (
    <TouchableOpacity
        style={styles.freelancerCard}
        onPress={() => handleFreelancerServices(item.userId)} // Wrap in an arrow function
    >
        {item?.pictureData ? (
            <Base64Image
                base64String={item.pictureData}
                style={styles.profilePicture}
            />
        ) : (
            <Text>No picture available</Text>
        )}
        <View style={styles.freelancerInfo}>
            <Text style={styles.freelancerName}>
                {item.profileDescription?.substring(0, 30)}...
            </Text>
            <Text style={styles.distanceText}>
                {Math.random().toFixed(1)} km away
            </Text>
        </View>
    </TouchableOpacity>
);

  const inputHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180], // Increased height for better visibility
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: 'Nearby Freelancers',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Finding nearby freelancers...</Text>
        </View>
      ) : (
        <>
          {location && (
            <View style={styles.mapContainer}>
              <MapView 
                style={styles.map} 
                initialRegion={location}
                region={markerPosition}
              >
                <Marker
                  coordinate={markerPosition}
                  draggable
                  onDragEnd={async (e) => {
                    const coords = e.nativeEvent.coordinate;
                    setMarkerPosition(coords);
                    setTempCoords({
                      latitude: coords.latitude.toString(),
                      longitude: coords.longitude.toString(),
                    });
                    await fetchNearbyFreelancers(coords.latitude, coords.longitude);
                  }}
                />
                <Circle
                  center={markerPosition}
                  radius={searchRadius * 1000}
                  fillColor="rgba(0, 128, 255, 0.2)"
                  strokeColor="rgba(0, 128, 255, 0.5)"
                />
                {}
              </MapView>

              {}
            </View>
          )}

          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              Found {freelancers.length} freelancers within {searchRadius}km
            </Text>
            <FlatList
              data={freelancers}
              renderItem={renderFreelancerItem}
              keyExtractor={(item) => item._id}
              // contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>
      )}
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
  mapContainer: {
    height: 300,
    marginHorizontal: SIZES.medium,
    marginTop: SIZES.medium,
    borderRadius: SIZES.medium,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  controlButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.medium, // Increased padding
    borderTopLeftRadius: SIZES.small,
    borderTopRightRadius: SIZES.small,
  },
  controlButtonText: {
    color: 'white',
    marginLeft: SIZES.xSmall,
    fontWeight: 'bold',
    fontSize: SIZES.medium, // Increased font size
  },
  coordinateInputContainer: {
    backgroundColor: 'white',
    padding: SIZES.xSmall,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray2,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium, // Increased margin
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: SIZES.xSmall,
  },
  inputLabel: {
    fontSize: SIZES.medium, // Increased font size
    color: COLORS.gray,
    marginBottom: 8, // Increased margin
    fontWeight: '500',
  },
  coordinateInput: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: SIZES.xSmall,
    padding: SIZES.xSmall, // Increased padding
    fontSize: SIZES.medium,
    height: 45, // Explicit height
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.xSmall, // Increased padding
    borderRadius: SIZES.xSmall,
    alignItems: 'center',
    marginTop: SIZES.small,
    height: 48, // Explicit height
  },
  resultContainer: {
    flex: 1,
    padding: SIZES.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  freelancerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginBottom: SIZES.small,
    ...SHADOWS.medium,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.small,
  },
  freelancerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  freelancerName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  distanceText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: SIZES.medium, // Increased font size
  },
  resultText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: SIZES.small,
  },
});

export default NearbyFreelancersScreen;