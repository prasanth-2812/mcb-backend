import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, Image } from 'react-native';
import { Text, Button, Card, useTheme, Chip, IconButton, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import ValidatedInput from '../components/ValidatedInput';
import { validateForm, VALIDATION_RULES, ERROR_MESSAGES } from '../utils/validation';
import { FileUploadService } from '../services/fileUploadService';

const EditProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, updateProfile, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    location: state.user?.location || '',
    role: state.user?.preferences?.role || '',
    jobType: state.user?.preferences?.type || '',
    preferredLocation: state.user?.preferences?.location || '',
  });
  
  const [skills, setSkills] = useState<string[]>(state.user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [profilePicture, setProfilePicture] = useState(state.user?.profilePicture?.uri || '');
  const [profilePictureUploaded, setProfilePictureUploaded] = useState(state.user?.profilePicture?.uploaded || false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [fieldValidations, setFieldValidations] = useState<{[key: string]: boolean}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFieldValidation = (field: string, isValid: boolean) => {
    setFieldValidations(prev => ({ ...prev, [field]: isValid }));
  };

  const validateFormData = () => {
    const validationErrors = validateForm(formData, {
      name: VALIDATION_RULES.fullName,
      email: VALIDATION_RULES.email,
      phone: VALIDATION_RULES.phone,
      location: VALIDATION_RULES.location,
      role: VALIDATION_RULES.role,
      jobType: VALIDATION_RULES.jobType,
      preferredLocation: VALIDATION_RULES.preferredLocation,
    });
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleProfilePictureUpload = () => {
    Alert.alert(
      'Upload Profile Picture',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            try {
              const result = await FileUploadService.takePhoto();
              if (result.success && result.uri) {
                // Validate file
                const validation = FileUploadService.validateFile(
                  result.fileSize || 0, 
                  result.mimeType || 'image/jpeg', 
                  5 // 5MB max for images
                );
                
                if (!validation.valid) {
                  Alert.alert('Invalid File', validation.error);
                  return;
                }

                // Upload to server
                const uploadResult = await FileUploadService.uploadFile(
                  result.uri,
                  result.fileName || 'profile.jpg',
                  result.mimeType || 'image/jpeg',
                  'avatar'
                );

                if (uploadResult.success && uploadResult.uri) {
                  setProfilePicture(uploadResult.uri);
                  setProfilePictureUploaded(true);
                  Alert.alert('Success', 'Profile picture uploaded successfully!');
                } else {
                  Alert.alert('Upload Failed', uploadResult.error || 'Failed to upload profile picture');
                }
              } else {
                Alert.alert('Error', result.error || 'Failed to capture photo');
              }
            } catch (error) {
              console.error('Profile picture upload error:', error);
              Alert.alert('Error', 'Failed to upload profile picture');
            }
          }
        },
        {
          text: 'Gallery',
          onPress: async () => {
            try {
              const result = await FileUploadService.pickImage();
              if (result.success && result.uri) {
                // Validate file
                const validation = FileUploadService.validateFile(
                  result.fileSize || 0, 
                  result.mimeType || 'image/jpeg', 
                  5 // 5MB max for images
                );
                
                if (!validation.valid) {
                  Alert.alert('Invalid File', validation.error);
                  return;
                }

                // Upload to server
                const uploadResult = await FileUploadService.uploadFile(
                  result.uri,
                  result.fileName || 'profile.jpg',
                  result.mimeType || 'image/jpeg',
                  'avatar'
                );

                if (uploadResult.success && uploadResult.uri) {
                  setProfilePicture(uploadResult.uri);
                  setProfilePictureUploaded(true);
                  Alert.alert('Success', 'Profile picture uploaded successfully!');
                } else {
                  Alert.alert('Upload Failed', uploadResult.error || 'Failed to upload profile picture');
                }
              } else {
                Alert.alert('Error', result.error || 'Failed to select image');
              }
            } catch (error) {
              console.error('Profile picture upload error:', error);
              Alert.alert('Error', 'Failed to upload profile picture');
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) return;
    
    if (skills.includes(trimmedSkill)) {
      setErrors(prev => ({ ...prev, skill: ERROR_MESSAGES.skills.duplicate }));
      return;
    }
    
    if (skills.length >= 20) {
      setErrors(prev => ({ ...prev, skill: ERROR_MESSAGES.skills.tooMany }));
      return;
    }
    
    if (!/^[a-zA-Z0-9\s\-_&+]+$/.test(trimmedSkill)) {
      setErrors(prev => ({ ...prev, skill: ERROR_MESSAGES.skills.invalid }));
      return;
    }
    
    setSkills(prev => [...prev, trimmedSkill]);
    setNewSkill('');
    setErrors(prev => ({ ...prev, skill: '' }));
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    if (!validateFormData()) {
      Alert.alert('Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    try {
      // Update only the fields that the API can handle
      const apiProfileUpdate = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        skills: skills,
      };

      console.log('🔄 Sending profile update to API:', apiProfileUpdate);
      console.log('🔄 Location being sent to API:', formData.location);
      await updateProfile(apiProfileUpdate);

      // Update local state with all fields (including those not in API)
      const fullProfileUpdate = {
        ...state.user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        skills: skills,
        profilePicture: {
          uri: profilePicture,
          uploaded: profilePictureUploaded
        },
        preferences: {
          role: formData.role,
          type: formData.jobType,
          location: formData.preferredLocation,
        }
      };

      // Update local state with all fields
      dispatch({ type: 'UPDATE_PROFILE', payload: fullProfileUpdate });
      
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? DarkColors.background : Colors.white }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? DarkColors.background : Colors.white} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={isDark ? Colors.white : Colors.textPrimary}
            onPress={handleCancel}
            style={styles.backButton}
          />
          <Text variant="headlineSmall" style={[styles.headerTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
            Edit Profile
          </Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture Section */}
        <Card style={[styles.card, { backgroundColor: isDark ? Colors.darkGray : Colors.white }]}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
              Profile Picture
            </Text>
            
            <View style={styles.profilePictureSection}>
              <View style={styles.profilePictureContainer}>
                {profilePictureUploaded && profilePicture ? (
                  <Image 
                    source={{ uri: profilePicture }} 
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Avatar.Icon 
                    size={80} 
                    icon="account-circle-outline"
                    style={styles.avatarPlaceholder}
                  />
                )}
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handleProfilePictureUpload}
                >
                  <MaterialCommunityIcons name="camera-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profilePictureInfo}>
                <Text variant="bodyMedium" style={[styles.profilePictureText, { color: isDark ? Colors.white : Colors.textSecondary }]}>
                  {profilePictureUploaded ? 'Profile picture uploaded' : 'No profile picture'}
                </Text>
                <Button 
                  mode="outlined" 
                  onPress={handleProfilePictureUpload}
                  style={styles.uploadButtonText}
                  textColor={isDark ? Colors.white : Colors.primary}
                >
                  {profilePictureUploaded ? 'Change Picture' : 'Upload Picture'}
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Personal Information */}
        <Card style={[styles.card, { backgroundColor: isDark ? Colors.darkGray : Colors.white }]}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
              Personal Information
            </Text>
            
            <View style={styles.inputGroup}>
              <ValidatedInput
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                onValidationChange={(isValid) => handleFieldValidation('name', isValid)}
                fieldName="name"
                formData={formData}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                error={!!errors.name}
                style={styles.input}
              />
              
              <ValidatedInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                onValidationChange={(isValid) => handleFieldValidation('email', isValid)}
                fieldName="email"
                formData={formData}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                keyboardType="email-address"
                error={!!errors.email}
                style={styles.input}
              />
              
              <ValidatedInput
                label="Phone"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                onValidationChange={(isValid) => handleFieldValidation('phone', isValid)}
                fieldName="phone"
                formData={formData}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                keyboardType="phone-pad"
                error={!!errors.phone}
                style={styles.input}
              />
              
              <ValidatedInput
                label="Location"
                value={formData.location}
                onChangeText={(text) => handleInputChange('location', text)}
                onValidationChange={(isValid) => handleFieldValidation('location', isValid)}
                fieldName="location"
                formData={formData}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                error={!!errors.location}
                style={styles.input}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Professional Information */}
        <Card style={[styles.card, { backgroundColor: isDark ? Colors.darkGray : Colors.white }]}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
              Professional Information
            </Text>
            
            <View style={styles.inputGroup}>
              <ValidatedInput
                label="Desired Role"
                value={formData.role}
                onChangeText={(text) => handleInputChange('role', text)}
                onValidationChange={(isValid) => handleFieldValidation('role', isValid)}
                fieldName="role"
                formData={formData}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                error={!!errors.role}
                style={styles.input}
              />
              
              <ValidatedInput
                label="Job Type"
                value={formData.jobType}
                onChangeText={(text) => handleInputChange('jobType', text)}
                onValidationChange={(isValid) => handleFieldValidation('jobType', isValid)}
                fieldName="jobType"
                formData={formData}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                placeholder="e.g., Full-time, Part-time, Contract"
                error={!!errors.jobType}
                style={styles.input}
              />
              
              <ValidatedInput
                label="Preferred Location"
                value={formData.preferredLocation}
                onChangeText={(text) => handleInputChange('preferredLocation', text)}
                onValidationChange={(isValid) => handleFieldValidation('preferredLocation', isValid)}
                fieldName="preferredLocation"
                formData={formData}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                error={!!errors.preferredLocation}
                style={styles.input}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Skills Section */}
        <Card style={[styles.card, { backgroundColor: isDark ? Colors.darkGray : Colors.white }]}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
              Skills
            </Text>
            
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  style={[styles.skillChip, { backgroundColor: '#1976D2' }]}
                  textStyle={styles.skillChipText}
                  onClose={() => handleRemoveSkill(skill)}
                  closeIcon={() => <MaterialCommunityIcons name="close" size={16} color="white" />}
                >
                  {skill}
                </Chip>
              ))}
            </View>
            
            <View style={styles.addSkillContainer}>
              <ValidatedInput
                label="Add Skill"
                value={newSkill}
                onChangeText={setNewSkill}
                fieldName="skill"
                formData={{ skills }}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                error={!!errors.skill}
                style={[styles.input, styles.skillInput]}
                onSubmitEditing={handleAddSkill}
              />
              <Button
                mode="contained"
                onPress={handleAddSkill}
                style={styles.addSkillButton}
                buttonColor="#1976D2"
                icon={() => <MaterialCommunityIcons name="plus" size={20} color="white" />}
              >
                Add
              </Button>
            </View>
            {errors.skill && (
              <Text style={styles.errorText}>
                {errors.skill}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={handleCancel}
            style={[styles.actionButton, styles.cancelButton]}
            textColor={isDark ? Colors.white : Colors.textPrimary}
            buttonColor="transparent"
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={[styles.actionButton, styles.saveButton]}
            buttonColor="#1976D2"
          >
            Save Changes
          </Button>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 48, // Compensate for back button width
  },
  headerRight: {
    width: 48,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
  profilePictureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profilePictureContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarPlaceholder: {
    backgroundColor: '#1976D2',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1976D2',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profilePictureInfo: {
    flex: 1,
  },
  profilePictureText: {
    marginBottom: 8,
  },
  uploadButtonText: {
    alignSelf: 'flex-start',
  },
  inputGroup: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#F44336',
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillChip: {
    marginBottom: 8,
  },
  skillChipText: {
    color: 'white',
    fontSize: 12,
  },
  addSkillContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  skillInput: {
    flex: 1,
  },
  addSkillButton: {
    borderRadius: 8,
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
  cancelButton: {
    borderColor: '#B0BEC5',
  },
  saveButton: {
    // Additional styles if needed
  },
});

export default EditProfileScreen;
