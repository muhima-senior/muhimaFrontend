import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Stack, useRouter } from "expo-router";
import axios from 'axios';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { REACT_APP_API_URL_NEW } from '@env';
import { COLORS, FONT, SIZES, SHADOWS } from '../constants/theme';
import { useGlobalStore } from './store/GlobalStore';


const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, setUser, userType, setUserId, userId } = useGlobalStore();


  const handleSignIn = async () => {
    try {
      // Validate inputs
      await validationSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
  
      const api = axios.create({
        baseURL: REACT_APP_API_URL_NEW,
      });
  
      // Call signin endpoint
      const response = await api.post('/api/users/signin', {
        email,
        password,
        userType,
      });
  
      if (response.status === 200) {
        setUser(response.data.username);
        setUserId(response.data.userId);
  
        if (userType === 'Freelancer') {
          try {
            const freelancerResponse = await api.get(`/api/freelancer/user/${response.data.userId}`);
            if (freelancerResponse.status === 200) {
              router.push('Freelancer/FreelancerHome');
              Alert.alert('Success', 'Login successful');
            }
          } catch (freelancerError) {
            if (freelancerError.response?.status === 404) {
              router.push('Freelancer/createprofile');
            } else {
              throw freelancerError; // Handle other errors
            }
          }
        } else if (userType === 'Homeowner') {
          try {
            const homeownerResponse = await api.get(`/api/homeowner/user/${response.data.userId}`);
            if (homeownerResponse.status === 200) {
              router.push('home');
              Alert.alert('Success', 'Login successful');
            }
          } catch (homeownerError) {
            if (homeownerError.response?.status === 404) {
              router.push('Homeowner/createProfile');
            } else {
              throw homeownerError; // Handle other errors
            }
          }
        }
        
      }
    } catch (error) {
      // Validation errors
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } 
      // Axios errors
      else if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data);
        if (error.response) {
          switch (error.response.status) {
            case 400:
              Alert.alert('Error', 'User not found');
              break;
            case 401:
              Alert.alert('Error', 'Invalid password');
              break;
            default:
              Alert.alert('Error', 'An unexpected error occurred');
          }
        } else {
          Alert.alert('Error', 'Network error. Please try again.');
        }
      } 
      // Generic errors
      else {
        console.error('Unexpected Error:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };
  
  const handleForgotPassword = () => {
    router.push('forgotpassword');
  };

  const handleSignUp = () => {
    router.push('signupscreen');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Enter your registered Email and Password</Text>

            <Text style={styles.fieldLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor={COLORS.gray}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                  }
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordButton}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>FORGOT PASSWORD</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpText}>
                Don't Have an Account? <Text style={styles.signUpLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.xLarge * 2,
    paddingBottom: SIZES.xLarge,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginBottom: SIZES.xLarge,
    textAlign: 'center',
  },
  fieldLabel: {
    alignSelf: 'flex-start',
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
    marginBottom: SIZES.xSmall,
  },
  input: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: 50,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.primary,
    ...SHADOWS.small,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    width: '100%',
    height: 50,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SIZES.medium,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.primary,
  },
  showPasswordButton: {
    padding: SIZES.small,
  },
  forgotPassword: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    alignSelf: 'flex-end',
    marginBottom: SIZES.large,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
    ...SHADOWS.medium,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
  },
  signUpText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
  },
  signUpLink: {
    color: COLORS.primary,
    fontFamily: FONT.bold,
  },
  errorText: {
    color: COLORS.tertiary,
    fontSize: SIZES.small,
    fontFamily: FONT.regular,
    marginBottom: SIZES.small,
    alignSelf: 'flex-start',
  },
});

export default SignInScreen;