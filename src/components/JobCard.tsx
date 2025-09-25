import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Text, Chip, IconButton, useTheme, Button } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Job } from '../types';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

interface JobCardProps {
  job: Job;
  onPress?: () => void;
  onSave?: () => void;
  onApply?: () => void;
  showSaveButton?: boolean;
  showApplyButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onPress, 
  onSave, 
  onApply,
  showSaveButton = true,
  showApplyButton = true 
}) => {
  const theme = useTheme();
  const { state, saveJob, unsaveJob } = useApp();
  const isDark = state.theme === 'dark';
  const isSaved = state.savedJobs.includes(job.id);
  const isApplied = state.appliedJobs.includes(job.id);
  
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const scale = useSharedValue(1);
  const saveScale = useSharedValue(1);
  const applyScale = useSharedValue(1);
  const successOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const saveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const applyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: applyScale.value }],
  }));

  const successAnimatedStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
    transform: [{ scale: successOpacity.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    onPress?.();
  };

  const handleSave = () => {
    saveScale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    
    if (isSaved) {
      unsaveJob(job.id);
    } else {
      saveJob(job.id);
    }
    
    onSave?.();
  };

  const showSuccess = () => {
    setShowSuccessAnimation(true);
    successOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(1500, withTiming(0, { duration: 300 }))
    );
    
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2000);
  };

  const handleApply = () => {
    applyScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1.1, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    
    runOnJS(showSuccess)();
    onApply?.();
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
    <Animated.View style={animatedStyle}>
      <Card style={[
        styles.card,
        { 
          backgroundColor: isDark ? Colors.darkGray : Colors.white,
          borderLeftWidth: job.isUrgent ? 4 : 0,
          borderLeftColor: job.isUrgent ? '#F44336' : 'transparent'
        }
      ]}>
        <Card.Content style={styles.content}>
          <TouchableOpacity onPress={handlePress} style={styles.touchable}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.jobInfo}>
                <Text 
                  variant="titleMedium" 
                  style={[
                    styles.jobTitle,
                    { color: isDark ? Colors.white : Colors.textPrimary }
                  ]}
                >
                  {job.title}
                </Text>
                <Text 
                  variant="bodyMedium" 
                  style={[
                    styles.companyName,
                    { color: isDark ? Colors.gray : Colors.textSecondary }
                  ]}
                >
                  {job.company}
                </Text>
              </View>
              
              <View style={styles.headerRight}>
                {job.isUrgent && (
                  <Chip 
                    style={styles.urgentChip}
                    textStyle={styles.urgentChipText}
                    icon={() => <MaterialCommunityIcons name="alert-circle" size={12} color="white" />}
                  >
                    Urgent
                  </Chip>
                )}
                
                {showSaveButton && (
                  <Animated.View style={saveAnimatedStyle}>
                    <IconButton
                      icon={() => (
                        <MaterialCommunityIcons 
                          name={isSaved ? "bookmark" : "bookmark-outline"} 
                          size={24} 
                          color={isSaved ? "#1976D2" : "#B0BEC5"} 
                        />
                      )}
                      onPress={handleSave}
                      style={styles.saveButton}
                    />
                  </Animated.View>
                )}
              </View>
            </View>

            {/* Job Details */}
            <View style={styles.details}>
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
                >
                  {job.salary}
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
                  {formatDate(job.postedDate)}
                </Text>
              </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              <Chip 
                style={[styles.typeChip, { backgroundColor: getJobTypeColor(job.type) + '20' }]}
                textStyle={[styles.typeChipText, { color: getJobTypeColor(job.type) }]}
              >
                {job.type}
              </Chip>
              
              {job.isRemote && (
                <Chip 
                  style={styles.remoteChip}
                  textStyle={styles.remoteChipText}
                  icon={() => <MaterialCommunityIcons name="home" size={12} color="#9C27B0" />}
                >
                  Remote
                </Chip>
              )}
              
              {job.tags.slice(0, 2).map((tag, index) => (
                <Chip 
                  key={index}
                  style={styles.tagChip}
                  textStyle={styles.tagChipText}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {showApplyButton && (
              <Animated.View style={applyAnimatedStyle}>
                <Button
                  mode={isApplied ? "outlined" : "contained"}
                  onPress={handleApply}
                  style={[
                    styles.applyButton,
                    isApplied && styles.appliedButton
                  ]}
                  buttonColor={isApplied ? undefined : "#1976D2"}
                  textColor={isApplied ? "#1976D2" : "white"}
                  icon={() => (
                    <MaterialCommunityIcons 
                      name={isApplied ? "check" : "file-send-outline"} 
                      size={16} 
                      color={isApplied ? "#1976D2" : "white"} 
                    />
                  )}
                >
                  {isApplied ? "Applied" : "Apply Now"}
                </Button>
              </Animated.View>
            )}
          </View>

          {/* Success Animation Overlay */}
          {showSuccessAnimation && (
            <Animated.View style={[styles.successOverlay, successAnimatedStyle]}>
              <View style={styles.successContent}>
                <MaterialCommunityIcons name="check-circle" size={48} color="#4CAF50" />
                <Text variant="titleMedium" style={styles.successText}>
                  Application Sent!
                </Text>
              </View>
            </Animated.View>
          )}
        </Card.Content>
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
  },
  content: {
    padding: 0,
  },
  touchable: {
    padding: 16,
  },
  header: {
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
  details: {
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
  tagsContainer: {
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
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  applyButton: {
    borderRadius: 8,
  },
  appliedButton: {
    borderColor: '#1976D2',
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