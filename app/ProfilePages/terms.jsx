import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import { useRouter } from "expo-router";

const Terms = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={COLORS.black} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
        <View style={{ width: 24 }}>
          {/* Placeholder View for spacing, no text here */}
        </View>
      </View>

      {/* Content Section */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.content}>
          Welcome to our app. By using our services, you agree to the following terms and conditions:
          {"\n\n"}
          1. Use the app responsibly. {"\n"}
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
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  content: {
    fontSize: SIZES.medium,
    lineHeight: 24,
    fontFamily: FONT.regular,
    color: COLORS.gray,
  },
});

export default Terms;
