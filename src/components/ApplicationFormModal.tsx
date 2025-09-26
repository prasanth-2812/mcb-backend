import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Modal, Text, Button, Card, TextInput, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Job } from '../types';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ApplicationFormModalProps {
  visible: boolean;
  onDismiss: () => void;
  job: Job | null;
  onSubmit: (applicationData: ApplicationData) => void;
}

interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  visible,
  onDismiss,
  job,
  onSubmit
}) => {
  const theme = useTheme();
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      onSubmit(formData);
      setIsSubmitting(false);
      Alert.alert('Success', 'Your application has been submitted successfully!');
      onDismiss();
    }, 1500);
  };

  const handleDismiss = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      resume: '',
      coverLetter: ''
    });
    onDismiss();
  };

  if (!job) return null;

  return (
    <Modal
      visible={visible}
      onDismiss={handleDismiss}
      contentContainerStyle={[
        styles.modal,
        { backgroundColor: isDark ? Colors.darkGray : '#FFFFFF' }
      ]}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.jobInfo}>
              <Text 
                variant="headlineSmall" 
                style={[
                  styles.jobTitle,
                  { color: isDark ? Colors.white : '#1A1A1A' }
                ]}
              >
                Apply for {job.title}
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
            </View>
          </View>
        </View>

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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  companyName: {
    // Additional styles if needed
  },
  formCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  formContent: {
    padding: 20,
  },
  formTitle: {
    fontWeight: '700',
    marginBottom: 20,
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
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});

export default ApplicationFormModal;
