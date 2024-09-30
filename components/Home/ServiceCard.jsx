import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // React Navigation hook for navigating
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the cart icon

// Get screen width
const { width: screenWidth } = Dimensions.get('window');

const ServiceCard = ({ service, cardWidth = 0.7, cardMargin = 16 }) => {
  const navigation = useNavigation(); // React Navigation hook

  // Handle navigation to the service details screen
  const handleSeeAll = () => {
    router.push({
      pathname: 'servicedetailscreen', // Navigate to the service details screen
      params: { 
        service_id: service.id, 
        service: JSON.stringify(service) // Pass the whole service object as a JSON string
      },
    });
  };

  // Handle adding the service to the cart
  const handleAddToCart = () => {
    // Logic to add service to cart
    router.push('bookingsummary');
    console.log(`${service.title} added to cart`);
  };

  // Calculate card width and margin based on props and screen width
  const cardStyles = {
    width: cardWidth * screenWidth, // Width as a percentage of screen width
    marginRight: cardMargin,
  };

  return (
    <TouchableOpacity onPress={handleSeeAll} style={[styles.card, cardStyles]}>
      <Image source={{ uri: service.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.ratingContainer}>
          <Text>{service.rating}</Text>
          <Text style={styles.ratingCount}>({service.reviewCount} Reviews)</Text>
        </View>
        <Text style={styles.title}>{service.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>SAR {service.currentPrice}</Text>
          <Text style={styles.originalPrice}>SAR {service.originalPrice}</Text>
        </View>
        <View style={styles.providerContainer}>
          <Image source={{ uri: service.providerImage }} style={styles.providerImage} />
          <Text style={styles.providerName}>{service.providerName}</Text>
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
    color: '#4A90E2',
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  providerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  providerName: {
    fontSize: 12,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
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
