import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import {
  ArrowLeft,
  Star,
  Phone,
  MessageSquare,
  MapPin,
  Share2
} from 'lucide-react-native';
import { useRouter, Stack } from "expo-router";
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { REACT_APP_API_URL_NEW } from '@env';
import { COLORS } from '../constants/theme';
import Base64Image from '@/components/Base64Image';

const ActionButton = ({ icon, label }) => (
  <TouchableOpacity style={styles.actionButton}>
    <View style={styles.actionIconContainer}>
      {icon}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const ServiceDetailScreen = () => {
  const router = useRouter();
  const route = useRoute();

  // States
  const [serviceId, setServiceId] = useState(null);
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the service_id from route params when the component mounts
  useEffect(() => {
    if (route.params?.service_id) {
      setServiceId(route.params.service_id);  // Set service_id once from route params
    }
  }, [route.params]);

  // Fetch service details using the serviceId
  const getServiceDetails = async () => {
    if (serviceId) {
      try {
        const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/service/${serviceId}`);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);  // Stop loading in both success and error cases
      }
    }
  };

  // Fetch the service details once the serviceId is set
  useEffect(() => {
    getServiceDetails();
  }, [serviceId]);  // Re-run only when serviceId changes

  const handleBookService = () => {
    console.log("To be implemented")
    // router.push({
    //   pathname: 'bookingsummary',
    //   params: {
    //     service_id: service._id,
    //     // service: JSON.stringify(service),
    //   },
    // });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Removed <Stack.Screen> */}
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
            {/* <Text style={styles.originalPrice}>SAR {service.originalPrice}</Text> */}
          </View>

          <Text style={styles.sectionTitle}>Descriptions</Text>
          <Text style={styles.description}>{service.description}</Text>

          <View style={styles.actionContainer}>
            <ActionButton icon={<Phone color={COLORS.primary} size={24} />} label="Call" />
            <ActionButton icon={<MessageSquare color={COLORS.primary} size={24} />} label="Chat" />
            <ActionButton icon={<MapPin color={COLORS.primary} size={24} />} label="Map" />
            <ActionButton icon={<Share2 color={COLORS.primary} size={24} />} label="Share" />
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

          {/* 
          <Text style={styles.sectionTitle}>Reviews</Text>
          {service.reviews.map((review, index) => (
            <ReviewItem key={index} review={review} />
          ))} 
          */}
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
  ratingCount: { // Fixed: Changed from 'reviewCount' to 'ratingCount'
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
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    width: '23%',
    justifyContent: 'center',
  },
  actionIconContainer: { // Added to properly style the icon container
    // Add any styles you need for the icon container
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
  reviewItem: {
    marginBottom: 16,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  starContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  reviewDate: {
    fontSize: 14,
    color: '#555',
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
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
