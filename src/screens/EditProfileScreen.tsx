import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, Image } from 'react-native';
import { Text, Button, Card, useTheme, TextInput, Chip, IconButton, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

const EditProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, updateProfile } = useApp();
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePictureUpload = () => {
    Alert.alert(
      'Upload Profile Picture',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            // Simulate camera capture
            const mockImageUri = 'https://via.placeholder.com/300x300/1976D2/FFFFFF?text=Profile';
            setProfilePicture(mockImageUri);
            setProfilePictureUploaded(true);
          }
        },
        {
          text: 'Gallery',
          onPress: () => {
            // Simulate gallery selection
            const mockImageUri = 'https://via.placeholder.com/300x300/4CAF50/FFFFFF?text=Profile';
            setProfilePicture(mockImageUri);
            setProfilePictureUploaded(true);
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
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSave = () => {
    // Update profile with new data
    const updatedProfile = {
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

    updateProfile(updatedProfile);
    
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
              <TextInput
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                mode="outlined"
                style={styles.input}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
              />
              
              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                mode="outlined"
                style={styles.input}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                keyboardType="email-address"
              />
              
              <TextInput
                label="Phone"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                mode="outlined"
                style={styles.input}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                keyboardType="phone-pad"
              />
              
              <TextInput
                label="Location"
                value={formData.location}
                onChangeText={(text) => handleInputChange('location', text)}
                mode="outlined"
                style={styles.input}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
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
              <TextInput
                label="Desired Role"
                value={formData.role}
                onChangeText={(text) => handleInputChange('role', text)}
                mode="outlined"
                style={styles.input}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
              />
              
              <TextInput
                label="Job Type"
                value={formData.jobType}
                onChangeText={(text) => handleInputChange('jobType', text)}
                mode="outlined"
                style={styles.input}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
                placeholder="e.g., Full-time, Part-time, Contract"
              />
              
              <TextInput
                label="Preferred Location"
                value={formData.preferredLocation}
                onChangeText={(text) => handleInputChange('preferredLocation', text)}
                mode="outlined"
                style={styles.input}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
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
              <TextInput
                label="Add Skill"
                value={newSkill}
                onChangeText={setNewSkill}
                mode="outlined"
                style={[styles.input, styles.skillInput]}
                textColor={isDark ? Colors.white : Colors.textPrimary}
                outlineColor={isDark ? Colors.gray : Colors.border}
                activeOutlineColor="#1976D2"
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
