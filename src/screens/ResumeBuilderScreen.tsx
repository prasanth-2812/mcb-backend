import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, Share } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  TextInput, 
  useTheme, 
  ProgressBar, 
  Chip,
  IconButton,
  Divider,
  Switch,
  Menu,
  Portal,
  Modal,
  Surface
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  FadeIn,
  SlideInRight,
  SlideInLeft
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { UserProfile } from '../types';

// Resume Builder Data Types
interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  professionalSummary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
    achievements: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: Array<{
      language: string;
      proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
    }>;
  };
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate: string;
    endDate: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
}

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
}

const ResumeBuilderScreen: React.FC = () => {
  const theme = useTheme();
  const { state, updateProfile } = useApp();
  const isDark = state.theme === 'dark';
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-1');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Resume data state
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: state.user?.personalInfo?.firstName || '',
      lastName: state.user?.personalInfo?.lastName || '',
      email: state.user?.personalInfo?.email || '',
      phone: state.user?.personalInfo?.phone || '',
      location: state.user?.personalInfo?.location || '',
      website: '',
      linkedin: '',
      github: ''
    },
    professionalSummary: '',
    experience: [],
    education: [],
    skills: {
      technical: state.user?.professionalInfo?.skills || [],
      soft: [],
      languages: state.user?.professionalInfo?.languages || []
    },
    projects: [],
    certifications: []
  });

  // Animation values
  const contentOpacity = useSharedValue(0);
  const slideOffset = useSharedValue(0);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 600 });
    slideOffset.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateX: slideOffset.value }]
  }));

  // Resume templates
  const templates: ResumeTemplate[] = [
    {
      id: 'modern-1',
      name: 'Modern Professional',
      description: 'Clean, ATS-friendly design with modern typography and optimal spacing for maximum readability',
      preview: 'M',
      category: 'modern'
    },
    {
      id: 'classic-1',
      name: 'Classic Corporate',
      description: 'Traditional format perfect for corporate roles with structured layout and professional appearance',
      preview: 'C',
      category: 'classic'
    },
    {
      id: 'creative-1',
      name: 'Creative Portfolio',
      description: 'Eye-catching design for creative professionals with visual elements and unique styling',
      preview: 'C',
      category: 'creative'
    },
    {
      id: 'minimal-1',
      name: 'Minimal Clean',
      description: 'Simple, elegant design focusing on content with clean lines and professional simplicity',
      preview: 'M',
      category: 'minimal'
    }
  ];

  const totalSteps = 6;
  const getProgress = () => currentStep / totalSteps;

  // Helper functions
  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
    updateResumeData('experience', [...resumeData.experience, newExperience]);
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      achievements: []
    };
    updateResumeData('education', [...resumeData.education, newEducation]);
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: ''
    };
    updateResumeData('projects', [...resumeData.projects, newProject]);
  };

  const addCertification = () => {
    const newCertification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: ''
    };
    updateResumeData('certifications', [...resumeData.certifications, newCertification]);
  };

  const removeItem = (section: keyof ResumeData, id: string) => {
    const currentData = resumeData[section] as any[];
    updateResumeData(section, currentData.filter(item => item.id !== id));
  };

  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      // Simulate saving resume
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user profile with resume data
      updateProfile({
        resume: {
          fileName: `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`,
          uploaded: true
        }
      });
      
      Alert.alert('Success', 'Resume saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportResume = async () => {
    try {
      await Share.share({
        message: 'Check out my resume!',
        url: 'https://example.com/resume.pdf' // In real app, this would be the actual file
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share resume.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View entering={FadeIn.duration(600)}>
            <Card elevation={4} style={[styles.stepCard, { backgroundColor: isDark ? DarkColors.surface : Colors.white }]}>
              <Card.Content style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepIconContainer}>
                    <Text style={[styles.stepIcon, { color: Colors.primary }]}>📄</Text>
                  </View>
                  <View style={styles.stepHeaderText}>
                    <Text variant="headlineSmall" style={[styles.stepTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                      Choose Your Template
                    </Text>
                    <Text variant="bodyLarge" style={[styles.stepDescription, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                      Select a professional template that best represents your career
                    </Text>
                  </View>
                </View>
                
                <View style={styles.templateList}>
                  {templates.map((template, index) => (
                    <TouchableOpacity
                      key={template.id}
                      style={[
                        styles.templateListItem,
                        selectedTemplate === template.id && styles.selectedTemplateItem,
                        { 
                          backgroundColor: isDark ? DarkColors.surface : Colors.white,
                          borderColor: selectedTemplate === template.id ? Colors.primary : isDark ? Colors.gray : Colors.lightGray
                        }
                      ]}
                      onPress={() => setSelectedTemplate(template.id)}
                    >
                      <View style={styles.templateItemLeft}>
                        <View style={[styles.templatePreview, { 
                          backgroundColor: selectedTemplate === template.id ? Colors.primary : Colors.lightGray 
                        }]}>
                          <Text style={[styles.templatePreviewText, { 
                            color: selectedTemplate === template.id ? Colors.white : Colors.textSecondary 
                          }]}>
                            {template.preview}
                          </Text>
                        </View>
                        <View style={styles.templateItemInfo}>
                          <Text variant="titleMedium" style={[styles.templateItemName, { 
                            color: isDark ? Colors.white : Colors.textPrimary 
                          }]}>
                            {template.name}
                          </Text>
                          <Text variant="bodyMedium" style={[styles.templateItemDescription, { 
                            color: isDark ? Colors.gray : Colors.textSecondary 
                          }]}>
                            {template.description}
                          </Text>
                          <View style={styles.templateItemMeta}>
                            <View style={[styles.templateCategory, { 
                              backgroundColor: selectedTemplate === template.id ? Colors.primary : Colors.lightGray 
                            }]}>
                              <Text style={[styles.templateCategoryText, { 
                                color: selectedTemplate === template.id ? Colors.white : Colors.textSecondary 
                              }]}>
                                {template.category.toUpperCase()}
                              </Text>
                            </View>
                            <Text variant="bodySmall" style={[styles.templateItemFeatures, { 
                              color: isDark ? Colors.gray : Colors.textSecondary 
                            }]}>
                              ATS-Friendly • Professional
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.templateItemRight}>
                        {selectedTemplate === template.id ? (
                          <View style={styles.selectedIndicator}>
                            <Text style={styles.selectedCheckmark}>✓</Text>
                          </View>
                        ) : (
                          <View style={styles.unselectedIndicator}>
                            <Text style={styles.unselectedCircle}>○</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View entering={SlideInRight.duration(600)}>
            <Card elevation={4} style={[styles.stepCard, { backgroundColor: isDark ? DarkColors.surface : Colors.white }]}>
              <Card.Content style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepIconContainer}>
                    <Text style={[styles.stepIcon, { color: Colors.primary }]}>👤</Text>
                  </View>
                  <View style={styles.stepHeaderText}>
                    <Text variant="headlineSmall" style={[styles.stepTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                      Personal Information
                    </Text>
                    <Text variant="bodyLarge" style={[styles.stepDescription, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                      Provide your basic information and professional summary
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sectionContainer}>
                  <Text variant="titleMedium" style={[styles.sectionLabel, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    Basic Information
                  </Text>
                  
                  <View style={styles.formRow}>
                    <View style={styles.halfInputContainer}>
                      <TextInput
                        label="First Name *"
                        value={resumeData.personalInfo.firstName}
                        onChangeText={(text) => updateResumeData('personalInfo', { ...resumeData.personalInfo, firstName: text })}
                        style={styles.halfInput}
                        mode="outlined"
                        left={<TextInput.Icon icon="account" />}
                      />
                    </View>
                    <View style={styles.halfInputContainer}>
                      <TextInput
                        label="Last Name *"
                        value={resumeData.personalInfo.lastName}
                        onChangeText={(text) => updateResumeData('personalInfo', { ...resumeData.personalInfo, lastName: text })}
                        style={styles.halfInput}
                        mode="outlined"
                        left={<TextInput.Icon icon="account" />}
                      />
                    </View>
                  </View>
                  
                  <TextInput
                    label="Email Address *"
                    value={resumeData.personalInfo.email}
                    onChangeText={(text) => updateResumeData('personalInfo', { ...resumeData.personalInfo, email: text })}
                    style={styles.fullInput}
                    mode="outlined"
                    keyboardType="email-address"
                    left={<TextInput.Icon icon="email" />}
                  />
                  
                  <View style={styles.formRow}>
                    <View style={styles.halfInputContainer}>
                      <TextInput
                        label="Phone Number *"
                        value={resumeData.personalInfo.phone}
                        onChangeText={(text) => updateResumeData('personalInfo', { ...resumeData.personalInfo, phone: text })}
                        style={styles.halfInput}
                        mode="outlined"
                        keyboardType="phone-pad"
                        left={<TextInput.Icon icon="phone" />}
                      />
                    </View>
                    <View style={styles.halfInputContainer}>
                      <TextInput
                        label="Location *"
                        value={resumeData.personalInfo.location}
                        onChangeText={(text) => updateResumeData('personalInfo', { ...resumeData.personalInfo, location: text })}
                        style={styles.halfInput}
                        mode="outlined"
                        left={<TextInput.Icon icon="map-marker" />}
                      />
                    </View>
                  </View>
                </View>
                
                <View style={styles.sectionContainer}>
                  <Text variant="titleMedium" style={[styles.sectionLabel, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    Professional Summary
                  </Text>
                  <Text variant="bodySmall" style={[styles.fieldHint, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                    Write a compelling 2-3 sentence summary highlighting your key strengths and career objectives
                  </Text>
                  <TextInput
                    label="Professional Summary"
                    value={resumeData.professionalSummary}
                    onChangeText={(text) => updateResumeData('professionalSummary', text)}
                    style={styles.fullInput}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    placeholder="e.g., Experienced software engineer with 5+ years developing scalable web applications..."
                    left={<TextInput.Icon icon="text" />}
                  />
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View entering={SlideInRight.duration(600)}>
            <Card elevation={4} style={[styles.stepCard, { backgroundColor: isDark ? DarkColors.surface : Colors.white }]}>
              <Card.Content style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepIconContainer}>
                    <Text style={[styles.stepIcon, { color: Colors.primary }]}>💼</Text>
                  </View>
                  <View style={styles.stepHeaderText}>
                    <Text variant="headlineSmall" style={[styles.stepTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                      Work Experience
                    </Text>
                    <Text variant="bodyLarge" style={[styles.stepDescription, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                      Add your professional work experience in chronological order
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sectionHeader}>
                  <Text variant="titleMedium" style={[styles.sectionLabel, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    Professional Experience
                  </Text>
                  <Button 
                    mode="contained" 
                    onPress={addExperience} 
                    icon="plus"
                    style={styles.addButton}
                    buttonColor={Colors.primary}
                    contentStyle={styles.addButtonContent}
                  >
                    Add Experience
                  </Button>
                </View>
                
                {resumeData.experience.map((exp, index) => (
                  <Card key={exp.id} elevation={2} style={[styles.itemCard, { backgroundColor: isDark ? DarkColors.background : Colors.white }]}>
                    <Card.Content>
                      <View style={styles.itemHeader}>
                        <View style={styles.itemHeaderLeft}>
                          <View style={[styles.itemNumber, { backgroundColor: Colors.primary }]}>
                            <Text style={styles.itemNumberText}>{index + 1}</Text>
                          </View>
                          <Text variant="titleMedium" style={[styles.itemTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                            Experience #{index + 1}
                          </Text>
                        </View>
                        <IconButton
                          icon="delete"
                          size={20}
                          iconColor={Colors.error}
                          onPress={() => removeItem('experience', exp.id)}
                        />
                      </View>
                      
                      <TextInput
                        label="Job Title *"
                        value={exp.title}
                        onChangeText={(text) => {
                          const updated = resumeData.experience.map(e => e.id === exp.id ? { ...e, title: text } : e);
                          updateResumeData('experience', updated);
                        }}
                        style={styles.fullInput}
                        mode="outlined"
                        left={<TextInput.Icon icon="briefcase" />}
                      />
                      
                      <View style={styles.formRow}>
                        <View style={styles.halfInputContainer}>
                          <TextInput
                            label="Company *"
                            value={exp.company}
                            onChangeText={(text) => {
                              const updated = resumeData.experience.map(e => e.id === exp.id ? { ...e, company: text } : e);
                              updateResumeData('experience', updated);
                            }}
                            style={styles.halfInput}
                            mode="outlined"
                            left={<TextInput.Icon icon="office-building" />}
                          />
                        </View>
                        <View style={styles.halfInputContainer}>
                          <TextInput
                            label="Location"
                            value={exp.location}
                            onChangeText={(text) => {
                              const updated = resumeData.experience.map(e => e.id === exp.id ? { ...e, location: text } : e);
                              updateResumeData('experience', updated);
                            }}
                            style={styles.halfInput}
                            mode="outlined"
                            left={<TextInput.Icon icon="map-marker" />}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.formRow}>
                        <View style={styles.halfInputContainer}>
                          <TextInput
                            label="Start Date *"
                            value={exp.startDate}
                            onChangeText={(text) => {
                              const updated = resumeData.experience.map(e => e.id === exp.id ? { ...e, startDate: text } : e);
                              updateResumeData('experience', updated);
                            }}
                            style={styles.halfInput}
                            mode="outlined"
                            placeholder="MM/YYYY"
                            left={<TextInput.Icon icon="calendar" />}
                          />
                        </View>
                        <View style={styles.halfInputContainer}>
                          <TextInput
                            label="End Date"
                            value={exp.endDate}
                            onChangeText={(text) => {
                              const updated = resumeData.experience.map(e => e.id === exp.id ? { ...e, endDate: text } : e);
                              updateResumeData('experience', updated);
                            }}
                            style={styles.halfInput}
                            mode="outlined"
                            placeholder="MM/YYYY"
                            left={<TextInput.Icon icon="calendar" />}
                            disabled={exp.current}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.switchRow}>
                        <View style={styles.switchLabel}>
                          <Text variant="bodyMedium" style={[styles.switchText, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                            Currently working here
                          </Text>
                          <Text variant="bodySmall" style={[styles.switchHint, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                            Check if this is your current position
                          </Text>
                        </View>
                        <Switch
                          value={exp.current}
                          onValueChange={(value) => {
                            const updated = resumeData.experience.map(e => e.id === exp.id ? { ...e, current: value } : e);
                            updateResumeData('experience', updated);
                          }}
                          color={Colors.primary}
                        />
                      </View>
                      
                      <TextInput
                        label="Job Description & Achievements"
                        value={exp.description}
                        onChangeText={(text) => {
                          const updated = resumeData.experience.map(e => e.id === exp.id ? { ...e, description: text } : e);
                          updateResumeData('experience', updated);
                        }}
                        style={styles.fullInput}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        placeholder="Describe your key responsibilities and achievements in this role..."
                        left={<TextInput.Icon icon="text" />}
                      />
                    </Card.Content>
                  </Card>
                ))}
              </Card.Content>
            </Card>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View entering={SlideInRight.duration(600)}>
            <Card elevation={4} style={[styles.stepCard, { backgroundColor: isDark ? DarkColors.surface : Colors.white }]}>
              <Card.Content style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepIconContainer}>
                    <Text style={[styles.stepIcon, { color: Colors.primary }]}>🎓</Text>
                  </View>
                  <View style={styles.stepHeaderText}>
                    <Text variant="headlineSmall" style={[styles.stepTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                      Education
                    </Text>
                    <Text variant="bodyLarge" style={[styles.stepDescription, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                      Add your educational background and qualifications
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sectionHeader}>
                  <Text variant="titleMedium" style={[styles.sectionLabel, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    Educational Background
                  </Text>
                  <Button 
                    mode="contained" 
                    onPress={addEducation} 
                    icon="plus"
                    style={styles.addButton}
                    buttonColor={Colors.primary}
                    contentStyle={styles.addButtonContent}
                  >
                    Add Education
                  </Button>
                </View>
                
                {resumeData.education.map((edu, index) => (
                  <Card key={edu.id} elevation={2} style={[styles.itemCard, { backgroundColor: isDark ? DarkColors.background : Colors.white }]}>
                    <Card.Content>
                      <View style={styles.itemHeader}>
                        <View style={styles.itemHeaderLeft}>
                          <View style={[styles.itemNumber, { backgroundColor: Colors.primary }]}>
                            <Text style={styles.itemNumberText}>{index + 1}</Text>
                          </View>
                          <Text variant="titleMedium" style={[styles.itemTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                            Education #{index + 1}
                          </Text>
                        </View>
                        <IconButton
                          icon="delete"
                          size={20}
                          iconColor={Colors.error}
                          onPress={() => removeItem('education', edu.id)}
                        />
                      </View>
                      
                      <TextInput
                        label="Degree/Qualification *"
                        value={edu.degree}
                        onChangeText={(text) => {
                          const updated = resumeData.education.map(e => e.id === edu.id ? { ...e, degree: text } : e);
                          updateResumeData('education', updated);
                        }}
                        style={styles.fullInput}
                        mode="outlined"
                        left={<TextInput.Icon icon="school" />}
                      />
                      
                      <View style={styles.formRow}>
                        <View style={styles.halfInputContainer}>
                          <TextInput
                            label="Institution *"
                            value={edu.school}
                            onChangeText={(text) => {
                              const updated = resumeData.education.map(e => e.id === edu.id ? { ...e, school: text } : e);
                              updateResumeData('education', updated);
                            }}
                            style={styles.halfInput}
                            mode="outlined"
                            left={<TextInput.Icon icon="office-building" />}
                          />
                        </View>
                        <View style={styles.halfInputContainer}>
                          <TextInput
                            label="Location"
                            value={edu.location}
                            onChangeText={(text) => {
                              const updated = resumeData.education.map(e => e.id === edu.id ? { ...e, location: text } : e);
                              updateResumeData('education', updated);
                            }}
                            style={styles.halfInput}
                            mode="outlined"
                            left={<TextInput.Icon icon="map-marker" />}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.formRow}>
                        <View style={styles.halfInputContainer}>
                          <TextInput
                            label="Start Date"
                            value={edu.startDate}
                            onChangeText={(text) => {
                              const updated = resumeData.education.map(e => e.id === edu.id ? { ...e, startDate: text } : e);
                              updateResumeData('education', updated);
                            }}
                            style={styles.halfInput}
                            mode="outlined"
                            placeholder="MM/YYYY"
                            left={<TextInput.Icon icon="calendar" />}
                          />
                        </View>
                        <View style={styles.halfInputContainer}>
                          <TextInput
                            label="End Date"
                            value={edu.endDate}
                            onChangeText={(text) => {
                              const updated = resumeData.education.map(e => e.id === edu.id ? { ...e, endDate: text } : e);
                              updateResumeData('education', updated);
                            }}
                            style={styles.halfInput}
                            mode="outlined"
                            placeholder="MM/YYYY"
                            left={<TextInput.Icon icon="calendar" />}
                            disabled={edu.current}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.switchRow}>
                        <View style={styles.switchLabel}>
                          <Text variant="bodyMedium" style={[styles.switchText, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                            Currently studying
                          </Text>
                          <Text variant="bodySmall" style={[styles.switchHint, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                            Check if you're currently enrolled
                          </Text>
                        </View>
                        <Switch
                          value={edu.current}
                          onValueChange={(value) => {
                            const updated = resumeData.education.map(e => e.id === edu.id ? { ...e, current: value } : e);
                            updateResumeData('education', updated);
                          }}
                          color={Colors.primary}
                        />
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Content>
            </Card>
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View entering={SlideInRight.duration(600)}>
            <Card elevation={4} style={[styles.stepCard, { backgroundColor: isDark ? DarkColors.surface : Colors.white }]}>
              <Card.Content style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepIconContainer}>
                    <Text style={[styles.stepIcon, { color: Colors.primary }]}>⚡</Text>
                  </View>
                  <View style={styles.stepHeaderText}>
                    <Text variant="headlineSmall" style={[styles.stepTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                      Skills & Languages
                    </Text>
                    <Text variant="bodyLarge" style={[styles.stepDescription, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                      Highlight your technical and soft skills to stand out
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sectionContainer}>
                  <Text variant="titleMedium" style={[styles.sectionLabel, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    Technical Skills
                  </Text>
                  <Text variant="bodySmall" style={[styles.fieldHint, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                    Add programming languages, tools, frameworks, and technologies you're proficient with
                  </Text>
                  <View style={styles.skillsContainer}>
                    {resumeData.skills.technical.map((skill, index) => (
                      <Chip
                        key={index}
                        onClose={() => {
                          const updated = resumeData.skills.technical.filter((_, i) => i !== index);
                          updateResumeData('skills', { ...resumeData.skills, technical: updated });
                        }}
                        style={[styles.skillChip, { backgroundColor: Colors.primary }]}
                        textStyle={styles.skillChipText}
                        icon="close"
                      >
                        {skill}
                      </Chip>
                    ))}
                    <TextInput
                      label="Add technical skill"
                      style={styles.skillInput}
                      mode="outlined"
                      left={<TextInput.Icon icon="code-tags" />}
                      onSubmitEditing={(e) => {
                        if (e.nativeEvent.text.trim()) {
                          updateResumeData('skills', {
                            ...resumeData.skills,
                            technical: [...resumeData.skills.technical, e.nativeEvent.text.trim()]
                          });
                          e.currentTarget.clear();
                        }
                      }}
                    />
                  </View>
                </View>
                
                <View style={styles.sectionContainer}>
                  <Text variant="titleMedium" style={[styles.sectionLabel, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    Soft Skills
                  </Text>
                  <Text variant="bodySmall" style={[styles.fieldHint, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                    Include interpersonal skills, leadership qualities, and personal attributes
                  </Text>
                  <View style={styles.skillsContainer}>
                    {resumeData.skills.soft.map((skill, index) => (
                      <Chip
                        key={index}
                        onClose={() => {
                          const updated = resumeData.skills.soft.filter((_, i) => i !== index);
                          updateResumeData('skills', { ...resumeData.skills, soft: updated });
                        }}
                        style={[styles.skillChip, { backgroundColor: Colors.secondary }]}
                        textStyle={styles.skillChipText}
                        icon="close"
                      >
                        {skill}
                      </Chip>
                    ))}
                    <TextInput
                      label="Add soft skill"
                      style={styles.skillInput}
                      mode="outlined"
                      left={<TextInput.Icon icon="account-heart" />}
                      onSubmitEditing={(e) => {
                        if (e.nativeEvent.text.trim()) {
                          updateResumeData('skills', {
                            ...resumeData.skills,
                            soft: [...resumeData.skills.soft, e.nativeEvent.text.trim()]
                          });
                          e.currentTarget.clear();
                        }
                      }}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        );

      case 6:
        return (
          <Animated.View entering={SlideInRight.duration(600)}>
            <Card elevation={4} style={[styles.stepCard, { backgroundColor: isDark ? DarkColors.surface : Colors.white }]}>
              <Card.Content style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepIconContainer}>
                    <Text style={[styles.stepIcon, { color: Colors.primary }]}>✅</Text>
                  </View>
                  <View style={styles.stepHeaderText}>
                    <Text variant="headlineSmall" style={[styles.stepTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                      Review & Export
                    </Text>
                    <Text variant="bodyLarge" style={[styles.stepDescription, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                      Review your resume and export it in your preferred format
                    </Text>
                  </View>
                </View>
                
                <View style={styles.completionSummary}>
                  <Text variant="titleMedium" style={[styles.summaryTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                    Resume Summary
                  </Text>
                  <View style={styles.summaryStats}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: Colors.primary }]}>
                        {resumeData.personalInfo.firstName && resumeData.personalInfo.lastName ? '✓' : '○'}
                      </Text>
                      <Text style={[styles.statLabel, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                        Personal Info
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: Colors.primary }]}>
                        {resumeData.experience.length > 0 ? '✓' : '○'}
                      </Text>
                      <Text style={[styles.statLabel, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                        Experience
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: Colors.primary }]}>
                        {resumeData.education.length > 0 ? '✓' : '○'}
                      </Text>
                      <Text style={[styles.statLabel, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                        Education
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: Colors.primary }]}>
                        {resumeData.skills.technical.length > 0 ? '✓' : '○'}
                      </Text>
                      <Text style={[styles.statLabel, { color: isDark ? Colors.gray : Colors.textSecondary }]}>
                        Skills
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  <Button
                    mode="contained"
                    onPress={() => setShowPreview(true)}
                    style={[styles.actionButton, styles.primaryActionButton]}
                    buttonColor={Colors.primary}
                    contentStyle={styles.actionButtonContent}
                    icon="eye"
                  >
                    Preview Resume
                  </Button>
                  
                  <View style={styles.secondaryActions}>
                    <Button
                      mode="outlined"
                      onPress={handleSaveResume}
                      loading={isSaving}
                      disabled={isSaving}
                      style={[styles.actionButton, styles.secondaryActionButton]}
                      textColor={Colors.primary}
                      contentStyle={styles.actionButtonContent}
                      icon="content-save"
                    >
                      {isSaving ? 'Saving...' : 'Save Resume'}
                    </Button>
                    
                    <Button
                      mode="outlined"
                      onPress={handleExportResume}
                      style={[styles.actionButton, styles.secondaryActionButton]}
                      textColor={Colors.success}
                      contentStyle={styles.actionButtonContent}
                      icon="download"
                    >
                      Export PDF
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      slideOffset.value = withSpring(50, { damping: 15, stiffness: 100 });
      setTimeout(() => {
        slideOffset.value = withSpring(0, { damping: 15, stiffness: 100 });
      }, 100);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      slideOffset.value = withSpring(-50, { damping: 15, stiffness: 100 });
      setTimeout(() => {
        slideOffset.value = withSpring(0, { damping: 15, stiffness: 100 });
      }, 100);
    }
  };

  const renderPreviewModal = () => (
    <Portal>
      <Modal
        visible={showPreview}
        onDismiss={() => setShowPreview(false)}
        contentContainerStyle={[styles.previewModal, { backgroundColor: isDark ? DarkColors.surface : Colors.white }]}
      >
        <View style={styles.previewHeader}>
          <Text variant="headlineSmall" style={[styles.previewTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
            Resume Preview
          </Text>
          <IconButton
            icon="close"
            onPress={() => setShowPreview(false)}
          />
        </View>
        
        <ScrollView style={styles.previewContent}>
          <View style={[styles.resumePreview, { backgroundColor: Colors.white }]}>
            {/* Resume Header */}
            <View style={styles.resumeHeader}>
              <Text style={styles.resumeName}>
                {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
              </Text>
              <Text style={styles.resumeContact}>
                {resumeData.personalInfo.email} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.location}
              </Text>
            </View>
            
            {/* Professional Summary */}
            {resumeData.professionalSummary && (
              <View style={styles.resumeSection}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.sectionContent}>{resumeData.professionalSummary}</Text>
              </View>
            )}
            
            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <View style={styles.resumeSection}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {resumeData.experience.map((exp, index) => (
                  <View key={exp.id} style={styles.experienceItem}>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.companyName}>{exp.company} • {exp.location}</Text>
                    <Text style={styles.jobDates}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                    {exp.description && (
                      <Text style={styles.jobDescription}>{exp.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
            
            {/* Education */}
            {resumeData.education.length > 0 && (
              <View style={styles.resumeSection}>
                <Text style={styles.sectionTitle}>Education</Text>
                {resumeData.education.map((edu, index) => (
                  <View key={edu.id} style={styles.educationItem}>
                    <Text style={styles.degreeName}>{edu.degree}</Text>
                    <Text style={styles.schoolName}>{edu.school} • {edu.location}</Text>
                    <Text style={styles.educationDates}>
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* Skills */}
            {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) && (
              <View style={styles.resumeSection}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {resumeData.skills.technical.length > 0 && (
                  <Text style={styles.skillsText}>
                    <Text style={styles.skillCategory}>Technical: </Text>
                    {resumeData.skills.technical.join(', ')}
                  </Text>
                )}
                {resumeData.skills.soft.length > 0 && (
                  <Text style={styles.skillsText}>
                    <Text style={styles.skillCategory}>Soft Skills: </Text>
                    {resumeData.skills.soft.join(', ')}
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? DarkColors.background : Colors.background }
    ]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? DarkColors.background : Colors.background}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {/* Progress Header */}
          <View style={styles.progressHeader}>
            <Text 
              variant="headlineSmall" 
              style={[
                styles.title,
                { color: isDark ? Colors.white : Colors.textPrimary }
              ]}
            >
              Resume Builder
            </Text>
            <Text 
              variant="bodyLarge" 
              style={[
                styles.subtitle,
                { color: isDark ? Colors.gray : Colors.textSecondary }
              ]}
            >
              Step {currentStep} of {totalSteps}
            </Text>
            
            <ProgressBar 
              progress={getProgress()}
              color={isDark ? Colors.primary : Colors.primary}
              style={styles.progressBar}
            />
          </View>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            {currentStep > 1 && (
              <Button
                mode="outlined"
                onPress={handlePrevStep}
                style={styles.navButton}
                textColor={isDark ? Colors.primary : Colors.primary}
                contentStyle={styles.navButtonContent}
                icon="chevron-left"
              >
                Previous
              </Button>
            )}
            
            {currentStep < totalSteps && (
              <Button
                mode="contained"
                onPress={handleNextStep}
                style={styles.navButton}
                buttonColor={isDark ? Colors.primary : Colors.primary}
                contentStyle={styles.navButtonContent}
                icon="chevron-right"
              >
                Next
              </Button>
            )}
          </View>

          {/* Tips Card */}
          <Card style={[
            styles.tipsCard,
            { backgroundColor: isDark ? DarkColors.surface : Colors.white }
          ]}>
            <Card.Content style={styles.tipsContent}>
              <Text 
                variant="titleMedium" 
                style={[
                  styles.tipsTitle,
                  { color: isDark ? Colors.white : Colors.textPrimary }
                ]}
              >
                💡 Pro Tips
              </Text>
              <Text 
                variant="bodyMedium" 
                style={[
                  styles.tipsText,
                  { color: isDark ? Colors.gray : Colors.textSecondary }
                ]}
              >
                • Use action verbs to describe your achievements{'\n'}
                • Quantify your accomplishments with numbers{'\n'}
                • Tailor your resume for each job application{'\n'}
                • Keep it concise - aim for 1-2 pages
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>
      
      {renderPreviewModal()}
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
    paddingBottom: Sizes.xl,
  },
  content: {
    padding: Sizes.lg,
  },
  progressHeader: {
    marginBottom: Sizes.xl,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: Sizes.xs,
  },
  subtitle: {
    marginBottom: Sizes.md,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  stepCard: {
    marginBottom: Sizes.xl,
    elevation: 4,
    borderRadius: Sizes.radiusLg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  stepContent: {
    padding: Sizes.xl,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Sizes.xl,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
  },
  stepIcon: {
    fontSize: 24,
  },
  stepHeaderText: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: '700',
    marginBottom: Sizes.sm,
    letterSpacing: 0.5,
  },
  stepDescription: {
    lineHeight: 24,
    opacity: 0.8,
  },
  sectionContainer: {
    marginBottom: Sizes.xl,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: Sizes.sm,
    letterSpacing: 0.3,
  },
  fieldHint: {
    marginBottom: Sizes.md,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  
  // Template Selection Styles
  templateList: {
    marginTop: Sizes.lg,
  },
  templateListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizes.lg,
    marginBottom: Sizes.md,
    borderRadius: Sizes.radiusLg,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedTemplateItem: {
    borderColor: Colors.primary,
    elevation: 4,
    shadowOpacity: 0.2,
    backgroundColor: `${Colors.primary}10`, // 10% opacity
  },
  templateItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  templatePreview: {
    width: 60,
    height: 60,
    borderRadius: Sizes.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  templatePreviewText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  templateItemInfo: {
    flex: 1,
  },
  templateItemName: {
    fontWeight: '700',
    marginBottom: Sizes.xs,
    letterSpacing: 0.3,
  },
  templateItemDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: Sizes.sm,
    opacity: 0.8,
  },
  templateItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateCategory: {
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: Sizes.radiusSm,
  },
  templateCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  templateItemFeatures: {
    fontSize: 11,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  templateItemRight: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Sizes.md,
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedCheckmark: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  unselectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedCircle: {
    color: Colors.lightGray,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Form Styles
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.md,
  },
  halfInputContainer: {
    flex: 1,
    marginHorizontal: Sizes.xs,
  },
  halfInput: {
    flex: 1,
  },
  fullInput: {
    marginBottom: Sizes.md,
  },
  
  // Section Header Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.lg,
  },
  subsectionTitle: {
    fontWeight: '600',
    marginTop: Sizes.lg,
    marginBottom: Sizes.md,
  },
  
  // Item Card Styles
  itemCard: {
    marginBottom: Sizes.lg,
    elevation: 2,
    borderRadius: Sizes.radiusLg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.lg,
    paddingBottom: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  itemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
  },
  itemNumberText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.lg,
    paddingVertical: Sizes.sm,
    paddingHorizontal: Sizes.md,
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusSm,
  },
  switchLabel: {
    flex: 1,
  },
  switchText: {
    fontWeight: '500',
    marginBottom: Sizes.xs,
  },
  switchHint: {
    fontSize: 12,
    opacity: 0.7,
  },
  
  // Skills Styles
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Sizes.lg,
    alignItems: 'center',
  },
  skillChip: {
    marginRight: Sizes.sm,
    marginBottom: Sizes.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  skillChipText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  skillInput: {
    flex: 1,
    minWidth: 150,
    marginTop: Sizes.sm,
  },
  
  // Action Buttons Styles
  actionButtons: {
    marginTop: Sizes.xl,
  },
  actionButton: {
    marginBottom: Sizes.md,
    borderRadius: Sizes.radiusLg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionButtonContent: {
    paddingVertical: Sizes.sm,
  },
  primaryActionButton: {
    elevation: 4,
    shadowOpacity: 0.2,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryActionButton: {
    flex: 1,
    marginHorizontal: Sizes.xs,
  },
  addButton: {
    borderRadius: Sizes.radiusLg,
    elevation: 2,
  },
  addButtonContent: {
    paddingVertical: Sizes.xs,
    paddingHorizontal: Sizes.md,
  },
  
  // Completion Summary Styles
  completionSummary: {
    marginBottom: Sizes.xl,
    padding: Sizes.lg,
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusLg,
  },
  summaryTitle: {
    fontWeight: '600',
    marginBottom: Sizes.md,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Sizes.xs,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Navigation Styles
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.xl,
  },
  navButton: {
    flex: 1,
    marginHorizontal: Sizes.sm,
    borderRadius: Sizes.radiusMd,
  },
  navButtonContent: {
    paddingVertical: Sizes.sm,
  },
  
  // Tips Card Styles
  tipsCard: {
    elevation: Sizes.elevation2,
    borderRadius: Sizes.radiusMd,
  },
  tipsContent: {
    padding: Sizes.lg,
  },
  tipsTitle: {
    fontWeight: '600',
    marginBottom: Sizes.md,
  },
  tipsText: {
    lineHeight: 22,
  },
  
  // Preview Modal Styles
  previewModal: {
    margin: Sizes.lg,
    borderRadius: Sizes.radiusMd,
    maxHeight: '90%',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizes.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  previewTitle: {
    fontWeight: 'bold',
  },
  previewContent: {
    flex: 1,
  },
  
  // Resume Preview Styles
  resumePreview: {
    padding: Sizes.xl,
    minHeight: 800,
  },
  resumeHeader: {
    alignItems: 'center',
    marginBottom: Sizes.xl,
    paddingBottom: Sizes.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  resumeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Sizes.sm,
  },
  resumeContact: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resumeSection: {
    marginBottom: Sizes.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Sizes.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  experienceItem: {
    marginBottom: Sizes.lg,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Sizes.xs,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  jobDates: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Sizes.sm,
    fontStyle: 'italic',
  },
  jobDescription: {
    fontSize: 14,
    lineHeight: 18,
    color: Colors.textPrimary,
  },
  educationItem: {
    marginBottom: Sizes.md,
  },
  degreeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Sizes.xs,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  educationDates: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  skillsText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textPrimary,
    marginBottom: Sizes.sm,
  },
  skillCategory: {
    fontWeight: 'bold',
  },
});

export default ResumeBuilderScreen;
