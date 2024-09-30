import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, SafeAreaView, Dimensions } from 'react-native';
import { Stack, useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

const MuhimaSignInScreen = () => {
  const router = useRouter();

  const HandleSignIn = () => {
    router.push({
      pathname: 'signinscreen',
    });
  };

    const HandleFreelancerSignIn = () => {
      router.push({
        pathname: 'Freelancer/freelancersigninscreen',
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
      <ImageBackground
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRygkkjgvrVKbEzhxpXQuN3nR7OEi7BDRp13A&s' }}
        style={styles.background}
      >
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
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
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.1,
    paddingHorizontal: width * 0.05,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4169E1',
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
    color: '#FFFFFF',
    fontSize: width * 0.04,
    textDecorationLine: 'underline',
  },
});

export default MuhimaSignInScreen;