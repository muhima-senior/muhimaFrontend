import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Stack, useRouter } from "expo-router";
import axios from 'axios';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';

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
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      await validationSchema.validate({ fullName, email, password, verifyPassword }, { abortEarly: false });

      const api = axios.create({ baseURL: API_URL });
      const response = await api.post(`${API_URL}/api/users/signup`, {
        username: fullName,
        email,
        password,
        userType: 'Homeowner',
      });

      console.log('Sign up successful:', response.data);
      Alert.alert('Success', 'Account created successfully!');
      router.push('home');
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Sign up error:', error);
        Alert.alert('Error', 'Failed to create account. Please try again.');
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Enter your details to Sign up</Text>

        <Text style={styles.fieldLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#B0B0B0"
          value={fullName}
          onChangeText={handleInputChange(setFullName, 'fullName')}
          autoCapitalize="words"
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#B0B0B0"
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
            placeholderTextColor="#B0B0B0"
            value={password}
            onChangeText={handleInputChange(setPassword, 'password')}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordButton}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#B0B0B0" />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <Text style={styles.fieldLabel}>Verify Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Re-enter your password"
            placeholderTextColor="#B0B0B0"
            value={verifyPassword}
            onChangeText={handleInputChange(setVerifyPassword, 'verifyPassword')}
            secureTextEntry={!showVerifyPassword}
          />
          <TouchableOpacity onPress={toggleShowVerifyPassword} style={styles.showPasswordButton}>
            <Ionicons name={showVerifyPassword ? 'eye-off' : 'eye'} size={24} color="#B0B0B0" />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333333',
  },
  showPasswordButton: {
    padding: 10,
  },
  signUpButton: {
    backgroundColor: '#1E90FF',
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInText: {
    fontSize: 16,
    color: '#333333',
  },
  signInLink: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  fieldLabel: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
});

export default CreateAccountScreen;
