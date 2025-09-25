import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

const SplashScreen: React.FC = () => {
  const theme = useTheme();
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const loadingOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate logo entrance
    logoScale.value = withSequence(
      withTiming(0.8, { duration: 300 }),
      withTiming(1, { duration: 200 })
    );
    logoOpacity.value = withTiming(1, { duration: 300 });
    
    // Animate text entrance
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 300 });
    }, 400);
    
    // Animate loading indicator
    setTimeout(() => {
      loadingOpacity.value = withTiming(1, { duration: 300 });
    }, 600);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? Colors.background : Colors.background }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={[
          styles.logo,
          { backgroundColor: isDark ? Colors.primary : Colors.primary }
        ]}>
          <Text 
            variant="displayMedium" 
            style={[styles.logoText, { color: Colors.white }]}
          >
            MCB
          </Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text 
          variant="headlineMedium" 
          style={[
            styles.title,
            { color: isDark ? Colors.white : Colors.textPrimary }
          ]}
        >
          My Career Build
        </Text>
        <Text 
          variant="bodyLarge" 
          style={[
            styles.subtitle,
            { color: isDark ? Colors.gray : Colors.textSecondary }
          ]}
        >
          Build your career, one opportunity at a time
        </Text>
      </Animated.View>

      <Animated.View style={[styles.loadingContainer, loadingAnimatedStyle]}>
        <ActivityIndicator 
          size="large" 
          color={isDark ? Colors.primary : Colors.primary}
        />
        <Text 
          variant="bodyMedium" 
          style={[
            styles.loadingText,
            { color: isDark ? Colors.gray : Colors.textSecondary }
          ]}
        >
          Loading your career journey...
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Sizes.xl,
  },
  logoContainer: {
    marginBottom: Sizes.xxl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: Sizes.elevation4,
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
    letterSpacing: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Sizes.xxl,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Sizes.sm,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Sizes.md,
    textAlign: 'center',
  },
});

export default SplashScreen;
