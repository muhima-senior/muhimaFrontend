import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search, Mic } from 'lucide-react-native';

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Search color="#999" size={20} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor="#999"
      />
      <Mic color="#999" size={20} style={styles.micIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 16,
    padding: 8,
    marginTop: 20, // Add a top margin for separation
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  micIcon: {
    marginLeft: 8,
  },
});

export default SearchBar;
