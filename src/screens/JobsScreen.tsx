import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, FAB, useTheme, Card, Chip, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import FiltersModal from '../components/FiltersModal';
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

  const renderRecommendedJobs = () => (
    <View style={styles.recommendedSection}>
      <View style={styles.sectionHeader}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Recommended for You
        </Text>
        <TouchableOpacity>
          <Text variant="bodyMedium" style={styles.viewAllText}>
            View All
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendedContainer}
      >
        {recommendedJobs.map((job) => (
          <Card key={job.id} style={styles.recommendedCard}>
            <Card.Content style={styles.recommendedContent}>
              <View style={styles.recommendedHeader}>
                <Text variant="titleMedium" style={styles.recommendedTitle}>
                  {job.title}
                </Text>
                <Chip 
                  style={[styles.urgentChip, { backgroundColor: job.isUrgent ? '#FF5722' : '#4CAF50' }]}
                  textStyle={styles.urgentChipText}
                >
                  {job.isUrgent ? 'Urgent' : 'New'}
                </Chip>
              </View>
              
              <Text variant="bodyMedium" style={styles.recommendedCompany}>
                {job.company}
              </Text>
              
              <View style={styles.recommendedDetails}>
                <View style={styles.recommendedDetailRow}>
                  <MaterialCommunityIcons name="map-marker" size={14} color="#666666" />
                  <Text variant="bodySmall" style={styles.recommendedDetailText}>
                    {job.location}
                  </Text>
                </View>
                
                <View style={styles.recommendedDetailRow}>
                  <MaterialCommunityIcons name="currency-usd" size={14} color="#4CAF50" />
                  <Text variant="bodySmall" style={[styles.recommendedDetailText, styles.salaryText]}>
                    {job.salary}
                  </Text>
                </View>
              </View>
              
              <View style={styles.recommendedTags}>
                {job.tags.slice(0, 2).map((tag, index) => (
                  <Chip key={index} style={styles.tagChip} textStyle={styles.tagChipText}>
                    {tag}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
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
    const isTablet = screenWidth > 768;
    const numColumns = isTablet ? 2 : 1;
    const cardWidth = isTablet ? (screenWidth - 60) / 2 : screenWidth - 40;

    return (
      <View style={styles.jobsGrid}>
        {filteredJobs.map((job, index) => (
          <View 
            key={job.id} 
            style={[
              styles.jobCardContainer,
              { width: cardWidth }
            ]}
          >
            <JobCard 
              job={job} 
              onSave={() => console.log('Save job:', job.id)}
              onApply={() => handleApplyToJob(job)}
            />
          </View>
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

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search jobs, companies, or skills..."
            />
          </View>

          {/* Filter Bar */}
          <View style={styles.filterBar}>
            <TouchableOpacity 
              style={[styles.filterButton, getActiveFiltersCount() > 0 && styles.activeFilterButton]}
              onPress={handleFilterPress}
            >
              <MaterialCommunityIcons 
                name="filter-variant" 
                size={20} 
                color={getActiveFiltersCount() > 0 ? "#1976D2" : "#666666"} 
              />
              <Text 
                variant="bodyMedium" 
                style={[
                  styles.filterButtonText,
                  { color: getActiveFiltersCount() > 0 ? "#1976D2" : "#666666" }
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

            {getActiveFiltersCount() > 0 && (
              <TouchableOpacity onPress={handleFilterClear}>
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

      {/* Filter Modal */}
      <FiltersModal
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        onApply={handleFilterApply}
        filters={filters}
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterButton: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  filterButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  filterBadge: {
    backgroundColor: '#1976D2',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  clearFiltersText: {
    color: '#1976D2',
    fontWeight: '500',
  },
  recommendedSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  viewAllText: {
    color: '#1976D2',
    fontWeight: '500',
  },
  recommendedContainer: {
    paddingLeft: 20,
  },
  recommendedCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendedContent: {
    padding: 16,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendedTitle: {
    flex: 1,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  urgentChip: {
    height: 24,
  },
  urgentChipText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  recommendedCompany: {
    color: '#666666',
    marginBottom: 12,
  },
  recommendedDetails: {
    marginBottom: 12,
  },
  recommendedDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendedDetailText: {
    marginLeft: 6,
    color: '#666666',
  },
  salaryText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  recommendedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    backgroundColor: '#E3F2FD',
    marginRight: 6,
    marginBottom: 4,
    height: 24,
  },
  tagChipText: {
    fontSize: 10,
    color: '#1976D2',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  jobCardContainer: {
    marginBottom: 16,
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