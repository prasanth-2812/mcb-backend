import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Button, Card, useTheme, Switch, Divider, Chip, ProgressBar, Avatar } from 'react-native-paper';
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

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { state, updateProfile, toggleTheme, logout } = useApp();
  const isDark = state.theme === 'dark';
  
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');
  
  const contentOpacity = useSharedValue(0);
  const headerScale = useSharedValue(0.8);

  useEffect(() => {
    // Animate content entrance
    contentOpacity.value = withTiming(1, { duration: 600 });
    headerScale.value = withSpring(1, { damping: 15, stiffness: 150 });
  }, []);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const handleEditProfile = () => {
    console.log('Navigate to edit profile');
  };

  const handleResumeUpload = () => {
    setResumeUploaded(true);
    setResumeFileName('John_Doe_Resume.pdf');
    console.log('Resume uploaded');
  };

  const handleAddSkill = () => {
    console.log('Add new skill');
  };

  const handleAccountSettings = () => {
    console.log('Navigate to account settings');
  };

  const handlePrivacySettings = () => {
    console.log('Navigate to privacy settings');
  };

  const handleLogout = () => {
    logout();
  };

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {/* Header with Avatar */}
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <View style={styles.avatarContainer}>
              <Avatar.Icon 
                size={120} 
                icon="account-circle-outline"
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <MaterialCommunityIcons name="account-edit-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text variant="headlineMedium" style={styles.userName}>
              {state.user.personalInfo.firstName} {state.user.personalInfo.lastName}
            </Text>
            <Text variant="bodyLarge" style={styles.userTitle}>
              {state.user.professionalInfo.title}
            </Text>
          </Animated.View>

          {/* Profile Info Card */}
          <Card style={styles.profileInfoCard}>
            <Card.Content style={styles.profileInfoContent}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="email-outline" size={20} color="#1976D2" />
                  <View style={styles.infoText}>
                    <Text variant="bodySmall" style={styles.infoLabel}>Email</Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>{state.user.personalInfo.email}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="phone-outline" size={20} color="#1976D2" />
                  <View style={styles.infoText}>
                    <Text variant="bodySmall" style={styles.infoLabel}>Phone</Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>{state.user.personalInfo.phone}</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Profile Completion */}
          <Card style={styles.completionCard}>
            <Card.Content style={styles.completionContent}>
              <View style={styles.completionHeader}>
                <Text variant="titleMedium" style={styles.completionTitle}>
                  Profile Completion
                </Text>
                <Text variant="bodyMedium" style={styles.completionPercentage}>
                  {Math.round((state.user.profileCompletion || 0.3) * 100)}%
                </Text>
              </View>
              <ProgressBar 
                progress={state.user.profileCompletion || 0.3} 
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
                Complete your profile
              </Button>
            </Card.Content>
          </Card>

          {/* Resume Section */}
          <Card style={styles.resumeCard}>
            <Card.Content style={styles.resumeContent}>
              <View style={styles.resumeHeader}>
                <Text variant="titleMedium" style={styles.resumeTitle}>
                  Resume
                </Text>
                <MaterialCommunityIcons name="file-document-outline" size={24} color="#1976D2" />
              </View>
              
              {resumeUploaded ? (
                <View style={styles.resumeUploaded}>
                  <View style={styles.resumeFile}>
                    <MaterialCommunityIcons name="file-document-outline" size={24} color="#1976D2" />
                    <Text variant="bodyMedium" style={styles.resumeFileName}>{resumeFileName}</Text>
                  </View>
                  <Button
                    mode="text"
                    onPress={() => setResumeUploaded(false)}
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
          <Card style={styles.skillsCard}>
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
                {state.user.professionalInfo.skills.map((skill, index) => (
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

          {/* Settings Section */}
          <Card style={styles.settingsCard}>
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
        </Animated.View>
      </ScrollView>
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
  resumeFileName: {
    marginLeft: 8,
    color: '#1A1A1A',
    flex: 1,
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
});

export default ProfileScreen;
