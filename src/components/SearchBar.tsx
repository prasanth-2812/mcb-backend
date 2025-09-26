import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import { Searchbar, useTheme, Chip, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterPress?: () => void;
  onVoiceSearch?: () => void;
  showFilterButton?: boolean;
  showVoiceSearch?: boolean;
  showSuggestions?: boolean;
  recentSearches?: string[];
  suggestions?: string[];
  activeFilters?: string[];
  onRemoveFilter?: (filter: string) => void;
  onClearFilters?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search jobs...', 
  onSearch, 
  onFilterPress,
  onVoiceSearch,
  showFilterButton = true,
  showVoiceSearch = true,
  showSuggestions = true,
  recentSearches = [],
  suggestions = [],
  activeFilters = [],
  onRemoveFilter,
  onClearFilters
}) => {
  const theme = useTheme();
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation values
  const suggestionsHeight = useSharedValue(0);
  const filterChipsOpacity = useSharedValue(activeFilters.length > 0 ? 1 : 0);

  useEffect(() => {
    filterChipsOpacity.value = withTiming(activeFilters.length > 0 ? 1 : 0, { duration: 200 });
  }, [activeFilters.length]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    setShowSuggestionsList(query.length > 0);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestionsList(true);
    suggestionsHeight.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      setShowSuggestionsList(false);
      suggestionsHeight.value = withTiming(0, { duration: 200 });
    }, 150);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestionsList(false);
  };

  const handleVoiceSearch = () => {
    onVoiceSearch?.();
  };

  const handleFilterPress = () => {
    onFilterPress?.();
  };

  const handleRemoveFilter = (filter: string) => {
    onRemoveFilter?.(filter);
  };

  const handleClearFilters = () => {
    onClearFilters?.();
  };

  // Animated styles
  const animatedSuggestionsStyle = useAnimatedStyle(() => ({
    height: interpolate(suggestionsHeight.value, [0, 1], [0, 200]),
    opacity: suggestionsHeight.value,
  }));

  const animatedFilterChipsStyle = useAnimatedStyle(() => ({
    opacity: filterChipsOpacity.value,
    transform: [
      { translateY: interpolate(filterChipsOpacity.value, [0, 1], [-10, 0]) }
    ],
  }));

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <MaterialCommunityIcons 
        name="history" 
        size={16} 
        color={isDark ? Colors.gray : Colors.textSecondary} 
      />
      <Text style={[styles.suggestionText, { color: isDark ? Colors.white : Colors.textPrimary }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Animated.View style={[styles.filterChipsContainer, animatedFilterChipsStyle]}>
          <View style={styles.filterChips}>
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                style={styles.filterChip}
                textStyle={styles.filterChipText}
                onClose={() => handleRemoveFilter(filter)}
                closeIcon={() => <MaterialCommunityIcons name="close" size={16} color="#666666" />}
              >
                {filter}
              </Chip>
            ))}
            <TouchableOpacity onPress={handleClearFilters} style={styles.clearAllButton}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={placeholder}
          onChangeText={handleSearch}
          value={searchQuery}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {showVoiceSearch && (
            <TouchableOpacity onPress={handleVoiceSearch} style={styles.actionButton}>
              <MaterialCommunityIcons name="microphone" size={20} color="#3b82f6" />
            </TouchableOpacity>
          )}
          {showFilterButton && (
            <TouchableOpacity onPress={handleFilterPress} style={styles.actionButton}>
              <MaterialCommunityIcons name="tune" size={20} color="#3b82f6" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Suggestions */}
      {showSuggestionsList && (suggestions.length > 0 || recentSearches.length > 0) && (
        <Animated.View style={[styles.suggestionsContainer, animatedSuggestionsStyle]}>
          <View style={styles.suggestionsContent}>
            {recentSearches.length > 0 && (
              <View style={styles.suggestionsSection}>
                <Text style={[styles.suggestionsTitle, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                  Recent Searches
                </Text>
                <FlatList
                  data={recentSearches}
                  renderItem={renderSuggestion}
                  keyExtractor={(item, index) => `recent-${index}`}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
            
            {suggestions.length > 0 && (
              <View style={styles.suggestionsSection}>
                <Text style={[styles.suggestionsTitle, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                  Suggestions
                </Text>
                <FlatList
                  data={suggestions}
                  renderItem={renderSuggestion}
                  keyExtractor={(item, index) => `suggestion-${index}`}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
  },
  filterChipsContainer: {
    marginBottom: Sizes.sm,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterChip: {
    marginRight: Sizes.xs,
    marginBottom: Sizes.xs,
    backgroundColor: '#E3F2FD',
  },
  filterChipText: {
    color: '#1976D2',
    fontSize: 12,
  },
  clearAllButton: {
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
  },
  clearAllText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    elevation: Sizes.elevation1,
    borderRadius: Sizes.radiusMd,
    borderWidth: 1,
    flex: 1,
  },
  input: {
    fontSize: Sizes.fontSizeMd,
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: Sizes.sm,
  },
  actionButton: {
    padding: Sizes.sm,
    marginLeft: Sizes.xs,
    backgroundColor: '#F5F5F5',
    borderRadius: Sizes.radiusSm,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: Sizes.md,
    right: Sizes.md,
    backgroundColor: '#FFFFFF',
    borderRadius: Sizes.radiusMd,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  suggestionsContent: {
    padding: Sizes.sm,
  },
  suggestionsSection: {
    marginBottom: Sizes.sm,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Sizes.xs,
    textTransform: 'uppercase',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.sm,
    paddingHorizontal: Sizes.sm,
  },
  suggestionText: {
    marginLeft: Sizes.sm,
    fontSize: 14,
  },
});

export default SearchBar;
