import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';

const Header = ({ username, navigation, route }) => {
  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2-Yb6GOCGW4MEaq315XfZgLN0PRsP2Vhpqw&s' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
      <TouchableOpacity>
        <Bell color="#000" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,  // Add a bottom margin to separate it from the SearchBar
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;