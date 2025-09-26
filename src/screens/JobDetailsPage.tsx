import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, StatusBar, Dimensions } from 'react-native';
import { Text, Button, Card, Chip, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Job } from '../types';

const { width: screenWidth } = Dimensions.get('window');

interface JobDetailsPageProps {
  navigation: any;
  route: {
    params: {
      jobId: string;
    };
  };
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    // Find the job by ID
    const foundJob = state.jobs.find(j => j.id === route.params.jobId);
    if (foundJob) {
      setJob(foundJob);
    }
  }, [route.params.jobId, state.jobs]);

  const handleApply = () => {
    if (job) {
      navigation.navigate('ApplicationPage', { jobId: job.id });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!job) {
    return (
      <SafeAreaView style={[
        styles.container,
        { backgroundColor: isDark ? Colors.background : '#f9fafb' }
      ]}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? Colors.background : '#f9fafb'}
        />
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall">Job not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isApplied = state.appliedJobs.includes(job.id);

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? Colors.background : '#f9fafb' }
    ]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? Colors.background : '#f9fafb'}
      />
      
      {/* Header */}
      <View style={[
        styles.header,
        { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
      ]}>
        <IconButton
          icon="arrow-left"
          iconColor={isDark ? Colors.white : '#1A1A1A'}
          size={24}
          onPress={handleBack}
          style={styles.backButton}
        />
        <Text 
          variant="titleLarge" 
          style={[
            styles.headerTitle,
            { color: isDark ? Colors.white : '#1A1A1A' }
          ]}
        >
          Job Details
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Job Header Card */}
          <Card style={[
            styles.headerCard,
            { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
          ]}>
            <Card.Content style={styles.headerCardContent}>
              <View style={styles.jobHeader}>
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
            </Card.Content>
          </Card>

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

          {/* Key Skills */}
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
                Key Skills
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

          {/* Perks & Benefits */}
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
                    size={20} 
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

          {/* Requirements */}
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
                Requirements
              </Text>
              {job.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <MaterialCommunityIcons 
                    name="circle" 
                    size={8} 
                    color={isDark ? Colors.primary : '#3b82f6'} 
                    style={styles.requirementBullet}
                  />
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.requirementText,
                      { color: isDark ? Colors.gray : '#374151' }
                    ]}
                  >
                    {requirement}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* About Company */}
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
                About Company
              </Text>
              <Text 
                variant="bodyLarge" 
                style={[
                  styles.description,
                  { color: isDark ? Colors.gray : '#374151' }
                ]}
              >
                {job.company} is a leading company in the industry, committed to innovation and excellence. 
                We offer a dynamic work environment where talented individuals can grow and make a meaningful impact.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Fixed Apply Button */}
      <View style={[
        styles.applyContainer,
        { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
      ]}>
        <Button
          mode="contained"
          onPress={handleApply}
          disabled={isApplied}
          style={styles.applyButton}
          buttonColor={isApplied ? '#4CAF50' : '#3b82f6'}
          textColor="white"
          icon={() => (
            <MaterialCommunityIcons 
              name={isApplied ? "check" : "file-send-outline"} 
              size={24} 
              color="white" 
            />
          )}
        >
          {isApplied ? 'Applied' : 'Apply'}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
  },
  headerRight: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 14,
  },
  headerCard: {
    marginBottom: 12,
    elevation: 1,
    borderRadius: 8,
  },
  headerCardContent: {
    padding: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
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
    marginBottom: 12,
    elevation: 1,
    borderRadius: 8,
  },
  sectionContent: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
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
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requirementBullet: {
    marginRight: 12,
    marginTop: 6,
  },
  requirementText: {
    flex: 1,
    lineHeight: 22,
  },
  applyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  applyButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JobDetailsPage;
