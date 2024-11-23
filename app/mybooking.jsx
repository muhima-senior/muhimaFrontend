import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { useGlobalStore } from './store/GlobalStore';
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, FONT, SIZES, SHADOWS }  from '../constants/theme'; // Assuming you're importing the theme

const BookingCard = ({ item }) => {
    const router = useRouter();

    const handleViewDetails = () => {
        router.push({
            pathname: 'bookingdetail',
            params: { id: item._id },
        });
    };

    return (
        <View style={styles.card}>
            <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Text style={styles.title}>{item.gigTitle}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.divider} />
            <View style={styles.footer}>
                <View style={styles.amountContainer}>
                    <Icon name="check-circle" size={20} color={COLORS.success} />
                    <Text style={styles.amount}>Amount Paid: {item.total}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleViewDetails}>
                    <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'confirmed':
            return COLORS.green;
        case 'canceled':
            return COLORS.red;
        case 'completed':
            return COLORS.primary;
        default:
            return COLORS.gray2;
    }
};

const BookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useGlobalStore();
    const { type } = useLocalSearchParams();
    const router = useRouter();

    const getBookings = async () => {
        try {
            let url = `${REACT_APP_API_URL_NEW}/api/service`;
            if (type === 'freelancer') {
                url = `${REACT_APP_API_URL_NEW}/api/appointment/freelancer/${userId}`;
            } else if (type === 'homeowner') {
                url = `${REACT_APP_API_URL_NEW}/api/appointment/user/${userId}`;
            }
            const response = await axios.get(url);
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBookings();
    }, [type]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft color={COLORS.black} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Bookings</Text>
                <View style={{ width: 24 }} />
            </View>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {bookings.map((item, index) => (
                        <BookingCard key={index} item={item} />
                    ))}
                </ScrollView>
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
        fontSize: SIZES.large,
        fontFamily: FONT.bold,
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.medium,
        padding: 16,
        marginBottom: 16,
        ...SHADOWS.small,
    },
    statusContainer: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: SIZES.xSmall,
        marginBottom: 8,
    },
    statusText: {
        fontSize: SIZES.small,
        fontFamily: FONT.medium,
        color: COLORS.white,
    },
    title: {
        fontSize: SIZES.large,
        fontFamily: FONT.bold,
        color: COLORS.black,
        marginBottom: 4,
    },
    date: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
        color: COLORS.gray,
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.gray2,
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
        fontSize: SIZES.medium,
        fontFamily: FONT.medium,
        color: COLORS.black,
        marginLeft: 6,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: SIZES.xSmall,
    },
    buttonText: {
        color: COLORS.white,
        fontFamily: FONT.bold,
        fontSize: SIZES.small,
    },
});

export default BookingsScreen;
