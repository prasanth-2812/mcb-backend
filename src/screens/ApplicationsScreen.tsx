import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, useTheme, SegmentedButtons, Divider, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { Application, ApplicationStatus } from '../types';
// Removed dummy data import - using API data only

const ApplicationsScreen: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    // Applications are loaded from API in AppContext
    // Animate content entrance
    contentOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  useEffect(() => {
    // Filter applications based on selected status
    if (selectedStatus === 'All') {
      setFilteredApplications(state.applications);
    } else {
      setFilteredApplications(
        state.applications.filter(app => app.status === selectedStatus)
      );
    }
  }, [state.applications, selectedStatus]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const getStatusIcon = (status: ApplicationStatus): string => {
    switch (status) {
      case 'applied':
        return 'progress-clock';
      case 'shortlisted':
        return 'check-circle-outline';
      case 'interview':
        return 'calendar-clock-outline';
      case 'rejected':
        return 'close-circle-outline';
      case 'accepted':
        return 'check-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const getStatusColor = (status: ApplicationStatus): string => {
    switch (status) {
      case 'applied':
        return '#1976D2';
      case 'shortlisted':
        return '#FF9800';
      case 'interview':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'accepted':
        return '#4CAF50';
      default:
        return '#B0BEC5';
    }
  };

  const getStatusText = (status: ApplicationStatus): string => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'shortlisted':
        return 'Shortlisted';
      case 'interview':
        return 'Interview';
      case 'rejected':
        return 'Rejected';
      case 'accepted':
        return 'Accepted';
      default:
        return 'Unknown';
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

  const toggleExpanded = (applicationId: string) => {
    setExpandedApplication(expandedApplication === applicationId ? null : applicationId);
  };

  const renderTimeline = (statusHistory: any[]) => {
    return (
      <View style={styles.timelineContainer}>
        <Text variant="titleSmall" style={styles.timelineTitle}>Application Timeline</Text>
        {statusHistory.map((entry, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: getStatusColor(entry.status) }]}>
              <MaterialCommunityIcons 
                name={getStatusIcon(entry.status)} 
                size={12} 
                color="white" 
              />
            </View>
            <View style={styles.timelineContent}>
              <Text variant="bodyMedium" style={styles.timelineStatus}>
                {getStatusText(entry.status)}
              </Text>
              <Text variant="bodySmall" style={styles.timelineDate}>
                {formatDate(entry.date)}
              </Text>
              <Text variant="bodySmall" style={styles.timelineNote}>
                {entry.note}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderApplicationItem = ({ item }: { item: Application }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);
    const statusText = getStatusText(item.status);
    const isExpanded = expandedApplication === item.id;

    return (
      <Animated.View style={contentAnimatedStyle}>
        <Card style={[
          styles.applicationCard,
          { backgroundColor: isDark ? Colors.darkGray : Colors.white }
        ]}>
          <Card.Content style={styles.applicationContent}>
            <TouchableOpacity onPress={() => toggleExpanded(item.id)}>
              <View style={styles.applicationHeader}>
                <View style={styles.jobInfo}>
                  <Text 
                    variant="titleMedium" 
                    style={[
                      styles.jobTitle,
                      { color: isDark ? Colors.white : Colors.textPrimary }
                    ]}
                  >
                    {item.jobTitle}
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
                <View style={styles.headerRight}>
                  <Chip
                    icon={() => (
                      <MaterialCommunityIcons 
                        name={statusIcon} 
                        size={16} 
                        color="white" 
                      />
                    )}
                    style={[styles.statusChip, { backgroundColor: statusColor }]}
                    textStyle={styles.statusChipText}
                  >
                    {statusText}
                  </Chip>
                  <MaterialCommunityIcons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={isDark ? Colors.gray : Colors.textSecondary} 
                  />
                </View>
              </View>

              <View style={styles.applicationDetails}>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons 
                    name="calendar-outline" 
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
                    Applied on {formatDate(item.appliedDate)}
                  </Text>
                </View>

                {item.interviewDate && (
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
                      Interview: {formatDate(item.interviewDate)}
                    </Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons 
                    name="map-marker-outline" 
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
                    color={isDark ? Colors.gray : Colors.textSecondary} 
                  />
                  <Text 
                    variant="bodySmall" 
                    style={[
                      styles.detailText,
                      { color: isDark ? Colors.gray : Colors.textSecondary }
                    ]}
                  >
                    {item.salary}
                  </Text>
                </View>
              </View>

              {item.nextStep && (
                <View style={styles.nextStepContainer}>
                  <Text 
                    variant="bodySmall" 
                    style={[
                      styles.nextStepLabel,
                      { color: isDark ? Colors.gray : Colors.textSecondary }
                    ]}
                  >
                    Next Step:
                  </Text>
                  <Text 
                    variant="bodyMedium" 
                    style={[
                      styles.nextStepText,
                      { color: isDark ? Colors.white : Colors.textPrimary }
                    ]}
                  >
                    {item.nextStep}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <Divider style={styles.divider} />
                {renderTimeline(item.statusHistory)}
                
                {item.notes && (
                  <View style={styles.notesContainer}>
                    <Text variant="titleSmall" style={styles.notesTitle}>Notes</Text>
                    <Text 
                      variant="bodySmall" 
                      style={[
                        styles.notesText,
                        { color: isDark ? Colors.gray : Colors.textSecondary }
                      ]}
                    >
                      {item.notes}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };

  const statusButtons = [
    { value: 'All', label: 'All' },
    { value: 'applied', label: 'Applied' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview', label: 'Interview' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? Colors.background : Colors.background }
    ]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? Colors.background : Colors.background}
      />
      
      <View style={styles.header}>
        <Text 
          variant="headlineMedium" 
          style={[
            styles.title,
            { color: isDark ? Colors.white : Colors.textPrimary }
          ]}
        >
          My Applications
        </Text>
        <Text 
          variant="bodyMedium" 
          style={[
            styles.subtitle,
            { color: isDark ? Colors.gray : Colors.textSecondary }
          ]}
        >
          {filteredApplications.length} applications
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          buttons={statusButtons}
          style={styles.segmentedButtons}
        />
      </View>

      <FlatList
        data={filteredApplications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  separator: {
    height: 12,
  },
  applicationCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  applicationContent: {
    padding: 0,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
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
    opacity: 0.7,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 8,
  },
  statusChipText: {
    color: 'white',
    fontWeight: '500',
  },
  applicationDetails: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    flex: 1,
  },
  nextStepContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  nextStepLabel: {
    fontWeight: '500',
    marginBottom: 4,
  },
  nextStepText: {
    fontWeight: '600',
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#E0E0E0',
  },
  timelineContainer: {
    marginBottom: 16,
  },
  timelineTitle: {
    fontWeight: '600',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontWeight: '600',
    marginBottom: 2,
    color: '#1A1A1A',
  },
  timelineDate: {
    color: '#666666',
    marginBottom: 4,
  },
  timelineNote: {
    color: '#666666',
    fontStyle: 'italic',
  },
  notesContainer: {
    marginTop: 8,
  },
  notesTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  notesText: {
    lineHeight: 20,
  },
});

export default ApplicationsScreen;