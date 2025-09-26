import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, Checkbox } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const SignupScreen: React.FC = () => {
  const theme = useTheme();
  const { state, login, navigateToScreen } = useApp();
  const isDark = state.theme === 'dark';

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      agreeToTerms
    );
  };

  const handleSignup = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill in all fields and ensure passwords match');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login({
        id: '1',
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: 'New York, NY',
          profileImage: '',
          bio: 'Software Developer',
        },
        professionalInfo: {
          title: 'Software Developer',
          experience: '5 years',
          skills: ['React', 'Node.js', 'TypeScript'],
          availability: 'Full-time',
          expectedSalary: '$80,000 - $100,000',
          workType: ['Remote'],
          languages: [{ language: 'English', proficiency: 'Native' }],
        },
        education: [],
        experience: [],
        projects: [],
        certifications: [],
        resume: {
          fileName: '',
          fileSize: '',
          uploadDate: '',
          url: '',
        },
        preferences: {
          jobTypes: ['Full-time'],
          workArrangement: ['Remote'],
          industries: ['Technology'],
          companySize: ['Medium'],
          notificationSettings: {
            emailNotifications: true,
            pushNotifications: true,
            jobMatches: true,
            applicationUpdates: true,
            weeklyDigest: true,
          },
        },
        profileCompletion: 75,
        lastUpdated: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/logoJob.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#B0B0B0' : '#666666' }]}>
            Join thousands of professionals building their careers
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Row */}
          <View style={styles.nameRow}>
            <View style={styles.halfInput}>
              <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                First Name
              </Text>
              <TextInput
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="First name"
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                autoCapitalize="words"
                style={[
                  styles.input,
                  { 
                    backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA',
                    borderColor: isDark ? '#404040' : '#E1E5E9',
                    color: isDark ? '#FFFFFF' : '#1A1A1A'
                  }
                ]}
              />
            </View>
            
            <View style={styles.halfInput}>
              <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                Last Name
              </Text>
              <TextInput
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Last name"
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                autoCapitalize="words"
                style={[
                  styles.input,
                  { 
                    backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA',
                    borderColor: isDark ? '#404040' : '#E1E5E9',
                    color: isDark ? '#FFFFFF' : '#1A1A1A'
                  }
                ]}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Email Address
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA',
                  borderColor: isDark ? '#404040' : '#E1E5E9',
                  color: isDark ? '#FFFFFF' : '#1A1A1A'
                }
              ]}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Phone Number
            </Text>
            <TextInput
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter your phone number"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              keyboardType="phone-pad"
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA',
                  borderColor: isDark ? '#404040' : '#E1E5E9',
                  color: isDark ? '#FFFFFF' : '#1A1A1A'
                }
              ]}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Enter your password"
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                secureTextEntry={!showPassword}
                style={[
                  styles.passwordInput,
                  { 
                    backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA',
                    borderColor: isDark ? '#404040' : '#E1E5E9',
                    color: isDark ? '#FFFFFF' : '#1A1A1A'
                  }
                ]}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={isDark ? '#B0B0B0' : '#666666'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Confirm Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirm your password"
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                secureTextEntry={!showConfirmPassword}
                style={[
                  styles.passwordInput,
                  { 
                    backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA',
                    borderColor: isDark ? '#404040' : '#E1E5E9',
                    color: isDark ? '#FFFFFF' : '#1A1A1A'
                  }
                ]}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={isDark ? '#B0B0B0' : '#666666'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Checkbox
              status={agreeToTerms ? 'checked' : 'unchecked'}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              color="#3B82F6"
            />
            <Text style={[styles.termsText, { color: isDark ? '#B0B0B0' : '#666666' }]}>
              I agree to the{' '}
              <Text style={[styles.linkText, { color: '#3B82F6' }]}>
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text style={[styles.linkText, { color: '#3B82F6' }]}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.signupButton,
              { backgroundColor: '#3B82F6' },
              (!isFormValid() || isLoading) && styles.signupButtonDisabled
            ]}
            onPress={handleSignup}
            disabled={!isFormValid() || isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#B0B0B0' : '#666666' }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigateToScreen('login')}>
            <Text style={[styles.loginLink, { color: '#3B82F6' }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
    paddingBottom: 40,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  halfInput: {
    flex: 0.48,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
    padding: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  termsText: {
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
    fontSize: 14,
  },
  linkText: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  signupButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupScreen;