import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the cart icon
import Base64Image from '../../components/Base64Image';
import { COLORS } from '../../constants/theme';
// Get screen width
const { width: screenWidth } = Dimensions.get('window');

const ServiceCard = ({ service, cardWidth = 0.7, cardMargin = 16 }) => {

  // Handle navigation to the service details screen
  const handleSeeAll = () => {
    console.log("Service selected")
    router.push({
      pathname: 'servicedetailscreen',
      params: { service_id: service._id },
    });
  };

  const handleAddToCart = () => {
    router.push({
      pathname: 'bookingsummary',
      params: { serviceId: service._id }
    });
    console.log(`${service.title} added to cart`);
  };



  // Calculate card width and margin based on props and screen width
  const cardStyles = {
    width: cardWidth * screenWidth, // Width as a percentage of screen width
    marginRight: cardMargin,
  };

  return (
    <TouchableOpacity onPress={handleSeeAll} style={[styles.card, cardStyles]}>
      {/* Ensure the service and its pictureData exist */}
      {service?.pictureData ? (
        <Base64Image
          base64String={service.pictureData}
          style={styles.serviceImage}
        />
      ) : (
        <Text>No image available</Text>
      )}
      <View style={styles.content}>
        <View style={styles.ratingContainer}>
          <Text>{service?.averageRating || 0}</Text>
          <Text style={styles.ratingCount}>({service?.reviewCount || 0} Reviews)</Text>
        </View>
        <Text style={styles.title}>{service?.title || 'Untitled Service'}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>SAR {service?.price || 'N/A'}</Text>
        </View>
        <View style={styles.providerContainer}>
          {/* Ensure freelancer and its pictureData exist */}
          {service?.freelancer?.pictureData || service?.freelancerId?.pictureData ? (
            <Base64Image
              base64String={service?.freelancer?.pictureData || service?.freelancerId?.pictureData}
              style={styles.providerImage}
            />
          ) : (
            <Image source={{ uri: 'https://example.com/default_image.png' }} style={styles.providerImage} />
          )}

          {/* Ensure user and username exist */}
          <Text style={styles.providerName}>{service?.user?.username || service?.username || 'Unknown Provider'}</Text>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Ionicons name="cart" size={24} color="#fff" />
          <Text style={styles.cartText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceImage: {
    width: '100%', // Full width of the card
    height: 150, // Fixed height for the image
    borderTopLeftRadius: 8, // Round the top left corners
    borderTopRightRadius: 8, // Round the top right corners
  },
  ratingCount: {
    marginLeft: 4,
    color: '#666',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginRight: 8,
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  providerImage: {
    width: 32, // Slightly increase the size for better visibility
    height: 32, // Match width for a circular image
    borderRadius: 16, // Ensure it's fully circular
    marginRight: 8, // Maintain margin to separate from the text
    borderWidth: 1, // Optional: Add border for better definition
    borderColor: '#ccc', // Optional: Light gray border color
  },

  providerName: {
    fontSize: 12,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:COLORS.primary,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    justifyContent: 'center',
  },
  cartText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
});

export default ServiceCard;
