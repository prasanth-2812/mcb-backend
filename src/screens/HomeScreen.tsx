import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, useTheme, Chip, Avatar, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import ProfileCard from '../components/ProfileCard';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import jobsData from '../data/jobs.json';
import notificationsData from '../data/notifications.json';

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch } = useApp();
  const navigation = useNavigation();
  const isDark = state.theme === 'dark';
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const headerOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);
  const progressCardsScale = useSharedValue(0);
  const quickActionsScale = useSharedValue(0);

  useEffect(() => {
    // Load initial data
    if (state.jobs.length === 0) {
      dispatch({ type: 'SET_JOBS', payload: jobsData });
    }
    if (state.notifications.length === 0) {
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notificationsData });
    }

    // Animate entrance with staggered animations
    headerOpacity.value = withTiming(1, { duration: 600 });
    setTimeout(() => {
      cardsOpacity.value = withTiming(1, { duration: 600 });
    }, 200);
    setTimeout(() => {
      progressCardsScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }, 400);
    setTimeout(() => {
      quickActionsScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }, 600);
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const cardsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
  }));

  const progressCardsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progressCardsScale.value }],
    opacity: interpolate(progressCardsScale.value, [0, 1], [0, 1], Extrapolate.CLAMP),
  }));

  const quickActionsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: quickActionsScale.value }],
    opacity: interpolate(quickActionsScale.value, [0, 1], [0, 1], Extrapolate.CLAMP),
  }));

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
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
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
        </Animated.View>

        <Animated.View style={[styles.content, cardsAnimatedStyle]}>
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
          <Animated.View style={[styles.progressSection, progressCardsAnimatedStyle]}>
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
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={[styles.quickActionsSection, quickActionsAnimatedStyle]}>
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
          </Animated.View>

          {/* Search Bar */}
          <Card style={styles.searchCard}>
            <Card.Content style={styles.searchContent}>
              <View style={styles.searchContainer}>
                <MaterialCommunityIcons name="magnify" size={24} color="#B0BEC5" />
                <Text style={styles.searchPlaceholder}>
                  Search for jobs, companies, or skills...
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Recommended Jobs */}
          <View style={styles.jobsSection}>
            <View style={styles.sectionHeader}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Recommended Jobs
              </Text>
              <Button
                mode="text"
                onPress={() => {}}
                textColor="#1976D2"
              >
                View All
              </Button>
            </View>
            
            {getRecentJobs().map((job, index) => (
              <Card key={job.id} style={styles.jobCard}>
                <Card.Content style={styles.jobCardContent}>
                  <View style={styles.jobHeader}>
                    <View style={styles.jobInfo}>
                      <Text variant="titleMedium" style={styles.jobTitle}>
                        {job.title}
                      </Text>
                      <Text variant="bodyMedium" style={styles.jobCompany}>
                        {job.company}
                      </Text>
                      <View style={styles.jobLocation}>
                        <MaterialCommunityIcons name="map-marker" size={16} color="#B0BEC5" />
                        <Text variant="bodySmall" style={styles.jobLocationText}>
                          {job.location}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.jobLogo}>
                      <MaterialCommunityIcons name="domain" size={32} color="#1976D2" />
                    </View>
                  </View>
                  
                  <View style={styles.jobDetails}>
                    <View style={styles.jobTags}>
                      <Chip 
                        style={styles.jobTag}
                        textStyle={styles.jobTagText}
                      >
                        {job.type}
                      </Chip>
                      {job.isUrgent && (
                        <Chip 
                          style={[styles.jobTag, styles.urgentTag]}
                          textStyle={[styles.jobTagText, styles.urgentTagText]}
                        >
                          Urgent
                        </Chip>
                      )}
                    </View>
                    <Text variant="titleMedium" style={styles.jobSalary}>
                      ${job.salary}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
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
        </Animated.View>
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
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
  },
  profileButton: {
    borderColor: '#1976D2',
  },
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  progressCardsContainer: {
    paddingRight: 20,
  },
  progressCard: {
    width: 120,
    marginRight: 12,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  progressCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  progressNumber: {
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  progressLabel: {
    color: '#666666',
    textAlign: 'center',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickActionText: {
    marginTop: 8,
    color: '#1976D2',
    fontWeight: '600',
  },
  searchCard: {
    marginBottom: 24,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  searchContent: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPlaceholder: {
    marginLeft: 12,
    color: '#B0BEC5',
    fontSize: 16,
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
