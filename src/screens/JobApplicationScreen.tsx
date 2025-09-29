import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, Card, useTheme, TextInput, IconButton, ProgressBar } from 'react-native-paper';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Job } from '../types';

interface JobApplicationScreenProps {
  route: {
    params: {
      jobId: string;
      job?: Job;
    };
  };
}

const JobApplicationScreen: React.FC<JobApplicationScreenProps> = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, applyToJob } = useApp();
  const isDark = state.theme === 'dark';
  
  const [formData, setFormData] = useState({
    fullName: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    coverLetter: '',
  });
  
  const [resumeFile, setResumeFile] = useState<{
    name: string;
    uploaded: boolean;
  }>({
    name: state.user?.resume?.fileName || '',
    uploaded: state.user?.resume?.uploaded || false,
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  
  const [job, setJob] = useState<Job | null>(null);
  
  const contentOpacity = useSharedValue(0);
  const headerScale = useSharedValue(0.8);
  const progressValue = useSharedValue(0);

  useEffect(() => {
    // Find the job by ID
    const foundJob = state.jobs.find(j => j.id === route.params.jobId);
    if (foundJob) {
      setJob(foundJob);
    }

    // Animate content entrance
    contentOpacity.value = withTiming(1, { duration: 600 });
    headerScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    
    // Calculate form completion progress
    calculateProgress();
  }, [formData, resumeFile]);

  const calculateProgress = () => {
    const requiredFields = ['fullName', 'email', 'phone'];
    const completedFields = requiredFields.filter(field => formData[field as keyof typeof formData].trim() !== '');
    const progress = (completedFields.length + (resumeFile.uploaded ? 1 : 0)) / (requiredFields.length + 1);
    progressValue.value = withTiming(progress, { duration: 300 });
  };

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!resumeFile.uploaded) {
      newErrors.resume = 'Resume upload is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResumeUpload = () => {
    // Simulate file upload
    Alert.alert(
      'Upload Resume',
      'Choose your resume file',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upload PDF', 
          onPress: () => {
            setResumeFile({
              name: 'Resume_John_Doe.pdf',
              uploaded: true
            });
            if (errors.resume) {
              setErrors(prev => ({ ...prev, resume: '' }));
            }
          }
        },
        { 
          text: 'Upload DOC', 
          onPress: () => {
            setResumeFile({
              name: 'Resume_John_Doe.docx',
              uploaded: true
            });
            if (errors.resume) {
              setErrors(prev => ({ ...prev, resume: '' }));
            }
          }
        }
      ]
    );
  };

  const handleRemoveResume = () => {
    setResumeFile({ name: '', uploaded: false });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create application object
      const application = {
        id: Date.now().toString(),
        jobId: job?.id || '',
        jobTitle: job?.title || '',
        company: job?.company || '',
        appliedDate: new Date().toISOString(),
        status: 'applied' as const,
        statusHistory: [{
          status: 'applied' as const,
          date: new Date().toISOString(),
          description: 'Application submitted successfully'
        }],
        notes: formData.coverLetter,
        interviewDate: null,
        salary: job?.salary || '',
        location: job?.location || '',
      };

      // Apply to job
      applyToJob(application);
      
      Alert.alert(
        'Application Submitted!',
        'Your application has been submitted successfully. You will receive a confirmation email shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    Alert.alert('Draft Saved', 'Your application has been saved as a draft.');
  };

  const isFormValid = () => {
    return formData.fullName.trim() !== '' && 
           formData.email.trim() !== '' && 
           formData.phone.trim() !== '' && 
           resumeFile.uploaded &&
           Object.keys(errors).length === 0;
  };

  if (!job) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark : Colors.white }]}>
        <View style={styles.loadingContainer}>
          <Text>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark : Colors.white }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? Colors.dark : Colors.white} 
      />
      
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={isDark ? Colors.white : Colors.textPrimary}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <View style={styles.headerTitleContainer}>
            <Text variant="titleMedium" style={[styles.jobTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
              {job.title}
            </Text>
            <Text variant="bodyMedium" style={[styles.companyName, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
              {job.company}
            </Text>
          </View>
        </View>
      </Animated.View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.ScrollView 
          style={contentAnimatedStyle}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Bar */}
          <Card style={[styles.progressCard, { backgroundColor: isDark ? Colors.darkGray : Colors.white }]}>
            <Card.Content style={styles.progressContent}>
              <View style={styles.progressHeader}>
                <Text variant="bodyMedium" style={[styles.progressText, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                  Application Progress
                </Text>
                <Text variant="bodySmall" style={[styles.progressPercentage, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                  {Math.round(progressValue.value * 100)}%
                </Text>
              </View>
              <View style={[styles.progressBarContainer, { backgroundColor: isDark ? Colors.gray : '#E0E0E0' }]}>
                <Animated.View style={[styles.progressBarFill, { backgroundColor: '#1976D2' }, progressAnimatedStyle]} />
              </View>
            </Card.Content>
          </Card>

          {/* Job Summary */}
          <Card style={[styles.card, { backgroundColor: isDark ? Colors.darkGray : Colors.white }]}>
            <Card.Content style={styles.cardContent}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                Job Summary
              </Text>
              
              <View style={styles.jobSummaryGrid}>
                <View style={styles.jobSummaryItem}>
                  <MaterialCommunityIcons name="briefcase-outline" size={20} color="#1976D2" />
                  <Text variant="bodyMedium" style={[styles.jobSummaryLabel, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                    Type
                  </Text>
                  <Text variant="bodyMedium" style={[styles.jobSummaryValue, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    {job.type}
                  </Text>
                </View>
                
                <View style={styles.jobSummaryItem}>
                  <MaterialCommunityIcons name="map-marker-outline" size={20} color="#1976D2" />
                  <Text variant="bodyMedium" style={[styles.jobSummaryLabel, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                    Location
                  </Text>
                  <Text variant="bodyMedium" style={[styles.jobSummaryValue, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    {job.location}
                  </Text>
                </View>
                
                <View style={styles.jobSummaryItem}>
                  <MaterialCommunityIcons name="currency-inr" size={20} color="#1976D2" />
                  <Text variant="bodyMedium" style={[styles.jobSummaryLabel, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                    Salary
                  </Text>
                  <Text variant="bodyMedium" style={[styles.jobSummaryValue, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    {job.salary}
                  </Text>
                </View>
                
                <View style={styles.jobSummaryItem}>
                  <MaterialCommunityIcons name="account-tie-outline" size={20} color="#1976D2" />
                  <Text variant="bodyMedium" style={[styles.jobSummaryLabel, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                    Experience
                  </Text>
                  <Text variant="bodyMedium" style={[styles.jobSummaryValue, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    {job.experience}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Application Form */}
          <Card style={[styles.card, { backgroundColor: isDark ? Colors.darkGray : Colors.white }]}>
            <Card.Content style={styles.cardContent}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                Application Details
              </Text>
              
              <View style={styles.formGroup}>
                <TextInput
                  label="Full Name *"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                  mode="outlined"
                  style={styles.input}
                  textColor={isDark ? Colors.white : Colors.textPrimary}
                  outlineColor={errors.fullName ? '#F44336' : (isDark ? Colors.gray : Colors.border)}
                  activeOutlineColor="#1976D2"
                  error={!!errors.fullName}
                />
                {errors.fullName && (
                  <Text variant="bodySmall" style={styles.errorText}>
                    {errors.fullName}
                  </Text>
                )}
                
                <TextInput
                  label="Email Address *"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  mode="outlined"
                  style={styles.input}
                  textColor={isDark ? Colors.white : Colors.textPrimary}
                  outlineColor={errors.email ? '#F44336' : (isDark ? Colors.gray : Colors.border)}
                  activeOutlineColor="#1976D2"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!errors.email}
                />
                {errors.email && (
                  <Text variant="bodySmall" style={styles.errorText}>
                    {errors.email}
                  </Text>
                )}
                
                <TextInput
                  label="Phone Number *"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  mode="outlined"
                  style={styles.input}
                  textColor={isDark ? Colors.white : Colors.textPrimary}
                  outlineColor={errors.phone ? '#F44336' : (isDark ? Colors.gray : Colors.border)}
                  activeOutlineColor="#1976D2"
                  keyboardType="phone-pad"
                  error={!!errors.phone}
                />
                {errors.phone && (
                  <Text variant="bodySmall" style={styles.errorText}>
                    {errors.phone}
                  </Text>
                )}
                
                {/* Resume Upload */}
                <View style={styles.resumeSection}>
                  <Text variant="bodyLarge" style={[styles.resumeLabel, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    Resume *
                  </Text>
                  
                  {resumeFile.uploaded ? (
                    <View style={[styles.resumeUploaded, { backgroundColor: isDark ? Colors.gray : '#F5F5F5' }]}>
                      <View style={styles.resumeFileInfo}>
                        <MaterialCommunityIcons name="file-document" size={24} color="#1976D2" />
                        <View style={styles.resumeFileDetails}>
                          <Text variant="bodyMedium" style={[styles.resumeFileName, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                            {resumeFile.name}
                          </Text>
                          <Text variant="bodySmall" style={[styles.resumeFileSize, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                            PDF • 2.4 MB
                          </Text>
                        </View>
                      </View>
                      <IconButton
                        icon="close"
                        size={20}
                        iconColor="#F44336"
                        onPress={handleRemoveResume}
                        style={styles.removeResumeButton}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.resumeUpload, { borderColor: errors.resume ? '#F44336' : (isDark ? Colors.gray : Colors.border) }]}
                      onPress={handleResumeUpload}
                    >
                      <MaterialCommunityIcons name="file-upload-outline" size={32} color="#1976D2" />
                      <Text variant="bodyMedium" style={[styles.uploadText, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                        Tap to upload resume
                      </Text>
                      <Text variant="bodySmall" style={[styles.uploadSubtext, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                        PDF, DOC, DOCX up to 10MB
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {errors.resume && (
                    <Text variant="bodySmall" style={styles.errorText}>
                      {errors.resume}
                    </Text>
                  )}
                </View>
                
                <TextInput
                  label="Cover Letter (Optional)"
                  value={formData.coverLetter}
                  onChangeText={(text) => handleInputChange('coverLetter', text)}
                  mode="outlined"
                  style={styles.input}
                  textColor={isDark ? Colors.white : Colors.textPrimary}
                  outlineColor={isDark ? Colors.gray : Colors.border}
                  activeOutlineColor="#1976D2"
                  multiline
                  numberOfLines={4}
                  placeholder="Tell us why you're interested in this position..."
                />
              </View>
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={handleSaveDraft}
              style={[styles.actionButton, styles.draftButton]}
              textColor={isDark ? Colors.white : Colors.textPrimary}
              buttonColor="transparent"
              disabled={isSubmitting}
            >
              Save Draft
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.actionButton, styles.submitButton]}
              buttonColor="#1976D2"
              disabled={!isFormValid() || isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    margin: 0,
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  companyName: {
    opacity: 0.8,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  progressCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressContent: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontWeight: '500',
  },
  progressPercentage: {
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  jobSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  jobSummaryItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  jobSummaryLabel: {
    marginTop: 4,
    marginBottom: 2,
    fontSize: 12,
  },
  jobSummaryValue: {
    fontWeight: '500',
    textAlign: 'center',
  },
  formGroup: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#F44336',
    marginTop: -8,
    marginLeft: 12,
  },
  resumeSection: {
    marginTop: 8,
  },
  resumeLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  resumeUploaded: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resumeFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resumeFileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  resumeFileName: {
    fontWeight: '500',
    marginBottom: 2,
  },
  resumeFileSize: {
    fontSize: 12,
  },
  removeResumeButton: {
    margin: 0,
  },
  resumeUpload: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  uploadText: {
    marginTop: 8,
    fontWeight: '500',
  },
  uploadSubtext: {
    marginTop: 4,
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  draftButton: {
    borderColor: '#B0BEC5',
  },
  submitButton: {
    // Additional styles if needed
  },
});

export default JobApplicationScreen;
