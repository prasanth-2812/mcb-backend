import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, Card, Button, useTheme, Chip, Avatar, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import JobCardSkeleton from '../components/JobCardSkeleton';
// Removed dummy data import - using API data only

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch, saveJob, unsaveJob } = useApp();
  const navigation = useNavigation();
  const isDark = state.theme === 'dark';
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  

  useEffect(() => {
    // Load initial data
    const loadInitialData = async () => {
      console.log('🏠 HomeScreen: Starting initial data load...');
      console.log('🏠 Current jobs in state:', state.jobs.length);
      setIsLoadingJobs(true);
      
      // Load jobs if not already loaded
      if (state.jobs.length === 0) {
        console.log('🔄 No jobs in state, loading from API...');
        await loadJobsFromAPI();
      } else {
        console.log('✅ Jobs already loaded:', state.jobs.length);
      }
      
      // Load notifications if not already loaded
      if (state.notifications.length === 0) {
        // Notifications will be loaded from API in AppContext
        console.log('📱 Notifications will be loaded from API');
      }
      
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoadingJobs(false);
      console.log('🏠 HomeScreen: Initial data load complete. Jobs count:', state.jobs.length);
    };
    
    loadInitialData();
  }, []);

  const loadJobsFromAPI = async () => {
    try {
      console.log('🔄 Loading jobs from API...');
      const { loadDataFromAPI } = await import('../utils/dataLoader');
      const apiData = await loadDataFromAPI();
      console.log('✅ Jobs loaded from API:', apiData.jobs.length);
      dispatch({ type: 'SET_JOBS', payload: apiData.jobs });
    } catch (error) {
      console.error('❌ Failed to load jobs from API:', error);
      // Try to load from AppContext's background loading
      if (state.jobs.length === 0) {
        console.log('🔄 No jobs available, showing empty state');
        dispatch({ type: 'SET_JOBS', payload: [] });
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh jobs from API
    await loadJobsFromAPI();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSavedJobs = () => {
    (navigation as any).navigate('SavedJobs');
  };

  const handleNotifications = () => {
    (navigation as any).navigate('Notifications');
  };

  const handleProfile = () => {
    (navigation as any).navigate('Profile');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRecentJobs = () => {
    const recentJobs = state.jobs.slice(0, 3);
    console.log('🏠 getRecentJobs called. Total jobs:', state.jobs.length, 'Recent jobs:', recentJobs.length);
    return recentJobs;
  };


  const getJobMatchPercentage = (job: any) => {
    if (!job) return 60;
    const userSkills = state.user?.skills || [];
    const jobTags = job.tags || [];
    const matchingSkills = userSkills.filter((skill: string) => 
      jobTags.some((tag: string) => tag.toLowerCase().includes(skill.toLowerCase()))
    );
    return Math.min(95, Math.max(60, 60 + (matchingSkills.length * 10)));
  };

  const handleJobPress = (job: any) => {
    (navigation as any).navigate('JobDetails', { jobId: job.id });
  };

  const handleJobApply = (job: any) => {
    console.log('Apply button clicked for job:', job.id);
    // Navigate to job details first, same as clicking job card
    (navigation as any).navigate('JobDetails', { jobId: job.id });
  };

  const handleJobSave = async (jobId: string) => {
    try {
      if (state.savedJobs.includes(jobId)) {
        await unsaveJob(jobId);
      } else {
        await saveJob(jobId);
      }
    } catch (error) {
      console.error('❌ Failed to save/unsave job:', error);
    }
  };

  const getUnreadNotifications = () => {
    return state.notifications.filter(n => !n.isRead).length;
  };

  const getApplicationStats = () => {
    const total = state.applications.length;
    const shortlisted = state.applications.filter(app => app.status === 'shortlisted').length;
    const interviews = state.applications.filter(app => app.status === 'interview').length;
    
    return { total, shortlisted, interviews };
  };

  const stats = getApplicationStats();

  // Animated styles

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Jobs' },
    { id: 'remote', label: 'Remote' },
    { id: 'fulltime', label: 'Full-time' },
    { id: 'urgent', label: 'Urgent' },
  ];

  // Quick actions data
  const quickActions = [
    {
      id: 'search',
      title: 'Search Jobs',
      icon: 'magnify',
      onPress: () => navigation.navigate('Jobs' as never)
    },
    {
      id: 'applications',
      title: 'Applications',
      icon: 'file-document-multiple',
      onPress: () => navigation.navigate('Applications' as never)
    },
    {
      id: 'saved',
      title: 'Saved Jobs',
      icon: 'bookmark-multiple',
      onPress: handleSavedJobs
    },
    {
      id: 'profile',
      title: 'Build Profile',
      icon: 'account-edit',
      onPress: handleProfile
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1976D2"
          />
        }
      >
        {/* Simple Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Text variant="headlineSmall" style={styles.greeting}>
                {getGreeting()}, {state.user?.name || 'User'}!
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Ready to build your career today?
              </Text>
            </View>
            
            <View style={styles.headerActions}>
              {/* Notification Bell */}
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={handleNotifications}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="bell-outline" size={24} color="#1976D2" />
                {getUnreadNotifications() > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>{getUnreadNotifications()}</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {/* Profile Avatar */}
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={handleProfile}
                activeOpacity={0.7}
              >
                <Avatar.Icon 
                  size={40} 
                  icon="account-circle-outline"
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

         {/* Search Bar */}
         <View style={styles.searchContainer}>
           <SearchBar
             placeholder="Search for jobs, companies, or skills..."
             onSearch={handleSearch}
             onFilterPress={() => navigation.navigate('Jobs' as never)}
             showFilterButton={true}
             showVoiceSearch={false}
             showSuggestions={false}
             activeFilters={[]}
             onRemoveFilter={() => {}}
             onClearFilters={() => {}}
           />
         </View>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChips}
          >
            {filterOptions.map((filter) => (
              <Chip
                key={filter.id}
                selected={selectedFilter === filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.id && styles.selectedFilterChip
                ]}
                textStyle={[
                  styles.filterChipText,
                  selectedFilter === filter.id && styles.selectedFilterChipText
                ]}
              >
                {filter.label}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <View style={styles.content}>
          {/* Profile Completion */}
          {state.user && (
            <Card style={styles.profileCard}>
              <Card.Content style={styles.profileContent}>
                <View style={styles.profileHeader}>
                  <Text variant="titleMedium" style={styles.profileTitle}>
                    Complete Your Profile
                  </Text>
                  <Text variant="bodySmall" style={styles.profilePercentage}>
                    {state.user.profileCompletion || 0}%
                  </Text>
                </View>
                <ProgressBar 
                  progress={(state.user.profileCompletion || 0) / 100} 
                  color="#1976D2"
                  style={styles.progressBar}
                />
                <Button 
                  mode="outlined" 
                  onPress={() => (navigation as any).navigate('EditProfile')}
                  style={styles.profileButton}
                  textColor="#1976D2"
                >
                  Complete Profile
                </Button>
              </Card.Content>
            </Card>
          )}

          {/* Progress Stats */}
          <View style={styles.progressSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Your Progress
            </Text>
            <View style={styles.progressCards}>
              <Card style={styles.progressCard}>
                <Card.Content style={styles.progressCardContent}>
                  <MaterialCommunityIcons name="file-document-multiple" size={20} color="#1976D2" />
                  <Text variant="headlineSmall" style={styles.progressNumber}>
                    {stats.total}
                  </Text>
                  <Text variant="bodySmall" style={styles.progressLabel}>
                    Applications
                  </Text>
                </Card.Content>
              </Card>
              
              <Card style={styles.progressCard}>
                <Card.Content style={styles.progressCardContent}>
                  <MaterialCommunityIcons name="account-check" size={20} color="#FF9800" />
                  <Text variant="headlineSmall" style={styles.progressNumber}>
                    {stats.shortlisted}
                  </Text>
                  <Text variant="bodySmall" style={styles.progressLabel}>
                    Shortlisted
                  </Text>
                </Card.Content>
              </Card>
              
              <Card style={styles.progressCard}>
                <Card.Content style={styles.progressCardContent}>
                  <MaterialCommunityIcons name="calendar-clock" size={20} color="#4CAF50" />
                  <Text variant="headlineSmall" style={styles.progressNumber}>
                    {stats.interviews}
                  </Text>
                  <Text variant="bodySmall" style={styles.progressLabel}>
                    Interviews
                  </Text>
                </Card.Content>
              </Card>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Actions
            </Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionButton}
                  onPress={action.onPress}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name={action.icon} size={24} color="#1976D2" />
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recommended Jobs */}
          <View style={styles.recommendedJobsSection}>
            <View style={styles.recommendedHeader}>
              <Text variant="titleMedium" style={styles.recommendedTitle}>
                Recommended for You
              </Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => (navigation as any).navigate('Jobs')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#1976D2" />
              </TouchableOpacity>
            </View>

            {/* Job Cards */}
            <View style={styles.jobCardsContainer}>
              {(() => {
                const recentJobs = getRecentJobs();
                console.log('🏠 Rendering job cards. isLoadingJobs:', isLoadingJobs, 'recentJobs.length:', recentJobs.length);
                
                if (isLoadingJobs) {
                  return (
                    <View style={styles.loadingJobsContainer}>
                      {[1, 2, 3].map((index) => (
                        <JobCardSkeleton key={index} />
                      ))}
                    </View>
                  );
                } else if (recentJobs.length === 0) {
                  return (
                    <Card style={styles.emptyStateCard}>
                      <Card.Content style={styles.emptyStateContent}>
                        <MaterialCommunityIcons name="briefcase-outline" size={48} color="#CCCCCC" />
                        <Text variant="titleMedium" style={styles.emptyStateTitle}>
                          No Jobs Available
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptyStateText}>
                          Check back later for new job opportunities
                        </Text>
                        <Button 
                          mode="outlined" 
                          onPress={() => (navigation as any).navigate('Jobs')}
                          style={styles.emptyStateButton}
                        >
                          Browse All Jobs
                        </Button>
                      </Card.Content>
                    </Card>
                  );
                } else {
                  return (
                    <View style={styles.jobCardsList}>
                      {recentJobs.map((job) => job ? (
                    <Card 
                      key={job.id} 
                      style={styles.jobCard}
                      onPress={() => handleJobPress(job)}
                    >
                      <Card.Content style={styles.jobCardContent}>
                        {/* Job Header */}
                        <View style={styles.jobCardHeader}>
                          <View style={styles.jobLogoContainer}>
                            {job.companyLogo ? (
                              <Image 
                                source={{ uri: job.companyLogo }} 
                                style={styles.jobLogo}
                                resizeMode="cover"
                                onError={() => {
                                  // Fallback to placeholder if image fails to load
                                  console.log('Failed to load company logo:', job.companyLogo);
                                }}
                              />
                            ) : (
                              <View style={styles.jobLogoPlaceholder}>
                                <Text style={styles.jobLogoText}>
                                  {job.company?.charAt(0)?.toUpperCase() || '?'}
                                </Text>
                              </View>
                            )}
                          </View>
                          
                          <View style={styles.jobInfoContainer}>
                            <Text variant="titleSmall" style={styles.jobCardTitle} numberOfLines={2}>
                              {job.title || 'No Title'}
                            </Text>
                            <Text variant="bodyMedium" style={styles.jobCardCompany}>
                              {job.company || 'Unknown Company'}
                            </Text>
                            <View style={styles.jobCardLocation}>
                              <MaterialCommunityIcons name="map-marker" size={14} color="#666666" />
                              <Text variant="bodySmall" style={styles.jobCardLocationText}>
                                {job.location || 'Location not specified'}
                              </Text>
                            </View>
                          </View>

                          {/* Match Percentage */}
                          <Text style={styles.matchPercentage}>
                            {getJobMatchPercentage(job)}% match
                          </Text>
                        </View>

                        {/* Job Details */}
                          <View style={styles.jobCardDetails}>
                            <View style={styles.jobTagsContainer}>
                              <Text style={styles.jobTag}>{job.type || 'Full-time'}</Text>
                              {job.isRemote && (
                                <Text style={styles.jobTag}>Remote</Text>
                              )}
                              {job.isUrgent && (
                                <Text style={[styles.jobTag, styles.urgentTag]}>Urgent</Text>
                              )}
                            </View>
                            
                            <Text style={styles.jobSalaryText}>{job.salary || 'Salary not specified'}</Text>
                          </View>

                        {/* Action Buttons */}
                        <View style={styles.jobCardActions}>
                          <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleJobSave(job?.id)}
                          >
                            <MaterialCommunityIcons 
                              name={state.savedJobs.includes(job?.id) ? "bookmark" : "bookmark-outline"} 
                              size={18} 
                              color="#1976D2" 
                            />
                            <Text style={styles.actionButtonText}>
                              {state.savedJobs.includes(job?.id) ? "Saved" : "Save"}
                            </Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.applyButton]}
                            onPress={() => handleJobApply(job)}
                          >
                            <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
                            <Text style={[styles.actionButtonText, styles.applyButtonText]}>
                              Apply
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </Card.Content>
                    </Card>
                      ) : null)}
                    </View>
                  );
                }
              })()}
            </View>
          </View>

          {/* Notifications Card */}
          <Card style={styles.notificationsCard}>
            <Card.Content style={styles.notificationsContent}>
              <View style={styles.notificationsHeader}>
                <MaterialCommunityIcons name="bell-outline" size={20} color="#1976D2" />
                <Text variant="titleSmall" style={styles.notificationsTitle}>
                  Notifications
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.notificationsText}>
                {getUnreadNotifications()} unread notifications
              </Text>
              <Button 
                mode="text" 
                onPress={handleNotifications}
                textColor="#1976D2"
                style={styles.notificationsButton}
              >
                View All
              </Button>
            </Card.Content>
          </Card>

          {/* Simple Insights */}
          <Card style={styles.insightsCard}>
            <Card.Content style={styles.insightsContent}>
              <Text variant="titleSmall" style={styles.insightsTitle}>
                Insights
              </Text>
              <View style={styles.insightsList}>
                <Text style={styles.insightText}>
                  • {getRecentJobs().filter(job => getJobMatchPercentage(job) > 80).length} high match jobs
                </Text>
                <Text style={styles.insightText}>
                  • {getRecentJobs().filter(job => job.isUrgent).length} urgent positions
                </Text>
                <Text style={styles.insightText}>
                  • {new Set(getRecentJobs().map(job => job.location?.split(',')[1]?.trim()).filter(Boolean)).size} locations available
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F8F9FA',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F44336',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatarContainer: {
    padding: 4,
  },
  avatar: {
    backgroundColor: '#1976D2',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterChips: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F5F5F5',
  },
  selectedFilterChip: {
    backgroundColor: '#1976D2',
  },
  filterChipText: {
    color: '#666666',
  },
  selectedFilterChipText: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
  },
  profileCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
  },
  profileContent: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileTitle: {
    fontWeight: '600',
    color: '#333333',
  },
  profilePercentage: {
    color: '#1976D2',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
  },
  profileButton: {
    borderRadius: 8,
  },
  progressSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  progressCards: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    borderRadius: 12,
    elevation: 1,
  },
  progressCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  progressNumber: {
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
    marginBottom: 4,
  },
  progressLabel: {
    color: '#666666',
  },
  quickActionsSection: {
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: (screenWidth - 44) / 2,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
  },
  quickActionTitle: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  recommendedJobsSection: {
    marginBottom: 20,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendedTitle: {
    fontWeight: '600',
    color: '#333333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  viewAllText: {
    color: '#1976D2',
    fontSize: 14,
    marginRight: 4,
  },
  jobCardsContainer: {
    gap: 12,
  },
  loadingJobsContainer: {
    gap: 12,
  },
  jobCardsList: {
    gap: 12,
  },
  jobCard: {
    borderRadius: 12,
    elevation: 1,
  },
  jobCardContent: {
    padding: 16,
  },
  jobCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  jobLogoContainer: {
    marginRight: 12,
  },
  jobLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  jobLogoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobLogoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobInfoContainer: {
    flex: 1,
  },
  jobCardTitle: {
    fontWeight: '600',
    color: '#333333',
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
    color: '#666666',
    marginLeft: 4,
  },
  matchPercentage: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '500',
  },
  jobCardDetails: {
    marginBottom: 12,
  },
  jobTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  jobTag: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgentTag: {
    backgroundColor: '#FFEBEE',
    color: '#F44336',
  },
  jobSalaryText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  actionButtonText: {
    color: '#1976D2',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  applyButtonText: {
    color: '#FFFFFF',
  },
  notificationsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
  },
  notificationsContent: {
    padding: 16,
  },
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationsTitle: {
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  notificationsText: {
    color: '#666666',
    marginBottom: 8,
  },
  notificationsButton: {
    alignSelf: 'flex-start',
  },
  insightsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
  },
  insightsContent: {
    padding: 16,
  },
  insightsTitle: {
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  insightsList: {
    gap: 4,
  },
  insightText: {
    color: '#666666',
    fontSize: 14,
  },
  emptyStateCard: {
    borderRadius: 12,
    elevation: 1,
    marginVertical: 8,
  },
  emptyStateContent: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateTitle: {
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    color: '#999999',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    borderRadius: 8,
  },
});

export default HomeScreen;


