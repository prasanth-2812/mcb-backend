import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Text, FAB, useTheme, Card, Chip, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import FilterJobsScreen from './FilterJobsScreen';
import { Job, FilterOptions } from '../types';
import jobsData from '../data/jobs.json';

const { width: screenWidth } = Dimensions.get('window');

interface JobsScreenProps {
  navigation: any;
}

const JobsScreen: React.FC<JobsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    jobType: [],
    location: [],
    salaryRange: [0, 200000],
    experience: [],
    remote: null,
    companySize: [],
  });

  useEffect(() => {
    // Load jobs if not already loaded
    if (state.jobs.length === 0) {
      dispatch({ type: 'SET_JOBS', payload: jobsData });
    }
  }, []);

  useEffect(() => {
    // Filter jobs based on search query and filters
    let filtered = state.jobs;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply other filters
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job => filters.jobType.includes(job.type));
    }

    if (filters.location.length > 0) {
      filtered = filtered.filter(job => 
        filters.location.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()))
      );
    }

    if (filters.remote !== null) {
      filtered = filtered.filter(job => job.isRemote === filters.remote);
    }

    setFilteredJobs(filtered);
  }, [state.jobs, searchQuery, filters]);

  useEffect(() => {
    // Set recommended jobs (first 3 jobs for now)
    setRecommendedJobs(state.jobs.slice(0, 3));
  }, [state.jobs]);


  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterPress = () => {
    setShowFilters(true);
  };

  const handleFilterApply = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleFilterClear = () => {
    setFilters({
      jobType: [],
      location: [],
      salaryRange: [0, 200000],
      experience: [],
      remote: null,
      companySize: [],
    });
    setSearchQuery('');
  };

  const handleApplyToJob = (job: Job) => {
    // Navigate to Job Details page
    navigation.navigate('JobDetailsPage', { jobId: job.id });
  };

  const getJobMatchPercentage = (job: Job) => {
    // Simulate match calculation based on user skills and job requirements
    const userSkills = state.user?.professionalInfo?.skills || [];
    const jobTags = job.tags || [];
    const matchingSkills = userSkills.filter((skill: string) => 
      jobTags.some((tag: string) => tag.toLowerCase().includes(skill.toLowerCase()))
    );
    return Math.min(95, Math.max(60, 60 + (matchingSkills.length * 10)));
  };

  const handleJobSave = (jobId: string) => {
    if (state.savedJobs.includes(jobId)) {
      dispatch({ type: 'UNSAVE_JOB', payload: jobId });
    } else {
      dispatch({ type: 'SAVE_JOB', payload: jobId });
    }
  };

  const handleJobShare = (job: Job) => {
    // Handle job sharing
    console.log('Sharing job:', job.id);
  };

  const getActiveFilters = () => {
    const activeFilters: string[] = [];
    if (filters.jobType.length > 0) {
      activeFilters.push(...filters.jobType);
    }
    if (filters.location.length > 0) {
      activeFilters.push(...filters.location);
    }
    if (filters.remote !== null) {
      activeFilters.push(filters.remote ? 'Remote' : 'On-site');
    }
    if (filters.experience.length > 0) {
      activeFilters.push(...filters.experience);
    }
    if (filters.companySize.length > 0) {
      activeFilters.push(...filters.companySize);
    }
    return activeFilters;
  };

  const handleRemoveFilter = (filter: string) => {
    // Remove specific filter
    if (filters.jobType.includes(filter)) {
      setFilters(prev => ({
        ...prev,
        jobType: prev.jobType.filter(type => type !== filter)
      }));
    } else if (filters.location.includes(filter)) {
      setFilters(prev => ({
        ...prev,
        location: prev.location.filter(loc => loc !== filter)
      }));
    } else if (filters.experience.includes(filter)) {
      setFilters(prev => ({
        ...prev,
        experience: prev.experience.filter(exp => exp !== filter)
      }));
    } else if (filters.companySize.includes(filter)) {
      setFilters(prev => ({
        ...prev,
        companySize: prev.companySize.filter(size => size !== filter)
      }));
    } else if (filter === 'Remote' || filter === 'On-site') {
      setFilters(prev => ({
        ...prev,
        remote: null
      }));
    }
  };

  const renderRecommendedJobs = () => (
    <View style={styles.recommendedSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Recommended for You
          </Text>
          <View style={styles.recommendedSubtitle}>
            <MaterialCommunityIcons name="sparkles" size={14} color="#FFD700" />
            <Text variant="bodySmall" style={styles.recommendedSubtitleText}>
              Based on your profile
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#1976D2" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendedContainer}
      >
        {recommendedJobs.map((job) => (
          <TouchableOpacity 
            key={job.id}
            style={styles.recommendedCard}
            onPress={() => handleApplyToJob(job)}
            activeOpacity={0.8}
          >
            {/* Job Header */}
            <View style={styles.jobCardHeader}>
              <View style={styles.jobLogoContainer}>
                {job.companyLogo ? (
                  <Image 
                    source={{ uri: job.companyLogo }} 
                    style={styles.jobLogo}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.jobLogoPlaceholder}>
                    <Text style={styles.jobLogoText}>
                      {job.company.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.jobInfoContainer}>
                <Text variant="titleMedium" style={styles.jobCardTitle} numberOfLines={2}>
                  {job.title}
                </Text>
                <Text variant="bodyMedium" style={styles.jobCardCompany}>
                  {job.company}
                </Text>
                <View style={styles.jobCardLocation}>
                  <MaterialCommunityIcons name="map-marker" size={14} color="#666666" />
                  <Text variant="bodySmall" style={styles.jobCardLocationText}>
                    {job.location}
                  </Text>
                </View>
              </View>

              {/* Match Percentage */}
              <View style={styles.matchPercentageContainer}>
                <Text style={styles.matchPercentageText}>
                  {getJobMatchPercentage(job)}%
                </Text>
                <Text style={styles.matchLabel}>match</Text>
                <View style={styles.matchBar}>
                  <View 
                    style={[
                      styles.matchBarFill,
                      { width: `${getJobMatchPercentage(job)}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>

            {/* Job Details */}
            <View style={styles.jobCardDetails}>
              <View style={styles.jobTagsContainer}>
                <View style={styles.jobTag}>
                  <Text style={styles.jobTagText}>{job.type}</Text>
                </View>
                {job.isUrgent && (
                  <View style={[styles.jobTag, styles.urgentTag]}>
                    <MaterialCommunityIcons name="alert-circle" size={12} color="#F44336" />
                    <Text style={[styles.jobTagText, styles.urgentTagText]}>Urgent</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.jobSalaryContainer}>
                <Text style={styles.jobSalaryText}>{job.salary}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.jobCardActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleJobSave(job.id)}
              >
                <MaterialCommunityIcons 
                  name={state.savedJobs.includes(job.id) ? "bookmark" : "bookmark-outline"} 
                  size={18} 
                  color="#1976D2" 
                />
                <Text style={styles.actionButtonText}>
                  {state.savedJobs.includes(job.id) ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.applyButton]}
                onPress={() => handleApplyToJob(job)}
              >
                <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
                <Text style={[styles.actionButtonText, styles.applyButtonText]}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderJobItem = ({ item }: { item: Job }) => (
    <JobCard 
      job={item} 
      onSave={() => console.log('Save job:', item.id)}
      onApply={() => handleApplyToJob(item)}
    />
  );

  const renderJobsGrid = () => {
    return (
      <View style={styles.jobsGrid}>
        {filteredJobs.map((job, index) => (
          <TouchableOpacity 
            key={job.id}
            style={styles.jobCard}
            onPress={() => handleApplyToJob(job)}
            activeOpacity={0.8}
          >
            {/* Job Header */}
            <View style={styles.jobCardHeader}>
              <View style={styles.jobLogoContainer}>
                {job.companyLogo ? (
                  <Image 
                    source={{ uri: job.companyLogo }} 
                    style={styles.jobLogo}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.jobLogoPlaceholder}>
                    <Text style={styles.jobLogoText}>
                      {job.company.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.jobInfoContainer}>
                <Text variant="titleMedium" style={styles.jobCardTitle} numberOfLines={2}>
                  {job.title}
                </Text>
                <Text variant="bodyMedium" style={styles.jobCardCompany}>
                  {job.company}
                </Text>
                <View style={styles.jobCardLocation}>
                  <MaterialCommunityIcons name="map-marker" size={14} color="#666666" />
                  <Text variant="bodySmall" style={styles.jobCardLocationText}>
                    {job.location}
                  </Text>
                </View>
              </View>

              {/* Match Percentage */}
              <View style={styles.matchPercentageContainer}>
                <Text style={styles.matchPercentageText}>
                  {getJobMatchPercentage(job)}%
                </Text>
                <Text style={styles.matchLabel}>match</Text>
                <View style={styles.matchBar}>
                  <View 
                    style={[
                      styles.matchBarFill,
                      { width: `${getJobMatchPercentage(job)}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>

            {/* Job Details */}
            <View style={styles.jobCardDetails}>
              <View style={styles.jobTagsContainer}>
                <View style={styles.jobTag}>
                  <Text style={styles.jobTagText}>{job.type}</Text>
                </View>
                {job.isUrgent && (
                  <View style={[styles.jobTag, styles.urgentTag]}>
                    <MaterialCommunityIcons name="alert-circle" size={12} color="#F44336" />
                    <Text style={[styles.jobTagText, styles.urgentTagText]}>Urgent</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.jobSalaryContainer}>
                <Text style={styles.jobSalaryText}>{job.salary}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.jobCardActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleJobSave(job.id)}
              >
                <MaterialCommunityIcons 
                  name={state.savedJobs.includes(job.id) ? "bookmark" : "bookmark-outline"} 
                  size={18} 
                  color="#1976D2" 
                />
                <Text style={styles.actionButtonText}>
                  {state.savedJobs.includes(job.id) ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.applyButton]}
                onPress={() => handleApplyToJob(job)}
              >
                <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
                <Text style={[styles.actionButtonText, styles.applyButtonText]}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="briefcase-outline" size={64} color="#B0BEC5" />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No jobs found
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        Try adjusting your search criteria or filters
      </Text>
      <Button 
        mode="outlined" 
        onPress={handleFilterClear}
        style={styles.clearFiltersButton}
        textColor="#1976D2"
      >
        Clear Filters
      </Button>
    </View>
  );

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.jobType.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.remote !== null) count++;
    if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) count++;
    return count;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Find Your Dream Job
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {filteredJobs.length} jobs available
            </Text>
          </View>

          {/* Enhanced Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search jobs, companies, or skills..."
              onFilterPress={handleFilterPress}
              onVoiceSearch={() => console.log('Voice search')}
              showFilterButton={true}
              showVoiceSearch={true}
              showSuggestions={true}
              recentSearches={['React Native Developer', 'Remote Jobs', 'Frontend Developer']}
              suggestions={['JavaScript', 'TypeScript', 'Mobile Development', 'UI/UX Design']}
              activeFilters={getActiveFilters()}
              onRemoveFilter={handleRemoveFilter}
              onClearFilters={handleFilterClear}
            />
          </View>

          {/* Enhanced Filter Bar */}
          <View style={styles.filterBar}>
            <View style={styles.filterLeftSection}>
              <TouchableOpacity 
                style={[styles.filterButton, getActiveFiltersCount() > 0 && styles.activeFilterButton]}
                onPress={handleFilterPress}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons 
                  name="tune" 
                  size={20} 
                  color={getActiveFiltersCount() > 0 ? "#FFFFFF" : "#666666"} 
                />
                <Text 
                  variant="bodyMedium" 
                  style={[
                    styles.filterButtonText,
                    { color: getActiveFiltersCount() > 0 ? "#FFFFFF" : "#666666" }
                  ]}
                >
                  Filters
                </Text>
                {getActiveFiltersCount() > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sortButton}
                onPress={() => console.log('Sort pressed')}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="sort" size={20} color="#666666" />
                <Text variant="bodyMedium" style={styles.sortButtonText}>
                  Sort
                </Text>
              </TouchableOpacity>
            </View>

            {getActiveFiltersCount() > 0 && (
              <TouchableOpacity 
                onPress={handleFilterClear}
                style={styles.clearAllButton}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="close-circle" size={16} color="#F44336" />
                <Text variant="bodyMedium" style={styles.clearFiltersText}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Recommended Jobs */}
          {recommendedJobs.length > 0 && (
            <View>
              {renderRecommendedJobs()}
            </View>
          )}

          {/* Jobs List */}
          <View style={styles.jobsSection}>
            <Text variant="titleLarge" style={styles.jobsSectionTitle}>
              All Jobs
            </Text>
            
            {filteredJobs.length > 0 ? (
              renderJobsGrid()
            ) : (
              renderEmptyState()
            )}
          </View>
        </View>
      </ScrollView>

      {/* Enhanced Filter Modal */}
      <FilterJobsScreen
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
      />

      {/* FAB */}
      <View style={styles.fabContainer}>
        <FAB
          icon={() => <MaterialCommunityIcons name="filter-variant" size={24} color="white" />}
          style={styles.fab}
          onPress={handleFilterPress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  subtitle: {
    opacity: 0.7,
    color: '#666666',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeFilterButton: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  filterButtonText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  filterBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterBadgeText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '700',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sortButtonText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
    color: '#666666',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  clearFiltersText: {
    color: '#F44336',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  recommendedSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  recommendedSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedSubtitleText: {
    marginLeft: 4,
    color: '#666666',
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  viewAllText: {
    color: '#1976D2',
    fontWeight: '600',
    marginRight: 4,
  },
  recommendedContainer: {
    paddingLeft: 20,
  },
  recommendedCard: {
    width: 320,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // Job Card Styles
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  jobCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  jobLogoContainer: {
    marginRight: 12,
  },
  jobLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  jobLogoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  jobInfoContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobCardTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  jobCardCompany: {
    color: '#666666',
    marginBottom: 4,
  },
  jobCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobCardLocationText: {
    marginLeft: 4,
    color: '#666666',
  },
  matchPercentageContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  matchPercentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  matchLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 4,
  },
  matchBar: {
    width: 50,
    height: 3,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  matchBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  jobCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  jobTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jobTagText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  urgentTag: {
    backgroundColor: '#FFEBEE',
  },
  urgentTagText: {
    color: '#F44336',
    marginLeft: 4,
  },
  jobSalaryContainer: {
    alignItems: 'flex-end',
  },
  jobSalaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  jobCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  applyButton: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  applyButtonText: {
    color: '#FFFFFF',
  },
  jobsSection: {
    paddingHorizontal: 20,
  },
  jobsSectionTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  jobsList: {
    marginBottom: 20,
  },
  jobsGrid: {
    marginBottom: 20,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#999999',
    textAlign: 'center',
    marginBottom: 24,
  },
  clearFiltersButton: {
    borderColor: '#1976D2',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    backgroundColor: '#3b82f6',
  },
});

export default JobsScreen;