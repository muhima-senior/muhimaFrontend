import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import {
  ArrowLeft,
  Star,
  Phone,
  MessageSquare,
  MapPin,
  Share2
} from 'lucide-react-native';
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { COLORS } from '../constants/theme';
import Base64Image from '@/components/Base64Image';
import { useGlobalStore } from './store/GlobalStore';

const ServiceDetailScreen = () => {
  const router = useRouter();
  const { userId, userType } = useGlobalStore();

  // States
  const [serviceId, setServiceId] = useState(null);
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { service_id } = useLocalSearchParams();
  
  useEffect(() => {
    setServiceId(service_id)
    console.log(service_id)
  }, []);

  const getServiceDetails = async () => {
    if (serviceId) {
      try {
        const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/service/${serviceId}`);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getServiceDetails();
  }, [serviceId]);

  const handleBookService = () => {
    router.push({
      pathname: 'bookingsummary',
      params: {
        serviceId: service._id,
      },
    });
  };

  const handleCall = () => {
    if (service?.freelancer?.mobileNumber) {
      Alert.alert(
        "Contact Provider",
        `Call ${service.freelancer.mobileNumber}?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Call",
            onPress: () => {
              Linking.openURL(`tel:${service.freelancer.mobileNumber}`);
            }
          }
        ]
      );
    } else {
      Alert.alert("Error", "Mobile number not available");
    }
  };

  const handleChatNavigation = () => {
    if (service && service.freelancer && service.user) {
      router.push({
        pathname: 'chat',
        params: {
          freelancerId: service.freelancer.userId,
          freelancerName: service.user.username || 'Freelancer',
          userType: 'homeowner',
          homeownerId: userId
        }
      });
    } else {
      Alert.alert('Error', 'Cannot initiate chat. Service details are incomplete.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const ActionButton = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={styles.actionIconContainer}>
        {icon}
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {service?.pictureData ? (
          <Base64Image
            base64String={service.pictureData}
            style={styles.serviceImage}
          />
        ) : (
          <Text>No image available</Text>
        )}
        <View style={styles.contentPadding}>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Star key={index} color="#FFD700" fill="#FFD700" size={20} />
            ))}
            <Text style={styles.ratingCount}>({service?.reviewCount || 0} Reviews)</Text>
          </View>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>SAR {service.price}</Text>
          </View>

          <Text style={styles.sectionTitle}>Descriptions</Text>
          <Text style={styles.description}>{service.description}</Text>

          <View style={styles.actionContainer}>
            <ActionButton 
              icon={<Phone color={COLORS.primary} size={24} />} 
              label="Call" 
              onPress={handleCall}
            />
            <ActionButton 
              icon={<MessageSquare color={COLORS.primary} size={24} />} 
              label="Chat" 
              onPress={handleChatNavigation}
            />
          </View>

          <Text style={styles.sectionTitle}>About Service Provider</Text>
          <View style={styles.providerContainer}>
            {service?.freelancer?.pictureData ? (
              <Base64Image
                base64String={service.freelancer.pictureData}
                style={styles.providerImage}
              />
            ) : (
              <Image source={{ uri: 'https://example.com/default_image.png' }} style={styles.providerImage} />
            )}
            <View>
              <Text style={styles.providerName}>{service?.user?.username || 'Unknown Provider'}</Text>
              <Text style={styles.providerTitle}>Service Provider</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Price</Text>
          <Text style={styles.footerPrice}>SAR {service.price}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookService}>
          <Text style={styles.bookButtonText}>Book Service</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentPadding: {
    padding: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCount: {
    marginLeft: 8,
    color: '#555',
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 18,
    color: '#888',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex',
    marginVertical: 16,
    padding:10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginRight:15,
    width: '50%',
    justifyContent: 'center',
  },
  actionIconContainer: {
  },
  actionLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  providerTitle: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  footerLabel: {
    fontSize: 14,
    color: '#555',
  },
  footerPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceDetailScreen;