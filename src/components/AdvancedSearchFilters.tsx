import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  useTheme, 
  Chip, 
  TextInput, 
  SegmentedButtons,
  Slider,
  Checkbox,
  RadioButton,
  Divider
} from 'react-native-paper';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

export interface AdvancedFilters {
  // Basic filters
  query: string;
  location: string;
  
  // Job type filters
  jobTypes: string[];
  employmentTypes: string[];
  experienceLevels: string[];
  
  // Salary filters
  salaryRange: [number, number];
  salaryType: 'annual' | 'hourly' | 'contract';
  
  // Company filters
  companySizes: string[];
  industries: string[];
  companyTypes: string[];
  
  // Remote work filters
  remoteWork: 'remote' | 'hybrid' | 'onsite' | 'any';
  
  // Date filters
  postedDate: 'any' | 'today' | 'week' | 'month' | '3months';
  
  // Benefits filters
  benefits: string[];
  
  // Skills filters
  requiredSkills: string[];
  preferredSkills: string[];
  
  // Additional filters
  visaSponsorship: boolean;
  equityOffered: boolean;
  relocationAssistance: boolean;
}

interface AdvancedSearchFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  isDark: boolean;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  isDark
}) => {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState('basic');

  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof AdvancedFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const jobTypeOptions = [
    'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary'
  ];

  const experienceOptions = [
    'Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Principal', 'Executive'
  ];

  const companySizeOptions = [
    'Startup (1-10)', 'Small (11-50)', 'Medium (51-200)', 'Large (201-1000)', 'Enterprise (1000+)'
  ];

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Consulting', 'Media', 'Real Estate', 'Government', 'Non-profit', 'Other'
  ];

  const benefitOptions = [
    'Health Insurance', 'Dental Insurance', 'Vision Insurance', '401k', 'PTO',
    'Flexible Hours', 'Remote Work', 'Professional Development', 'Gym Membership',
    'Free Meals', 'Transportation', 'Childcare', 'Stock Options'
  ];

  const skillOptions = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
    'TypeScript', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git',
    'Machine Learning', 'Data Science', 'DevOps', 'UI/UX Design', 'Project Management'
  ];

  const renderBasicFilters = () => (
    <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
          Basic Filters
        </Text>
        
        <TextInput
          label="Job Title or Keywords"
          value={filters.query}
          onChangeText={(text) => updateFilter('query', text)}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Location"
          value={filters.location}
          onChangeText={(text) => updateFilter('location', text)}
          style={styles.input}
          mode="outlined"
        />
        
        <View style={styles.chipContainer}>
          <Text variant="bodyMedium" style={[styles.chipLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
            Job Types:
          </Text>
          <View style={styles.chipRow}>
            {jobTypeOptions.map((type) => (
              <Chip
                key={type}
                selected={filters.jobTypes.includes(type)}
                onPress={() => toggleArrayFilter('jobTypes', type)}
                style={styles.chip}
                mode={filters.jobTypes.includes(type) ? 'flat' : 'outlined'}
              >
                {type}
              </Chip>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSalaryFilters = () => (
    <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
          Salary Range
        </Text>
        
        <View style={styles.salaryContainer}>
          <Text variant="bodyMedium" style={[styles.salaryLabel, { color: isDark ? DarkColors.text : Colors.text }]}>
            ${filters.salaryRange[0].toLocaleString()} - ${filters.salaryRange[1].toLocaleString()}
          </Text>
          
          <Slider
            value={filters.salaryRange[0]}
            onValueChange={(value) => updateFilter('salaryRange', [value, filters.salaryRange[1]])}
            minimumValue={0}
            maximumValue={500000}
            step={5000}
            style={styles.slider}
          />
          
          <Slider
            value={filters.salaryRange[1]}
            onValueChange={(value) => updateFilter('salaryRange', [filters.salaryRange[0], value])}
            minimumValue={0}
            maximumValue={500000}
            step={5000}
            style={styles.slider}
          />
        </View>
        
        <View style={styles.segmentedContainer}>
          <Text variant="bodyMedium" style={[styles.segmentedLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
            Salary Type:
          </Text>
          <SegmentedButtons
            value={filters.salaryType}
            onValueChange={(value) => updateFilter('salaryType', value)}
            buttons={[
              { value: 'annual', label: 'Annual' },
              { value: 'hourly', label: 'Hourly' },
              { value: 'contract', label: 'Contract' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const renderCompanyFilters = () => (
    <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
          Company Filters
        </Text>
        
        <View style={styles.chipContainer}>
          <Text variant="bodyMedium" style={[styles.chipLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
            Company Size:
          </Text>
          <View style={styles.chipRow}>
            {companySizeOptions.map((size) => (
              <Chip
                key={size}
                selected={filters.companySizes.includes(size)}
                onPress={() => toggleArrayFilter('companySizes', size)}
                style={styles.chip}
                mode={filters.companySizes.includes(size) ? 'flat' : 'outlined'}
              >
                {size}
              </Chip>
            ))}
          </View>
        </View>
        
        <View style={styles.chipContainer}>
          <Text variant="bodyMedium" style={[styles.chipLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
            Industry:
          </Text>
          <View style={styles.chipRow}>
            {industryOptions.map((industry) => (
              <Chip
                key={industry}
                selected={filters.industries.includes(industry)}
                onPress={() => toggleArrayFilter('industries', industry)}
                style={styles.chip}
                mode={filters.industries.includes(industry) ? 'flat' : 'outlined'}
              >
                {industry}
              </Chip>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderRemoteWorkFilters = () => (
    <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
          Work Arrangement
        </Text>
        
        <View style={styles.radioContainer}>
          {[
            { value: 'any', label: 'Any' },
            { value: 'remote', label: 'Remote Only' },
            { value: 'hybrid', label: 'Hybrid' },
            { value: 'onsite', label: 'On-site Only' }
          ].map((option) => (
            <View key={option.value} style={styles.radioItem}>
              <RadioButton
                value={option.value}
                status={filters.remoteWork === option.value ? 'checked' : 'unchecked'}
                onPress={() => updateFilter('remoteWork', option.value)}
              />
              <Text variant="bodyMedium" style={[styles.radioLabel, { color: isDark ? DarkColors.text : Colors.text }]}>
                {option.label}
              </Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderBenefitsFilters = () => (
    <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
          Benefits & Perks
        </Text>
        
        <View style={styles.chipContainer}>
          <View style={styles.chipRow}>
            {benefitOptions.map((benefit) => (
              <Chip
                key={benefit}
                selected={filters.benefits.includes(benefit)}
                onPress={() => toggleArrayFilter('benefits', benefit)}
                style={styles.chip}
                mode={filters.benefits.includes(benefit) ? 'flat' : 'outlined'}
              >
                {benefit}
              </Chip>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSkillsFilters = () => (
    <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
          Skills & Technologies
        </Text>
        
        <View style={styles.chipContainer}>
          <Text variant="bodyMedium" style={[styles.chipLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
            Required Skills:
          </Text>
          <View style={styles.chipRow}>
            {skillOptions.map((skill) => (
              <Chip
                key={skill}
                selected={filters.requiredSkills.includes(skill)}
                onPress={() => toggleArrayFilter('requiredSkills', skill)}
                style={styles.chip}
                mode={filters.requiredSkills.includes(skill) ? 'flat' : 'outlined'}
              >
                {skill}
              </Chip>
            ))}
          </View>
        </View>
        
        <View style={styles.chipContainer}>
          <Text variant="bodyMedium" style={[styles.chipLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
            Preferred Skills:
          </Text>
          <View style={styles.chipRow}>
            {skillOptions.map((skill) => (
              <Chip
                key={skill}
                selected={filters.preferredSkills.includes(skill)}
                onPress={() => toggleArrayFilter('preferredSkills', skill)}
                style={styles.chip}
                mode={filters.preferredSkills.includes(skill) ? 'flat' : 'outlined'}
              >
                {skill}
              </Chip>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderAdditionalFilters = () => (
    <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
          Additional Filters
        </Text>
        
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxItem}>
            <Checkbox
              status={filters.visaSponsorship ? 'checked' : 'unchecked'}
              onPress={() => updateFilter('visaSponsorship', !filters.visaSponsorship)}
            />
            <Text variant="bodyMedium" style={[styles.checkboxLabel, { color: isDark ? DarkColors.text : Colors.text }]}>
              Visa Sponsorship Available
            </Text>
          </View>
          
          <View style={styles.checkboxItem}>
            <Checkbox
              status={filters.equityOffered ? 'checked' : 'unchecked'}
              onPress={() => updateFilter('equityOffered', !filters.equityOffered)}
            />
            <Text variant="bodyMedium" style={[styles.checkboxLabel, { color: isDark ? DarkColors.text : Colors.text }]}>
              Equity Offered
            </Text>
          </View>
          
          <View style={styles.checkboxItem}>
            <Checkbox
              status={filters.relocationAssistance ? 'checked' : 'unchecked'}
              onPress={() => updateFilter('relocationAssistance', !filters.relocationAssistance)}
            />
            <Text variant="bodyMedium" style={[styles.checkboxLabel, { color: isDark ? DarkColors.text : Colors.text }]}>
              Relocation Assistance
            </Text>
          </View>
        </View>
        
        <View style={styles.segmentedContainer}>
          <Text variant="bodyMedium" style={[styles.segmentedLabel, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
            Posted Date:
          </Text>
          <SegmentedButtons
            value={filters.postedDate}
            onValueChange={(value) => updateFilter('postedDate', value)}
            buttons={[
              { value: 'any', label: 'Any' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: '3months', label: '3 Months' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const sections = [
    { id: 'basic', label: 'Basic', icon: 'magnify' },
    { id: 'salary', label: 'Salary', icon: 'currency-usd' },
    { id: 'company', label: 'Company', icon: 'office-building' },
    { id: 'remote', label: 'Remote', icon: 'home' },
    { id: 'benefits', label: 'Benefits', icon: 'gift' },
    { id: 'skills', label: 'Skills', icon: 'code-tags' },
    { id: 'additional', label: 'More', icon: 'tune' },
  ];

  return (
    <View style={styles.container}>
      {/* Section Navigation */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectionNav}>
        {sections.map((section) => (
          <Button
            key={section.id}
            mode={activeSection === section.id ? 'contained' : 'outlined'}
            onPress={() => setActiveSection(section.id)}
            style={styles.sectionButton}
            icon={section.icon}
            compact
          >
            {section.label}
          </Button>
        ))}
      </ScrollView>

      {/* Filter Content */}
      <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
        {activeSection === 'basic' && renderBasicFilters()}
        {activeSection === 'salary' && renderSalaryFilters()}
        {activeSection === 'company' && renderCompanyFilters()}
        {activeSection === 'remote' && renderRemoteWorkFilters()}
        {activeSection === 'benefits' && renderBenefitsFilters()}
        {activeSection === 'skills' && renderSkillsFilters()}
        {activeSection === 'additional' && renderAdditionalFilters()}
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
        <Button
          mode="outlined"
          onPress={onClearFilters}
          style={styles.actionButton}
          icon="refresh"
        >
          Clear All
        </Button>
        <Button
          mode="contained"
          onPress={onApplyFilters}
          style={styles.actionButton}
          icon="check"
        >
          Apply Filters
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionNav: {
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
  },
  sectionButton: {
    marginRight: Sizes.sm,
  },
  filterContent: {
    flex: 1,
    padding: Sizes.md,
  },
  sectionCard: {
    marginBottom: Sizes.md,
    elevation: 2,
    borderRadius: Sizes.radiusLg,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: Sizes.md,
  },
  input: {
    marginBottom: Sizes.md,
  },
  chipContainer: {
    marginBottom: Sizes.md,
  },
  chipLabel: {
    marginBottom: Sizes.sm,
    fontWeight: '500',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.xs,
  },
  chip: {
    marginBottom: Sizes.xs,
  },
  salaryContainer: {
    marginBottom: Sizes.md,
  },
  salaryLabel: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: Sizes.sm,
  },
  slider: {
    marginVertical: Sizes.sm,
  },
  segmentedContainer: {
    marginBottom: Sizes.md,
  },
  segmentedLabel: {
    marginBottom: Sizes.sm,
    fontWeight: '500',
  },
  segmentedButtons: {
    marginBottom: Sizes.sm,
  },
  radioContainer: {
    marginBottom: Sizes.md,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.sm,
  },
  radioLabel: {
    marginLeft: Sizes.sm,
  },
  checkboxContainer: {
    marginBottom: Sizes.md,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.sm,
  },
  checkboxLabel: {
    marginLeft: Sizes.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: Sizes.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Sizes.xs,
  },
});

export default AdvancedSearchFilters;
