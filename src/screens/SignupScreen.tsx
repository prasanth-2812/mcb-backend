import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, useTheme, Checkbox } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import ValidatedInput from '../components/ValidatedInput';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { validateForm, VALIDATION_RULES, ERROR_MESSAGES } from '../utils/validation';

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
  const { state, register, navigateToScreen } = useApp();
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [fieldValidations, setFieldValidations] = useState<{[key: string]: boolean}>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
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
      firstName: VALIDATION_RULES.firstName,
      lastName: VALIDATION_RULES.lastName,
      email: VALIDATION_RULES.email,
      phone: VALIDATION_RULES.phone,
      password: VALIDATION_RULES.password,
      confirmPassword: VALIDATION_RULES.confirmPassword,
    });
    
    // Add terms validation
    if (!agreeToTerms) {
      validationErrors.terms = ERROR_MESSAGES.terms;
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      fieldValidations.firstName &&
      fieldValidations.lastName &&
      fieldValidations.email &&
      fieldValidations.phone &&
      fieldValidations.password &&
      fieldValidations.confirmPassword &&
      agreeToTerms &&
      Object.keys(errors).length === 0
    );
  };

  const handleSignup = async () => {
    if (!validateFormData()) {
      Alert.alert('Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
      });
      
      if (result.success) {
        navigateToScreen('main');
      } else {
        Alert.alert('Registration Failed', result.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            source={require('../../assets/logo.png')} 
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
              <ValidatedInput
                label="First Name"
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
                onValidationChange={(isValid) => handleFieldValidation('firstName', isValid)}
                fieldName="firstName"
                formData={formData}
                placeholder="First name"
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
                outlineColor={isDark ? '#404040' : '#E1E5E9'}
                activeOutlineColor="#1976D2"
                autoCapitalize="words"
                error={!!errors.firstName}
                style={styles.validatedInput}
              />
            </View>
            
            <View style={styles.halfInput}>
              <ValidatedInput
                label="Last Name"
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
                onValidationChange={(isValid) => handleFieldValidation('lastName', isValid)}
                fieldName="lastName"
                formData={formData}
                placeholder="Last name"
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
                outlineColor={isDark ? '#404040' : '#E1E5E9'}
                activeOutlineColor="#1976D2"
                autoCapitalize="words"
                error={!!errors.lastName}
                style={styles.validatedInput}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <ValidatedInput
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              onValidationChange={(isValid) => handleFieldValidation('email', isValid)}
              fieldName="email"
              formData={formData}
              placeholder="Enter your email"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
              outlineColor={isDark ? '#404040' : '#E1E5E9'}
              activeOutlineColor="#1976D2"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              style={styles.validatedInput}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <ValidatedInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              onValidationChange={(isValid) => handleFieldValidation('phone', isValid)}
              fieldName="phone"
              formData={formData}
              placeholder="Enter your phone number"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
              outlineColor={isDark ? '#404040' : '#E1E5E9'}
              activeOutlineColor="#1976D2"
              keyboardType="phone-pad"
              error={!!errors.phone}
              style={styles.validatedInput}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordInputContainer}>
              <ValidatedInput
                label="Password"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                onValidationChange={(isValid) => handleFieldValidation('password', isValid)}
                fieldName="password"
                formData={formData}
                placeholder="Enter your password"
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
                outlineColor={isDark ? '#404040' : '#E1E5E9'}
                activeOutlineColor="#1976D2"
                secureTextEntry={!showPassword}
                error={!!errors.password}
                style={[styles.validatedInput, styles.passwordInput]}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={isDark ? '#B0B0B0' : '#666666'}
                />
              </TouchableOpacity>
            </View>
            <PasswordStrengthIndicator password={formData.password} />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordInputContainer}>
              <ValidatedInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                onValidationChange={(isValid) => handleFieldValidation('confirmPassword', isValid)}
                fieldName="confirmPassword"
                formData={formData}
                placeholder="Confirm your password"
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
                outlineColor={isDark ? '#404040' : '#E1E5E9'}
                activeOutlineColor="#1976D2"
                secureTextEntry={!showConfirmPassword}
                error={!!errors.confirmPassword}
                style={[styles.validatedInput, styles.passwordInput]}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={24}
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
          {errors.terms && (
            <Text style={styles.errorText}>
              {errors.terms}
            </Text>
          )}

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
    width: 160,
    height: 80,
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
  validatedInput: {
    height: 56,
    fontSize: 16,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  errorText: {
    color: '#F44336',
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
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