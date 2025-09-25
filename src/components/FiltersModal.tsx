import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Modal, 
  Text, 
  Button, 
  Card, 
  Chip, 
  useTheme, 
  Divider
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FilterOptions } from '../types';

interface FiltersModalProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: (filters: FilterOptions) => void;
  filters: FilterOptions;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  visible,
  onDismiss,
  onApply,
  filters
}) => {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote'];
  const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Los Angeles, CA', 'Seattle, WA', 'Boston, MA'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const companySizes = ['Startup (1-50)', 'Small (51-200)', 'Medium (201-1000)', 'Large (1000+)'];

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

  const handleCompanySizeToggle = (size: string) => {
    setLocalFilters(prev => ({
      ...prev,
      companySize: prev.companySize.includes(size)
        ? prev.companySize.filter(s => s !== size)
        : [...prev.companySize, size]
    }));
  };

  const handleRemoteToggle = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      remote: value === 'remote' ? true : value === 'onsite' ? false : null
    }));
  };

  const handleSalaryChange = (values: number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      salaryRange: values
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

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <Card style={styles.modalCard}>
        <Card.Content style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>
              Filter Jobs
            </Text>
            <TouchableOpacity onPress={onDismiss}>
              <MaterialCommunityIcons name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Job Type */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Job Type
              </Text>
              <View style={styles.chipContainer}>
                {jobTypes.map((type) => (
                  <Chip
                    key={type}
                    selected={localFilters.jobType.includes(type)}
                    onPress={() => handleJobTypeToggle(type)}
                    style={[
                      styles.chip,
                      localFilters.jobType.includes(type) && styles.selectedChip
                    ]}
                    textStyle={[
                      styles.chipText,
                      localFilters.jobType.includes(type) && styles.selectedChipText
                    ]}
                  >
                    {type}
                  </Chip>
                ))}
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Location */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Location
              </Text>
              <View style={styles.chipContainer}>
                {locations.map((location) => (
                  <Chip
                    key={location}
                    selected={localFilters.location.includes(location)}
                    onPress={() => handleLocationToggle(location)}
                    style={[
                      styles.chip,
                      localFilters.location.includes(location) && styles.selectedChip
                    ]}
                    textStyle={[
                      styles.chipText,
                      localFilters.location.includes(location) && styles.selectedChipText
                    ]}
                  >
                    {location}
                  </Chip>
                ))}
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Remote Work */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Work Arrangement
              </Text>
              <View style={styles.segmentedContainer}>
                <TouchableOpacity
                  style={[
                    styles.segmentedButton,
                    (localFilters.remote === null) && styles.segmentedButtonActive
                  ]}
                  onPress={() => handleRemoteToggle('all')}
                >
                  <Text style={[
                    styles.segmentedButtonText,
                    (localFilters.remote === null) && styles.segmentedButtonTextActive
                  ]}>
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentedButton,
                    localFilters.remote === true && styles.segmentedButtonActive
                  ]}
                  onPress={() => handleRemoteToggle('remote')}
                >
                  <Text style={[
                    styles.segmentedButtonText,
                    localFilters.remote === true && styles.segmentedButtonTextActive
                  ]}>
                    Remote
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentedButton,
                    localFilters.remote === false && styles.segmentedButtonActive
                  ]}
                  onPress={() => handleRemoteToggle('onsite')}
                >
                  <Text style={[
                    styles.segmentedButtonText,
                    localFilters.remote === false && styles.segmentedButtonTextActive
                  ]}>
                    On-site
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Salary Range */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Salary Range
              </Text>
              <View style={styles.salaryContainer}>
                <Text variant="bodyMedium" style={styles.salaryText}>
                  ${localFilters.salaryRange[0].toLocaleString()} - ${localFilters.salaryRange[1].toLocaleString()}
                </Text>
                <View style={styles.salaryButtons}>
                  <TouchableOpacity
                    style={[
                      styles.salaryButton,
                      localFilters.salaryRange[1] === 50000 && styles.salaryButtonActive
                    ]}
                    onPress={() => handleSalaryChange([0, 50000])}
                  >
                    <Text style={[
                      styles.salaryButtonText,
                      localFilters.salaryRange[1] === 50000 && styles.salaryButtonTextActive
                    ]}>
                      $0 - $50k
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.salaryButton,
                      localFilters.salaryRange[1] === 100000 && styles.salaryButtonActive
                    ]}
                    onPress={() => handleSalaryChange([0, 100000])}
                  >
                    <Text style={[
                      styles.salaryButtonText,
                      localFilters.salaryRange[1] === 100000 && styles.salaryButtonTextActive
                    ]}>
                      $0 - $100k
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.salaryButton,
                      localFilters.salaryRange[1] === 150000 && styles.salaryButtonActive
                    ]}
                    onPress={() => handleSalaryChange([0, 150000])}
                  >
                    <Text style={[
                      styles.salaryButtonText,
                      localFilters.salaryRange[1] === 150000 && styles.salaryButtonTextActive
                    ]}>
                      $0 - $150k
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.salaryButton,
                      localFilters.salaryRange[1] === 200000 && styles.salaryButtonActive
                    ]}
                    onPress={() => handleSalaryChange([0, 200000])}
                  >
                    <Text style={[
                      styles.salaryButtonText,
                      localFilters.salaryRange[1] === 200000 && styles.salaryButtonTextActive
                    ]}>
                      $0 - $200k+
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Experience Level */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Experience Level
              </Text>
              <View style={styles.chipContainer}>
                {experienceLevels.map((level) => (
                  <Chip
                    key={level}
                    selected={localFilters.experience.includes(level)}
                    onPress={() => handleExperienceToggle(level)}
                    style={[
                      styles.chip,
                      localFilters.experience.includes(level) && styles.selectedChip
                    ]}
                    textStyle={[
                      styles.chipText,
                      localFilters.experience.includes(level) && styles.selectedChipText
                    ]}
                  >
                    {level}
                  </Chip>
                ))}
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Company Size */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Company Size
              </Text>
              <View style={styles.chipContainer}>
                {companySizes.map((size) => (
                  <Chip
                    key={size}
                    selected={localFilters.companySize.includes(size)}
                    onPress={() => handleCompanySizeToggle(size)}
                    style={[
                      styles.chip,
                      localFilters.companySize.includes(size) && styles.selectedChip
                    ]}
                    textStyle={[
                      styles.chipText,
                      localFilters.companySize.includes(size) && styles.selectedChipText
                    ]}
                  >
                    {size}
                  </Chip>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Button
              mode="outlined"
              onPress={handleClear}
              style={styles.clearButton}
              textColor="#666666"
            >
              Clear All
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.applyButton}
              buttonColor="#1976D2"
            >
              Apply Filters ({getActiveFiltersCount()})
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalContent: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  scrollView: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  chipText: {
    color: '#666666',
    fontSize: 12,
  },
  selectedChipText: {
    color: '#1976D2',
    fontWeight: '600',
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginVertical: 16,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  segmentedButtonActive: {
    backgroundColor: '#1976D2',
  },
  segmentedButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  segmentedButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  salaryContainer: {
    paddingVertical: 8,
  },
  salaryText: {
    color: '#1A1A1A',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  salaryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  salaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  salaryButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  salaryButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  salaryButtonTextActive: {
    color: '#1976D2',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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

export default FiltersModal;