import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ServiceCard from '../components/Home/ServiceCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';

const BestServicesScreen = () => {
  const router = useRouter();
  const { title, type, category, freelanceId } = useLocalSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const getServices = async () => {
    try {
      let url = `${REACT_APP_API_URL_NEW}/api/service`;

      if (type === 'best') {
        url = `${REACT_APP_API_URL_NEW}/api/service`; // Assuming this fetches all services
      } else if (type === 'category' && category) {
        url = `${REACT_APP_API_URL_NEW}/api/service/category/${category}`; // Use the category ID directly
      } else if (type === 'freelancer' && freelanceId) {
        url = `${REACT_APP_API_URL_NEW}/api/service/freelancer/${freelanceId}`;
      }

      const response = await axios.get(url);
      console.log(url); // Log the URL for debugging
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  useEffect(() => {
    getServices();
  }, [type, category, freelanceId]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#312651" />
            <Text style={styles.loaderText}>Loading services...</Text>
          </View>
        ) : (
          <FlatList
            data={services}
            renderItem={({ item }) => <ServiceCard service={item} cardWidth={0.9} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            nestedScrollEnabled={true}
          />
        )}
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
  list: {
    padding: 16,
  },
  loaderContainer: {
    flex: 5, // Take up full screen
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#fff',
    paddingTop: '10%',
  },
  loaderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
});

export default BestServicesScreen;
