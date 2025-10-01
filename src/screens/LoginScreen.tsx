import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import ValidatedInput from '../components/ValidatedInput';
import { validateForm, VALIDATION_RULES, ERROR_MESSAGES } from '../utils/validation';

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const { state, login, navigateToScreen } = useApp();
  const isDark = state.theme === 'dark';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [fieldValidations, setFieldValidations] = useState<{[key: string]: boolean}>({});

  const handleInputChange = (field: string, value: string) => {
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
      email: VALIDATION_RULES.email,
      password: VALIDATION_RULES.password,
    });
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateFormData()) {
      Alert.alert('Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigateToScreen('main');
      } else {
        Alert.alert('Login Failed', result.error || 'Please check your credentials');
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
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#B0B0B0' : '#666666' }]}>
            Sign in to continue your career journey
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
          </View>

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => navigateToScreen('forgot-password')}
          >
            <Text style={[styles.forgotPasswordText, { color: '#3B82F6' }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: '#3B82F6' },
              (isLoading || !fieldValidations.email || !fieldValidations.password) && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading || !fieldValidations.email || !fieldValidations.password}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#B0B0B0' : '#666666' }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigateToScreen('signup')}>
            <Text style={[styles.signupLink, { color: '#3B82F6' }]}>
              Sign Up
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
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
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
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
  signupLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;