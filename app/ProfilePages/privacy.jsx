import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Privacy = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>
      <ScrollView>
        <Text style={styles.content}>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information:
          {"\n\n"}
          1. Information Collection: {"\n"}
          We may collect personal information such as your name, email address, and usage data to improve your experience. {"\n\n"}
          2. Use of Information: {"\n"}
          Your information will be used to provide and improve our services, send notifications, and ensure the app functions as intended. {"\n\n"}
          3. Data Protection: {"\n"}
          We use industry-standard security measures to protect your data. {"\n\n"}
          4. Third Parties: {"\n"}
          We do not share your personal information with third parties without your consent, except as required by law. {"\n\n"}
          5. Updates to Policy: {"\n"}
          We may update this policy from time to time. Continued use of the app constitutes acceptance of these updates.
          {"\n\n"}
          For questions, contact us at support@example.com.
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

export default Privacy;
