import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { REACT_APP_API_URL_NEW } from '@env';
import { useRouter, Stack } from "expo-router";
import axios from 'axios';

const ReviewScreen = () => {
  const [rating, setRating] = useState(0);
  const [recommended, setRecommended] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [appointmentId, setAppointmentId] = useState(null)
  const router = useRouter();

  const route = useRoute(); // Access the route params

  useEffect(() => {
    if (route.params?.appointmentId) {
      setAppointmentId(route.params.appointmentId); // Extract appointmentId from params
    }
    console.log(appointmentId)
  }, [route.params]);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starContainer}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color="#007AFF"
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const getRatingText = () => {
    if (rating === 0) return 'Rate Your Service';
    if (rating === 5) return 'My Service was Excellent';
    if (rating === 4) return 'My Service was Good';
    if (rating === 3) return 'My Service was Average';
    if (rating === 2) return 'My Service was Poor';
    return 'My Service was Terrible';
  };


  const handleSubmit = async () => {
    const payload = {
      appointmentId,
      rating,
      comments: reviewText,
    };
  
    const url = `${REACT_APP_API_URL_NEW}/api/rating/addRating`;
  
    console.log('Payload:', payload);
    console.log('URL:', url);
  
    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Response Data:', response.data);
      Alert.alert('Success', 'Your review has been submitted successfully!');
      router.push({
        pathname: 'home',
      });
    } catch (error) {
      console.error('Error:', error.response || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Something went wrong!'
      );
    }
  };
   

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Write a Review</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView}>
          <Text style={styles.ratingText}>{getRatingText()}</Text>
          
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          
          <View style={styles.reviewInputContainer}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review here..."
              multiline
              value={reviewText}
              onChangeText={setReviewText}
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.recommendContainer}
            onPress={() => setRecommended(!recommended)}
          >
            <View style={styles.checkbox}>
              {recommended && (
                <Ionicons name="checkmark" size={16} color="#007AFF" />
              )}
            </View>
            <Text style={styles.recommendText}>
              I recommended this service provider to my friends
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.submitButton, 
              { opacity: rating === 0 ? 0.5 : 1 }
            ]}
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 24, // To offset the back button and center the title
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  starContainer: {
    marginRight: 8,
  },
  reviewInputContainer: {
    marginBottom: 20,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    height: 120,
    fontSize: 16,
  },
  recommendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendText: {
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewScreen;