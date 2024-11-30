import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS} from '../constants';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM'
];

interface AvailableSlotsProps {
  availableSlots: Record<string, string[]>;
  setAvailableSlots: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const AvailableSlotsSelector: React.FC<AvailableSlotsProps> = ({ availableSlots, setAvailableSlots }) => {
  const [selectedDay, setSelectedDay] = useState('Monday');

  const toggleTimeSlot = (time: string) => {
    setAvailableSlots(prevSlots => ({
      ...prevSlots,
      [selectedDay.toLowerCase()]: prevSlots[selectedDay.toLowerCase()].includes(time)
        ? prevSlots[selectedDay.toLowerCase()].filter(slot => slot !== time)
        : [...prevSlots[selectedDay.toLowerCase()], time]
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.daySelector}>
        {days.map(day => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayButtonText, selectedDay === day && styles.selectedDayButtonText]}>
              {day.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.timeSlotContainer}>
        {timeSlots.map(time => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeSlot,
              availableSlots[selectedDay.toLowerCase()].includes(time) && styles.selectedTimeSlot
            ]}
            onPress={() => toggleTimeSlot(time)}
          >
            <Text style={[
              styles.timeSlotText,
              availableSlots[selectedDay.toLowerCase()].includes(time) && styles.selectedTimeSlotText
            ]}>
              {time}
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
    backgroundColor: "#FFFFFF",
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary,
  },
  dayButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  selectedDayButtonText: {
    color: '#FFFFFF',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '31%',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333333',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
});

export default AvailableSlotsSelector;