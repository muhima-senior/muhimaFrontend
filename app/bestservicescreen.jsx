import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ServiceCard from '../components/Home/ServiceCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';

const BestServicesScreen = () => {
  const router = useRouter();
  const { title, type, category, freelanceId } = useLocalSearchParams(); // Extract query parameters
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const getServices = async () => {
    try {
      let url = `${REACT_APP_API_URL_NEW}/api/service`;

      if (type === "best") {
        url = `${REACT_APP_API_URL_NEW}/api/service`;
      } else if (type === "category") {
        url = `${REACT_APP_API_URL_NEW}/api/service/category/${category?.toLowerCase()}`;
      } else if (type === "freelancer") {
        url = `${REACT_APP_API_URL_NEW}/api/service/freelancer/${freelanceId}`;
      }
      const response = await axios.get(url);
      setServices(response.data);
      setLoading(false); // Stop loading after data is fetched
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false); // Stop loading in case of error
    }
  };

  useEffect(() => {
    getServices();
  }, [type, category]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={() => console.log('Search pressed')}>
            <Search color="#000" size={24} />
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={services}
            renderItem={({ item }) => <ServiceCard service={item} cardWidth={0.9} />}
            keyExtractor={(item, index) => item.id || index.toString()}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BestServicesScreen;
