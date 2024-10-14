import { useState } from "react";
import { SafeAreaView, FlatList, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import Header from "../components/Home/Header";
import { COLORS, SIZES } from "../constants";
import SearchBar from "../components/Home/SearchBar";
import CategoriesSection from "../components/Home/CategoriesSection";
import BestServicesSection from "../components/Home/BestServicesSection";
import BottomNavBar from "../components/Home/BottomNavbar";
import { useGlobalStore } from './store/GlobalStore';

const Home = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { user, setUser } = useGlobalStore();

  const renderHeader = () => (
    <View style={{ padding: SIZES.medium }}>
      <SearchBar />
      <CategoriesSection />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          header: () => <Header username={user} />,
          headerTitle: "",
        }}
      />
      <FlatList
        data={[/* dummy data, if needed */]}
        renderItem={null} // Since we handle custom components, set this to null
        ListHeaderComponent={renderHeader}
        ListFooterComponent={BestServicesSection}  // Render the BestServices section after categories
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      />
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default Home;
