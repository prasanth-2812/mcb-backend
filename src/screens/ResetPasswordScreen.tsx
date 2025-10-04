import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { Text, Button, Card, useTheme, TextInput, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

interface ResetPasswordScreenProps {
  route?: {
    params?: {
      token?: string;
    };
  };
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ route }) => {
  const theme = useTheme();
  const { state, navigateToScreen } = useApp();
  const isDark = state.theme === 'dark';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get token from navigation params
    const resetToken = state.navigationParams?.token || '';
    setToken(resetToken);
    
    if (!resetToken) {
      Alert.alert('Error', 'Invalid reset link. Please request a new password reset.');
      navigateToScreen('forgot-password');
    }
  }, [state.navigationParams, navigateToScreen]);

  const handleBackToLogin = () => {
    navigateToScreen('login');
  };

  const handleResetPassword = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Invalid reset token. Please request a new password reset.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔄 Resetting password with token:', token.substring(0, 10) + '...');
      
      const response = await fetch('http://10.115.43.116:4000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Password reset successfully');
        setIsSuccess(true);
      } else {
        console.error('❌ Password reset failed:', data.message);
        Alert.alert('Error', data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('❌ Password reset error:', error);
      Alert.alert('Error', 'Failed to reset password. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidPassword = (pwd: string) => {
    return pwd.length >= 6;
  };

  const passwordsMatch = () => {
    return password === confirmPassword && password.length > 0;
  };

  if (isSuccess) {
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
            Password Reset
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
                  name="check-circle-outline" 
                  size={80} 
                  color="#4CAF50" 
                />
              </View>
              
              <Text variant="headlineSmall" style={[styles.successTitle, { color: isDark ? Colors.white : Colors.textPrimary }]}>
                Password Reset Successful!
              </Text>
              
              <Text variant="bodyLarge" style={[styles.successMessage, { color: isDark ? Colors.textSecondary : Colors.textSecondary }]}>
                Your password has been successfully updated. You can now log in with your new password.
              </Text>
            </Card.Content>
          </Card>

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleBackToLogin}
              style={styles.loginButton}
              buttonColor={isDark ? Colors.primary : Colors.primary}
              textColor="#FFFFFF"
              icon={() => <MaterialCommunityIcons name="login" size={20} color="#FFFFFF" />}
            >
              Go to Login
            </Button>
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
          Reset Password
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
              Set New Password
            </Text>
            
            <Text variant="bodyLarge" style={[styles.subtitle, { color: isDark ? Colors.textSecondary : Colors.textSecondary }]}>
              Please enter your new password below. Make sure it's secure and easy to remember.
            </Text>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                label="New Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                placeholder="Enter your new password"
                error={password.length > 0 && !isValidPassword(password)}
                disabled={isLoading}
              />
              {password.length > 0 && !isValidPassword(password) && (
                <Text variant="bodySmall" style={styles.errorText}>
                  Password must be at least 6 characters long
                </Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                left={<TextInput.Icon icon="lock-check-outline" />}
                right={
                  <TextInput.Icon 
                    icon={showConfirmPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                placeholder="Confirm your new password"
                error={confirmPassword.length > 0 && !passwordsMatch()}
                disabled={isLoading}
              />
              {confirmPassword.length > 0 && !passwordsMatch() && (
                <Text variant="bodySmall" style={styles.errorText}>
                  Passwords do not match
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading || !isValidPassword(password) || !passwordsMatch()}
            style={styles.resetButton}
            buttonColor={isDark ? Colors.primary : Colors.primary}
            textColor="#FFFFFF"
            icon={() => <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
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
            Password requirements:
          </Text>
          <Text variant="bodySmall" style={[styles.helpText, { color: isDark ? Colors.textSecondary : Colors.textSecondary }]}>
            • At least 6 characters long
          </Text>
          <Text variant="bodySmall" style={[styles.helpText, { color: isDark ? Colors.textSecondary : Colors.textSecondary }]}>
            • Use a combination of letters and numbers for better security
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
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
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
  resetButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 8,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  helpContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  helpText: {
    lineHeight: 20,
    marginBottom: 4,
  },
});

export default ResetPasswordScreen;
