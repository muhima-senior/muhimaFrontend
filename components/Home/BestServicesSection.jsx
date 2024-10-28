import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ServiceCard from './ServiceCard';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';

const BestServicesSection = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const handleSeeAll = () => {
    router.push({
      pathname: 'bestservicescreen',
      params: { type: "best", title: "All Services", category: "None" },
    });
  };

  const getServices = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/service`);
      setServices(response.data);
      setLoading(false); // Stop loading after data is fetched
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false); // Stop loading in case of error
      throw error;
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Best Services</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      {loading ? ( // Show loading indicator while fetching services
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : services.length > 0 ? ( // Render FlatList only if services are populated
        <FlatList
          data={services}
          renderItem={({ item }) => <ServiceCard service={item} />}
          keyExtractor={(item) => item._id || item.id || item.name} // Use unique keys (id or _id)
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
      ) : (
        <Text>No services available</Text> // Placeholder if no services are available
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#4A90E2',
    fontSize: 14,
  },
});

export default BestServicesSection;
