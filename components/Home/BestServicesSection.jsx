import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ServiceCard from './ServiceCard';
import { useRouter } from 'expo-router';

export const services = [
  {
    
    id: '1',
    title: 'Complete House Cleaning',
    currentPrice: 150,
    originalPrice: 180,
    rating: 4.5,
    reviewCount: 110,
    providerName: 'Ali ',
    providerImage: 'https://st2.depositphotos.com/4232343/8203/i/950/depositphotos_82035308-stock-photo-attractive-young-stay-at-home.jpg',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCaMtWBO9bSkTz-m-San3T2dXMIXFJvDOHdw&s',
  },
  {
    
    id: "2",
    title: "Premium Gardening Service",
    currentPrice: 120,
    originalPrice: 150,
    rating: 5,
    reviewCount: 24,
    providerName: "Green Thumb Gardening",
    providerImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxJIkRR5xaxAjrWIeuiGkZBj4cMK7JFkB2CQ&s",
    image: "https://www.lawdonut.co.uk/business/sites/lawdonut-business/files/production/image/gardenservices_0.jpg",
  },

  {
    id: '3',
    title: 'Painting Service',
    currentPrice: 1100,
    originalPrice: 1200,
    rating: 4.8,
    reviewCount: 15,
    providerName: 'Salman',
    providerImage: 'https://static3.bigstockphoto.com/5/8/2/large1500/285815488.jpg',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSZy4SDLzHwRoNTGed_vG578hWbd_TcLGn4A&s',
  },
  // Add more services as needed
];


const BestServicesSection = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const handleSeeAll = () => {
    router.push('/bestservicescreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Best Services</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        renderItem={({ item }) => <ServiceCard service={item} />}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
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