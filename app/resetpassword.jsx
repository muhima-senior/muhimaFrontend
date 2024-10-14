import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import axios from 'axios';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { REACT_APP_API_URL_NEW } from '@env';
import { COLORS, FONT, SIZES, SHADOWS } from '../constants/theme';

const validationSchema = yup.object().shape({
  code: yup.string().required('Verification code is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const ResetPasswordScreen = () => {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      await validationSchema.validate({ code, password, confirmPassword }, { abortEarly: false });

      const response = await axios.post(`${REACT_APP_API_URL_NEW}/api/users/reset-password`, {
        email,
        resetCode: code,
        newPassword: password,
      });

      console.log('Password reset successful:', response.data);
      Alert.alert('Success', 'Your password has been reset successfully');
      router.push('signinscreen');
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Reset password error:', error);
        Alert.alert('Error', 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter the verification code sent to your email and your new password</Text>

            <Text style={styles.fieldLabel}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              placeholderTextColor={COLORS.gray}
              value={code}
              onChangeText={(text) => {
                setCode(text);
                setErrors((prevErrors) => ({ ...prevErrors, code: '' }));
              }}

            />
            {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}

            <Text style={styles.fieldLabel}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter new password"
                placeholderTextColor={COLORS.gray}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordButton}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <Text style={styles.fieldLabel}>Confirm New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm new password"
                placeholderTextColor={COLORS.gray}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={toggleShowConfirmPassword} style={styles.showPasswordButton}>
                <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

            <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword} disabled={isLoading}>
              <Text style={styles.resetButtonText}>{isLoading ? 'Resetting...' : 'Reset Password'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>Back</Text>
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
  resetButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 50,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
    ...SHADOWS.medium,
  },
  resetButtonText: {
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

export default ResetPasswordScreen;