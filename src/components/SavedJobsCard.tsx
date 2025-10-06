import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Card, Text, Chip, IconButton, useTheme, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Job } from '../types';
import { useApp } from '../context/AppContext';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

const { width: screenWidth } = Dimensions.get('window');

interface SavedJobsCardProps {
  job: Job;
  onPress?: () => void;
  onApply?: () => void;
  onRemove?: () => void;
}

const SavedJobsCard: React.FC<SavedJobsCardProps> = ({ 
  job, 
  onPress,
  onApply,
  onRemove
}) => {
  const theme = useTheme();
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const isApplied = state.appliedJobs.includes(job.id);
  
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  // Animation values
  const scaleValue = useSharedValue(1);

  const handlePress = () => {
    scaleValue.value = withSpring(0.98, {}, () => {
      scaleValue.value = withSpring(1);
    });
    onPress?.();
  };

  const handleApply = () => {
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2000);
    onApply?.();
  };

  const handleRemove = () => {
    onRemove?.();
  };

  // Animated styles
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Animated.View style={animatedCardStyle}>
      <Card style={[
        styles.card,
        { 
          backgroundColor: isDark ? DarkColors.surface : '#FFFFFF',
          borderLeftWidth: job.isUrgent ? 4 : 0,
          borderLeftColor: job.isUrgent ? '#F44336' : 'transparent'
        }
      ]}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
          <Card.Content style={styles.content}>
            {/* Header with Job Info and Logo */}
            <View style={styles.header}>
              <View style={styles.companyInfo}>
                <Text 
                  variant="titleMedium" 
                  style={[
                    styles.jobTitle,
                    { color: isDark ? DarkColors.text : '#1A1A1A' }
                  ]}
                  numberOfLines={2}
                >
                  {job.title}
                </Text>
                <Text 
                  variant="bodyMedium" 
                  style={[
                    styles.companyName,
                    { color: isDark ? DarkColors.textSecondary : '#666666' }
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

            {/* Job Type and Status Chips */}
            <View style={styles.jobTypeContainer}>
              <Chip 
                style={[styles.jobTypeChip, { backgroundColor: getJobTypeColor(job.type) + '20' }]}
                textStyle={[styles.jobTypeText, { color: getJobTypeColor(job.type) }]}
                icon={() => (
                  <MaterialCommunityIcons 
                    name="briefcase" 
                    size={14} 
                    color={getJobTypeColor(job.type)} 
                  />
                )}
              >
                {job.type}
              </Chip>
              
              {job.isRemote && (
                <Chip 
                  style={[styles.remoteChip, { backgroundColor: '#2196F320' }]}
                  textStyle={[styles.remoteText, { color: '#2196F3' }]}
                  icon={() => (
                    <MaterialCommunityIcons 
                      name="home" 
                      size={14} 
                      color="#2196F3" 
                    />
                  )}
                >
                  Remote
                </Chip>
              )}
              
              <Chip 
                style={[styles.savedChip, { backgroundColor: '#4CAF5020' }]}
                textStyle={[styles.savedText, { color: '#4CAF50' }]}
                icon={() => (
                  <MaterialCommunityIcons 
                    name="bookmark" 
                    size={14} 
                    color="#4CAF50" 
                  />
                )}
              >
                Saved
              </Chip>
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

            {/* Skills Tags */}
            <View style={styles.skillsContainer}>
              {job.tags.slice(0, 3).map((tag, index) => (
                <Chip 
                  key={index}
                  style={styles.skillChip}
                  textStyle={styles.skillChipText}
                >
                  {tag}
                </Chip>
              ))}
              {job.tags.length > 3 && (
                <Chip 
                  style={styles.moreChip}
                  textStyle={styles.moreChipText}
                >
                  +{job.tags.length - 3}
                </Chip>
              )}
            </View>

            {/* Action Buttons */}
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
              
              <IconButton
                icon="bookmark-off"
                size={20}
                iconColor="#F44336"
                onPress={handleRemove}
                style={styles.removeButton}
              />
            </View>

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
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    minHeight: 140,
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
  jobTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  companyName: {
    color: '#666666',
    marginBottom: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
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
  jobTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  jobTypeChip: {
    height: 28,
    borderRadius: 14,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  remoteChip: {
    height: 28,
    borderRadius: 14,
  },
  remoteText: {
    fontSize: 12,
    fontWeight: '600',
  },
  savedChip: {
    height: 28,
    borderRadius: 14,
  },
  savedText: {
    fontSize: 12,
    fontWeight: '600',
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
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  skillChip: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  skillChipText: {
    color: '#3b82f6',
    fontSize: 11,
    fontWeight: '600',
  },
  moreChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  moreChipText: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applyButton: {
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    margin: 0,
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
    marginTop: 8,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default SavedJobsCard;
