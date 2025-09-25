import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, Checkbox } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import profileData from '../data/profile.json';

const SignupScreen: React.FC = () => {
  const theme = useTheme();
  const { state, login, navigateToScreen } = useApp();
  const isDark = state.theme === 'dark';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const logoScale = useSharedValue(0);
  const formOpacity = useSharedValue(0);

  React.useEffect(() => {
    logoScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    formOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!acceptTerms) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, create a new profile with the form data
      const newProfile = {
        ...profileData,
        personalInfo: {
          ...profileData.personalInfo,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
        }
      };
      
      login(newProfile as any);
      setIsLoading(false);
    }, 1500);
  };

  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.password && 
           formData.confirmPassword &&
           formData.password === formData.confirmPassword &&
           acceptTerms;
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? Colors.background : Colors.background }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={[
            styles.logo,
            { backgroundColor: isDark ? Colors.primary : Colors.primary }
          ]}>
            <Text 
              variant="displaySmall" 
              style={[styles.logoText, { color: Colors.white }]}
            >
              MCB
            </Text>
          </View>
          <Text 
            variant="headlineSmall" 
            style={[
              styles.title,
              { color: isDark ? Colors.white : Colors.textPrimary }
            ]}
          >
            Create Account
          </Text>
          <Text 
            variant="bodyLarge" 
            style={[
              styles.subtitle,
              { color: isDark ? Colors.gray : Colors.textSecondary }
            ]}
          >
            Join thousands of professionals building their careers
          </Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <View style={styles.nameRow}>
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              mode="outlined"
              autoCapitalize="words"
              style={[styles.input, styles.halfInput]}
              contentStyle={[
                styles.inputContent,
                { color: isDark ? Colors.white : Colors.textPrimary }
              ]}
              outlineStyle={[
                styles.inputOutline,
                { borderColor: isDark ? Colors.border : Colors.borderLight }
              ]}
              theme={{
                colors: {
                  primary: isDark ? Colors.primary : Colors.primary,
                  onSurface: isDark ? Colors.white : Colors.textPrimary,
                  outline: isDark ? Colors.border : Colors.borderLight,
                }
              }}
              accessibilityLabel="First name"
            />
            
            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              mode="outlined"
              autoCapitalize="words"
              style={[styles.input, styles.halfInput]}
              contentStyle={[
                styles.inputContent,
                { color: isDark ? Colors.white : Colors.textPrimary }
              ]}
              outlineStyle={[
                styles.inputOutline,
                { borderColor: isDark ? Colors.border : Colors.borderLight }
              ]}
              theme={{
                colors: {
                  primary: isDark ? Colors.primary : Colors.primary,
                  onSurface: isDark ? Colors.white : Colors.textPrimary,
                  outline: isDark ? Colors.border : Colors.borderLight,
                }
              }}
              accessibilityLabel="Last name"
            />
          </View>

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            contentStyle={[
              styles.inputContent,
              { color: isDark ? Colors.white : Colors.textPrimary }
            ]}
            outlineStyle={[
              styles.inputOutline,
              { borderColor: isDark ? Colors.border : Colors.borderLight }
            ]}
            theme={{
              colors: {
                primary: isDark ? Colors.primary : Colors.primary,
                onSurface: isDark ? Colors.white : Colors.textPrimary,
                outline: isDark ? Colors.border : Colors.borderLight,
              }
            }}
            accessibilityLabel="Email address"
          />

          <TextInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            mode="outlined"
            keyboardType="phone-pad"
            autoComplete="tel"
            style={styles.input}
            contentStyle={[
              styles.inputContent,
              { color: isDark ? Colors.white : Colors.textPrimary }
            ]}
            outlineStyle={[
              styles.inputOutline,
              { borderColor: isDark ? Colors.border : Colors.borderLight }
            ]}
            theme={{
              colors: {
                primary: isDark ? Colors.primary : Colors.primary,
                onSurface: isDark ? Colors.white : Colors.textPrimary,
                outline: isDark ? Colors.border : Colors.borderLight,
              }
            }}
            accessibilityLabel="Phone number"
          />

          <TextInput
            label="Location"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            mode="outlined"
            autoCapitalize="words"
            style={styles.input}
            contentStyle={[
              styles.inputContent,
              { color: isDark ? Colors.white : Colors.textPrimary }
            ]}
            outlineStyle={[
              styles.inputOutline,
              { borderColor: isDark ? Colors.border : Colors.borderLight }
            ]}
            theme={{
              colors: {
                primary: isDark ? Colors.primary : Colors.primary,
                onSurface: isDark ? Colors.white : Colors.textPrimary,
                outline: isDark ? Colors.border : Colors.borderLight,
              }
            }}
            accessibilityLabel="Location"
          />

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoComplete="password-new"
            style={styles.input}
            contentStyle={[
              styles.inputContent,
              { color: isDark ? Colors.white : Colors.textPrimary }
            ]}
            outlineStyle={[
              styles.inputOutline,
              { borderColor: isDark ? Colors.border : Colors.borderLight }
            ]}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              />
            }
            theme={{
              colors: {
                primary: isDark ? Colors.primary : Colors.primary,
                onSurface: isDark ? Colors.white : Colors.textPrimary,
                outline: isDark ? Colors.border : Colors.borderLight,
              }
            }}
            accessibilityLabel="Password"
          />

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            autoComplete="password-new"
            style={styles.input}
            contentStyle={[
              styles.inputContent,
              { color: isDark ? Colors.white : Colors.textPrimary }
            ]}
            outlineStyle={[
              styles.inputOutline,
              { borderColor: isDark ? Colors.border : Colors.borderLight }
            ]}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
              />
            }
            theme={{
              colors: {
                primary: isDark ? Colors.primary : Colors.primary,
                onSurface: isDark ? Colors.white : Colors.textPrimary,
                outline: isDark ? Colors.border : Colors.borderLight,
              }
            }}
            accessibilityLabel="Confirm password"
          />

          {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <Text 
              variant="bodySmall" 
              style={[styles.errorText, { color: Colors.error }]}
            >
              Passwords do not match
            </Text>
          )}

          <View style={styles.termsContainer}>
            <Checkbox
              status={acceptTerms ? 'checked' : 'unchecked'}
              onPress={() => setAcceptTerms(!acceptTerms)}
              color={isDark ? Colors.primary : Colors.primary}
            />
            <Text 
              variant="bodySmall" 
              style={[
                styles.termsText,
                { color: isDark ? Colors.gray : Colors.textSecondary }
              ]}
            >
              I agree to the{' '}
              <Text 
                style={[styles.linkText, { color: isDark ? Colors.primary : Colors.primary }]}
                onPress={() => {}}
              >
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text 
                style={[styles.linkText, { color: isDark ? Colors.primary : Colors.primary }]}
                onPress={() => {}}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handleSignup}
            loading={isLoading}
            disabled={!isFormValid() || isLoading}
            style={styles.signupButton}
            buttonColor={isDark ? Colors.primary : Colors.primary}
            contentStyle={styles.buttonContent}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <View style={styles.loginContainer}>
            <Text 
              variant="bodyMedium" 
              style={[
                styles.loginText,
                { color: isDark ? Colors.gray : Colors.textSecondary }
              ]}
            >
              Already have an account?{' '}
            </Text>
            <Button
              mode="text"
              onPress={() => navigateToScreen('login')}
              textColor={isDark ? Colors.primary : Colors.primary}
              style={styles.loginButton}
            >
              Sign In
            </Button>
          </View>
        </Animated.View>
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
    paddingHorizontal: Sizes.lg,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: Sizes.xl,
    paddingBottom: Sizes.lg,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.md,
    elevation: Sizes.elevation2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoText: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: Sizes.xs,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    flex: 1,
    paddingBottom: Sizes.xl,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: Sizes.sm,
  },
  input: {
    marginBottom: Sizes.md,
  },
  inputContent: {
    fontSize: Sizes.fontSizeMd,
  },
  inputOutline: {
    borderRadius: Sizes.radiusMd,
  },
  errorText: {
    marginTop: -Sizes.sm,
    marginBottom: Sizes.sm,
    marginLeft: Sizes.sm,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Sizes.xl,
  },
  termsText: {
    flex: 1,
    marginLeft: Sizes.sm,
    lineHeight: 20,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  signupButton: {
    borderRadius: Sizes.radiusMd,
    marginBottom: Sizes.lg,
  },
  buttonContent: {
    paddingVertical: Sizes.sm,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    // Additional styles if needed
  },
  loginButton: {
    // Additional styles if needed
  },
});

export default SignupScreen;
