import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import Base64Image from '../../components/Base64Image';
import { COLORS } from '../../constants/theme';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';

const Header = ({ username, navigation, route, userId }) => {
  const [ homeowner, setHomeowner] = useState(null)
  const getHomeownerData = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/homeowner/user/${userId}`);
      setHomeowner(response.data);
    } catch (error) {
      console.error('Error homeonwer details:', error);
    }
  };
  useEffect(() => {
    if(userId)
      getHomeownerData()
  }, [userId])
  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
      {homeowner?.pictureData ? (
          <Base64Image
            base64String={homeowner.pictureData}
            style={styles.profilePic}
          />
        ) : (
          <Text>No image available</Text>
        )}
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
    padding: 16,
    paddingTop: 40,
    marginBottom: 10,  // Add a bottom margin to separate it from the SearchBar
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
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});

export default Header;