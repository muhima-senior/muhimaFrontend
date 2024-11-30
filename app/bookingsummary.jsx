import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { ArrowLeft, Star } from 'lucide-react-native';
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import Base64Image from '@/components/Base64Image';
import TimeSlotPicker from '../components/TimeSlotPicker';
import { COLORS } from '../constants/theme';


const COUPON_BUTTON_TEXT = 'Apply Coupon';

const BookingSummaryScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);


  const router = useRouter();
  const {serviceId} = useLocalSearchParams();
  console.log("Booking summary: ",serviceId)

  const handleSelectSlotPress = () => {
    setIsPickerVisible(true);
  };



  const handleClosePicker = () => {
    setIsPickerVisible(false);
  };

  useEffect(() => {
    if (serviceId) {
      getServiceDetails(serviceId);
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
  const discount = 10;
  const deliveryFee = 'Free';
  const grandTotal = itemTotal - discount;

  const StarRating = ({ rating, reviews }) => (
    <View style={styles.ratingContainer}>
      <Star color="#FFD700" fill="#FFD700" size={20} />
      <Text style={styles.ratingText}>{rating} ({reviews} reviews)</Text>
    </View>
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
        <Text style={styles.headerTitle}>Booking Summary</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          contentInset={{ bottom: 90 }}
          contentInsetAdjustmentBehavior="automatic"
        >
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
                <View style={styles.quantityControlsWrapper}>
                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={handleDecrease}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.quantityTextContainer}>
                    <Text style={styles.quantityText}>{quantity}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={handleIncrease}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          

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

        
        </ScrollView>
      )}

      {!loading && service && (
        <View style={styles.bottomTabContainer}>
          <View style={styles.bottomTabContent}>
            <View style={styles.priceContainer}>
              <Text style={styles.bottomPrice}>SAR {grandTotal.toFixed(2)}</Text>
            
            </View>
            <TouchableOpacity 
              style={styles.selectSlotButton} 
              onPress={handleSelectSlotPress}
            >
              <Text style={styles.selectSlotButtonText}>Select Slot</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isPickerVisible && (
        <TimeSlotPicker 
          availableSlots={service?.freelancer?.availableSlots}
          quantity={quantity}
          total={grandTotal}
          serviceId={serviceId}
          serviceName={service?.title}
          freelancerId={service?.freelancer._id}
          onClose={handleClosePicker} 
        />
      )}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  mainService: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mainServiceImage: {
    width: 120,
    height: 120,
    backgroundColor: '#EAEAEA',
  },
  mainServiceDetails: {
    flex: 1,
    padding: 16,
  },
  mainServiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  mainServiceDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quantityControlsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quantityButtonText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quantityTextContainer: {
    width: 40,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  mainServicePrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  couponButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 10,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  freeText: {
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666666',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginTop: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  bottomTabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomTabContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  priceContainer: {
    flex: 1,
    marginRight: 16,
  },
  bottomPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  viewDetails: {
    fontSize: 14,
    color: '#666666',
    textDecorationLine: 'underline',
  },
  selectSlotButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectSlotButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingSummaryScreen;