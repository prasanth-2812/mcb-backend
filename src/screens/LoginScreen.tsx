import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
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
import profileData from '../data/profile.json';

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const { state, login, navigateToScreen } = useApp();
  const isDark = state.theme === 'dark';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, login with any email/password
      login(profileData as any);
      setIsLoading(false);
    }, 1500);
  };

  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    handleLogin();
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
            Welcome Back
          </Text>
          <Text 
            variant="bodyLarge" 
            style={[
              styles.subtitle,
              { color: isDark ? Colors.gray : Colors.textSecondary }
            ]}
          >
            Sign in to continue your career journey
          </Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
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
            accessibilityHint="Enter your email address"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoComplete="password"
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
            accessibilityHint="Enter your password"
          />

          <Button
            mode="text"
            onPress={() => {}}
            style={styles.forgotPassword}
            textColor={isDark ? Colors.primary : Colors.primary}
          >
            Forgot Password?
          </Button>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={!email || !password || isLoading}
            style={styles.loginButton}
            buttonColor={isDark ? Colors.primary : Colors.primary}
            contentStyle={styles.buttonContent}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text 
              variant="bodyMedium" 
              style={[
                styles.dividerText,
                { color: isDark ? Colors.gray : Colors.textSecondary }
              ]}
            >
              OR
            </Text>
            <Divider style={styles.divider} />
          </View>

          <Button
            mode="outlined"
            onPress={handleDemoLogin}
            style={styles.demoButton}
            textColor={isDark ? Colors.primary : Colors.primary}
            contentStyle={styles.buttonContent}
          >
            Demo Login
          </Button>

          <View style={styles.signupContainer}>
            <Text 
              variant="bodyMedium" 
              style={[
                styles.signupText,
                { color: isDark ? Colors.gray : Colors.textSecondary }
              ]}
            >
              Don't have an account?{' '}
            </Text>
            <Button
              mode="text"
              onPress={() => navigateToScreen('signup')}
              textColor={isDark ? Colors.primary : Colors.primary}
              style={styles.signupButton}
            >
              Sign Up
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
    paddingTop: Sizes.xxl,
    paddingBottom: Sizes.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.lg,
    elevation: Sizes.elevation3,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: Sizes.sm,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    paddingBottom: Sizes.xl,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Sizes.xl,
  },
  loginButton: {
    borderRadius: Sizes.radiusMd,
    marginBottom: Sizes.lg,
  },
  buttonContent: {
    paddingVertical: Sizes.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Sizes.lg,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: Sizes.md,
    fontWeight: '500',
  },
  demoButton: {
    borderRadius: Sizes.radiusMd,
    marginBottom: Sizes.xl,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    // Additional styles if needed
  },
  signupButton: {
    // Additional styles if needed
  },
});

export default LoginScreen;
