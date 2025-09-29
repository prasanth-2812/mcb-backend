import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const { state, login, navigateToScreen } = useApp();
  const isDark = state.theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login({
        id: 1,
        name: 'John Doe',
        email: email,
        phone: '+1234567890',
        location: 'New York, NY',
        skills: ['React', 'Node.js', 'TypeScript'],
        resume: {
          fileName: '',
          uploaded: false,
        },
        profileCompletion: 75,
        preferences: {
          role: 'Software Developer',
          location: 'New York, NY',
          type: 'Full-time',
        },
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
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#B0B0B0' : '#666666' }]}>
            Sign in to continue your career journey
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Email Address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
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

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                value={password}
                onChangeText={setPassword}
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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: '#3B82F6' }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: '#3B82F6' },
              isLoading && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
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