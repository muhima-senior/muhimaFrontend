import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { Stack, useRouter } from "expo-router";
import axios from 'axios';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { REACT_APP_API_URL_NEW } from '@env';
import { COLORS, FONT, SIZES, SHADOWS } from '../constants/theme';
import { useGlobalStore } from './store/GlobalStore';


const validationSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  verifyPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const CreateAccountScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const { userType, setUserType } = useGlobalStore();
  const { userId, setUserId } = useGlobalStore();

  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      await validationSchema.validate({ fullName, email, password, verifyPassword }, { abortEarly: false });

      const api = axios.create({ baseURL: REACT_APP_API_URL_NEW });
      const response = await api.post('/api/users/signup', {
        username: fullName,
        email,
        password,
        userType: userType,
      });
      const data = await response.data;
      console.log(data)
      setUserId(data.userId)
      console.log('Sign up successful:', response.data);
      Alert.alert('Success', 'Account created successfully!');
      if (userType == 'Freelancer')
        router.push('Freelancer/createprofile');
      else if (userType == 'Homeowner')
        router.push('Homeowner/createProfile');
      else
        router.push('home');

    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Sign up error:', error.response.data.message);
        Alert.alert('Error', 'Failed to create account. ' + error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    console.log('Sign In pressed');
    router.push({ pathname: 'signinscreen' });
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowVerifyPassword = () => setShowVerifyPassword(!showVerifyPassword);

  const handleInputChange = (setter, field) => (value) => {
    setter(value);
    setErrors((prev) => ({ ...prev, [field]: undefined })); // Clear the specific error
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Enter your details to Sign up</Text>

            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.gray}
              value={fullName}
              onChangeText={handleInputChange(setFullName, 'fullName')}
              autoCapitalize="words"
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={handleInputChange(setEmail, 'email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.gray}
                value={password}
                onChangeText={handleInputChange(setPassword, 'password')}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordButton}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <Text style={styles.fieldLabel}>Verify Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Re-enter your password"
                placeholderTextColor={COLORS.gray}
                value={verifyPassword}
                onChangeText={handleInputChange(setVerifyPassword, 'verifyPassword')}
                secureTextEntry={!showVerifyPassword}
              />
              <TouchableOpacity onPress={toggleShowVerifyPassword} style={styles.showPasswordButton}>
                <Ionicons name={showVerifyPassword ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            {errors.verifyPassword && <Text style={styles.errorText}>{errors.verifyPassword}</Text>}

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={isLoading}>
              <Text style={styles.signUpButtonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInText}>
                Already a Member? <Text style={styles.signInLink}>Sign In</Text>
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
  signUpButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
    ...SHADOWS.medium,
  },
  signUpButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
  },
  signInText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
  },
  signInLink: {
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

export default CreateAccountScreen;