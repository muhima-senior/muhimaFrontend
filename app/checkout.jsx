import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useGlobalStore } from './store/GlobalStore';
import axios from 'axios';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import BookingConfirmation from '../components/BookingConfirmation';
import AddressSection from '../components/AddressSection';
import { COLORS } from '../constants/theme';
import CardInput from '../components/CardInput';

const apiUrl = process.env.REACT_APP_API_URL_NEW;

const PaymentMethodCard = ({ selected, title, icon, onSelect }) => (
  <TouchableOpacity 
    style={[styles.paymentCard, selected && styles.paymentCardSelected]}
    onPress={onSelect}
  >
    <MaterialIcons name={icon} size={24} color={selected ? COLORS.primary : "#666"} />
    <Text style={[styles.paymentText, selected && styles.paymentTextSelected]}>
      {title}
    </Text>
    <MaterialIcons 
      name={selected ? "radio-button-checked" : "radio-button-unchecked"} 
      size={24} 
      color={selected ? COLORS.primary : "#666"} 
    />
  </TouchableOpacity>
);

const Checkout = () => {
  const route = useRouter();
  const { userId } = useGlobalStore();
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { 
    serviceName, 
    serviceId,
    total, 
    selectedSlots, 
    quantity, 
    freelancerId 
  } = useLocalSearchParams();

  const slots = selectedSlots ? JSON.parse(selectedSlots) : [];

  const handleCreateAppointment = async () => {
    if (!address.trim()) {
      Alert.alert('Missing Address', 'Please provide a valid address before proceeding.');
      return;
    }

    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    setIsLoading(true);
    try {
      const appointmentData = {
        userId: userId,
        freelancerId: freelancerId,
        gigId: serviceId,
        appointmentDates: slots,
        quantity: quantity,
        total: total,
        paymentMethod: paymentMethod,
        address: address
      };
      console.log(`${apiUrl}/api/appointment/create`);
      console.log(appointmentData);
      await axios.post(`${apiUrl}/api/appointment/create`, appointmentData);
      setShowBookingConfirmation(true);
    } catch (error) {
      console.error("Error creating appointment:", error);
      Alert.alert("Error", "Could not create appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const [cardDetails, setCardDetails] = useState(null);

  // ... (previous functions remain the same)

  const handleSaveCard = (details) => {
    setCardDetails(details);
    setPaymentMethod('CARD');
  };
  const handleDone = () => {
    setShowBookingConfirmation(false);
    route.push('home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => route.back()}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Order Summary Section */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Name</Text>
            <Text style={styles.summaryValue}>{serviceName}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Quantity</Text>
            <Text style={styles.summaryValue}>{quantity}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cost</Text>
            <Text style={styles.summaryValueHighlight}>SAR {total}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.slotsHeader}>Selected Slots</Text>
          {slots.map((slot, index) => (
            <View key={index} style={styles.slotRow}>
              <CheckCircle color={COLORS.primary} size={20} />
              <Text style={styles.slotText}>
                {slot.day}, {slot.date}: {slot.time}
              </Text>
            </View>
          ))}
        </View>

        {/* Address Section */}
        <AddressSection onSaveAddress={(addr) => setAddress(addr)} />

        {/* Payment Method Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <PaymentMethodCard
            selected={paymentMethod === 'CARD'}
            title="Credit/Debit Card"
            icon="credit-card"
            onSelect={() => setPaymentMethod('CARD')}
          />
          <PaymentMethodCard
            selected={paymentMethod === 'COD'}
            title="Cash on Delivery"
            icon="payments"
            onSelect={() => setPaymentMethod('COD')}
          />
          {/* <PaymentMethodCard
            selected={paymentMethod === 'TRANSFER'}
            title="Online Transfer"
            icon="account-balance"
            onSelect={() => setPaymentMethod('TRANSFER')}
          /> */}

          {paymentMethod === 'CARD' && (
            <CardInput onSaveCard={handleSaveCard} />
          )}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity 
          style={[
            styles.confirmButton, 
            (!address || !paymentMethod) && styles.confirmButtonDisabled
          ]}
          onPress={handleCreateAppointment}
          disabled={!address || !paymentMethod || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>
              Confirm Appointment
            </Text>
          )}
        </TouchableOpacity>

        {/* Booking Confirmation */}
        {showBookingConfirmation && (
          <BookingConfirmation onDone={handleDone} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Combined styles from both components
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 16,
    backgroundColor: '#F7F9FC',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  summaryValueHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  slotsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
  },
  paymentSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  paymentCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f0f9ff',
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  paymentTextSelected: {
    color: COLORS.primary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Checkout;