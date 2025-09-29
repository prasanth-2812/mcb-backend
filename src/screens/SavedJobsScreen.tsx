import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, useTheme, Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import JobCard from '../components/JobCard';
import { Job } from '../types';
import jobsData from '../data/jobs.json';

const SavedJobsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, dispatch, unsaveJob } = useApp();
  const isDark = state.theme === 'dark';
  
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    // Load jobs if not already loaded
    if (state.jobs.length === 0) {
      dispatch({ type: 'SET_JOBS', payload: jobsData });
    }

    // Animate content entrance
    contentOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  useEffect(() => {
    // Filter saved jobs
    const saved = state.jobs.filter(job => state.savedJobs.includes(job.id));
    setSavedJobs(saved);
  }, [state.jobs, state.savedJobs]);

  useEffect(() => {
    // Apply search filter
    if (searchQuery.trim()) {
      const filtered = savedJobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(savedJobs);
    }
  }, [savedJobs, searchQuery]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const handleRemoveSaved = (jobId: string) => {
    unsaveJob(jobId);
  };

  const handleClearAll = () => {
    state.savedJobs.forEach(jobId => {
      unsaveJob(jobId);
    });
  };

  const handleJobPress = (job: Job) => {
    (navigation as any).navigate('JobDetails', { jobId: job.id });
  };

  const handleJobApply = (job: Job) => {
    // Handle job application
    console.log('Applying to job:', job.id);
  };

  const handleJobSave = (job: Job) => {
    if (state.savedJobs.includes(job.id)) {
      unsaveJob(job.id);
    } else {
      dispatch({ type: 'SAVE_JOB', payload: job.id });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <Animated.View style={contentAnimatedStyle}>
      <TouchableOpacity onPress={() => handleJobPress(item)}>
        <Card style={[
          styles.jobCard,
          { backgroundColor: isDark ? Colors.darkGray : Colors.white }
        ]}>
          <Card.Content style={styles.jobContent}>
          <View style={styles.jobHeader}>
            <View style={styles.jobInfo}>
              <Text 
                variant="titleMedium" 
                style={[
                  styles.jobTitle,
                  { color: isDark ? Colors.white : Colors.textPrimary }
                ]}
              >
                {item.title}
              </Text>
              <Text 
                variant="bodyMedium" 
                style={[
                  styles.companyName,
                  { color: isDark ? Colors.gray : Colors.textSecondary }
                ]}
              >
                {item.company}
              </Text>
            </View>
            
            <View style={styles.jobActions}>
              <Chip 
                style={styles.savedChip}
                textStyle={styles.savedChipText}
                icon={() => <MaterialCommunityIcons name="bookmark" size={12} color="#1976D2" />}
              >
                Saved
              </Chip>
              <IconButton
                icon={() => <MaterialCommunityIcons name="bookmark-remove" size={20} color="#F44336" />}
                onPress={() => handleRemoveSaved(item.id)}
                style={styles.removeButton}
              />
            </View>
          </View>

          <View style={styles.jobDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={16} 
                color={isDark ? Colors.gray : Colors.textSecondary} 
              />
              <Text 
                variant="bodySmall" 
                style={[
                  styles.detailText,
                  { color: isDark ? Colors.gray : Colors.textSecondary }
                ]}
              >
                {item.location}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="currency-usd" 
                size={16} 
                color="#4CAF50" 
              />
              <Text 
                variant="bodySmall" 
                style={[styles.detailText, styles.salaryText]}
              >
                {item.salary}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="clock-outline" 
                size={16} 
                color={isDark ? Colors.gray : Colors.textSecondary} 
              />
              <Text 
                variant="bodySmall" 
                style={[
                  styles.detailText,
                  { color: isDark ? Colors.gray : Colors.textSecondary }
                ]}
              >
                Posted {formatDate(item.postedDate)}
              </Text>
            </View>
          </View>

          <View style={styles.jobTags}>
            <Chip 
              style={[styles.typeChip, { backgroundColor: getJobTypeColor(item.type) + '20' }]}
              textStyle={[styles.typeChipText, { color: getJobTypeColor(item.type) }]}
            >
              {item.type}
            </Chip>
            
            {item.isRemote && (
              <Chip 
                style={styles.remoteChip}
                textStyle={styles.remoteChipText}
                icon={() => <MaterialCommunityIcons name="home" size={12} color="#9C27B0" />}
              >
                Remote
              </Chip>
            )}
            
            {item.isUrgent && (
              <Chip 
                style={styles.urgentChip}
                textStyle={styles.urgentChipText}
                icon={() => <MaterialCommunityIcons name="alert-circle" size={12} color="white" />}
              >
                Urgent
              </Chip>
            )}
          </View>

          <View style={styles.jobActions}>
            <Button
              mode="outlined"
              onPress={() => handleJobPress(item)}
              style={styles.viewButton}
              textColor="#1976D2"
            >
              View Details
            </Button>
            <Button
              mode="contained"
              onPress={() => handleJobApply(item)}
              style={styles.applyButton}
              buttonColor="#1976D2"
            >
              Apply Now
            </Button>
          </View>
        </Card.Content>
      </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  const getJobTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return '#4CAF50';
      case 'part-time':
        return '#FF9800';
      case 'contract':
        return '#9C27B0';
      case 'remote':
        return '#2196F3';
      default:
        return '#1976D2';
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="bookmark-outline" size={64} color="#B0BEC5" />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No saved jobs yet
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        Save jobs you're interested in to view them here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? Colors.background : Colors.background }
    ]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? Colors.background : Colors.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text 
            variant="headlineMedium" 
            style={[
              styles.title,
              { color: isDark ? Colors.white : Colors.textPrimary }
            ]}
          >
            Saved Jobs
          </Text>
          {savedJobs.length > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text variant="bodyMedium" style={styles.clearAllText}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text 
          variant="bodyMedium" 
          style={[
            styles.subtitle,
            { color: isDark ? Colors.gray : Colors.textSecondary }
          ]}
        >
          {filteredJobs.length} saved jobs
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Card style={styles.searchCard}>
          <Card.Content style={styles.searchContent}>
            <View style={styles.searchInput}>
              <MaterialCommunityIcons name="magnify" size={20} color="#B0BEC5" />
              <Text style={styles.searchPlaceholder}>
                Search saved jobs...
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: '600',
  },
  clearAllText: {
    color: '#F44336',
    fontWeight: '500',
  },
  subtitle: {
    opacity: 0.7,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchContent: {
    padding: 0,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchPlaceholder: {
    marginLeft: 12,
    color: '#B0BEC5',
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  separator: {
    height: 12,
  },
  jobCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobContent: {
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
    marginRight: 12,
  },
  jobTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  companyName: {
    opacity: 0.8,
  },
  jobActions: {
    alignItems: 'flex-end',
  },
  savedChip: {
    backgroundColor: '#E3F2FD',
    marginBottom: 8,
    height: 24,
  },
  savedChipText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: '600',
  },
  removeButton: {
    margin: 0,
  },
  jobDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    flex: 1,
  },
  salaryText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  jobTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeChip: {
    marginRight: 6,
    marginBottom: 4,
    height: 24,
  },
  typeChipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  remoteChip: {
    backgroundColor: '#E1BEE7',
    marginRight: 6,
    marginBottom: 4,
    height: 24,
  },
  remoteChipText: {
    fontSize: 10,
    color: '#9C27B0',
    fontWeight: '600',
  },
  urgentChip: {
    backgroundColor: '#F44336',
    marginRight: 6,
    marginBottom: 4,
    height: 24,
  },
  urgentChipText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#1976D2',
  },
  applyButton: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
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
  },
});

export default SavedJobsScreen;
