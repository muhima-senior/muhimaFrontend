import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ServiceCard from '../components/Home/ServiceCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from "expo-router";
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { useRoute } from '@react-navigation/native';

const BestServicesScreen = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();

  const { title, type, category } = route.params;  // Extracting params from the route
  console.log(title, type, category)

  const getServices = async () => {
    try {
      let url = `${REACT_APP_API_URL_NEW}/api/service`;

      if (type === "best") {
        url = `${REACT_APP_API_URL_NEW}/api/service`;
      }
      else if (type === "category") {
        url = `${REACT_APP_API_URL_NEW}/api/service/category/${category.toLowerCase()}`;
      }
      console.log(url)
      const response = await axios.get(url);
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
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity>
            <Search color="#000" size={24} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={services}
          renderItem={({ item }) => <ServiceCard service={item} />}
          keyExtractor={item => item._id}
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
});

export default BestServicesScreen;
