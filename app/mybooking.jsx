import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { useRoute } from '@react-navigation/native';
import { useGlobalStore } from './store/GlobalStore';
import { useRouter, Stack } from "expo-router";


const BookingCard = ({ item }) => {

    const router = useRouter();

    const handleViewDetails = () => {
        router.push({
            pathname: 'bookingdetail',
            params: { id:item._id },
          });
    };
    return (
        <View style={styles.card}>
            <View style={styles.statusContainer}>
                <Text style={[styles.statusText, { color: '#007BFF' }]}>
                    {item.status}
                </Text>
            </View>
            <Text style={styles.title}>{item.gigTitle}</Text>
            <Text style={styles.date}></Text>
            <View style={styles.divider} />
            <View style={styles.footer}>
                <View style={styles.amountContainer}>
                    <Icon name="check-circle" size={20} color="#007BFF" />
                    <Text style={styles.amount}>Amount Paid {item.total}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleViewDetails}
                >
                    <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
                <Icon name="chevron-right" size={24} color="#000" />
            </View>
        </View>
    );
};

const BookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { userId } = useGlobalStore();

    const { title, type, category , id } = route.params; 

    const getBookings = async () => {
        try {
    
          let url = `${REACT_APP_API_URL_NEW}/api/service`;
    
          if (type === "freelancer") {
            url = `${REACT_APP_API_URL_NEW}/api/appointment/freelancer/${userId}`;
          }
          else if (type === "homeowner") {
            url = `${REACT_APP_API_URL_NEW}/api/appointment/user/${userId}`;
          }
    
          console.log(url)
          const response = await axios.get(url);
          setBookings(response.data);
          setLoading(false); // Stop loading after data is fetched
        } catch (error) {
          console.error('Error fetching services:', error);
          setLoading(false); // Stop loading in case of error
          throw error;
        }
      };
    
      useEffect(() => {
        getBookings();
      }, [type, category]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>My Bookings</Text>
            {bookings.map((item, index) => (
                <BookingCard key={index} item={item} />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#eee',
    },
    statusContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#e0f2ff',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amount: {
        fontSize: 14,
        color: '#333',
        marginLeft: 6,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default BookingsScreen;
