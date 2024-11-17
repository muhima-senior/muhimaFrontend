import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Stack, useRouter } from "expo-router";
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import Base64Image from '@/components/Base64Image';
import TimeSlotPicker from '../components/TimeSlotPicker'

const FREQUENTLY_ADDED_SERVICES = [
  {
    image: "https://via.placeholder.com/80",
    title: "Complete Kitchen Cleaning",
    rating: { value: 5, reviews: 130 },
    price: 150,
    oldPrice: 180,
    providerName: "Mark Willions"
  },
  {
    image: "https://via.placeholder.com/80",
    title: "AC Service",
    rating: { value: 5, reviews: 0 },
    price: 50,
    oldPrice: 80,
    providerName: "Jacob Jones"
  }
];

const COUPON_BUTTON_TEXT = 'Apply Coupon';

const BookingSummaryScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);

  const router = useRouter();
  const route = useRoute();
  const serviceId = route.params?.service_id || null;
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleSelectSlotPress = () => {
    setIsPickerVisible(true); // Show the TimeSlotPicker when button is clicked
  };

  const handleClosePicker = () => {
    setIsPickerVisible(false); // Hide the TimeSlotPicker when done
  };
  useEffect(() => {
    if (serviceId) {
      getServiceDetails(serviceId);  // Fetch service details when serviceId is available
    }
  }, [serviceId]);

  const getServiceDetails = async (serviceId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/service/${serviceId}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const itemTotal = service ? service.price * quantity : 0;
  const discount = 10; // You can adjust this or calculate based on some logic
  const deliveryFee = 'Free'; // Assuming delivery is always free
  const grandTotal = itemTotal - discount; // Calculate grand total

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
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Summary</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainService}>
            {service?.pictureData ? (
              <Base64Image
                base64String={service.pictureData}
                style={styles.mainServiceImage}
              />
            ) : (
              <Text>No image available</Text>
            )}
            <View style={styles.mainServiceDetails}>
              <Text style={styles.mainServiceTitle}>{service?.title || 'Loading...'}</Text>
              <Text style={styles.mainServiceDescription}>{service?.description || 'No description available'}</Text>
              <StarRating rating={5} reviews={service?.reviewCount} />
              <View style={styles.quantityContainer}>
                <Text style={styles.mainServicePrice}>SAR {itemTotal.toFixed(2)}</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton} onPress={handleIncrease}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* <FrequentlyAddedTogether services={FREQUENTLY_ADDED_SERVICES} /> */}

          <TouchableOpacity style={styles.couponButton}>
            <Icon name="pricetag-outline" size={24} color="#007AFF" />
            <Text style={styles.couponButtonText}>{COUPON_BUTTON_TEXT}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Item Total</Text>
              <Text style={styles.summaryValue}>SAR {itemTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>SAR {discount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={[styles.summaryValue, styles.freeText]}>{deliveryFee}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>SAR {grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.addressContainer}>
            <Icon name="location-outline" size={24} color="#007AFF" />
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressLabel}>Address</Text>
              <Text style={styles.addressText}>3125 Almalqa, Riyadh</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

        <View style={styles.bottomContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.bottomPrice}>SAR {grandTotal.toFixed(2)}</Text>
            <Text style={styles.viewDetails}>View Details</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.selectSlotButton} onPress={handleSelectSlotPress}>
              <Text style={styles.selectSlotButtonText}>Select Slot</Text>
            </TouchableOpacity>
          </View>
      </View>
      {isPickerVisible && (
            <TimeSlotPicker 
              availableSlots={service.freelancer.availableSlots}
              quantity={quantity}
              total = {grandTotal}
              serviceId = {serviceId}
              onClose={handleClosePicker} 
            />
          )}
    </SafeAreaView>
  );
};

const StarRating = ({ rating, reviews }) => (
  <View style={styles.ratingContainer}>
    <Icon name="star" size={20} color="#FFD700" />
    <Text style={styles.ratingText}>{rating} ({reviews} reviews)</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 80,
  },
  mainService: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  mainServiceImage: {
    width: 100,
    height: 100,
  },
  mainServiceDetails: {
    flex: 1,
    padding: 16,
  },
  mainServiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mainServiceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainServicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  couponButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  freeText: {
    color: 'green',
  },
  totalRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  addressLabel: {
    fontSize: 16,
    color: '#666',
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeText: {
    color: '#007AFF',
  },
  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bottomPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewDetails: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  selectSlotButton: {
    paddingVertical: 10,  // Reduce vertical padding if needed
    paddingHorizontal: 10, // Keep minimal horizontal padding
    backgroundColor: '#007aff',
    borderRadius: 8,
    alignItems: 'center',  // Center text horizontally
    justifyContent: 'center', // Center text vertically
    alignSelf: 'center', // Ensures the button doesn’t stretch in a flex container
    minWidth: 80,  // Set a minimum width if needed to control button size
  },
  selectSlotButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Ensures text is centered within the Text component
  },
  buttonContainer:{

  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#FFD700',
    marginLeft: 4,
  },
});

export default BookingSummaryScreen;
