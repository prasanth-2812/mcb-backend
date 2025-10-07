import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Text } from 'react-native';
import { 
  Modal, 
  Text as PaperText, 
  Button, 
  Card, 
  Chip, 
  useTheme, 
  Divider,
  Searchbar,
  Surface
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { FilterOptions, Job } from '../types';
// import jobsData from '../data/jobs.json';

const { width: screenWidth } = Dimensions.get('window');

interface FilterJobsScreenProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}

const FilterJobsScreen: React.FC<FilterJobsScreenProps> = ({
  visible,
  onDismiss,
  onApply,
  initialFilters
}) => {
  const theme = useTheme();
  const { state } = useApp();
  const [localFilters, setLocalFilters] = useState<FilterOptions>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Animation values
  const modalScale = useSharedValue(0);
  const modalOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      modalScale.value = withSpring(1, { damping: 15, stiffness: 150 });
      modalOpacity.value = withTiming(1, { duration: 300 });
    } else {
      modalScale.value = withTiming(0, { duration: 200 });
      modalOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const categories = [
    { id: 'all', name: 'All Jobs', icon: 'briefcase-outline', count: state.jobs.length },
    { id: 'recommended', name: 'Recommended', icon: 'star-outline', count: state.jobs.slice(0, 3).length },
    { id: 'recent', name: 'Recent', icon: 'clock-outline', count: state.jobs.slice(0, 5).length },
    { id: 'saved', name: 'Saved', icon: 'bookmark-outline', count: state.savedJobs.length },
    { id: 'applied', name: 'Applied', icon: 'file-document-outline', count: state.applications.length },
  ];

  const jobTypes = [
    { id: 'full-time', name: 'Full-time', icon: 'briefcase', color: '#1976D2' },
    { id: 'part-time', name: 'Part-time', icon: 'clock-outline', color: '#4CAF50' },
    { id: 'contract', name: 'Contract', icon: 'file-document-outline', color: '#FF9800' },
    { id: 'remote', name: 'Remote', icon: 'home-outline', color: '#9C27B0' },
  ];

  const locations = [
    { id: 'san-francisco', name: 'San Francisco', icon: 'map-marker', count: 45 },
    { id: 'new-york', name: 'New York', icon: 'map-marker', count: 38 },
    { id: 'austin', name: 'Austin', icon: 'map-marker', count: 25 },
    { id: 'seattle', name: 'Seattle', icon: 'map-marker', count: 22 },
    { id: 'boston', name: 'Boston', icon: 'map-marker', count: 18 },
    { id: 'los-angeles', name: 'Los Angeles', icon: 'map-marker', count: 15 },
  ];

  const experienceLevels = [
    { id: 'entry', name: 'Entry Level', icon: 'account-outline', color: '#4CAF50' },
    { id: 'mid', name: 'Mid Level', icon: 'account', color: '#FF9800' },
    { id: 'senior', name: 'Senior Level', icon: 'account-star', color: '#F44336' },
    { id: 'executive', name: 'Executive', icon: 'crown', color: '#9C27B0' },
  ];

  const salaryRanges = [
    { id: '0-50k', name: '$0 - $50k', min: 0, max: 50000 },
    { id: '50k-100k', name: '$50k - $100k', min: 50000, max: 100000 },
    { id: '100k-150k', name: '$100k - $150k', min: 100000, max: 150000 },
    { id: '150k-200k', name: '$150k - $200k', min: 150000, max: 200000 },
    { id: '200k+', name: '$200k+', min: 200000, max: 500000 },
  ];

  const handleJobTypeToggle = (jobType: string) => {
    setLocalFilters(prev => ({
      ...prev,
      jobType: prev.jobType.includes(jobType)
        ? prev.jobType.filter(type => type !== jobType)
        : [...prev.jobType, jobType]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setLocalFilters(prev => ({
      ...prev,
      location: prev.location.includes(location)
        ? prev.location.filter(loc => loc !== location)
        : [...prev.location, location]
    }));
  };

  const handleExperienceToggle = (experience: string) => {
    setLocalFilters(prev => ({
      ...prev,
      experience: prev.experience.includes(experience)
        ? prev.experience.filter(exp => exp !== experience)
        : [...prev.experience, experience]
    }));
  };

  const handleSalaryRangeSelect = (range: { min: number; max: number }) => {
    setLocalFilters(prev => ({
      ...prev,
      salaryRange: [range.min, range.max]
    }));
  };

  const handleRemoteToggle = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      remote: value === 'remote' ? true : value === 'onsite' ? false : null
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = {
      jobType: [],
      location: [],
      salaryRange: [0, 200000],
      experience: [],
      remote: null,
      companySize: [],
    };
    setLocalFilters(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.jobType.length > 0) count++;
    if (localFilters.location.length > 0) count++;
    if (localFilters.remote !== null) count++;
    if (localFilters.salaryRange[0] > 0 || localFilters.salaryRange[1] < 200000) count++;
    if (localFilters.experience.length > 0) count++;
    if (localFilters.companySize.length > 0) count++;
    return count;
  };

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalOpacity.value,
  }));

  const renderCategoryItem = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem,
        selectedCategory === category.id && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <View style={[
        styles.categoryIcon,
        selectedCategory === category.id && styles.selectedCategoryIcon
      ]}>
        <MaterialCommunityIcons 
          name={category.icon} 
          size={20} 
          color={selectedCategory === category.id ? '#FFFFFF' : '#666666'} 
        />
      </View>
      <View style={styles.categoryContent}>
        <PaperText style={[
          styles.categoryName,
          selectedCategory === category.id && styles.selectedCategoryName
        ]}>
          {category.name}
        </PaperText>
        <PaperText style={[
          styles.categoryCount,
          selectedCategory === category.id && styles.selectedCategoryCount
        ]}>
          {category.count} jobs
        </PaperText>
      </View>
      {selectedCategory === category.id && (
        <MaterialCommunityIcons name="check-circle" size={20} color="#1976D2" />
      )}
    </TouchableOpacity>
  );

  const renderFilterSection = (title: string, children: React.ReactNode) => (
    <View style={styles.filterSection}>
      <PaperText variant="titleMedium" style={styles.sectionTitle}>
        {title}
      </PaperText>
      {children}
    </View>
  );

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <Animated.View style={[styles.modalContent, animatedModalStyle]}>
        <Surface style={styles.modalSurface} elevation={8}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <PaperText variant="headlineSmall" style={styles.title}>
                Filter Jobs
              </PaperText>
              <PaperText variant="bodyMedium" style={styles.subtitle}>
                Find your perfect match
              </PaperText>
            </View>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Search */}
            <View style={styles.searchSection}>
              <Searchbar
                placeholder="Search jobs, companies, or skills..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                inputStyle={styles.searchInput}
                icon={() => <MaterialCommunityIcons name="magnify" size={20} color="#666666" />}
              />
            </View>

            {/* Categories */}
            {renderFilterSection('Categories', (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                {categories.map(renderCategoryItem)}
              </ScrollView>
            ))}

            <Divider style={styles.divider} />

            {/* Job Types */}
            {renderFilterSection('Job Types', (
              <View style={styles.chipContainer}>
                {jobTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.jobTypeChip,
                      localFilters.jobType.includes(type.name) && styles.selectedChip
                    ]}
                    onPress={() => handleJobTypeToggle(type.name)}
                  >
                    <MaterialCommunityIcons 
                      name={type.icon} 
                      size={16} 
                      color={localFilters.jobType.includes(type.name) ? '#FFFFFF' : type.color} 
                    />
                    <PaperText style={[
                      styles.chipText,
                      localFilters.jobType.includes(type.name) && styles.selectedChipText
                    ]}>
                      {type.name}
                    </PaperText>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <Divider style={styles.divider} />

            {/* Locations */}
            {renderFilterSection('Locations', (
              <View style={styles.locationsGrid}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      styles.locationItem,
                      localFilters.location.includes(location.name) && styles.selectedLocationItem
                    ]}
                    onPress={() => handleLocationToggle(location.name)}
                  >
                    <View style={styles.locationHeader}>
                      <MaterialCommunityIcons 
                        name={location.icon} 
                        size={16} 
                        color={localFilters.location.includes(location.name) ? '#1976D2' : '#666666'} 
                      />
                      <PaperText style={[
                        styles.locationName,
                        localFilters.location.includes(location.name) && styles.selectedLocationName
                      ]}>
                        {location.name}
                      </PaperText>
                    </View>
                    <PaperText style={[
                      styles.locationCount,
                      localFilters.location.includes(location.name) && styles.selectedLocationCount
                    ]}>
                      {location.count} jobs
                    </PaperText>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <Divider style={styles.divider} />

            {/* Work Arrangement */}
            {renderFilterSection('Work Arrangement', (
              <View style={styles.workArrangementContainer}>
                <TouchableOpacity
                  style={[
                    styles.workArrangementButton,
                    localFilters.remote === null && styles.selectedWorkArrangement
                  ]}
                  onPress={() => handleRemoteToggle('all')}
                >
                  <MaterialCommunityIcons 
                    name="briefcase-outline" 
                    size={20} 
                    color={localFilters.remote === null ? '#FFFFFF' : '#666666'} 
                  />
                  <PaperText style={[
                    styles.workArrangementText,
                    localFilters.remote === null && styles.selectedWorkArrangementText
                  ]}>
                    All
                  </PaperText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.workArrangementButton,
                    localFilters.remote === true && styles.selectedWorkArrangement
                  ]}
                  onPress={() => handleRemoteToggle('remote')}
                >
                  <MaterialCommunityIcons 
                    name="home-outline" 
                    size={20} 
                    color={localFilters.remote === true ? '#FFFFFF' : '#666666'} 
                  />
                  <PaperText style={[
                    styles.workArrangementText,
                    localFilters.remote === true && styles.selectedWorkArrangementText
                  ]}>
                    Remote
                  </PaperText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.workArrangementButton,
                    localFilters.remote === false && styles.selectedWorkArrangement
                  ]}
                  onPress={() => handleRemoteToggle('onsite')}
                >
                  <MaterialCommunityIcons 
                    name="office-building" 
                    size={20} 
                    color={localFilters.remote === false ? '#FFFFFF' : '#666666'} 
                  />
                  <PaperText style={[
                    styles.workArrangementText,
                    localFilters.remote === false && styles.selectedWorkArrangementText
                  ]}>
                    On-site
                  </PaperText>
                </TouchableOpacity>
              </View>
            ))}

            <Divider style={styles.divider} />

            {/* Salary Range */}
            {renderFilterSection('Salary Range', (
              <View style={styles.salaryContainer}>
                <PaperText style={styles.salaryDisplay}>
                  ${localFilters.salaryRange[0].toLocaleString()} - ${localFilters.salaryRange[1].toLocaleString()}
                </PaperText>
                <View style={styles.salaryButtons}>
                  {salaryRanges.map((range) => (
                    <TouchableOpacity
                      key={range.id}
                      style={[
                        styles.salaryButton,
                        localFilters.salaryRange[0] === range.min && localFilters.salaryRange[1] === range.max && styles.selectedSalaryButton
                      ]}
                      onPress={() => handleSalaryRangeSelect({ min: range.min, max: range.max })}
                    >
                      <PaperText style={[
                        styles.salaryButtonText,
                        localFilters.salaryRange[0] === range.min && localFilters.salaryRange[1] === range.max && styles.selectedSalaryButtonText
                      ]}>
                        {range.name}
                      </PaperText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            <Divider style={styles.divider} />

            {/* Experience Level */}
            {renderFilterSection('Experience Level', (
              <View style={styles.experienceGrid}>
                {experienceLevels.map((level) => (
                  <TouchableOpacity
                    key={level.id}
                    style={[
                      styles.experienceItem,
                      localFilters.experience.includes(level.name) && styles.selectedExperienceItem
                    ]}
                    onPress={() => handleExperienceToggle(level.name)}
                  >
                    <View style={[
                      styles.experienceIcon,
                      { backgroundColor: level.color + '20' }
                    ]}>
                      <MaterialCommunityIcons 
                        name={level.icon} 
                        size={20} 
                        color={level.color} 
                      />
                    </View>
                    <PaperText style={[
                      styles.experienceName,
                      localFilters.experience.includes(level.name) && styles.selectedExperienceName
                    ]}>
                      {level.name}
                    </PaperText>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Button
              mode="outlined"
              onPress={handleClear}
              style={styles.clearButton}
              textColor="#666666"
              icon={() => <MaterialCommunityIcons name="refresh" size={16} color="#666666" />}
            >
              Clear All
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.applyButton}
              buttonColor="#1976D2"
              icon={() => <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
            >
              Apply Filters ({getActiveFiltersCount()})
            </Button>
          </View>
        </Surface>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSurface: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666666',
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchBar: {
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  searchInput: {
    fontSize: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginVertical: 16,
  },
  // Categories
  categoriesScroll: {
    marginBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCategoryItem: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedCategoryIcon: {
    backgroundColor: '#1976D2',
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  selectedCategoryName: {
    color: '#1976D2',
  },
  categoryCount: {
    fontSize: 12,
    color: '#666666',
  },
  selectedCategoryCount: {
    color: '#1976D2',
  },
  // Job Types
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  jobTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedChip: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  chipText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  // Locations
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedLocationItem: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationName: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  selectedLocationName: {
    color: '#1976D2',
  },
  locationCount: {
    fontSize: 12,
    color: '#666666',
  },
  selectedLocationCount: {
    color: '#1976D2',
  },
  // Work Arrangement
  workArrangementContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  workArrangementButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedWorkArrangement: {
    backgroundColor: '#1976D2',
  },
  workArrangementText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  selectedWorkArrangementText: {
    color: '#FFFFFF',
  },
  // Salary
  salaryContainer: {
    paddingVertical: 8,
  },
  salaryDisplay: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 16,
  },
  salaryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  salaryButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedSalaryButton: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  salaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  selectedSalaryButtonText: {
    color: '#1976D2',
  },
  // Experience
  experienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  experienceItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedExperienceItem: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  experienceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  experienceName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  selectedExperienceName: {
    color: '#1976D2',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  clearButton: {
    borderColor: '#E0E0E0',
    flex: 1,
    marginRight: 12,
  },
  applyButton: {
    flex: 2,
  },
});

export default FilterJobsScreen;
