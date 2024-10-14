import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Stack, useRouter } from "expo-router";
import axios from 'axios';
import * as yup from 'yup';
import { REACT_APP_API_URL_NEW } from '@env';
import { COLORS, FONT, SIZES, SHADOWS } from '../constants/theme';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      await validationSchema.validate({ email }, { abortEarly: false });

      // Replace with your actual API endpoint
      const response = await axios.post(`${REACT_APP_API_URL_NEW}/api/users/forget-password`, {
        email,
      });

      console.log('Code sent successfully:', response.data);
      Alert.alert('Success', 'Verification code sent to your email');
      router.push({
        pathname: 'resetpassword',
        params: { email },
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Send code error:', error);
        Alert.alert('Error', 'Failed to send verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightWhite} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email to receive a verification code</Text>

            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TouchableOpacity style={styles.sendCodeButton} onPress={handleSendCode} disabled={isLoading}>
              <Text style={styles.sendCodeButtonText}>{isLoading ? 'Sending...' : 'Send Code'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>Back to Sign In</Text>
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
    padding: SIZES.large,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  sendCodeButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 50,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
    ...SHADOWS.medium,
  },
  sendCodeButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
  },
  backText: {
    fontSize: SIZES.medium,
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
  fieldLabel: {
    alignSelf: 'flex-start',
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
    marginBottom: SIZES.xSmall,
  },
});

export default ForgotPasswordScreen;