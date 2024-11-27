import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Terms = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Terms and Conditions</Text>
      <ScrollView>
        <Text style={styles.content}>
          Welcome to our app. By using our services, you agree to the following terms and conditions:
          {"\n\n"}
          2. Do not misuse the app by attempting unauthorized access. {"\n"}
          3. Content shared on the app must comply with our community guidelines. {"\n"}
          4. We are not liable for any damages caused by the misuse of the app. {"\n"}
          5. These terms are subject to change at any time.
          {"\n\n"}
          Please read our Privacy Policy for more details on how your data is handled.
          {"\n\n"}
          If you have any questions, feel free to contact our support team.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default Terms;
