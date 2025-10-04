import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Button, Card, useTheme, Switch, Divider, Chip, ProgressBar, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { FileUploadService } from '../services/fileUploadService';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, updateProfile, toggleTheme, logout } = useApp();
  const isDark = state.theme === 'dark';
  
  const [resumeUploaded, setResumeUploaded] = useState(state.user?.resume?.uploaded || false);
  const [resumeFileName, setResumeFileName] = useState(state.user?.resume?.fileName || '');
  const [profilePicture, setProfilePicture] = useState(state.user?.profilePicture?.uri || '');
  const [profilePictureUploaded, setProfilePictureUploaded] = useState(state.user?.profilePicture?.uploaded || false);
  

  useEffect(() => {
    // Debug: Log current user data
    console.log('📱 ProfileScreen - Current user data:', {
      name: state.user?.name,
      email: state.user?.email,
      phone: state.user?.phone,
      location: state.user?.location,
      skills: state.user?.skills,
      preferences: state.user?.preferences
    });
    
    // Sync resume and profile picture state with user data
    if (state.user?.resume) {
      setResumeUploaded(state.user.resume.uploaded);
      setResumeFileName(state.user.resume.fileName);
    }
    if (state.user?.profilePicture) {
      setProfilePicture(state.user.profilePicture.uri);
      setProfilePictureUploaded(state.user.profilePicture.uploaded);
    }
  }, [state.user]);


  const handleEditProfile = () => {
    (navigation as any).navigate('EditProfile');
  };

  const handleResumeBuilder = () => {
    (navigation as any).navigate('ResumeBuilder');
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
                  
                  // Update local state
                  if (state.user) {
                    const updatedUser = {
                      ...state.user,
                      profilePicture: {
                        uri: uploadResult.uri,
                        uploaded: true
                      }
                    };
                    (state as any).dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
                  }
                  
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
                  
                  // Update local state
                  if (state.user) {
                    const updatedUser = {
                      ...state.user,
                      profilePicture: {
                        uri: uploadResult.uri,
                        uploaded: true
                      }
                    };
                    (state as any).dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
                  }
                  
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

  const handleAccountSettings = () => {
    // Navigate to account settings
    console.log('Navigate to account settings');
  };

  const handlePrivacySettings = () => {
    // Navigate to privacy settings
    console.log('Navigate to privacy settings');
  };

  const handleResumeUpload = async () => {
    try {
      const result = await FileUploadService.pickDocument();
      if (result.success && result.uri) {
        // Validate file
        const validation = FileUploadService.validateFile(
          result.fileSize || 0, 
          result.mimeType || 'application/pdf', 
          10 // 10MB max for documents
        );
        
        if (!validation.valid) {
          Alert.alert('Invalid File', validation.error);
          return;
        }

        // Upload to server
        const uploadResult = await FileUploadService.uploadFile(
          result.uri,
          result.fileName || 'resume.pdf',
          result.mimeType || 'application/pdf',
          'resume'
        );

        if (uploadResult.success && uploadResult.uri) {
          setResumeUploaded(true);
          setResumeFileName(uploadResult.fileName || result.fileName || 'resume.pdf');
          
          // Update local state
          if (state.user) {
            const updatedUser = {
              ...state.user,
              resume: {
                fileName: uploadResult.fileName || result.fileName || 'resume.pdf',
                uploaded: true
              }
            };
            (state as any).dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
          }
          
          Alert.alert('Success', 'Resume uploaded successfully!');
        } else {
          Alert.alert('Upload Failed', uploadResult.error || 'Failed to upload resume');
        }
      } else {
        Alert.alert('Error', result.error || 'Failed to select document');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      Alert.alert('Error', 'Failed to upload resume');
    }
  };

  const handleAddSkill = () => {
    // Navigate to edit profile screen where skills can be managed
    (navigation as any).navigate('EditProfile');
  };

  const handleLogout = () => {
    logout();
  };

  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="loading" size={48} color="#B0BEC5" />
          <Text variant="headlineSmall" style={styles.errorText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!state.user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="account-alert" size={48} color="#B0BEC5" />
          <Text variant="headlineSmall" style={styles.errorText}>No user data found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F9F9F9' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#121212' : '#F9F9F9'} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header with Avatar */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {profilePictureUploaded && profilePicture ? (
                <View style={styles.profileImageContainer}>
                  <Image 
                    source={{ uri: profilePicture }} 
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={handleProfilePictureUpload}
                  >
                    <MaterialCommunityIcons name="camera-outline" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Avatar.Icon 
                    size={120} 
                    icon="account-circle-outline"
                    style={styles.avatar}
                  />
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={handleProfilePictureUpload}
                  >
                    <MaterialCommunityIcons name="camera-outline" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Text variant="headlineMedium" style={[styles.userName, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              {state.user?.name || 'User Name'}
            </Text>
            <Text variant="bodyLarge" style={[styles.userTitle, { color: isDark ? '#B0B0B0' : '#666666' }]}>
              {state.user?.preferences?.role || 'Job Title'}
            </Text>
            
            {/* Edit Profile Button */}
            <Button
              mode="outlined"
              onPress={handleEditProfile}
              style={styles.editProfileButton}
              textColor="#1976D2"
              icon={() => <MaterialCommunityIcons name="account-edit-outline" size={20} color="#1976D2" />}
            >
              Edit Profile
            </Button>
          </View>

          {/* Profile Info Card */}
          <Card style={[styles.profileInfoCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Card.Content style={styles.profileInfoContent}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="email-outline" size={20} color="#1976D2" />
                  <View style={styles.infoText}>
                    <Text variant="bodySmall" style={styles.infoLabel}>Email</Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>{state.user?.email || 'No email provided'}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="phone-outline" size={20} color="#1976D2" />
                  <View style={styles.infoText}>
                    <Text variant="bodySmall" style={styles.infoLabel}>Phone</Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>{state.user?.phone || 'No phone provided'}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="map-marker-outline" size={20} color="#1976D2" />
                  <View style={styles.infoText}>
                    <Text variant="bodySmall" style={styles.infoLabel}>Location</Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>{state.user?.location || 'No location provided'}</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Profile Completion */}
          <Card style={[styles.completionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Card.Content style={styles.completionContent}>
              <View style={styles.completionHeader}>
                <Text variant="titleMedium" style={styles.completionTitle}>
                  Profile Completion
                </Text>
                <Text variant="bodyMedium" style={styles.completionPercentage}>
                  {state.user?.profileCompletion || 0}%
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.completionText}>
                Your profile is {state.user?.profileCompletion || 0}% complete
              </Text>
              <ProgressBar 
                progress={(state.user?.profileCompletion || 0) / 100} 
                color="#1976D2"
                style={styles.progressBar}
              />
              <Button 
                mode="outlined" 
                onPress={handleEditProfile}
                style={styles.completeButton}
                textColor="#1976D2"
                icon={() => <MaterialCommunityIcons name="account-check-outline" size={20} color="#1976D2" />}
              >
                Complete Profile
              </Button>
            </Card.Content>
          </Card>

          {/* Resume Section */}
          <Card style={[styles.resumeCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Card.Content style={styles.resumeContent}>
              <View style={styles.resumeHeader}>
                <Text variant="titleMedium" style={styles.resumeTitle}>
                  Resume
                </Text>
                <MaterialCommunityIcons name="file-document-outline" size={24} color="#1976D2" />
              </View>
              
              {state.user?.resume?.uploaded ? (
                <View style={styles.resumeUploaded}>
                  <View style={styles.resumeFile}>
                    <MaterialCommunityIcons name="file-document-outline" size={24} color="#1976D2" />
                    <View style={styles.resumeFileInfo}>
                      <Text variant="bodyMedium" style={styles.resumeFileName}>{state.user.resume.fileName}</Text>
                      <Text variant="bodySmall" style={styles.resumeDate}>
                        Last updated: {new Date().toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Text>
                    </View>
                  </View>
                  <Button
                    mode="text"
                    onPress={() => {
                      setResumeUploaded(false);
                      setResumeFileName('');
                      if (state.user) {
                        const updatedUser = {
                          ...state.user,
                          resume: { fileName: "", uploaded: false }
                        };
                        // Update local state directly
                        (state as any).dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
                      }
                    }}
                    textColor="#1976D2"
                  >
                    Replace
                  </Button>
                </View>
              ) : (
                <Button
                  mode="outlined"
                  onPress={handleResumeUpload}
                  style={styles.uploadButton}
                  textColor="#1976D2"
                  icon={() => <MaterialCommunityIcons name="file-upload-outline" size={20} color="#1976D2" />}
                >
                  Upload Resume
                </Button>
              )}
            </Card.Content>
          </Card>

          {/* Skills Section */}
          <Card style={[styles.skillsCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Card.Content style={styles.skillsContent}>
              <View style={styles.skillsHeader}>
                <Text variant="titleMedium" style={styles.skillsTitle}>
                  Skills
                </Text>
                <TouchableOpacity onPress={handleAddSkill} style={styles.addSkillButton}>
                  <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#1976D2" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.skillsContainer}>
                {(state.user?.skills || []).map((skill, index) => (
                  <Chip 
                    key={index}
                    style={styles.skillChip}
                    textStyle={styles.skillChipText}
                    icon={() => <MaterialCommunityIcons name="star-outline" size={16} color="#1976D2" />}
                  >
                    {skill}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Career Preferences Section */}
          <Card style={[styles.preferencesCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Card.Content style={styles.preferencesContent}>
              <Text variant="titleMedium" style={styles.preferencesTitle}>
                Career Preferences
              </Text>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <MaterialCommunityIcons name="briefcase-outline" size={24} color="#1976D2" />
                  <View style={styles.preferenceText}>
                    <Text variant="bodySmall" style={styles.preferenceLabel}>Desired Role</Text>
                    <Text variant="bodyMedium" style={styles.preferenceValue}>
                      {state.user?.preferences?.role || 'Not specified'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <MaterialCommunityIcons name="map-marker-outline" size={24} color="#1976D2" />
                  <View style={styles.preferenceText}>
                    <Text variant="bodySmall" style={styles.preferenceLabel}>Preferred Location</Text>
                    <Text variant="bodyMedium" style={styles.preferenceValue}>
                      {state.user?.preferences?.location || 'Not specified'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <MaterialCommunityIcons name="clock-outline" size={24} color="#1976D2" />
                  <View style={styles.preferenceText}>
                    <Text variant="bodySmall" style={styles.preferenceLabel}>Job Type</Text>
                    <Text variant="bodyMedium" style={styles.preferenceValue}>
                      {state.user?.preferences?.type || 'Not specified'}
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Settings Section */}
          <Card style={[styles.settingsCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Card.Content style={styles.settingsContent}>
              <Text variant="titleMedium" style={styles.settingsTitle}>
                Settings
              </Text>
              
              <TouchableOpacity style={styles.settingItem} onPress={handleAccountSettings}>
                <View style={styles.settingLeft}>
                  <MaterialCommunityIcons name="cog-outline" size={24} color="#1976D2" />
                  <Text variant="bodyLarge" style={styles.settingLabel}>Account Settings</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#B0BEC5" />
              </TouchableOpacity>

              <Divider style={styles.divider} />

              <TouchableOpacity style={styles.settingItem} onPress={handlePrivacySettings}>
                <View style={styles.settingLeft}>
                  <MaterialCommunityIcons name="shield-outline" size={24} color="#1976D2" />
                  <Text variant="bodyLarge" style={styles.settingLabel}>Privacy</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#B0BEC5" />
              </TouchableOpacity>

              <Divider style={styles.divider} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <MaterialCommunityIcons name="theme-light-dark" size={24} color="#1976D2" />
                  <Text variant="bodyLarge" style={styles.settingLabel}>Dark Mode</Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  color="#1976D2"
                />
              </View>

              <Divider style={styles.divider} />

              <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
                <View style={styles.settingLeft}>
                  <MaterialCommunityIcons name="logout" size={24} color="#D32F2F" />
                  <Text variant="bodyLarge" style={[styles.settingLabel, styles.logoutText]}>Logout</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#B0BEC5" />
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
      
      {/* Floating Edit Button */}
      <TouchableOpacity 
        style={styles.floatingEditButton}
        onPress={handleEditProfile}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="pencil" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarPlaceholder: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#1976D2',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1976D2',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userName: {
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  userTitle: {
    color: '#666666',
    textAlign: 'center',
  },
  editProfileButton: {
    marginTop: 16,
    borderRadius: 8,
    borderColor: '#1976D2',
    borderWidth: 1.5,
  },
  profileInfoCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfoContent: {
    padding: 20,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    color: '#666666',
    marginBottom: 2,
  },
  infoValue: {
    color: '#1A1A1A',
    fontWeight: '500',
  },
  completionCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completionContent: {
    padding: 20,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionTitle: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  completionPercentage: {
    color: '#1976D2',
    fontWeight: '600',
  },
  completionText: {
    color: '#666666',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  completeButton: {
    borderColor: '#1976D2',
  },
  resumeCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resumeContent: {
    padding: 20,
  },
  resumeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resumeTitle: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  resumeUploaded: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resumeFile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resumeFileInfo: {
    marginLeft: 8,
    flex: 1,
  },
  resumeFileName: {
    color: '#1A1A1A',
    fontWeight: '500',
  },
  resumeDate: {
    color: '#666666',
    marginTop: 2,
  },
  uploadButton: {
    borderColor: '#1976D2',
  },
  skillsCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  skillsContent: {
    padding: 20,
  },
  skillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  skillsTitle: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  addSkillButton: {
    padding: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#E3F2FD',
    marginRight: 8,
    marginBottom: 8,
  },
  skillChipText: {
    color: '#1976D2',
    fontWeight: '500',
  },
  preferencesCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  preferencesContent: {
    padding: 20,
  },
  preferencesTitle: {
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 16,
  },
  preferenceItem: {
    marginBottom: 16,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    marginLeft: 12,
    flex: 1,
  },
  preferenceLabel: {
    color: '#666666',
    marginBottom: 2,
  },
  preferenceValue: {
    color: '#1A1A1A',
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingsContent: {
    padding: 20,
  },
  settingsTitle: {
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    color: '#1A1A1A',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutText: {
    color: '#D32F2F',
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginVertical: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
  },
  floatingEditButton: {
    position: 'absolute',
    bottom: 34, // Extra padding for mobile navigation
    right: 20,
    backgroundColor: '#1976D2',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default ProfileScreen;
