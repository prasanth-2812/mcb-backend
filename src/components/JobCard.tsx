import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { Card, Text, Chip, IconButton, useTheme, Button, ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Job } from '../types';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

const { width: screenWidth } = Dimensions.get('window');

interface JobCardProps {
  job: Job;
  onApply?: () => void;
  onPress?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  showSaveButton?: boolean;
  matchPercentage?: number;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply,
  onPress,
  onSave,
  onShare,
  showSaveButton = true,
  matchPercentage = Math.floor(Math.random() * 40) + 60 // Random match between 60-100%
}) => {
  const theme = useTheme();
  const { state, saveJob, unsaveJob } = useApp();
  const isDark = state.theme === 'dark';
  const isSaved = state.savedJobs.includes(job.id);
  const isApplied = state.appliedJobs.includes(job.id);
  
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Animation values
  const scaleValue = useSharedValue(1);
  const quickActionsOpacity = useSharedValue(0);

  const handlePress = () => {
    scaleValue.value = withSpring(0.98, {}, () => {
      scaleValue.value = withSpring(1);
    });
    onPress?.();
  };

  const handleSave = () => {
    if (isSaved) {
      unsaveJob(job.id);
    } else {
      saveJob(job.id);
    }
    
    onSave?.();
  };

  const handleShare = () => {
    Alert.alert('Share Job', `Share ${job.title} at ${job.company}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: () => onShare?.() }
    ]);
  };

  const showSuccess = () => {
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2000);
  };

  const handleApply = () => {
    showSuccess();
    onApply?.();
  };

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
    quickActionsOpacity.value = withTiming(showQuickActions ? 0 : 1, { duration: 200 });
  };

  // Animated styles
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const animatedQuickActionsStyle = useAnimatedStyle(() => ({
    opacity: quickActionsOpacity.value,
    transform: [
      { translateY: interpolate(quickActionsOpacity.value, [0, 1], [10, 0]) }
    ],
  }));

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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

  return (
    <Animated.View style={animatedCardStyle}>
      <Card style={[
        styles.card,
        { 
          backgroundColor: isDark ? Colors.darkGray : '#FFFFFF',
          borderLeftWidth: job.isUrgent ? 4 : 0,
          borderLeftColor: job.isUrgent ? '#F44336' : 'transparent'
        }
      ]}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
          <Card.Content style={styles.content}>
          {/* Header with Job Info and Logo */}
          <View style={styles.header}>
            <View style={styles.companyInfo}>
              <View style={styles.titleRow}>
                <Text 
                  variant="titleMedium" 
                  style={[
                    styles.jobTitle,
                    { color: isDark ? Colors.white : '#1A1A1A' }
                  ]}
                  numberOfLines={2}
                >
                  {job.title}
                </Text>
                {/* Match Percentage */}
                <View style={styles.matchContainer}>
                  <Text variant="bodySmall" style={styles.matchText}>
                    {matchPercentage}% match
                  </Text>
                  <ProgressBar 
                    progress={matchPercentage / 100} 
                    color="#4CAF50"
                    style={styles.matchBar}
                  />
                </View>
              </View>
              <Text 
                variant="bodyMedium" 
                style={[
                  styles.companyName,
                  { color: isDark ? Colors.gray : '#666666' }
                ]}
                numberOfLines={1}
              >
                {job.company}
              </Text>
            </View>
            
            <View style={styles.headerRight}>
              <View style={styles.logoContainer}>
                <Image 
                  source={{ uri: job.companyLogo }} 
                  style={styles.companyLogo}
                  accessibilityLabel={`${job.company} logo`}
                />
                {!job.companyLogo && (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoText}>
                      {job.company.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              {job.isUrgent && (
                <Chip 
                  style={styles.urgentChip}
                  textStyle={styles.urgentChipText}
                  icon={() => <MaterialCommunityIcons name="alert-circle" size={12} color="white" />}
                >
                  Urgent
                </Chip>
              )}
            </View>
          </View>

          {/* Job Details - Location and Salary */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={16} 
                color="#B0BEC5" 
              />
              <Text 
                variant="bodySmall" 
                style={[
                  styles.detailText,
                  { color: '#B0BEC5' }
                ]}
                numberOfLines={1}
              >
                {job.location}
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
                numberOfLines={1}
              >
                {job.salary}
              </Text>
            </View>
          </View>

          {/* Skills Tags and Action Buttons */}
          <View style={styles.bottomSection}>
            <View style={styles.skillsContainer}>
              {job.tags.slice(0, 2).map((tag, index) => (
                <Chip 
                  key={index}
                  style={styles.skillChip}
                  textStyle={styles.skillChipText}
                >
                  {tag}
                </Chip>
              ))}
              {job.tags.length > 2 && (
                <Chip 
                  style={styles.moreChip}
                  textStyle={styles.moreChipText}
                >
                  +{job.tags.length - 2}
                </Chip>
              )}
            </View>

            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={handleApply}
                style={styles.applyButton}
                buttonColor="#3b82f6"
                textColor="white"
                compact
              >
                {isApplied ? "Applied" : "Apply"}
              </Button>
              
              <TouchableOpacity onPress={toggleQuickActions} style={styles.moreButton}>
                <MaterialCommunityIcons 
                  name="dots-vertical" 
                  size={20} 
                  color="#666666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          {showQuickActions && (
            <Animated.View style={[styles.quickActions, animatedQuickActionsStyle]}>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={handleSave}
              >
                <MaterialCommunityIcons 
                  name={isSaved ? "bookmark" : "bookmark-outline"} 
                  size={20} 
                  color="#3b82f6" 
                />
                <Text style={styles.quickActionText}>
                  {isSaved ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={handleShare}
              >
                <MaterialCommunityIcons 
                  name="share-variant" 
                  size={20} 
                  color="#3b82f6" 
                />
                <Text style={styles.quickActionText}>Share</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Success Animation Overlay */}
          {showSuccessAnimation && (
            <View style={styles.successOverlay}>
              <View style={styles.successContent}>
                <MaterialCommunityIcons name="check-circle" size={48} color="#4CAF50" />
                <Text variant="titleMedium" style={styles.successText}>
                  Application Sent!
                </Text>
              </View>
            </View>
          )}
          </Card.Content>
        </TouchableOpacity>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  matchContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  matchText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 2,
  },
  matchBar: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },
  logoContainer: {
    position: 'relative',
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 8,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  companyName: {
    color: '#666666',
    marginBottom: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  urgentChip: {
    backgroundColor: '#F44336',
    marginBottom: 8,
    height: 24,
  },
  urgentChipText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  saveButton: {
    margin: 0,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 4,
    flex: 1,
  },
  salaryText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quickActionText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: 6,
  },
  skillChip: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skillChipText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '500',
  },
  moreChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  moreChipText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '500',
  },
  applyButton: {
    borderRadius: 8,
    marginLeft: 12,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  successContent: {
    alignItems: 'center',
  },
  successText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 8,
  },
});

export default JobCard;