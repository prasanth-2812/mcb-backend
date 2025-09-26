import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Dimensions, Alert } from 'react-native';
import { Text, Button, Card, TextInput, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Job } from '../types';

const { width: screenWidth } = Dimensions.get('window');

interface ApplicationPageProps {
  navigation: any;
  route: {
    params: {
      jobId: string;
    };
  };
}

interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
}

const ApplicationPage: React.FC<ApplicationPageProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  
  const [job, setJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Find the job by ID
    const foundJob = state.jobs.find(j => j.id === route.params.jobId);
    if (foundJob) {
      setJob(foundJob);
    }

    // Prefill candidate info if available
    if (state.user) {
      setFormData(prev => ({
        ...prev,
        fullName: `${state.user?.personalInfo.firstName || ''} ${state.user?.personalInfo.lastName || ''}`.trim(),
        email: state.user?.personalInfo.email || '',
        phone: state.user?.personalInfo.phone || ''
      }));
    }
  }, [route.params.jobId, state.jobs, state.user]);

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    if (!formData.coverLetter.trim()) {
      Alert.alert('Error', 'Please enter a cover letter');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Success', 
        'Your application has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('JobsScreen')
          }
        ]
      );
    }, 1500);
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
          Application
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Job Info Card */}
          <Card style={[
            styles.jobInfoCard,
            { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
          ]}>
            <Card.Content style={styles.jobInfoContent}>
              <Text 
                variant="titleLarge" 
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
                at {job.company}
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
            </Card.Content>
          </Card>

          {/* Application Form */}
          <Card style={[
            styles.formCard,
            { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
          ]}>
            <Card.Content style={styles.formContent}>
              <Text 
                variant="titleLarge" 
                style={[
                  styles.formTitle,
                  { color: isDark ? Colors.white : '#1A1A1A' }
                ]}
              >
                Application Form
              </Text>

              {/* Full Name */}
              <TextInput
                label="Full Name *"
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
                mode="outlined"
                style={styles.input}
                outlineColor={isDark ? Colors.gray : '#D1D5DB'}
                activeOutlineColor="#3b82f6"
                textColor={isDark ? Colors.white : '#1A1A1A'}
              />

              {/* Email */}
              <TextInput
                label="Email *"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                outlineColor={isDark ? Colors.gray : '#D1D5DB'}
                activeOutlineColor="#3b82f6"
                textColor={isDark ? Colors.white : '#1A1A1A'}
              />

              {/* Phone */}
              <TextInput
                label="Phone Number *"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                outlineColor={isDark ? Colors.gray : '#D1D5DB'}
                activeOutlineColor="#3b82f6"
                textColor={isDark ? Colors.white : '#1A1A1A'}
              />

              {/* Resume Upload */}
              <View style={styles.uploadSection}>
                <Text 
                  variant="bodyLarge" 
                  style={[
                    styles.uploadLabel,
                    { color: isDark ? Colors.white : '#1A1A1A' }
                  ]}
                >
                  Upload Resume
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => {
                    // In a real app, this would open a file picker
                    Alert.alert('File Upload', 'File upload functionality would be implemented here');
                  }}
                  style={styles.uploadButton}
                  icon={() => (
                    <MaterialCommunityIcons 
                      name="upload" 
                      size={20} 
                      color="#3b82f6" 
                    />
                  )}
                >
                  Choose File
                </Button>
                {formData.resume && (
                  <Text 
                    variant="bodySmall" 
                    style={[
                      styles.fileName,
                      { color: isDark ? Colors.gray : '#666666' }
                    ]}
                  >
                    {formData.resume}
                  </Text>
                )}
              </View>

              {/* Cover Letter */}
              <TextInput
                label="Cover Letter *"
                value={formData.coverLetter}
                onChangeText={(text) => handleInputChange('coverLetter', text)}
                mode="outlined"
                multiline
                numberOfLines={6}
                style={styles.textArea}
                outlineColor={isDark ? Colors.gray : '#D1D5DB'}
                activeOutlineColor="#3b82f6"
                textColor={isDark ? Colors.white : '#1A1A1A'}
                placeholder="Tell us why you're interested in this position..."
              />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={[
        styles.submitContainer,
        { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
      ]}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
          buttonColor="#3b82f6"
          textColor="white"
          icon={() => (
            <MaterialCommunityIcons 
              name="send" 
              size={20} 
              color="white" 
            />
          )}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
    padding: 16,
  },
  jobInfoCard: {
    marginBottom: 12,
    elevation: 1,
    borderRadius: 8,
  },
  jobInfoContent: {
    padding: 16,
  },
  jobTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  companyName: {
    marginBottom: 4,
  },
  location: {
    // Additional styles if needed
  },
  formCard: {
    marginBottom: 12,
    elevation: 1,
    borderRadius: 8,
  },
  formContent: {
    padding: 16,
  },
  formTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  uploadSection: {
    marginBottom: 16,
  },
  uploadLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  uploadButton: {
    borderColor: '#3b82f6',
    borderWidth: 1,
    borderRadius: 8,
  },
  fileName: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  textArea: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  submitContainer: {
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
  submitButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApplicationPage;
