import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterPress?: () => void;
  showFilterButton?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search jobs...', 
  onSearch, 
  onFilterPress,
  showFilterButton = true 
}) => {
  const theme = useTheme();
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={handleSearch}
        value={searchQuery}
        style={[
          styles.searchBar,
          {
            backgroundColor: isDark ? Colors.darkGray : Colors.white,
            borderColor: isDark ? Colors.border : Colors.borderLight,
          }
        ]}
        inputStyle={[
          styles.input,
          { color: isDark ? Colors.white : Colors.textPrimary }
        ]}
        icon={() => <MaterialCommunityIcons name="magnify" size={24} color={isDark ? Colors.gray : Colors.textSecondary} />}
        placeholderTextColor={isDark ? Colors.gray : Colors.textSecondary}
        accessibilityLabel="Search jobs"
        accessibilityHint="Enter keywords to search for jobs"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
  },
  searchBar: {
    elevation: Sizes.elevation1,
    borderRadius: Sizes.radiusMd,
    borderWidth: 1,
  },
  input: {
    fontSize: Sizes.fontSizeMd,
  },
});

export default SearchBar;
