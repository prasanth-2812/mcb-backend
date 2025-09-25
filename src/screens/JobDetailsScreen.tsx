import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Image } from 'react-native';
import { Text, Button, Card, Chip, Divider, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence 
} from 'react-native-reanimated';
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
  const [isApplying, setIsApplying] = useState(false);
  
  const contentOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Find the job by ID
    const foundJob = state.jobs.find(j => j.id === route.params.jobId);
    if (foundJob) {
      setJob(foundJob);
    }

    // Animate content entrance
    contentOpacity.value = withTiming(1, { duration: 600 });
  }, [route.params.jobId, state.jobs]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleApply = async () => {
    if (!job) return;

    setIsApplying(true);
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );

    // Simulate API call
    setTimeout(() => {
      applyToJob(job.id);
      setIsApplying(false);
    }, 1500);
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
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? Colors.background : Colors.background }
    ]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? Colors.background : Colors.background}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {/* Header Card */}
          <Card style={[
            styles.headerCard,
            { backgroundColor: isDark ? Colors.darkGray : Colors.white }
          ]}>
            <Card.Content style={styles.headerContent}>
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
                      { color: isDark ? Colors.white : Colors.textPrimary }
                    ]}
                  >
                    {job.title}
                  </Text>
                  <Text 
                    variant="titleMedium" 
                    style={[
                      styles.companyName,
                      { color: isDark ? Colors.gray : Colors.textSecondary }
                    ]}
                  >
                    {job.company}
                  </Text>
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.location,
                      { color: isDark ? Colors.gray : Colors.textSecondary }
                    ]}
                  >
                    {job.location}
                  </Text>
                </View>
              </View>

              <View style={styles.jobMeta}>
                <View style={styles.metaRow}>
                  <Chip 
                    style={[
                      styles.metaChip,
                      { backgroundColor: isDark ? Colors.lightGray : Colors.lightGray }
                    ]}
                    textStyle={[
                      styles.metaChipText,
                      { color: isDark ? Colors.textPrimary : Colors.textSecondary }
                    ]}
                  >
                    {job.type}
                  </Chip>
                  <Chip 
                    style={[
                      styles.metaChip,
                      { backgroundColor: isDark ? Colors.lightGray : Colors.lightGray }
                    ]}
                    textStyle={[
                      styles.metaChipText,
                      { color: isDark ? Colors.textPrimary : Colors.textSecondary }
                    ]}
                  >
                    {job.experience}
                  </Chip>
                </View>
                
                <Text 
                  variant="titleMedium" 
                  style={[
                    styles.salary,
                    { color: Colors.success }
                  ]}
                >
                  {job.salary}
                </Text>

                <View style={styles.tagsContainer}>
                  {job.tags.map((tag, index) => (
                    <Chip 
                      key={index}
                      style={[
                        styles.tag,
                        { backgroundColor: isDark ? Colors.primary : Colors.primaryContainer }
                      ]}
                      textStyle={[
                        styles.tagText,
                        { color: isDark ? Colors.white : Colors.primary }
                      ]}
                      compact
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>

                {job.isUrgent && (
                  <Chip 
                    style={[styles.urgentChip, { backgroundColor: Colors.error }]}
                    textStyle={styles.urgentText}
                  >
                    Urgent Hiring
                  </Chip>
                )}
              </View>
            </Card.Content>
          </Card>

          {/* Description Card */}
          <Card style={[
            styles.descriptionCard,
            { backgroundColor: isDark ? Colors.darkGray : Colors.white }
          ]}>
            <Card.Content style={styles.descriptionContent}>
              <Text 
                variant="titleLarge" 
                style={[
                  styles.sectionTitle,
                  { color: isDark ? Colors.white : Colors.textPrimary }
                ]}
              >
                Job Description
              </Text>
              <Text 
                variant="bodyLarge" 
                style={[
                  styles.description,
                  { color: isDark ? Colors.gray : Colors.textSecondary }
                ]}
              >
                {job.description}
              </Text>
            </Card.Content>
          </Card>

          {/* Requirements Card */}
          <Card style={[
            styles.requirementsCard,
            { backgroundColor: isDark ? Colors.darkGray : Colors.white }
          ]}>
            <Card.Content style={styles.requirementsContent}>
              <Text 
                variant="titleLarge" 
                style={[
                  styles.sectionTitle,
                  { color: isDark ? Colors.white : Colors.textPrimary }
                ]}
              >
                Requirements
              </Text>
              {job.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.requirementBullet,
                      { color: isDark ? Colors.primary : Colors.primary }
                    ]}
                  >
                    •
                  </Text>
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.requirementText,
                      { color: isDark ? Colors.gray : Colors.textSecondary }
                    ]}
                  >
                    {requirement}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Benefits Card */}
          <Card style={[
            styles.benefitsCard,
            { backgroundColor: isDark ? Colors.darkGray : Colors.white }
          ]}>
            <Card.Content style={styles.benefitsContent}>
              <Text 
                variant="titleLarge" 
                style={[
                  styles.sectionTitle,
                  { color: isDark ? Colors.white : Colors.textPrimary }
                ]}
              >
                Benefits
              </Text>
              {job.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.benefitBullet,
                      { color: isDark ? Colors.success : Colors.success }
                    ]}
                  >
                    ✓
                  </Text>
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.benefitText,
                      { color: isDark ? Colors.gray : Colors.textSecondary }
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
            styles.detailsCard,
            { backgroundColor: isDark ? Colors.darkGray : Colors.white }
          ]}>
            <Card.Content style={styles.detailsContent}>
              <Text 
                variant="titleLarge" 
                style={[
                  styles.sectionTitle,
                  { color: isDark ? Colors.white : Colors.textPrimary }
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
                      { color: isDark ? Colors.gray : Colors.textSecondary }
                    ]}
                  >
                    Posted Date
                  </Text>
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.detailValue,
                      { color: isDark ? Colors.white : Colors.textPrimary }
                    ]}
                  >
                    {new Date(job.postedDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text 
                    variant="bodyMedium" 
                    style={[
                      styles.detailLabel,
                      { color: isDark ? Colors.gray : Colors.textSecondary }
                    ]}
                  >
                    Application Deadline
                  </Text>
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.detailValue,
                      { color: isDark ? Colors.white : Colors.textPrimary }
                    ]}
                  >
                    {new Date(job.deadline).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text 
                    variant="bodyMedium" 
                    style={[
                      styles.detailLabel,
                      { color: isDark ? Colors.gray : Colors.textSecondary }
                    ]}
                  >
                    Work Arrangement
                  </Text>
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.detailValue,
                      { color: isDark ? Colors.white : Colors.textPrimary }
                    ]}
                  >
                    {job.isRemote ? 'Remote' : 'On-site'}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Action Buttons */}
      <Animated.View style={[styles.actionContainer, buttonAnimatedStyle]}>
        <View style={styles.actionButtons}>
          <IconButton
            icon={isSaved ? 'bookmark' : 'bookmark-outline'}
            iconColor={isSaved ? Colors.warning : Colors.gray}
            size={24}
            onPress={handleSave}
            style={styles.actionButton}
            accessibilityLabel={isSaved ? 'Remove from saved jobs' : 'Save job'}
          />
          <IconButton
            icon="share"
            iconColor={Colors.gray}
            size={24}
            onPress={handleShare}
            style={styles.actionButton}
            accessibilityLabel="Share job"
          />
        </View>
        
        <Button
          mode="contained"
          onPress={handleApply}
          loading={isApplying}
          disabled={isApplied || isApplying}
          style={styles.applyButton}
          buttonColor={isApplied ? Colors.success : (isDark ? Colors.primary : Colors.primary)}
          contentStyle={styles.applyButtonContent}
        >
          {isApplied ? 'Applied' : (isApplying ? 'Applying...' : 'Apply Now')}
        </Button>
      </Animated.View>
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
    paddingBottom: 100, // Space for action buttons
  },
  content: {
    padding: Sizes.md,
  },
  headerCard: {
    marginBottom: Sizes.md,
    elevation: Sizes.elevation2,
    borderRadius: Sizes.radiusMd,
  },
  headerContent: {
    padding: Sizes.lg,
  },
  companyInfo: {
    flexDirection: 'row',
    marginBottom: Sizes.lg,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: Sizes.radiusMd,
    marginRight: Sizes.md,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontWeight: 'bold',
    marginBottom: Sizes.xs,
  },
  companyName: {
    marginBottom: Sizes.xs,
  },
  location: {
    // Additional styles if needed
  },
  jobMeta: {
    // Additional styles if needed
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: Sizes.md,
  },
  metaChip: {
    marginRight: Sizes.sm,
  },
  metaChipText: {
    fontSize: Sizes.fontSizeSm,
  },
  salary: {
    fontWeight: 'bold',
    marginBottom: Sizes.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Sizes.md,
  },
  tag: {
    marginRight: Sizes.sm,
    marginBottom: Sizes.sm,
  },
  tagText: {
    fontSize: Sizes.fontSizeSm,
  },
  urgentChip: {
    alignSelf: 'flex-start',
  },
  urgentText: {
    color: Colors.white,
    fontSize: Sizes.fontSizeSm,
    fontWeight: '600',
  },
  descriptionCard: {
    marginBottom: Sizes.md,
    elevation: Sizes.elevation2,
    borderRadius: Sizes.radiusMd,
  },
  descriptionContent: {
    padding: Sizes.lg,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Sizes.md,
  },
  description: {
    lineHeight: 24,
  },
  requirementsCard: {
    marginBottom: Sizes.md,
    elevation: Sizes.elevation2,
    borderRadius: Sizes.radiusMd,
  },
  requirementsContent: {
    padding: Sizes.lg,
  },
  requirementItem: {
    flexDirection: 'row',
    marginBottom: Sizes.sm,
  },
  requirementBullet: {
    marginRight: Sizes.sm,
    marginTop: 2,
  },
  requirementText: {
    flex: 1,
    lineHeight: 22,
  },
  benefitsCard: {
    marginBottom: Sizes.md,
    elevation: Sizes.elevation2,
    borderRadius: Sizes.radiusMd,
  },
  benefitsContent: {
    padding: Sizes.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: Sizes.sm,
  },
  benefitBullet: {
    marginRight: Sizes.sm,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    lineHeight: 22,
  },
  detailsCard: {
    marginBottom: Sizes.md,
    elevation: Sizes.elevation2,
    borderRadius: Sizes.radiusMd,
  },
  detailsContent: {
    padding: Sizes.lg,
  },
  detailsGrid: {
    // Additional styles if needed
  },
  detailItem: {
    marginBottom: Sizes.md,
  },
  detailLabel: {
    marginBottom: Sizes.xs,
  },
  detailValue: {
    fontWeight: '500',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionButtons: {
    flexDirection: 'row',
    marginRight: Sizes.md,
  },
  actionButton: {
    marginRight: Sizes.sm,
  },
  applyButton: {
    flex: 1,
    borderRadius: Sizes.radiusMd,
  },
  applyButtonContent: {
    paddingVertical: Sizes.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JobDetailsScreen;
