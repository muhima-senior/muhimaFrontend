import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, Dimensions } from 'react-native';
import { Stack, useRouter } from "expo-router";
import { useGlobalStore } from './store/GlobalStore';
import { COLORS, FONT, SIZES, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const MuhimaSignInScreen = () => {
  const router = useRouter();
  const { userType, setUserType } = useGlobalStore();

  const HandleSignIn = () => {
    setUserType("Homeowner");
    router.push({
      pathname: 'signinscreen',
    });
  };

  const HandleFreelancerSignIn = () => {
    setUserType("Freelancer");
    router.push({
      pathname: 'signinscreen',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/logo.png')} // Path to your logo image
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to Muhima</Text>
          <Text style={styles.subtitle}>Connecting Freelancers with Opportunities</Text>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.button} onPress={HandleSignIn}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.freelancerLink} onPress={HandleFreelancerSignIn}>Sign in as Freelancer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Set the background color to white
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.1,
    paddingHorizontal: width * 0.05,
  },
  logo: {
    width: width * 0.6, // Adjust the logo width
    height: height * 0.2, // Adjust the logo height
    marginBottom: height * 0.05,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#000000', // Use black text for contrast
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#000000', // Use black text for contrast
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: width * 0.08,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    marginBottom: height * 0.02,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  freelancerLink: {
    color: COLORS.primary,
    fontSize: width * 0.04,
    textDecorationLine: 'underline',
  },
});

export default MuhimaSignInScreen;
