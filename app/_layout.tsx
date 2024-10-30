import React from 'react';
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { GlobalStoreProvider } from './store/GlobalStore'; // Adjust the import path as needed

export const unstable_settings = {
  initialRouteName: "home",
};

const Layout = () => {
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GlobalStoreProvider>
      <Stack initialRouteName="home">
        <Stack.Screen name="home" />
        <Stack.Screen name="bestservicescreen" />
        <Stack.Screen name="servicedetailscreen" />
        <Stack.Screen name="bookingsummary" />
        <Stack.Screen name="landingpage" />
        <Stack.Screen name="signinscreen" />
        <Stack.Screen name="signupscreen" />
        <Stack.Screen name="Freelancer/createprofile" />
        <Stack.Screen name="Freelancer/FreelancerHome" />
        <Stack.Screen name="Freelancer/createservice" />
      </Stack>
    </GlobalStoreProvider>
  );
};

export default Layout;