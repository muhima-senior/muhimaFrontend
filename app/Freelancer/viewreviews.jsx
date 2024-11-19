import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { useGlobalStore } from '../store/GlobalStore';
import Base64Image from '../../components/Base64Image';

const FreelancerReviewsScreen = () => {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useGlobalStore();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_URL_NEW}/api/rating/freelancer/${userId}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      {/* Gig Picture */}
      {item.gig?.pictureData ? (
        <Base64Image
            base64String={item.gig.pictureData}
            style={styles.gigImage}
        />
      ) : (
        <View style={[styles.gigImage, styles.placeholder]}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
        </View>
      )}

      <View style={styles.reviewDetails}>
        {/* Gig Title */}
        <Text style={styles.gigTitle}>{item.gig?.title || 'Untitled Gig'}</Text>

        {/* Rating Stars */}
        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Ionicons
              key={index}
              name={index < item.rating ? 'star' : 'star-outline'}
              size={20}
              color="#FFD700"
            />
          ))}
        </View>

        {/* Comments */}
        <Text style={styles.comments}>{item.comments || 'No comments provided.'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Freelancer Reviews</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item._id.toString()}
        />
      ) : (
        <Text style={styles.noReviewsText}>No reviews available for this freelancer.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  gigImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  reviewDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  gigTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  comments: {
    fontSize: 14,
    color: '#555',
  },
  noReviewsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default FreelancerReviewsScreen;
