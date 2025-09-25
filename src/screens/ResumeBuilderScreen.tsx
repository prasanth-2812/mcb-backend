import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Text, Button, Card, TextInput, useTheme, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

const ResumeBuilderScreen: React.FC = () => {
  const theme = useTheme();
  const { state, updateProfile } = useApp();
  const isDark = state.theme === 'dark';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  
  const contentOpacity = useSharedValue(0);

  React.useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const handleUploadResume = async () => {
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      // Update profile with new resume
      updateProfile({
        resume: {
          fileName: 'Updated_Resume.pdf',
          fileSize: '2.5 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          url: 'https://example.com/resumes/updated_resume.pdf'
        }
      });
    }, 2000);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getProgress = () => {
    return currentStep / 3;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card style={[
            styles.stepCard,
            { backgroundColor: isDark ? Colors.darkGray : Colors.white }
          ]}>
            <Card.Content style={styles.stepContent}>
              <Text 
                variant="titleLarge" 
                style={[
                  styles.stepTitle,
                  { color: isDark ? Colors.white : Colors.textPrimary }
                ]}
              >
                Upload Your Resume
              </Text>
              <Text 
                variant="bodyLarge" 
                style={[
                  styles.stepDescription,
                  { color: isDark ? Colors.gray : Colors.textSecondary }
                ]}
              >
                Upload your current resume to get started with building your profile.
              </Text>
              
              <Button
                mode="contained"
                onPress={handleUploadResume}
                loading={isUploading}
                disabled={isUploading}
                style={styles.uploadButton}
                buttonColor={isDark ? Colors.primary : Colors.primary}
                contentStyle={styles.uploadButtonContent}
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
              
              {state.user?.resume && (
                <View style={styles.currentResume}>
                  <Text 
                    variant="bodyMedium" 
                    style={[
                      styles.currentResumeText,
                      { color: isDark ? Colors.gray : Colors.textSecondary }
                    ]}
                  >
                    Current Resume: {state.user.resume.fileName}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        );
      
      case 2:
        return (
          <Card style={[
            styles.stepCard,
            { backgroundColor: isDark ? Colors.darkGray : Colors.white }
          ]}>
            <Card.Content style={styles.stepContent}>
              <Text 
                variant="titleLarge" 
                style={[
                  styles.stepTitle,
                  { color: isDark ? Colors.white : Colors.textPrimary }
                ]}
              >
                Optimize Your Resume
              </Text>
              <Text 
                variant="bodyLarge" 
                style={[
                  styles.stepDescription,
                  { color: isDark ? Colors.gray : Colors.textSecondary }
                ]}
              >
                We'll analyze your resume and suggest improvements to make it more attractive to employers.
              </Text>
              
              <View style={styles.optimizationList}>
                <View style={styles.optimizationItem}>
                  <Text 
                    variant="bodyMedium" 
                    style={[
                      styles.optimizationText,
                      { color: isDark ? Colors.white : Colors.textPrimary }
                    ]}
                  >
                    ✓ Keyword optimization for ATS systems
                  </Text>
                </View>
                <View style={styles.optimizationItem}>
                  <Text 
                    variant="bodyMedium" 
                    style={[
                      styles.optimizationText,
                      { color: isDark ? Colors.white : Colors.textPrimary }
                    ]}
                  >
                    ✓ Format and layout improvements
                  </Text>
                </View>
                <View style={styles.optimizationItem}>
                  <Text 
                    variant="bodyMedium" 
                    style={[
                      styles.optimizationText,
                      { color: isDark ? Colors.white : Colors.textPrimary }
                    ]}
                  >
                    ✓ Skills and experience enhancement
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        );
      
      case 3:
        return (
          <Card style={[
            styles.stepCard,
            { backgroundColor: isDark ? Colors.darkGray : Colors.white }
          ]}>
            <Card.Content style={styles.stepContent}>
              <Text 
                variant="titleLarge" 
                style={[
                  styles.stepTitle,
                  { color: isDark ? Colors.white : Colors.textPrimary }
                ]}
              >
                Download Your Optimized Resume
              </Text>
              <Text 
                variant="bodyLarge" 
                style={[
                  styles.stepDescription,
                  { color: isDark ? Colors.gray : Colors.textSecondary }
                ]}
              >
                Your resume has been optimized! Download the improved version and start applying to jobs.
              </Text>
              
              <Button
                mode="contained"
                onPress={() => {}}
                style={styles.downloadButton}
                buttonColor={isDark ? Colors.success : Colors.success}
                contentStyle={styles.downloadButtonContent}
              >
                Download Resume
              </Button>
            </Card.Content>
          </Card>
        );
      
      default:
        return null;
    }
  };

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
              Step {currentStep} of 3
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
              >
                Previous
              </Button>
            )}
            
            {currentStep < 3 && (
              <Button
                mode="contained"
                onPress={handleNextStep}
                style={styles.navButton}
                buttonColor={isDark ? Colors.primary : Colors.primary}
                contentStyle={styles.navButtonContent}
              >
                Next
              </Button>
            )}
          </View>

          {/* Tips Card */}
          <Card style={[
            styles.tipsCard,
            { backgroundColor: isDark ? Colors.darkGray : Colors.white }
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
    elevation: Sizes.elevation2,
    borderRadius: Sizes.radiusMd,
  },
  stepContent: {
    padding: Sizes.xl,
  },
  stepTitle: {
    fontWeight: 'bold',
    marginBottom: Sizes.md,
  },
  stepDescription: {
    marginBottom: Sizes.xl,
    lineHeight: 24,
  },
  uploadButton: {
    borderRadius: Sizes.radiusMd,
    marginBottom: Sizes.md,
  },
  uploadButtonContent: {
    paddingVertical: Sizes.sm,
  },
  currentResume: {
    marginTop: Sizes.md,
    padding: Sizes.md,
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusSm,
  },
  currentResumeText: {
    textAlign: 'center',
  },
  optimizationList: {
    marginTop: Sizes.lg,
  },
  optimizationItem: {
    marginBottom: Sizes.md,
  },
  optimizationText: {
    lineHeight: 22,
  },
  downloadButton: {
    borderRadius: Sizes.radiusMd,
  },
  downloadButtonContent: {
    paddingVertical: Sizes.sm,
  },
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
});

export default ResumeBuilderScreen;
