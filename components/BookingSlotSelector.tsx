import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface AvailableSlotsProps {
  availableSlots: Record<string, string[]>;
  onSelectSlot: (day: string, time: string) => void;
  selectedSlots: string[];
}

const BookingSlotSelector: React.FC<AvailableSlotsProps> = ({
  availableSlots,
  onSelectSlot,
  selectedSlots
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('');

  useEffect(() => {
    // Set the first available day as selected by default
    const availableDays = Object.keys(availableSlots);
    if (availableDays.length > 0 && !selectedDay) {
      setSelectedDay(availableDays[0]);
    }
  }, [availableSlots]);

  const isSlotSelected = (day: string, time: string) => {
    return selectedSlots.includes(`${day}-${time}`);
  };

  const formatDayDisplay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1, 3);
  };

  const formatTimeDisplay = (time: string) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.daySelector}>
        {Object.keys(availableSlots).map(day => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDayButton
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[
              styles.dayButtonText,
              selectedDay === day && styles.selectedDayButtonText
            ]}>
              {formatDayDisplay(day)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.timeSlotContainer}>
        {availableSlots[selectedDay]?.map(time => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeSlot,
              isSlotSelected(selectedDay, time) && styles.selectedTimeSlot
            ]}
            onPress={() => onSelectSlot(selectedDay, time)}
          >
            <Text style={[
              styles.timeSlotText,
              isSlotSelected(selectedDay, time) && styles.selectedTimeSlotText
            ]}>
              {formatTimeDisplay(time)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
  },
  selectedDayButton: {
    backgroundColor: '#007AFF',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  selectedDayButtonText: {
    color: '#FFFFFF',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  timeSlot: {
    width: '31%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
    marginRight: '2%',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#007AFF',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333333',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
});

export default BookingSlotSelector;