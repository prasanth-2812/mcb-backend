import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { Text, Button, Card, useTheme, TextInput, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

const ForgotPasswordScreen: React.FC = () => {
  const theme = useTheme();
  const { state, navigateToScreen } = useApp();
  const isDark = state.theme === 'dark';
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleBackToLogin = () => {
    navigateToScreen('login');
  };

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Reset email sent again!');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (emailSent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark : Colors.white }]}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={isDark ? Colors.dark : Colors.white} 
        />
        
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={isDark ? Colors.white : Colors.textPrimary}
            onPress={handleBackToLogin}
            style={styles.backButton}
          />
          <Text variant="headlineSmall" style={[styles.headerTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
            Check Your Email
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Card */}
          <Card style={[styles.card, { backgroundColor: isDark ? Colors.darkGray : Colors.white }]}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.successIconContainer}>
                <MaterialCommunityIcons 
                  name="email-check-outline" 
                  size={80} 
                  color="#4CAF50" 
                />
              </View>
              
              <Text variant="headlineSmall" style={[styles.successTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                Check Your Email
              </Text>
              
              <Text variant="bodyLarge" style={[styles.successMessage, { color: isDark ? Colors.textSecondary : Colors.textSecondary }]}>
                We've sent a password reset link to:
              </Text>
              
              <Text variant="bodyMedium" style={[styles.emailText, { color: isDark ? Colors.white : Colors.primary }]}>
                {email}
              </Text>
              
              <Text variant="bodyMedium" style={[styles.instructionsText, { color: isDark ? Colors.textSecondary : Colors.textSecondary }]}>
                Please check your email and click the link to reset your password. The link will expire in 15 minutes.
              </Text>
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleResendEmail}
              loading={isLoading}
              disabled={isLoading}
              style={styles.resendButton}
              textColor={isDark ? Colors.white : Colors.primary}
              icon={() => <MaterialCommunityIcons name="email-send-outline" size={20} color={isDark ? Colors.white : Colors.primary} />}
            >
              Resend Email
            </Button>
            
            <Button
              mode="contained"
              onPress={handleBackToLogin}
              style={styles.backToLoginButton}
              buttonColor={isDark ? Colors.primary : Colors.primary}
              textColor="#FFFFFF"
              icon={() => <MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" />}
            >
              Back to Login
            </Button>
          </View>

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Text variant="bodySmall" style={[styles.helpText, { color: isDark ? Colors.textSecondary : Colors.textSecondary }]}>
              Didn't receive the email? Check your spam folder or try again.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark : Colors.white }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? Colors.dark : Colors.white} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={isDark ? Colors.white : Colors.textPrimary}
          onPress={handleBackToLogin}
          style={styles.backButton}
        />
        <Text variant="headlineSmall" style={[styles.headerTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
          Forgot Password
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <Card style={[styles.card, { backgroundColor: isDark ? Colors.darkGray : Colors.white }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="lock-reset" 
                size={80} 
                color={isDark ? Colors.white : Colors.primary} 
              />
            </View>
            
            <Text variant="headlineSmall" style={[styles.title, { color: isDark ? Colors.white : Colors.textPrimary }]}>
              Reset Your Password
            </Text>
            
            <Text variant="bodyLarge" style={[styles.subtitle, { color: isDark ? Colors.textSecondary : Colors.textSecondary }]}>
              Don't worry! Enter your email address and we'll send you a link to reset your password.
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                left={<TextInput.Icon icon="email-outline" />}
                placeholder="Enter your email address"
                error={email.length > 0 && !isValidEmail(email)}
                disabled={isLoading}
              />
              {email.length > 0 && !isValidEmail(email) && (
                <Text variant="bodySmall" style={styles.errorText}>
                  Please enter a valid email address
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSendResetEmail}
            loading={isLoading}
            disabled={isLoading || !email.trim() || !isValidEmail(email)}
            style={styles.sendButton}
            buttonColor={isDark ? Colors.primary : Colors.primary}
            textColor="#FFFFFF"
            icon={() => <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleBackToLogin}
            disabled={isLoading}
            style={styles.cancelButton}
            textColor={isDark ? Colors.white : Colors.textPrimary}
            icon={() => <MaterialCommunityIcons name="arrow-left" size={20} color={isDark ? Colors.white : Colors.textPrimary} />}
          >
            Back to Login
          </Button>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text variant="bodySmall" style={[styles.helpText, { color: isDark ? Colors.textSecondary : Colors.textSecondary }]}>
            Remember your password? 
            <Text 
              style={[styles.linkText, { color: isDark ? Colors.white : Colors.primary }]}
              onPress={handleBackToLogin}
            >
              {' '}Sign in here
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    flexGrow: 1,
    padding: 16,
  },
  card: {
    marginBottom: 24,
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
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  successTitle: {
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  successMessage: {
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  instructionsText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#F44336',
    marginTop: 4,
    marginLeft: 12,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  sendButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  resendButton: {
    borderRadius: 12,
    paddingVertical: 8,
    borderColor: '#1976D2',
    borderWidth: 1.5,
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 8,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  backToLoginButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  helpContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  helpText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
