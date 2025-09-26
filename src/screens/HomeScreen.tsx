import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, Card, Button, useTheme, Chip, Avatar, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import ProfileCard from '../components/ProfileCard';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import JobCardSkeleton from '../components/JobCardSkeleton';
import { AnimatedButton, AnimatedCard } from '../components/MicroInteractions';
import jobsData from '../data/jobs.json';
import notificationsData from '../data/notifications.json';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch } = useApp();
  const navigation = useNavigation();
  const isDark = state.theme === 'dark';
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [showJobDetails, setShowJobDetails] = useState(false);
  
  // Animation values
  const jobsOpacity = useSharedValue(0);
  const jobsTranslateY = useSharedValue(20);
  const sectionScale = useSharedValue(0.95);

  useEffect(() => {
    // Load initial data
    if (state.jobs.length === 0) {
      dispatch({ type: 'SET_JOBS', payload: jobsData });
    }
    if (state.notifications.length === 0) {
      // Transform notifications data to match the expected type
      const transformedNotifications = notificationsData.map(notification => ({
        ...notification,
        timestamp: notification.createdAt
      }));
      dispatch({ type: 'SET_NOTIFICATIONS', payload: transformedNotifications as any });
    }
    
    // Simulate loading with animations
    const loadJobs = async () => {
      setIsLoadingJobs(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoadingJobs(false);
      
      // Animate jobs section
      jobsOpacity.value = withTiming(1, { duration: 600 });
      jobsTranslateY.value = withSpring(0, { damping: 15, stiffness: 300 });
      sectionScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };
    
    loadJobs();
  }, []);


  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSavedJobs = () => {
    navigation.navigate('SavedJobs' as never);
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications' as never);
  };

  const handleProfile = () => {
    navigation.navigate('Profile' as never);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRecentJobs = () => {
    return state.jobs.slice(0, 3);
  };

  const getJobMatchPercentage = (job: any) => {
    // Simulate match calculation based on user skills and job requirements
    const userSkills = state.user?.professionalInfo?.skills || [];
    const jobTags = job.tags || [];
    const matchingSkills = userSkills.filter((skill: string) => 
      jobTags.some((tag: string) => tag.toLowerCase().includes(skill.toLowerCase()))
    );
    return Math.min(95, Math.max(60, 60 + (matchingSkills.length * 10)));
  };

  const handleJobPress = (job: any) => {
    (navigation as any).navigate('JobDetails', { job });
  };

  const handleJobApply = (jobId: string) => {
    // Handle job application
    console.log('Applying to job:', jobId);
  };

  const handleJobSave = (jobId: string) => {
    // Handle job save
    console.log('Saving job:', jobId);
  };

  const handleJobShare = (job: any) => {
    // Handle job share
    console.log('Sharing job:', job.title);
  };

  // Animated styles
  const animatedJobsStyle = useAnimatedStyle(() => ({
    opacity: jobsOpacity.value,
    transform: [
      { translateY: jobsTranslateY.value },
      { scale: sectionScale.value }
    ],
  }));

  const getUnreadNotifications = () => {
    return state.notifications.filter(n => !n.isRead).length;
  };

  const getApplicationStats = () => {
    const total = state.applications.length;
    const applied = state.applications.filter(app => app.status === 'applied').length;
    const shortlisted = state.applications.filter(app => app.status === 'shortlisted').length;
    const interviews = state.applications.filter(app => app.status === 'interview').length;
    
    return { total, applied, shortlisted, interviews };
  };

  const stats = getApplicationStats();

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: '#F9F9F9' }
    ]}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="#F9F9F9"
      />
      
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
        {/* Professional Header with Avatar */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Text 
                variant="headlineMedium" 
                style={styles.greeting}
              >
                {getGreeting()}, {state.user?.personalInfo.firstName || 'User'}!
              </Text>
              <Text 
                variant="bodyLarge" 
                style={styles.subtitle}
              >
                Ready to build your career today?
              </Text>
            </View>
            <Avatar.Icon 
              size={48} 
              icon="account-circle-outline"
              style={styles.avatar}
            />
          </View>
        </View>

        <View style={styles.content}>
          {/* Profile Completion Card */}
          {state.user && (
            <Card style={styles.profileCard}>
              <Card.Content style={styles.profileContent}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileInfo}>
                    <Text variant="titleLarge" style={styles.profileTitle}>
                      Complete Your Profile
                    </Text>
                    <Text variant="bodyMedium" style={styles.profileSubtitle}>
                      {Math.round((state.user.profileCompletion || 0) * 100)}% Complete
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="account-check-outline" size={28} color="#1976D2" />
                </View>
                <ProgressBar 
                  progress={state.user.profileCompletion || 0.3} 
                  color="#1976D2"
                  style={styles.progressBar}
                />
                <Button 
                  mode="outlined" 
                  onPress={() => {}}
                  style={styles.profileButton}
                  textColor="#1976D2"
                >
                  Complete Profile
                </Button>
              </Card.Content>
            </Card>
          )}

          {/* Your Progress - Horizontal Cards */}
          <View style={styles.progressSection}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Your Progress
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.progressCardsContainer}
            >
              <Card style={styles.progressCard}>
                <Card.Content style={styles.progressCardContent}>
                  <MaterialCommunityIcons name="file-document-multiple" size={24} color="#1976D2" />
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
                  <MaterialCommunityIcons name="account-check" size={24} color="#FF9800" />
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
                  <MaterialCommunityIcons name="calendar-clock" size={24} color="#4CAF50" />
                  <Text variant="headlineSmall" style={styles.progressNumber}>
                    {stats.interviews}
                  </Text>
                  <Text variant="bodySmall" style={styles.progressLabel}>
                    Interviews
                  </Text>
                </Card.Content>
              </Card>
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Quick Actions
            </Text>
          </View>

          {/* Enhanced Search Bar */}
          <SearchBar
            placeholder="Search for jobs, companies, or skills..."
            onSearch={handleSearch}
            onFilterPress={() => navigation.navigate('Jobs' as never)}
            onVoiceSearch={() => console.log('Voice search activated')}
            showVoiceSearch={true}
            showSuggestions={true}
            recentSearches={['React Native Developer', 'Remote Jobs', 'Frontend Developer']}
            suggestions={['JavaScript', 'TypeScript', 'Mobile Development']}
            activeFilters={[]}
            onRemoveFilter={() => {}}
            onClearFilters={() => {}}
          />

          {/* New Recommended Jobs Section */}
          <View style={styles.recommendedJobsSection}>
            {/* Section Header */}
            <View style={styles.recommendedHeader}>
              <View style={styles.recommendedTitleContainer}>
                <Text variant="headlineSmall" style={styles.recommendedTitle}>
                  Recommended for You
                </Text>
                <View style={styles.recommendedSubtitle}>
                  <MaterialCommunityIcons name="sparkles" size={14} color="#FFD700" />
                  <Text variant="bodySmall" style={styles.recommendedSubtitleText}>
                    Based on your profile
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => (navigation as any).navigate('Jobs')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#1976D2" />
              </TouchableOpacity>
            </View>

            {/* Job Cards Container */}
            <View style={styles.jobCardsContainer}>
              {isLoadingJobs ? (
                // Loading Skeleton
                <View style={styles.loadingJobsContainer}>
                  {[1, 2, 3].map((index) => (
                    <View key={index} style={styles.jobCardSkeleton}>
                      <View style={styles.skeletonHeader}>
                        <View style={styles.skeletonLogo} />
                        <View style={styles.skeletonContent}>
                          <View style={styles.skeletonTitle} />
                          <View style={styles.skeletonCompany} />
                          <View style={styles.skeletonLocation} />
                        </View>
                      </View>
                      <View style={styles.skeletonFooter}>
                        <View style={styles.skeletonTags}>
                          <View style={styles.skeletonTag} />
                          <View style={styles.skeletonTag} />
                        </View>
                        <View style={styles.skeletonSalary} />
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                // Actual Job Cards
                <View style={styles.jobCardsList}>
                  {getRecentJobs().map((job, index) => (
                    <TouchableOpacity 
                      key={job.id}
                      style={styles.jobCard}
                      onPress={() => handleJobPress(job)}
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
                          onPress={() => handleJobApply(job.id)}
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
              )}
            </View>

            {/* Job Insights */}
            {!isLoadingJobs && getRecentJobs().length > 0 && (
              <View style={styles.jobInsightsContainer}>
                <View style={styles.insightItem}>
                  <MaterialCommunityIcons name="trending-up" size={16} color="#4CAF50" />
                  <Text style={styles.insightText}>
                    {getRecentJobs().filter(job => getJobMatchPercentage(job) > 80).length} high matches
                  </Text>
                </View>
                <View style={styles.insightItem}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#FF9800" />
                  <Text style={styles.insightText}>
                    {getRecentJobs().filter(job => job.isUrgent).length} urgent
                  </Text>
                </View>
                <View style={styles.insightItem}>
                  <MaterialCommunityIcons name="map-marker" size={16} color="#2196F3" />
                  <Text style={styles.insightText}>
                    {new Set(getRecentJobs().map(job => job.location.split(',')[1]?.trim())).size} locations
                  </Text>
                </View>
              </View>
            )}

            {/* New Quick Actions Section */}
            {!isLoadingJobs && (
              <View style={styles.quickActionsSection}>
                <View style={styles.quickActionsHeader}>
                  <Text variant="headlineSmall" style={styles.quickActionsTitle}>
                    Quick Actions
                  </Text>
                  <View style={styles.quickActionsSubtitle}>
                    <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FFD700" />
                    <Text variant="bodySmall" style={styles.quickActionsSubtitleText}>
                      Get things done faster
                    </Text>
                  </View>
                </View>

                {/* Primary Action - Search Jobs */}
                <TouchableOpacity 
                  style={styles.primaryQuickAction}
                  onPress={() => (navigation as any).navigate('Jobs')}
                  activeOpacity={0.9}
                >
                  <View style={styles.primaryActionBackground}>
                    <View style={styles.primaryActionContent}>
                      <View style={styles.primaryActionIcon}>
                        <MaterialCommunityIcons name="magnify" size={28} color="#FFFFFF" />
                      </View>
                      <View style={styles.primaryActionText}>
                        <Text style={styles.primaryActionTitle}>Search Jobs</Text>
                        <Text style={styles.primaryActionSubtitle}>Find your next opportunity</Text>
                      </View>
                      <View style={styles.primaryActionArrow}>
                        <MaterialCommunityIcons name="arrow-right" size={24} color="#FFFFFF" />
                      </View>
                    </View>
                    <View style={styles.primaryActionStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{state.jobs.length}</Text>
                        <Text style={styles.statLabel}>Jobs Available</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{getRecentJobs().length}</Text>
                        <Text style={styles.statLabel}>Recommended</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Secondary Actions Grid */}
                <View style={styles.secondaryActionsGrid}>
                  <TouchableOpacity 
                    style={styles.secondaryAction}
                    onPress={() => (navigation as any).navigate('SavedJobs')}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.secondaryActionIcon, { backgroundColor: '#E3F2FD' }]}>
                      <MaterialCommunityIcons name="bookmark" size={20} color="#1976D2" />
                    </View>
                    <Text style={styles.secondaryActionTitle}>Saved Jobs</Text>
                    <Text style={styles.secondaryActionCount}>{state.savedJobs.length}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.secondaryAction}
                    onPress={() => (navigation as any).navigate('Applications')}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.secondaryActionIcon, { backgroundColor: '#E8F5E8' }]}>
                      <MaterialCommunityIcons name="file-document" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.secondaryActionTitle}>Applications</Text>
                    <Text style={styles.secondaryActionCount}>{state.applications.length}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.secondaryAction}
                    onPress={() => (navigation as any).navigate('Profile')}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.secondaryActionIcon, { backgroundColor: '#FFF3E0' }]}>
                      <MaterialCommunityIcons name="account" size={20} color="#FF9800" />
                    </View>
                    <Text style={styles.secondaryActionTitle}>Profile</Text>
                    <Text style={styles.secondaryActionSubtitle}>Complete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.secondaryAction}
                    onPress={() => (navigation as any).navigate('Notifications')}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.secondaryActionIcon, { backgroundColor: '#F3E5F5' }]}>
                      <MaterialCommunityIcons name="bell" size={20} color="#9C27B0" />
                    </View>
                    <Text style={styles.secondaryActionTitle}>Notifications</Text>
                    <Text style={styles.secondaryActionCount}>{getUnreadNotifications()}</Text>
                  </TouchableOpacity>
                </View>

                {/* Quick Stats */}
                <View style={styles.quickStatsContainer}>
                  <View style={styles.quickStat}>
                    <MaterialCommunityIcons name="trending-up" size={16} color="#4CAF50" />
                    <Text style={styles.quickStatText}>
                      {getRecentJobs().filter(job => getJobMatchPercentage(job) > 80).length} high matches
                    </Text>
                  </View>
                  <View style={styles.quickStat}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color="#FF9800" />
                    <Text style={styles.quickStatText}>
                      {getRecentJobs().filter(job => job.isUrgent).length} urgent jobs
                    </Text>
                  </View>
                  <View style={styles.quickStat}>
                    <MaterialCommunityIcons name="map-marker" size={16} color="#2196F3" />
                    <Text style={styles.quickStatText}>
                      {new Set(getRecentJobs().map(job => job.location.split(',')[1]?.trim())).size} locations
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Notifications Summary */}
          {getUnreadNotifications() > 0 && (
            <Card style={styles.notificationCard}>
              <Card.Content style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationInfo}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color="#1976D2" />
                    <Text variant="titleMedium" style={styles.notificationTitle}>
                      You have {getUnreadNotifications()} new notifications
                    </Text>
                  </View>
                  <Chip 
                    style={styles.notificationChip}
                    textStyle={styles.notificationChipText}
                  >
                    {getUnreadNotifications()}
                  </Chip>
                </View>
                <Button
                  mode="text"
                  onPress={handleNotifications}
                  textColor="#1976D2"
                >
                  View Notifications
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
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
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666666',
  },
  avatar: {
    backgroundColor: '#1976D2',
  },
  content: {
    paddingHorizontal: 20,
  },
  profileCard: {
    marginBottom: 20,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
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
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileSubtitle: {
    color: '#666666',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  profileButton: {
    borderColor: '#1976D2',
  },
  progressSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  progressCardsContainer: {
    paddingRight: 20,
  },
  progressCard: {
    width: 100,
    marginRight: 10,
    elevation: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  progressCardContent: {
    alignItems: 'center',
    padding: 12,
  },
  progressNumber: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 6,
    marginBottom: 3,
    fontSize: 18,
  },
  progressLabel: {
    color: '#666666',
    textAlign: 'center',
    fontSize: 12,
  },
  quickActionsSection: {
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // New Recommended Jobs Section Styles
  recommendedJobsSection: {
    marginBottom: 24,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recommendedTitleContainer: {
    flex: 1,
  },
  recommendedTitle: {
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
  jobCardsContainer: {
    marginBottom: 16,
  },
  loadingJobsContainer: {
    gap: 12,
  },
  jobCardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  skeletonHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  skeletonLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
  skeletonCompany: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 6,
    width: '60%',
  },
  skeletonLocation: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '40%',
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonTags: {
    flexDirection: 'row',
    gap: 8,
  },
  skeletonTag: {
    height: 24,
    width: 60,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
  },
  skeletonSalary: {
    height: 16,
    width: 80,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  jobCardsList: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  jobInsightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  insightItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  insightText: {
    marginLeft: 4,
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
  },
  // New Quick Actions Section Styles
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsHeader: {
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  quickActionsSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionsSubtitleText: {
    marginLeft: 4,
    color: '#666666',
    fontWeight: '500',
  },
  primaryQuickAction: {
    marginBottom: 16,
  },
  primaryActionBackground: {
    backgroundColor: '#1976D2',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  primaryActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  primaryActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  primaryActionArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  secondaryActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  secondaryAction: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  secondaryActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  secondaryActionCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
  },
  secondaryActionSubtitle: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  quickStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStatText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  notificationCard: {
    marginTop: 8,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationTitle: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  notificationChip: {
    backgroundColor: '#1976D2',
    marginLeft: 8,
  },
  notificationChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HomeScreen;
