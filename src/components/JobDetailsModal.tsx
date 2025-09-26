import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Modal, Text, Button, Card, Chip, IconButton, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Job } from '../types';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface JobDetailsModalProps {
  visible: boolean;
  onDismiss: () => void;
  job: Job | null;
  onApply: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  visible,
  onDismiss,
  job,
  onApply
}) => {
  const theme = useTheme();
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const isApplied = job ? state.appliedJobs.includes(job.id) : false;

  if (!job) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={[
        styles.modal,
        { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
      ]}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.companyInfo}>
              <Image 
                source={{ uri: job.companyLogo }} 
                style={styles.companyLogo}
                accessibilityLabel={`${job.company} logo`}
              />
              <View style={styles.jobInfo}>
                <Text 
                  variant="headlineSmall" 
                  style={[
                    styles.jobTitle,
                    { color: isDark ? Colors.white : '#1A1A1A' }
                  ]}
                >
                  {job.title}
                </Text>
                <Text 
                  variant="titleMedium" 
                  style={[
                    styles.companyName,
                    { color: isDark ? Colors.gray : '#666666' }
                  ]}
                >
                  {job.company}
                </Text>
                <Text 
                  variant="bodyLarge" 
                  style={[
                    styles.location,
                    { color: isDark ? Colors.gray : '#666666' }
                  ]}
                >
                  {job.location}
                </Text>
              </View>
            </View>
            
            <IconButton
              icon="close"
              iconColor={isDark ? Colors.white : '#666666'}
              size={24}
              onPress={onDismiss}
              style={styles.closeButton}
            />
          </View>

          {/* Job Meta Info */}
          <View style={styles.metaInfo}>
            <View style={styles.metaRow}>
              <Chip 
                style={[
                  styles.metaChip,
                  { backgroundColor: isDark ? Colors.lightGray : '#F3F4F6' }
                ]}
                textStyle={[
                  styles.metaChipText,
                  { color: isDark ? Colors.textPrimary : '#374151' }
                ]}
              >
                {job.type}
              </Chip>
              <Chip 
                style={[
                  styles.metaChip,
                  { backgroundColor: isDark ? Colors.lightGray : '#F3F4F6' }
                ]}
                textStyle={[
                  styles.metaChipText,
                  { color: isDark ? Colors.textPrimary : '#374151' }
                ]}
              >
                {job.experience}
              </Chip>
            </View>
            
            <Text 
              variant="titleLarge" 
              style={[
                styles.salary,
                { color: '#4CAF50' }
              ]}
            >
              {job.salary}
            </Text>

            {job.isUrgent && (
              <Chip 
                style={[styles.urgentChip, { backgroundColor: '#F44336' }]}
                textStyle={styles.urgentText}
                icon={() => <MaterialCommunityIcons name="alert-circle" size={12} color="white" />}
              >
                Urgent Hiring
              </Chip>
            )}
          </View>
        </View>

        {/* Job Description */}
        <Card style={[
          styles.sectionCard,
          { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
        ]}>
          <Card.Content style={styles.sectionContent}>
            <Text 
              variant="titleLarge" 
              style={[
                styles.sectionTitle,
                { color: isDark ? Colors.white : '#1A1A1A' }
              ]}
            >
              Job Description
            </Text>
            <Text 
              variant="bodyLarge" 
              style={[
                styles.description,
                { color: isDark ? Colors.gray : '#374151' }
              ]}
            >
              {job.description}
            </Text>
          </Card.Content>
        </Card>

        {/* Required Skills */}
        <Card style={[
          styles.sectionCard,
          { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
        ]}>
          <Card.Content style={styles.sectionContent}>
            <Text 
              variant="titleLarge" 
              style={[
                styles.sectionTitle,
                { color: isDark ? Colors.white : '#1A1A1A' }
              ]}
            >
              Required Skills
            </Text>
            <View style={styles.skillsContainer}>
              {job.tags.map((skill, index) => (
                <Chip 
                  key={index}
                  style={styles.skillChip}
                  textStyle={styles.skillChipText}
                >
                  {skill}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Benefits */}
        <Card style={[
          styles.sectionCard,
          { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
        ]}>
          <Card.Content style={styles.sectionContent}>
            <Text 
              variant="titleLarge" 
              style={[
                styles.sectionTitle,
                { color: isDark ? Colors.white : '#1A1A1A' }
              ]}
            >
              Perks & Benefits
            </Text>
            {job.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <MaterialCommunityIcons 
                  name="check-circle" 
                  size={16} 
                  color="#4CAF50" 
                />
                <Text 
                  variant="bodyLarge" 
                  style={[
                    styles.benefitText,
                    { color: isDark ? Colors.gray : '#374151' }
                  ]}
                >
                  {benefit}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Job Details */}
        <Card style={[
          styles.sectionCard,
          { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
        ]}>
          <Card.Content style={styles.sectionContent}>
            <Text 
              variant="titleLarge" 
              style={[
                styles.sectionTitle,
                { color: isDark ? Colors.white : '#1A1A1A' }
              ]}
            >
              Job Details
            </Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text 
                  variant="bodyMedium" 
                  style={[
                    styles.detailLabel,
                    { color: isDark ? Colors.gray : '#6B7280' }
                  ]}
                >
                  Posted Date
                </Text>
                <Text 
                  variant="bodyLarge" 
                  style={[
                    styles.detailValue,
                    { color: isDark ? Colors.white : '#1A1A1A' }
                  ]}
                >
                  {formatDate(job.postedDate)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text 
                  variant="bodyMedium" 
                  style={[
                    styles.detailLabel,
                    { color: isDark ? Colors.gray : '#6B7280' }
                  ]}
                >
                  Application Deadline
                </Text>
                <Text 
                  variant="bodyLarge" 
                  style={[
                    styles.detailValue,
                    { color: isDark ? Colors.white : '#1A1A1A' }
                  ]}
                >
                  {formatDate(job.deadline)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text 
                  variant="bodyMedium" 
                  style={[
                    styles.detailLabel,
                    { color: isDark ? Colors.gray : '#6B7280' }
                  ]}
                >
                  Work Arrangement
                </Text>
                <Text 
                  variant="bodyLarge" 
                  style={[
                    styles.detailValue,
                    { color: isDark ? Colors.white : '#1A1A1A' }
                  ]}
                >
                  {job.isRemote ? 'Remote' : 'On-site'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Apply Button */}
      <View style={[
        styles.applyContainer,
        { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
      ]}>
        <Button
          mode="contained"
          onPress={onApply}
          disabled={isApplied}
          style={styles.applyButton}
          buttonColor={isApplied ? '#4CAF50' : '#3b82f6'}
          textColor="white"
          icon={() => (
            <MaterialCommunityIcons 
              name={isApplied ? "check" : "file-send-outline"} 
              size={20} 
              color="white" 
            />
          )}
        >
          {isApplied ? 'Applied' : 'Apply Now'}
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 16,
    maxHeight: screenHeight * 0.9,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  companyInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 16,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 28,
  },
  companyName: {
    marginBottom: 4,
  },
  location: {
    // Additional styles if needed
  },
  closeButton: {
    margin: 0,
  },
  metaInfo: {
    // Additional styles if needed
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  metaChip: {
    // Additional styles if needed
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  salary: {
    fontWeight: '700',
    marginBottom: 16,
  },
  urgentChip: {
    alignSelf: 'flex-start',
  },
  urgentText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  sectionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  description: {
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#dbeafe',
    marginBottom: 8,
  },
  skillChipText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '500',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  detailsGrid: {
    // Additional styles if needed
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontWeight: '600',
  },
  applyContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});

export default JobDetailsModal;
