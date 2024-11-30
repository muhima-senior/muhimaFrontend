import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalStore } from '../../app/store/GlobalStore';


const CategoryItem = ({ item, handleCategorySelection }) => (
  <TouchableOpacity
    style={styles.categoryItem}
    onPress={() => handleCategorySelection(item.name)}
  >
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>{item.icon}</Text>
    </View>
    <Text style={styles.categoryName}>{item.name}</Text>

  </TouchableOpacity>
);

const handleSeeAll = () => {
  router.push({
    pathname: 'categories',
    params: { type: "category", title: "All Categories", category: "None" },
  });
};

const CategoriesSection = () => {
  const router = useRouter();
  const { categories } = useGlobalStore();

  const handleCategorySelection = (categoryName) => {
    console.log("Category: ", categoryName)
    router.push({
      pathname: 'bestservicescreen',
      params: { type: "category", title: `${categoryName} Services`, category: categoryName },
    });
  }
  const handleSeeAll = () => {
    router.push('categories'); // Navigate to the categories page
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Categories</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        renderItem={({ item }) => <CategoryItem item={item} handleCategorySelection={handleCategorySelection} />}
        keyExtractor={item => item.id}
        numColumns={4}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#312651',
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 2,
  },
  servicesCount: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  }
});

export default CategoriesSection;