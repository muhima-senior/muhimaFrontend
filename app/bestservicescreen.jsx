import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
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

      if (type === "best") {
        url = `${REACT_APP_API_URL_NEW}/api/service`;
      } else if (type === "category") {
        url = `${REACT_APP_API_URL_NEW}/api/service/category/${category?.toLowerCase()}`;
      } else if (type === "freelancer") {
        url = `${REACT_APP_API_URL_NEW}/api/service/freelancer/${freelanceId}`;
      }
      const response = await axios.get(url);
      console.log(url)
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
  }, [type, category]);

  return (
    <SafeAreaView style={styles.container} >
      <View >
       
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#000" size={24} />
            </TouchableOpacity> 
             <Text style={styles.headerTitle}>{title}</Text>
            <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={services}
          renderItem={({ item }) => <ServiceCard service={item} cardWidth={0.9} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          nestedScrollEnabled={true}
        />
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
});

export default BestServicesScreen;

