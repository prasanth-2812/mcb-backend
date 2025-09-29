import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Chip, Divider, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { Job } from '../types';

interface JobDetailsScreenProps {
  route: {
    params: {
      jobId: string;
    };
  };
  navigation: any;
}

const JobDetailsScreen: React.FC<JobDetailsScreenProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const { state, applyToJob, saveJob, unsaveJob } = useApp();
  const isDark = state.theme === 'dark';
  
  const [job, setJob] = useState<Job | null>(null);
  
  useEffect(() => {
    // Find the job by ID
    const foundJob = state.jobs.find(j => j.id === route.params.jobId);
    if (foundJob) {
      setJob(foundJob);
    }
  }, [route.params.jobId, state.jobs]);

  const handleApply = async () => {
    if (!job) return;

    // Navigate to Job Application screen
    (navigation as any).navigate('JobApplication', { 
      jobId: job.id,
      job: job 
    });
  };

  const handleSave = () => {
    if (!job) return;

    const isSaved = state.savedJobs.includes(job.id);
    if (isSaved) {
      unsaveJob(job.id);
    } else {
      saveJob(job.id);
    }
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share job:', job?.title);
  };

  if (!job) {
    return (
      <SafeAreaView style={[
        styles.container,
        { backgroundColor: isDark ? Colors.background : Colors.background }
      ]}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? Colors.background : Colors.background}
        />
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall">Job not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isApplied = state.appliedJobs.includes(job.id);
  const isSaved = state.savedJobs.includes(job.id);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Job Overview Card */}
          <Card style={styles.jobOverviewCard}>
            <Card.Content style={styles.jobOverviewContent}>
              <View style={styles.companySection}>
                <View style={styles.companyLogoContainer}>
                  {job.companyLogo ? (
                    <Image 
                      source={{ uri: job.companyLogo }} 
                      style={styles.companyLogo}
                      accessibilityLabel={`${job.company} logo`}
                      onError={() => {
                        console.log('Failed to load company logo:', job.companyLogo);
                      }}
                    />
                  ) : (
                    <View style={styles.companyLogoPlaceholder}>
                      <Text style={styles.companyLogoText}>
                        {job.company?.charAt(0)?.toUpperCase() || '?'}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.companyInfo}>
                  <Text variant="titleLarge" style={styles.companyName}>
                    {job.company}
                  </Text>
                  
                  <View style={styles.locationRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={22} color="#666666" />
                    <Text variant="bodyLarge" style={styles.location}>
                      {job.location}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.jobTitleSection}>
                <Text variant="headlineMedium" style={styles.jobTitle}>
                  {job.title}
                </Text>
                
                <View style={styles.jobTypeRow}>
                  <Chip 
                    style={styles.jobTypeChip}
                    textStyle={styles.jobTypeChipText}
                    icon={() => <MaterialCommunityIcons name="briefcase-outline" size={20} color="#1976D2" />}
                  >
                    {job.type}
                  </Chip>
                  
                  <View style={styles.postedDateRow}>
                    <MaterialCommunityIcons name="calendar-outline" size={20} color="#666666" />
                    <Text variant="bodyMedium" style={styles.postedDate}>
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Salary & Experience Card */}
          <Card style={styles.salaryExperienceCard}>
            <Card.Content style={styles.salaryExperienceContent}>
              <View style={styles.salaryRow}>
                <MaterialCommunityIcons name="currency-inr" size={24} color="#4CAF50" />
                <Text variant="headlineSmall" style={styles.salary}>
                  {job.salary}
                </Text>
              </View>
              
              <View style={styles.experienceRow}>
                <MaterialCommunityIcons name="account-tie-outline" size={24} color="#1976D2" />
                <Text variant="titleMedium" style={styles.experience}>
                  {job.experience} experience
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Job Description Card */}
          <Card style={styles.descriptionCard}>
            <Card.Content style={styles.descriptionContent}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Job Description
              </Text>
              <ScrollView 
                style={styles.descriptionScroll}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <Text variant="bodyLarge" style={styles.description}>
                  {job.description}
                </Text>
              </ScrollView>
            </Card.Content>
          </Card>

          {/* Skills Required Card */}
          <Card style={styles.skillsCard}>
            <Card.Content style={styles.skillsContent}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Skills Required
              </Text>
              <View style={styles.skillsContainer}>
                {job.tags.map((skill, index) => (
                  <Chip 
                    key={index}
                    style={styles.skillChip}
                    textStyle={styles.skillChipText}
                    icon={() => <MaterialCommunityIcons name="star-outline" size={20} color="#1976D2" />}
                  >
                    {skill}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* About Company Card */}
          <Card style={styles.aboutCompanyCard}>
            <Card.Content style={styles.aboutCompanyContent}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                About Company
              </Text>
              <Text variant="bodyLarge" style={styles.companyDescription}>
                {job.company} is a leading technology company focused on innovation and growth. 
                We are committed to providing excellent opportunities for talented professionals 
                to advance their careers in a dynamic and collaborative environment.
              </Text>
            </Card.Content>
          </Card>

          {/* Job Details Card */}
          <Card style={styles.jobDetailsCard}>
            <Card.Content style={styles.jobDetailsContent}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Job Details
              </Text>
              
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Posted Date
                  </Text>
                  <Text variant="bodyLarge" style={styles.detailValue}>
                    {new Date(job.postedDate).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Application Deadline
                  </Text>
                  <Text variant="bodyLarge" style={styles.detailValue}>
                    {new Date(job.deadline).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Work Arrangement
                  </Text>
                  <Text variant="bodyLarge" style={styles.detailValue}>
                    {job.isRemote ? 'Remote' : 'On-site'}
                  </Text>
                </View>
                
                {job.isUrgent && (
                  <View style={styles.detailItem}>
                    <Text variant="bodyMedium" style={styles.detailLabel}>
                      Status
                    </Text>
                    <View style={styles.urgentBadge}>
                      <MaterialCommunityIcons name="alert-circle" size={16} color="#F44336" />
                      <Text variant="bodyLarge" style={styles.urgentText}>
                        Urgent Hiring
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Bar */}
      <View style={styles.bottomActionBar}>
        <Button
          mode="outlined"
          onPress={handleShare}
          style={styles.shareButton}
          textColor="#1976D2"
          icon={() => <MaterialCommunityIcons name="share-variant" size={22} color="#1976D2" />}
        >
          Share
        </Button>
        
        <Button
          mode="contained"
          onPress={handleApply}
          disabled={isApplied}
          style={styles.applyButton}
          buttonColor="#1976D2"
          icon={() => <MaterialCommunityIcons name="send-outline" size={22} color="#FFFFFF" />}
        >
          {isApplied ? 'Applied' : 'Apply Now'}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#1976D2',
    flex: 1,
    textAlign: 'center',
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 16,
  },
  jobOverviewCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  jobOverviewContent: {
    padding: 20,
  },
  companySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  companyLogoContainer: {
    marginRight: 16,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  companyLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginLeft: 8,
    color: '#666666',
  },
  jobTitleSection: {
    marginTop: 8,
  },
  jobTitle: {
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  jobTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jobTypeChip: {
    backgroundColor: '#E3F2FD',
  },
  jobTypeChipText: {
    color: '#1976D2',
    fontWeight: '500',
  },
  postedDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postedDate: {
    marginLeft: 8,
    color: '#666666',
  },
  salaryExperienceCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  salaryExperienceContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  salary: {
    marginLeft: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontSize: 20,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  experience: {
    marginLeft: 12,
    fontWeight: '500',
    color: '#1976D2',
  },
  descriptionCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  descriptionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  descriptionScroll: {
    maxHeight: 200,
  },
  description: {
    lineHeight: 24,
    color: '#666666',
  },
  skillsCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  skillsContent: {
    padding: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E3F2FD',
  },
  skillChipText: {
    color: '#1976D2',
    fontWeight: '500',
  },
  aboutCompanyCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  aboutCompanyContent: {
    padding: 20,
  },
  companyDescription: {
    lineHeight: 24,
    color: '#666666',
  },
  jobDetailsCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  jobDetailsContent: {
    padding: 20,
  },
  detailsGrid: {
    marginTop: 8,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontWeight: '500',
    color: '#333333',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  urgentText: {
    marginLeft: 6,
    color: '#F44336',
    fontWeight: '500',
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 34, // Extra padding for mobile navigation
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shareButton: {
    flex: 1,
    marginRight: 12,
    borderRadius: 8,
    borderColor: '#1976D2',
  },
  applyButton: {
    flex: 2,
    borderRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JobDetailsScreen;
