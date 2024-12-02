import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Platform 
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from "expo-router";
import { COLORS, FONT, SIZES } from '../../constants/theme';

const Privacy = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.white} 
      />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <ArrowLeft color={COLORS.black} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content Section */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  backButton: {
    width: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.black,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  content: {
    fontSize: SIZES.medium,
    lineHeight: 24,
    fontFamily: FONT.regular,
    color: COLORS.gray,
  },
});

export default Privacy;