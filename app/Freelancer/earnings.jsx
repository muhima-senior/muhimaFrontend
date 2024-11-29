import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import ArrowLeft from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { REACT_APP_API_URL_NEW } from '@env';
import { COLORS, FONT, SIZES } from '../../constants';
import { useGlobalStore } from '../store/GlobalStore';

const EarningsScreen = () => {
  const router = useRouter();
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { userId } = useGlobalStore();

  // Sort payment methods with priority
  const sortPaymentMethods = (earnings) => {
    const paymentMethodOrder = {
      'CreditCard': 1,
      'OnlineTransfer': 2,
      'COD': 3
    };

    return earnings.sort((a, b) => {
      // First, sort by payment method priority
      const methodPriorityComparison = 
        (paymentMethodOrder[a.paymentMethod] || 4) - 
        (paymentMethodOrder[b.paymentMethod] || 4);
      
      // If payment methods are the same, sort by most recent date
      if (methodPriorityComparison === 0) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      
      return methodPriorityComparison;
    });
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const handleRefund = async (bookingId) => {
    try {
      await axios.post(`${REACT_APP_API_URL_NEW}/api/freelancer/refund`, { 
        bookingId 
      });
      // Refresh earnings after refund
      fetchEarnings();
      Alert.alert('Success', 'Refund processed successfully');
    } catch (error) {
      console.error('Error processing refund:', error);
      Alert.alert('Error', 'Could not process refund');
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL_NEW}/api/appointment/freelancer/${userId}`);
      const sortedEarnings = sortPaymentMethods(response.data);
      setEarnings(sortedEarnings);
      calculateTotalEarnings(sortedEarnings);
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      setLoading(false);
      Alert.alert('Error', 'Could not fetch earnings');
    }
  };

  const calculateTotalEarnings = (earningsData) => {
    const total = earningsData.reduce((sum, earning) => sum + earning.total, 0);
    setTotalEarnings(total);
  };

  const handleMarkPaymentReceived = async (bookingId) => {
    try {
      await axios.post(`${REACT_APP_API_URL_NEW}/api/freelancer/mark-payment-received`, { 
        bookingId 
      });
      // Refresh earnings after marking payment
      fetchEarnings();
      Alert.alert('Success', 'Payment marked as received');
    } catch (error) {
      console.error('Error marking payment:', error);
      Alert.alert('Error', 'Could not mark payment received');
    }
  };

  const renderPaymentMethodIcon = (method) => {
    switch (method) {
      case 'CARD':
        return <Icon name="credit-card" size={20} color={COLORS.primary} />;
      case 'COD':
        return <Icon name="money" size={20} color={COLORS.primary} />;
      case 'OnlineTransfer':
        return <Icon name="exchange" size={20} color={COLORS.primary} />;
      default:
        return <Icon name="money" size={20} color="#666" />;
    }
  };

  const renderEarningItem = ({ item }) => {
    const renderPaymentAction = () => {
      // Always show 'Mark Received' button for COD payments
      if (item.paymentMethod === 'COD') {
        return (
          <TouchableOpacity 
            style={styles.markReceivedButton}
            onPress={() => handleMarkPaymentReceived(item._id)}
          >
            <Text style={styles.markReceivedButtonText}>Mark Received</Text>
          </TouchableOpacity>
        );
      }
      
      // For other payments, show the Refund button if it's CreditCard or OnlineTransfer
      if (item.paymentMethod === 'CreditCard' || item.paymentMethod === 'OnlineTransfer') {
        return (
          <TouchableOpacity 
            style={styles.refundButton}
            onPress={() => handleRefund(item._id)}
          >
            <Text style={styles.refundButtonText}>Refund</Text>
          </TouchableOpacity>
        );
      }
      
      // For other cases or cancelled bookings, show 'Paid' or 'Cancelled' text
      return (
        <Text style={[
          styles.paymentStatusText, 
          item.status === 'Cancelled' && styles.cancelledStatusText
        ]}>
          {item.status === 'Cancelled' ? 'Cancelled' : 'Paid'}
        </Text>
      );
    };
  
    return (
      <View style={styles.earningItem}>
        <View style={styles.earningHeader}>
          <View style={styles.earningHeaderLeft}>
            {renderPaymentMethodIcon(item.paymentMethod)}
            <Text style={styles.earningTitle}>
              {item.gigTitle || 'Service Booking'}
            </Text>
          </View>
          <Text style={styles.earningAmount}>SAR {item.total}</Text>
        </View>
        
        <View style={styles.earningDetails}>
          <Text style={styles.detailText}>
            Payment Method: 
            <Text style={styles.detailHighlight}> {item.paymentMethod}</Text>
          </Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusDot, 
              item.status === 'Pending' && styles.pendingStatus,
              item.status === 'Confirmed' && styles.confirmedStatus,
              item.status === 'Completed' && styles.completedStatus,
              item.status === 'Cancelled' && styles.cancelledStatus
            ]} />
            
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          
          <View style={styles.actionContainer}>
            {renderPaymentAction()}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft name="arrow-left" color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Earnings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Total Earnings Card */}
      <View style={styles.totalEarningsCard}>
        <Text style={styles.totalEarningsLabel}>Total Earnings</Text>
        <Text style={styles.totalEarningsAmount}>SAR {totalEarnings.toFixed(2)}</Text>
      </View>

      {/* Earnings List */}
      <FlatList
        data={earnings}
        renderItem={renderEarningItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No earnings found</Text>
          </View>
        }
        contentContainerStyle={styles.earningsList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalEarningsCard: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalEarningsLabel: {
    fontSize: 16,
    color: '#555',
  },
  totalEarningsAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  earningsList: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  earningItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  earningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  earningHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  earningAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  earningDetails: {
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  detailHighlight: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pendingStatus: {
    backgroundColor: 'orange',
  },
  confirmedStatus: {
    backgroundColor: 'green',
  },
  completedStatus: {
    backgroundColor: 'blue',
  },
  cancelledStatus: {
    backgroundColor: 'red',
  },
  statusText: {
    fontSize: 14,
    color: '#555',
  },
  actionContainer: {
    marginTop: 12,
  },
  markReceivedButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  markReceivedButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  refundButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  refundButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  paymentStatusText: {
    fontSize: 16,
    color: '#555',
  },
  cancelledStatusText: {
    color: 'red',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
});

export default EarningsScreen;
