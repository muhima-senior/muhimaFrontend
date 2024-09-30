import { Stack } from "expo-router";
import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";

// SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure any route can link back to /
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
    <Stack initialRouteName="home">
      <Stack.Screen name="home" />
      <Stack.Screen name="bestservicescreen" />
      <Stack.Screen name="servicedetailscreen" />
      <Stack.Screen name="bookingsummary" />
      <Stack.Screen name="landingpage" />
      <Stack.Screen name="signinscreen" />
      <Stack.Screen name="signupscreen" />
      <Stack.Screen name="Freelancer/freelancersigninscreen" />
      <Stack.Screen name="Freelancer/freelancersignup" />

    </Stack>
  )
};

export default Layout;
