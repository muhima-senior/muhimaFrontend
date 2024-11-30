import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react-native';
import { REACT_APP_API_URL_NEW } from '@env';
import { Stack, useRouter } from "expo-router";
import { useGlobalStore } from './store/GlobalStore';

const ChatScreen = () => {
  const { 
    freelancerId, 
    freelancerName,
    homeownerId,
    homeownerName
  } = useLocalSearchParams();

  const { userId, userType } = useGlobalStore();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Set isLoading initially to true
  const flatListRef = useRef(null);
  const router = useRouter();
  const [chatId, setChatId] = useState(null);

  // Fetch chat information
  const getChat = async () => {
    try {
      const payload = {
        homeownerId: homeownerId,
        freelancerId: freelancerId
      };
      const response = await axios.post(`${REACT_APP_API_URL_NEW}/api/chat/chat`, payload);
      setChatId(response.data.chat._id);
      console.log("payload: ",payload)
      console.log("Chat id",response.data.chat._id)
    } catch (error) {
      console.error('Error fetching chat:', error);
      Alert.alert('Error', 'Could not load chat');
      setIsLoading(false); // Stop loader if error occurs
    }
  };

  // Fetch messages for the chat
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/message/getMessages/${chatId}`);
      setMessages(response.data.messages);
      setIsLoading(false); // Stop loader after fetching messages
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Could not load messages');
      setIsLoading(false); // Stop loader if error occurs
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    setIsLoading(true);
    try {
      await axios.post(`${REACT_APP_API_URL_NEW}/api/message/send`, {
        content: inputText.trim(),
        senderId: userType === 'Homeowner' ? homeownerId : freelancerId,
        chatId: chatId
      });

      setInputText('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Could not send message');
    } finally {
      setIsLoading(false);
    }
  };

  // Load chat and messages on initial load
  useEffect(() => {
    const loadData = async () => {
      await getChat(); // Wait for getChat() to finish before calling fetchMessages
      if (chatId) {     // Only call fetchMessages after chatId has been set
        fetchMessages();
      }
    };
    loadData();
  }, [freelancerId, chatId]); // Re-run when freelancerId or chatId changes

  const MessageBubble = ({ message }) => {
    const isCurrentUser = message.senderId === userId;
    return (
      <View style={[styles.messageBubble, isCurrentUser ? styles.userBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isCurrentUser ? styles.messageText : styles.otherMessageText]}>{message.content}</Text>
        <Text style={[styles.timestampText, isCurrentUser ? styles.timestampText : styles.otherTimestampText]}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color="#000" size={24} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>
                {userType === 'Homeowner' ? freelancerName : homeownerName}
              </Text>
            </View>
          </View>

          {/* Messages List */}
          <View style={styles.messagesContainer}>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#312651" />
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => <MessageBubble message={item} />}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              />
            )}
          </View>

          {/* Input Container */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: inputText.trim() === '' ? 0.5 : 1 }
              ]}
              onPress={sendMessage}
              disabled={inputText.trim() === ''}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
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
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  headerTitleContainer: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userBubble: {
    backgroundColor: '#0084ff',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: '#e4e4e4',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  otherMessageText: {
    fontSize: 16,
    color: '#000',
  },
  timestampText: {
    fontSize: 10,
    color: '#fff',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  otherTimestampText: {
    fontSize: 10,
    color: '#000',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: '#0084ff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;