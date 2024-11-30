import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Alert 
} from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { Stack, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { useGlobalStore } from '../store/GlobalStore';
import AvailableSlotsSelector from '../../components/AvailableSlotsSelector';

const ManageAvailableSlotsScreen = () => {
  const [availableSlots, setAvailableSlots] = useState({
    monday: [], tuesday: [], wednesday: [], 
    thursday: [], friday: [], saturday: [], sunday: []
  });
  const { userId } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    fetchCurrentSlots();
  }, []);

  const fetchCurrentSlots = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/freelancer/user/${userId}`);
      if (response.data && response.data.availableSlots) {
        setAvailableSlots(response.data.availableSlots);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      Alert.alert('Error', 'Could not fetch current available slots');
    }
  };

  const saveAvailableSlots = async () => {
    try {
      await axios.patch(`${REACT_APP_API_URL_NEW}/api/freelancer/updateSlot`, {
        userId,
        availableSlots
      });
      Alert.alert('Success', 'Available slots updated successfully');
      router.back();
    } catch (error) {
      console.error('Error saving slots:', error);
      Alert.alert('Error', 'Could not save available slots');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft name="arrow-left" color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Available Slots</Text>
          <View style={{ width: 24 }} />
        </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instructionText}>
          Select your available time slots for each day of the week
        </Text>

        <AvailableSlotsSelector 
          availableSlots={availableSlots}
          setAvailableSlots={setAvailableSlots}
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveAvailableSlots}>
          <Text style={styles.saveButtonText}>Save Available Slots</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    padding: SIZES.medium,
  },
  instructionText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.large,
    ...SHADOWS.medium,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
  },
});

export default ManageAvailableSlotsScreen;