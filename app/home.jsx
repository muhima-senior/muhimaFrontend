import { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import Header from "../components/Home/Header";
import { COLORS, icons, images, SIZES } from "../constants";
import SearchBar from "../components/Home/SearchBar";
import CategoriesSection from "../components/Home/CategoriesSection";
import BestServicesSection from "../components/Home/BestServicesSection";
import BottomNavBar from "../components/Home/BottomNavbar";


const Home = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          header: Header,
          headerTitle: "",
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
          }}
        >
      <SearchBar/>
      <CategoriesSection/>
      <BestServicesSection/>
        </View>
        </ScrollView>
        <BottomNavBar/>
    </SafeAreaView>
  );
};

export default Home;