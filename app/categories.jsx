import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  { id: '1', name: 'Carpenter', icon: '🔧', services: '10 Services' },
  { id: '2', name: 'Cleaner', icon: '🧹', services: '5 Services' },
  { id: '3', name: 'Painter', icon: '🎨', services: '8 Services' },
  { id: '4', name: 'Electrician', icon: '⚡', services: '12 Services' },
  { id: '5', name: 'AC Repair', icon: '❄️', services: '7 Services' },
  { id: '6', name: 'Plumber', icon: '🔧', services: '6 Services' },
  { id: '7', name: "Men's Salon", icon: '💇', services: '3 Services' }
];

const CategoriesSection = () => {
  const router = useRouter();
  
  const handleCategorySelection = (categoryName) => {
    console.log("Category selected: ", categoryName);
    router.push({
      pathname: '/bestservicescreen',  // Ensure this is the correct route to BestServicesScreen
      params: { 
        type: "category", 
        title: `${categoryName} Services`, 
        category: categoryName  // Pass category to the next screen
      },
    });
  };

  const handleSeeAll = () => {
    router.push('/categories'); // Navigate to the categories page
  };

  return (
    <SafeAreaView style={styles.container}>
 
        <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft color="#000" size={24}  marginTop= {20} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Categories</Text>
                <View style={{ width: 26 }} />
            </View>
      
      <ScrollView style={styles.scrollView}>
        {categories.map((category, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.categoryItem} 
            onPress={() => handleCategorySelection(category.name)}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>{category.icon}</Text>
            </View>
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryName}>{category.name}</Text>

            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#4A90E2',
  },
  scrollView: {
    marginBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  servicesCount: {
    fontSize: 12,
    color: '#888',
  },
});

export default CategoriesSection;
