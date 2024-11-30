import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from "expo-router";
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';

const Privacy = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={COLORS.black} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }}>
          {/* Placeholder for spacing */}
        </View>
      </View>

      {/* Content Section */}
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
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.black,
  },
  content: {
    fontSize: SIZES.medium,
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
    fontFamily: FONT.regular,
    color: COLORS.gray,
  },
});

export default Privacy;
