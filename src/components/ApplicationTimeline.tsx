import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, Chip, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolate,
  withSpring
} from 'react-native-reanimated';
import { Application, StatusHistory } from '../types';
import { Colors } from '../constants/colors';

interface ApplicationTimelineProps {
  application: Application;
  onStatusPress?: (status: string) => void;
  onTimelineItemPress?: (item: StatusHistory) => void;
}

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  application,
  onStatusPress,
  onTimelineItemPress
}) => {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Animation values
  const progressValue = useSharedValue(0);
  const timelineOpacity = useSharedValue(0);

  React.useEffect(() => {
    progressValue.value = withTiming(1, { duration: 1000 });
    timelineOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'applied':
        return '#2196F3';
      case 'shortlisted':
        return '#FF9800';
      case 'interview':
        return '#9C27B0';
      case 'rejected':
        return '#F44336';
      case 'accepted':
        return '#4CAF50';
      default:
        return '#666666';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'file-document-outline';
      case 'shortlisted':
        return 'account-check';
      case 'interview':
        return 'calendar-clock';
      case 'rejected':
        return 'close-circle';
      case 'accepted':
        return 'check-circle';
      default:
        return 'circle';
    }
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressPercentage = (): number => {
    const statusOrder = ['applied', 'shortlisted', 'interview', 'accepted'];
    const currentIndex = statusOrder.indexOf(application.status.toLowerCase());
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  // Animated styles
  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progressValue.value, [0, 1], [0, getProgressPercentage()])}%`,
  }));

  const animatedTimelineStyle = useAnimatedStyle(() => ({
    opacity: timelineOpacity.value,
    transform: [
      { translateY: interpolate(timelineOpacity.value, [0, 1], [20, 0]) }
    ],
  }));

  return (
    <Card style={styles.container}>
      <Card.Content style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text variant="titleMedium" style={styles.jobTitle}>
              {application.jobTitle}
            </Text>
            <Text variant="bodyMedium" style={styles.companyName}>
              {application.company}
            </Text>
          </View>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(application.status) }]}
            textStyle={styles.statusChipText}
            icon={() => (
              <MaterialCommunityIcons 
                name={getStatusIcon(application.status)} 
                size={16} 
                color="white" 
              />
            )}
          >
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Chip>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View 
              style={[
                styles.progressFill,
                { backgroundColor: getStatusColor(application.status) },
                animatedProgressStyle
              ]} 
            />
          </View>
          <Text variant="bodySmall" style={styles.progressText}>
            {Math.round(getProgressPercentage())}% Complete
          </Text>
        </View>

        {/* Timeline */}
        <Animated.View style={[styles.timeline, animatedTimelineStyle]}>
          <Text variant="titleSmall" style={styles.timelineTitle}>
            Application Timeline
          </Text>
          
          {application.statusHistory.map((item, index) => {
            const isExpanded = expandedItems.has(item.date);
            const isLast = index === application.statusHistory.length - 1;
            
            return (
              <View key={`${item.date}-${index}`} style={styles.timelineItem}>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <View style={styles.timelineIconContainer}>
                      <MaterialCommunityIcons 
                        name={getStatusIcon(item.status)} 
                        size={20} 
                        color={getStatusColor(item.status)} 
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.timelineItemContent}
                      onPress={() => onTimelineItemPress?.(item)}
                    >
                      <View style={styles.timelineItemHeader}>
                        <Text variant="bodyMedium" style={styles.timelineStatus}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Text>
                        <Text variant="bodySmall" style={styles.timelineDate}>
                          {formatDate(item.date)}
                        </Text>
                      </View>
                      
                      {item.description && (
                        <Text variant="bodySmall" style={styles.timelineDescription}>
                          {item.description}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  
                  {isExpanded && item.note && (
                    <View style={styles.timelineNote}>
                      <Text variant="bodySmall" style={styles.noteText}>
                        {item.note}
                      </Text>
                    </View>
                  )}
                </View>
                
                {!isLast && (
                  <View style={[styles.timelineLine, { backgroundColor: getStatusColor(item.status) }]} />
                )}
              </View>
            );
          })}
        </Animated.View>

        {/* Next Step */}
        {application.nextStep && (
          <View style={styles.nextStepContainer}>
            <MaterialCommunityIcons name="arrow-right" size={16} color="#3b82f6" />
            <Text variant="bodyMedium" style={styles.nextStepText}>
              Next: {application.nextStep}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  companyName: {
    color: '#666666',
  },
  statusChip: {
    borderRadius: 16,
  },
  statusChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: '#666666',
    textAlign: 'center',
  },
  timeline: {
    marginBottom: 16,
  },
  timelineTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  timelineItem: {
    marginBottom: 8,
  },
  timelineContent: {
    flexDirection: 'row',
  },
  timelineIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineItemContent: {
    flex: 1,
  },
  timelineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineStatus: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  timelineDate: {
    color: '#666666',
  },
  timelineDescription: {
    color: '#666666',
    lineHeight: 18,
  },
  timelineNote: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginLeft: 44,
  },
  noteText: {
    color: '#666666',
    fontStyle: 'italic',
  },
  timelineLine: {
    width: 2,
    height: 20,
    marginLeft: 15,
    marginTop: 4,
  },
  nextStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  nextStepText: {
    marginLeft: 8,
    color: '#1976D2',
    fontWeight: '500',
  },
});

export default ApplicationTimeline;
