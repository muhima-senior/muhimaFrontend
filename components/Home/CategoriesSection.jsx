import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Zap, PaintBucket, Brush, Scissors, Snowflake, Droplet, Hammer, Flower } from 'lucide-react-native';

const categories = [
  { id: '1', name: 'Electrician', icon: Zap },
  { id: '2', name: 'Painter', icon: PaintBucket },
  { id: '3', name: 'Cleaner', icon: Brush },
  { id: '4', name: 'Tiling', icon: Scissors },
  { id: '5', name: 'AC Repair', icon: Snowflake },
  { id: '6', name: 'Plumber', icon: Droplet },
  { id: '7', name: 'Carpenter', icon: Hammer },
  { id: '8', name: 'Gardener', icon: Flower },
];

const CategoryItem = ({ item }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.iconContainer}>
      <item.icon color="#4A90E2" size={24} />
    </View>
    <Text style={styles.categoryName}>{item.name}</Text>
  </TouchableOpacity>
);

const CategoriesSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        renderItem={({ item }) => <CategoryItem item={item} />}
        keyExtractor={item => item.id}
        numColumns={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    color: '#4A90E2',
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
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CategoriesSection;