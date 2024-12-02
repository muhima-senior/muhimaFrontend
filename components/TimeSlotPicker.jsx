import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet,Dimensions } from 'react-native';
import { useRouter } from "expo-router";

const TimeSlotPicker = ({ availableSlots, quantity, total, serviceId, serviceName }) => {

  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [upcomingDates, setUpcomingDates] = useState([]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const router = useRouter();

  // Generate upcoming dates for the next month
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date,
        day: days[date.getDay()],
        label: `${date.getDate()} ${dayLabels[date.getDay()]}`
      });
    }
    setUpcomingDates(dates);
  }, []);

  const handleTimeSelect = (time, dateObj) => {
    const slot = { day: selectedDay, time, date: dateObj.date.toLocaleDateString() };
    const slotExists = selectedSlots.some(
      existingSlot => existingSlot.day === slot.day && existingSlot.time === slot.time && existingSlot.date === slot.date
    );

    if (slotExists) {
      setSelectedSlots(selectedSlots.filter(
        existingSlot => !(existingSlot.day === slot.day && existingSlot.time === slot.time && existingSlot.date === slot.date)
      ));
    } else if (selectedSlots.length < quantity) {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const isTimeSelected = (time, date) => {
    return selectedSlots.some(
      slot => slot.day === selectedDay && slot.time === time && slot.date === date.toLocaleDateString()
    );
  };

  const getSelectedSlotsForDay = (day) => {
    return selectedSlots.filter(slot => slot.day === day).length;
  };

const proceedToCheckout = () => {
  const checkoutData = {
    serviceId,
    total,
    selectedSlots: JSON.stringify(selectedSlots), // Serialize complex data
    quantity,
    serviceName,
  };
  router.push({
    pathname: '/checkout',
    params: checkoutData,
  });
};

  
  return (
    <View style={styles.container}>
       <View style={styles.content}>
      {/* Select Date */}
      <Text style={styles.header}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayContainer}>
        {upcomingDates.map((dateObj, index) => {
          const slotsForDay = getSelectedSlotsForDay(dateObj.day);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDay === dateObj.day && styles.selectedDayButton,
                slotsForDay > 0 && styles.dayWithSelection
              ]}
              onPress={() => setSelectedDay(dateObj.day)}
            >
              <Text style={[
                styles.dayText,
                selectedDay === dateObj.day && styles.selectedDayText,
                slotsForDay > 0 && styles.dayWithSelectionText
              ]}>
                {dateObj.label}
                {slotsForDay > 0 && ` (${slotsForDay})`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Select Time */}
      <Text style={styles.header}>
        Select Time (Selected: {selectedSlots.length}/{quantity})
      </Text>
      <View style={styles.timeContainer}>
        {availableSlots[selectedDay]?.length > 0 ? (
          availableSlots[selectedDay].map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeButton,
                isTimeSelected(time, upcomingDates.find(date => date.day === selectedDay)?.date) && styles.selectedTimeButton
              ]}
              onPress={() => handleTimeSelect(time, upcomingDates.find(date => date.day === selectedDay))}
            >
              <Text style={[
                styles.timeText,
                isTimeSelected(time, upcomingDates.find(date => date.day === selectedDay)?.date) && styles.selectedTimeText
              ]}>{time}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noSlotsText}>No slots available</Text>
        )}
      </View>

      {/* Selected Slots Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryHeader}>Selected Slots:</Text>
        {selectedSlots.map((slot, index) => (
          <Text key={index} style={styles.summaryText}>
            {dayLabels[days.indexOf(slot.day)]}, {slot.date}: {slot.time}
          </Text>
        ))}
      </View>

      {/* Proceed to Checkout Button */}
      </View>
      <TouchableOpacity 
        style={[
          styles.checkoutButton,
          selectedSlots.length === 0 && styles.disabledButton
        ]}
        disabled={selectedSlots.length === 0}
        onPress={proceedToCheckout}
      >
        <Text style={styles.checkoutButtonText}>
          Proceed to Checkout ({selectedSlots.length}/{quantity})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: Dimensions.get('window').height * 0.9, // Limit height to 90% of screen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
  padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dayContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedDayButton: {
    backgroundColor: '#d0e2ff',
  },
  dayWithSelection: {
    borderWidth: 2,
    borderColor: '#007aff',
  },
  dayText: {
    fontSize: 16,
    color: '#666',
  },
  selectedDayText: {
    fontWeight: 'bold',
    color: '#007aff',
  },
  dayWithSelectionText: {
    color: '#007aff',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    margin: 5,
  },
  selectedTimeButton: {
    backgroundColor: '#d0e2ff',
  },
  timeText: {
    fontSize: 16,
    color: '#666',
  },
  selectedTimeText: {
    fontWeight: 'bold',
    color: '#007aff',
  },
  noSlotsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  summaryContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  summaryHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  checkoutButton: {
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#312651',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimeSlotPicker;
