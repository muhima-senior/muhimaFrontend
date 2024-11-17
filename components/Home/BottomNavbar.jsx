import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Home, Grid, Calendar, MessageSquare, User } from 'lucide-react-native';
import { router } from "expo-router";

const tabs = [
  { name: 'Home', icon: Home },
  { name: 'Categories', icon: Grid },
  { name: 'Bookings', icon: Calendar },
  { name: 'Message', icon: MessageSquare },
  { name: 'Profile', icon: User },
];

const BottomNavBar = () => {
  
  const handlePress = (tab) => {
    if (tab.name === 'Bookings') {
      router.push({
        pathname: 'mybooking',
        params: { type: 'homeowner' },
      });    } else {
      // Handle other tab navigations here if necessary
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity key={index} style={styles.tab} onPress={() => handlePress(tab)}>
          <tab.icon color={tab.name === 'Categories' ? '#4A90E2' : '#999'} size={24} />
          <Text style={[styles.tabText, tab.name === 'Categories' && styles.activeTabText]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#999',
  },
  activeTabText: {
    color: '#4A90E2',
  },
});

export default BottomNavBar;