import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { MessageSquare, Search } from 'lucide-react-native';
import { ArrowLeft, Star } from 'lucide-react-native';
import { useGlobalStore } from './store/GlobalStore';


const ChatListScreen = () => {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, userType } = useGlobalStore();

  const dummyChats = [
    {
      projectId: '123',
      freelancerId: 'f1',
      homeownerId: 'h1',
      freelancerName: 'John Doe',
      serviceName: 'Interior Design',
      lastMessage: 'Looking forward to our meeting!',
      lastMessageTime: '2:30 PM',
      unreadCount: 3,
      freelancerProfilePic: 'https://via.placeholder.com/50',
    },
    {
      projectId: '124',
      freelancerId: 'f2',
      homeownerId: 'h1',
      freelancerName: 'Jane Smith',
      serviceName: 'Plumbing Services',
      lastMessage: 'Thank you for your feedback.',
      lastMessageTime: '1:15 PM',
      unreadCount: 1,
      freelancerProfilePic: 'https://via.placeholder.com/50',
    },
    {
      projectId: '125',
      freelancerId: 'f3',
      homeownerId: 'h1',
      freelancerName: 'Michael Lee',
      serviceName: 'Gardening Services',
      lastMessage: 'Let me know if you have any questions.',
      lastMessageTime: '11:45 AM',
      unreadCount: 0,
      freelancerProfilePic: 'https://via.placeholder.com/50',
    },
  ];

  const fetchChats = async () => {
    try {
      console.log(userId)
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/chat/getChats/${userId}`);
      setChats(response.data.chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats(dummyChats); // Use dummy data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const ChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => router.push({
        pathname: 'chat',
        params: {
          freelancerId: item.freelancerId._id,
          freelancerName: item.freelancerId.username,
          userType: userType,
          homeownerName: item.homeownerId.username, 
          homeownerId: item.homeownerId._id
        }
      })}
    >
      <Image 
        source={userType === 'Homeowner' ? item.freelancerId.pictureData : item.homeownerId.pictureData}
        style={styles.profileImage} 
      />
      <View style={styles.chatDetails}>
        <View style={styles.chatHeader}>
        <Text style={styles.freelancerName}>
          {userType === 'Homeowner' ? item.freelancerId.username : item.homeownerId.username}
        </Text>
        <Text style={styles.timestamp}>{item.lastMessageTime}</Text>
        </View>
        <Text 
          style={styles.lastMessage} 
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={{ width: 24 }} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0084ff" />
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageSquare size={64} color="#ccc" />
          <Text style={styles.emptyText}>No conversations yet</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={({ item }) => <ChatItem item={item} />}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.chatList}
        />
      )}
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
  chatList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freelancerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#0084ff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default ChatListScreen;
