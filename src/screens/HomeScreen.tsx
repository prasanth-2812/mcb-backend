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
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notificationsData });
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
    const matchingSkills = userSkills.filter(skill => 
      jobTags.some(tag => tag.toLowerCase().includes(skill.toLowerCase()))
    );
    return Math.min(95, Math.max(60, 60 + (matchingSkills.length * 10)));
  };

  const handleJobPress = (job: any) => {
    navigation.navigate('JobDetails' as never, { job } as never);
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
    const applied = state.applications.filter(app => app.status === 'Applied').length;
    const shortlisted = state.applications.filter(app => app.status === 'Shortlisted').length;
    const interviews = state.applications.filter(app => app.status === 'Interview').length;
    
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
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialCommunityIcons name="magnify" size={24} color="#1976D2" />
                <Text variant="bodyMedium" style={styles.quickActionText}>
                  Find Jobs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialCommunityIcons name="account-edit-outline" size={24} color="#1976D2" />
                <Text variant="bodyMedium" style={styles.quickActionText}>
                  Update Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={handleSavedJobs}>
                <MaterialCommunityIcons name="bookmark-outline" size={24} color="#1976D2" />
                <Text variant="bodyMedium" style={styles.quickActionText}>
                  Saved Jobs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={handleNotifications}>
                <MaterialCommunityIcons name="bell-ring-outline" size={24} color="#1976D2" />
                <Text variant="bodyMedium" style={styles.quickActionText}>
                  Notifications
                </Text>
              </TouchableOpacity>
            </View>
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
  quickActionText: {
    marginTop: 8,
    color: '#1976D2',
    fontWeight: '600',
  },
  jobsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  jobCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  jobCountText: {
    marginLeft: 4,
    color: '#666666',
    fontWeight: '500',
  },
  loadingContainer: {
    marginBottom: 16,
  },
  jobsList: {
    marginBottom: 16,
  },
  jobCardWrapper: {
    marginBottom: 12,
  },
  jobInsights: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  insightCard: {
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
    color: '#666666',
    fontSize: 11,
    fontWeight: '500',
  },
  quickJobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickActionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickActionText: {
    marginLeft: 8,
    color: '#1976D2',
    fontWeight: '600',
  },
  jobCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  jobCardContent: {
    padding: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  jobCompany: {
    color: '#666666',
    marginBottom: 4,
  },
  jobLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobLocationText: {
    marginLeft: 4,
    color: '#B0BEC5',
  },
  jobLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTags: {
    flexDirection: 'row',
    flex: 1,
  },
  jobTag: {
    marginRight: 8,
    backgroundColor: '#E3F2FD',
  },
  jobTagText: {
    color: '#1976D2',
    fontSize: 12,
  },
  urgentTag: {
    backgroundColor: '#FFEBEE',
  },
  urgentTagText: {
    color: '#D32F2F',
  },
  jobSalary: {
    fontWeight: '700',
    color: '#4CAF50',
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
