import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Home, Grid, Calendar, MessageSquare, User } from 'lucide-react-native';
import { router, usePathname } from "expo-router";

const tabs = [
  { name: 'Home', icon: Home, route: 'home' },
  { name: 'Categories', icon: Grid, route: 'categories' },
  { name: 'Bookings', icon: Calendar, route: 'Homeowner/mybooking' },
  { name: 'Message', icon: MessageSquare, route: 'message' },
  { name: 'Profile', icon: User, route: 'profilescreen' },
];

const BottomNavBar = () => {
  const pathname = usePathname();

  const isActive = (tabRoute) => {
    // Remove any params from the current route for comparison
    const baseCurrentRoute = pathname.split('?')[0];
    return baseCurrentRoute.includes(tabRoute);
  };

  const handlePress = (tab) => {
    if (tab.name === 'Bookings') {
      router.push({
        pathname: 'Homeowner/mybooking',
        params: { type: 'homeowner' },
      });
    } else if (tab.name === 'Profile') {
      router.push({
        pathname: 'profilescreen',
      });
    } else if (tab.name === 'Home') {
      router.push({
        pathname: 'home',
      });
    } else if (tab.name === 'Categories') {
      router.push({
        pathname: 'categories',
      });
    } else if (tab.name === 'Message') {
      router.push("message");
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const active = isActive(tab.route);
        return (
          <TouchableOpacity 
            key={index} 
            style={styles.tab} 
            onPress={() => handlePress(tab)}
          >
            <tab.icon 
              color={active ? '#4A90E2' : '#999'} 
              size={24} 
            />
            <Text style={[
              styles.tabText, 
              active && styles.activeTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
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