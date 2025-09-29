import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { 
  Modal, 
  Text, 
  Button, 
  Card, 
  Chip, 
  useTheme, 
  Divider,
  TextInput,
  Switch
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FilterOptions } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FilterJobsModalProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
  showUrgentOnly?: boolean;
  onUrgencyToggle?: (urgent: boolean) => void;
}

const FilterJobsModal: React.FC<FilterJobsModalProps> = ({
  visible,
  onDismiss,
  onApply,
  initialFilters,
  showUrgentOnly = false,
  onUrgencyToggle
}) => {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState<FilterOptions>(initialFilters);
  const [locationInput, setLocationInput] = useState('');
  const [localShowUrgentOnly, setLocalShowUrgentOnly] = useState(showUrgentOnly);
  

  useEffect(() => {
    setLocalFilters(initialFilters);
    setLocalShowUrgentOnly(showUrgentOnly);
  }, [initialFilters, showUrgentOnly]);

  const jobTypes = [
    { id: 'Full-time', name: 'Full-time', icon: 'briefcase-outline' },
    { id: 'Part-time', name: 'Part-time', icon: 'clock-outline' },
    { id: 'Internship', name: 'Internship', icon: 'school-outline' },
    { id: 'Remote', name: 'Remote', icon: 'laptop' },
  ];

  const experienceLevels = [
    { id: 'Fresher', name: 'Fresher' },
    { id: '1-3 yrs', name: '1–3 yrs' },
    { id: '3-5 yrs', name: '3–5 yrs' },
    { id: '5+ yrs', name: '5+ yrs' },
  ];

  const handleJobTypeToggle = (jobType: string) => {
    setLocalFilters(prev => ({
      ...prev,
      jobType: prev.jobType.includes(jobType)
        ? prev.jobType.filter(type => type !== jobType)
        : [...prev.jobType, jobType]
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

  const handleLocationAdd = () => {
    if (locationInput.trim() && !localFilters.location.includes(locationInput.trim())) {
      setLocalFilters(prev => ({
        ...prev,
        location: [...prev.location, locationInput.trim()]
      }));
      setLocationInput('');
    }
  };

  const handleLocationRemove = (location: string) => {
    setLocalFilters(prev => ({
      ...prev,
      location: prev.location.filter(loc => loc !== location)
    }));
  };

  const handleSalaryRangeChange = (min: number, max: number) => {
    setLocalFilters(prev => ({
      ...prev,
      salaryRange: [min, max]
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    if (onUrgencyToggle) {
      onUrgencyToggle(localShowUrgentOnly);
    }
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      jobType: [],
      location: [],
      salaryRange: [0, 200000],
      experience: [],
      remote: null,
      companySize: [],
    };
    setLocalFilters(resetFilters);
    setLocationInput('');
    setLocalShowUrgentOnly(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.jobType.length > 0) count++;
    if (localFilters.location.length > 0) count++;
    if (localFilters.remote !== null) count++;
    if (localFilters.salaryRange[0] > 0 || localFilters.salaryRange[1] < 200000) count++;
    if (localFilters.experience.length > 0) count++;
    if (localFilters.companySize.length > 0) count++;
    if (localShowUrgentOnly) count++;
    return count;
  };


  const renderFilterSection = (title: string, children: React.ReactNode) => (
    <View style={styles.filterSection}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <Card style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>
              Filter Jobs
            </Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Job Type */}
            {renderFilterSection('Job Type', (
              <View style={styles.chipContainer}>
                {jobTypes.map((type) => (
                  <Chip
                    key={type.id}
                    selected={localFilters.jobType.includes(type.name)}
                    onPress={() => handleJobTypeToggle(type.name)}
                    style={[
                      styles.chip,
                      localFilters.jobType.includes(type.name) && styles.selectedChip
                    ]}
                    textStyle={[
                      styles.chipText,
                      localFilters.jobType.includes(type.name) && styles.selectedChipText
                    ]}
                    icon={() => (
                      <MaterialCommunityIcons 
                        name={type.icon} 
                        size={22} 
                        color={localFilters.jobType.includes(type.name) ? '#FFFFFF' : '#1976D2'} 
                      />
                    )}
                  >
                    {type.name}
                  </Chip>
                ))}
              </View>
            ))}

            <Divider style={styles.divider} />

            {/* Location */}
            {renderFilterSection('Location', (
              <View style={styles.locationSection}>
                <View style={styles.locationInputContainer}>
                  <MaterialCommunityIcons name="map-marker-outline" size={22} color="#1976D2" />
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Enter location..."
                    value={locationInput}
                    onChangeText={setLocationInput}
                    onSubmitEditing={handleLocationAdd}
                    returnKeyType="done"
                  />
                  <TouchableOpacity onPress={handleLocationAdd} style={styles.addLocationButton}>
                    <MaterialCommunityIcons name="plus" size={20} color="#1976D2" />
                  </TouchableOpacity>
                </View>
                
                {localFilters.location.length > 0 && (
                  <View style={styles.locationChipsContainer}>
                    {localFilters.location.map((location, index) => (
                      <Chip
                        key={index}
                        onClose={() => handleLocationRemove(location)}
                        style={styles.locationChip}
                        textStyle={styles.locationChipText}
                      >
                        {location}
                      </Chip>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <Divider style={styles.divider} />

            {/* Salary Range */}
            {renderFilterSection('Salary Range', (
              <View style={styles.salarySection}>
                <View style={styles.salaryDisplay}>
                  <MaterialCommunityIcons name="currency-inr" size={22} color="#1976D2" />
                  <Text style={styles.salaryText}>
                    ₹{localFilters.salaryRange[0].toLocaleString()} - ₹{localFilters.salaryRange[1].toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.salaryButtons}>
                  <TouchableOpacity
                    style={[
                      styles.salaryButton,
                      localFilters.salaryRange[0] === 0 && localFilters.salaryRange[1] === 50000 && styles.selectedSalaryButton
                    ]}
                    onPress={() => handleSalaryRangeChange(0, 50000)}
                  >
                    <Text style={[
                      styles.salaryButtonText,
                      localFilters.salaryRange[0] === 0 && localFilters.salaryRange[1] === 50000 && styles.selectedSalaryButtonText
                    ]}>
                      ₹0 - ₹50k
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.salaryButton,
                      localFilters.salaryRange[0] === 50000 && localFilters.salaryRange[1] === 100000 && styles.selectedSalaryButton
                    ]}
                    onPress={() => handleSalaryRangeChange(50000, 100000)}
                  >
                    <Text style={[
                      styles.salaryButtonText,
                      localFilters.salaryRange[0] === 50000 && localFilters.salaryRange[1] === 100000 && styles.selectedSalaryButtonText
                    ]}>
                      ₹50k - ₹100k
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.salaryButton,
                      localFilters.salaryRange[0] === 100000 && localFilters.salaryRange[1] === 200000 && styles.selectedSalaryButton
                    ]}
                    onPress={() => handleSalaryRangeChange(100000, 200000)}
                  >
                    <Text style={[
                      styles.salaryButtonText,
                      localFilters.salaryRange[0] === 100000 && localFilters.salaryRange[1] === 200000 && styles.selectedSalaryButtonText
                    ]}>
                      ₹100k - ₹200k
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.salaryButton,
                      localFilters.salaryRange[0] === 200000 && localFilters.salaryRange[1] === 500000 && styles.selectedSalaryButton
                    ]}
                    onPress={() => handleSalaryRangeChange(200000, 500000)}
                  >
                    <Text style={[
                      styles.salaryButtonText,
                      localFilters.salaryRange[0] === 200000 && localFilters.salaryRange[1] === 500000 && styles.selectedSalaryButtonText
                    ]}>
                      ₹200k+
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Divider style={styles.divider} />

            {/* Experience Level */}
            {renderFilterSection('Experience Level', (
              <View style={styles.chipContainer}>
                {experienceLevels.map((level) => (
                  <Chip
                    key={level.id}
                    selected={localFilters.experience.includes(level.name)}
                    onPress={() => handleExperienceToggle(level.name)}
                    style={[
                      styles.chip,
                      localFilters.experience.includes(level.name) && styles.selectedChip
                    ]}
                    textStyle={[
                      styles.chipText,
                      localFilters.experience.includes(level.name) && styles.selectedChipText
                    ]}
                    icon={() => (
                      <MaterialCommunityIcons 
                        name="account-tie-outline" 
                        size={22} 
                        color={localFilters.experience.includes(level.name) ? '#FFFFFF' : '#1976D2'} 
                      />
                    )}
                  >
                    {level.name}
                  </Chip>
                ))}
              </View>
            ))}

            <Divider style={styles.divider} />

            {/* Urgency Toggle */}
            {renderFilterSection('Urgency', (
              <View style={styles.urgencySection}>
                <View style={styles.urgencyRow}>
                  <View style={styles.urgencyLeft}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={22} color="#1976D2" />
                    <Text variant="bodyLarge" style={styles.urgencyLabel}>
                      Show Urgent Jobs Only
                    </Text>
                  </View>
                  <Switch
                    value={localShowUrgentOnly}
                    onValueChange={setLocalShowUrgentOnly}
                    color="#1976D2"
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <Button
              mode="outlined"
              onPress={handleReset}
              style={styles.resetButton}
              textColor="#666666"
              icon={() => <MaterialCommunityIcons name="refresh" size={20} color="#666666" />}
            >
              Reset Filters
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.applyButton}
              buttonColor="#1976D2"
              icon={() => <MaterialCommunityIcons name="check-circle-outline" size={20} color="#FFFFFF" />}
            >
              Apply Filters
            </Button>
          </View>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    maxHeight: screenHeight * 0.6,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginVertical: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  chipText: {
    color: '#666666',
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  locationSection: {
    gap: 12,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  locationInput: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  addLocationButton: {
    padding: 4,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
  },
  locationChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationChip: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  locationChipText: {
    color: '#1976D2',
    fontWeight: '500',
  },
  salarySection: {
    gap: 16,
  },
  salaryDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  salaryText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
  },
  salaryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  salaryButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  selectedSalaryButtonText: {
    color: '#1976D2',
  },
  urgencySection: {
    paddingVertical: 8,
  },
  urgencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  urgencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  urgencyLabel: {
    marginLeft: 12,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  resetButton: {
    borderColor: '#E0E0E0',
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});

export default FilterJobsModal;
