import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ValidatedInput from './ValidatedInput';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { validateForm, VALIDATION_RULES, ERROR_MESSAGES } from '../utils/validation';

const ValidationDemo: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.dark;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    fullName: '',
    location: '',
    role: '',
    coverLetter: '',
    skill: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [fieldValidations, setFieldValidations] = useState<{[key: string]: boolean}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFieldValidation = (field: string, isValid: boolean) => {
    setFieldValidations(prev => ({ ...prev, [field]: isValid }));
  };

  const testValidation = () => {
    const validationErrors = validateForm(formData, {
      email: VALIDATION_RULES.email,
      password: VALIDATION_RULES.password,
      confirmPassword: VALIDATION_RULES.confirmPassword,
      firstName: VALIDATION_RULES.firstName,
      lastName: VALIDATION_RULES.lastName,
      phone: VALIDATION_RULES.phone,
      fullName: VALIDATION_RULES.fullName,
      location: VALIDATION_RULES.location,
      role: VALIDATION_RULES.role,
      coverLetter: VALIDATION_RULES.coverLetter,
    });
    
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      console.log('✅ All validations passed!');
    } else {
      console.log('❌ Validation errors:', validationErrors);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
          Form Validation Demo
        </Text>
        
        <Text variant="bodyMedium" style={[styles.subtitle, { color: isDark ? '#B0B0B0' : '#666666' }]}>
          Test all validation rules with user-friendly error messages
        </Text>

        <Card style={[styles.card, { backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Authentication Fields
            </Text>
            
            <ValidatedInput
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              onValidationChange={(isValid) => handleFieldValidation('email', isValid)}
              fieldName="email"
              formData={formData}
              placeholder="Enter your email"
              textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
              outlineColor={isDark ? '#404040' : '#E1E5E9'}
              activeOutlineColor="#1976D2"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              style={styles.input}
            />

            <ValidatedInput
              label="Password"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              onValidationChange={(isValid) => handleFieldValidation('password', isValid)}
              fieldName="password"
              formData={formData}
              placeholder="Enter your password"
              textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
              outlineColor={isDark ? '#404040' : '#E1E5E9'}
              activeOutlineColor="#1976D2"
              secureTextEntry
              error={!!errors.password}
              style={styles.input}
            />
            <PasswordStrengthIndicator password={formData.password} />

            <ValidatedInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              onValidationChange={(isValid) => handleFieldValidation('confirmPassword', isValid)}
              fieldName="confirmPassword"
              formData={formData}
              placeholder="Confirm your password"
              textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
              outlineColor={isDark ? '#404040' : '#E1E5E9'}
              activeOutlineColor="#1976D2"
              secureTextEntry
              error={!!errors.confirmPassword}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Personal Information
            </Text>
            
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
                  textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
                  outlineColor={isDark ? '#404040' : '#E1E5E9'}
                  activeOutlineColor="#1976D2"
                  autoCapitalize="words"
                  error={!!errors.firstName}
                  style={styles.input}
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
                  textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
                  outlineColor={isDark ? '#404040' : '#E1E5E9'}
                  activeOutlineColor="#1976D2"
                  autoCapitalize="words"
                  error={!!errors.lastName}
                  style={styles.input}
                />
              </View>
            </View>

            <ValidatedInput
              label="Full Name"
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
              onValidationChange={(isValid) => handleFieldValidation('fullName', isValid)}
              fieldName="fullName"
              formData={formData}
              placeholder="Full name"
              textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
              outlineColor={isDark ? '#404040' : '#E1E5E9'}
              activeOutlineColor="#1976D2"
              autoCapitalize="words"
              error={!!errors.fullName}
              style={styles.input}
            />

            <ValidatedInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              onValidationChange={(isValid) => handleFieldValidation('phone', isValid)}
              fieldName="phone"
              formData={formData}
              placeholder="Enter your phone number"
              textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
              outlineColor={isDark ? '#404040' : '#E1E5E9'}
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
              placeholder="Enter your location"
              textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
              outlineColor={isDark ? '#404040' : '#E1E5E9'}
              activeOutlineColor="#1976D2"
              error={!!errors.location}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Professional Information
            </Text>
            
            <ValidatedInput
              label="Desired Role"
              value={formData.role}
              onChangeText={(text) => handleInputChange('role', text)}
              onValidationChange={(isValid) => handleFieldValidation('role', isValid)}
              fieldName="role"
              formData={formData}
              placeholder="e.g., Software Developer"
              textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
              outlineColor={isDark ? '#404040' : '#E1E5E9'}
              activeOutlineColor="#1976D2"
              error={!!errors.role}
              style={styles.input}
            />

            <ValidatedInput
              label="Cover Letter"
              value={formData.coverLetter}
              onChangeText={(text) => handleInputChange('coverLetter', text)}
              onValidationChange={(isValid) => handleFieldValidation('coverLetter', isValid)}
              fieldName="coverLetter"
              formData={formData}
              placeholder="Tell us about yourself..."
              textColor={isDark ? '#FFFFFF' : '#1A1A1A'}
              outlineColor={isDark ? '#404040' : '#E1E5E9'}
              activeOutlineColor="#1976D2"
              multiline
              numberOfLines={4}
              error={!!errors.coverLetter}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={testValidation}
          style={styles.testButton}
          buttonColor="#1976D2"
        >
          Test All Validations
        </Button>

        <Text variant="bodySmall" style={[styles.infoText, { color: isDark ? '#B0B0B0' : '#666666' }]}>
          Try entering invalid data to see user-friendly error messages in action!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    flex: 0.48,
  },
  input: {
    marginBottom: 16,
  },
  testButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  infoText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ValidationDemo;
