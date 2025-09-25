import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Find Your Dream Job',
    description: 'Discover thousands of job opportunities tailored to your skills and preferences.',
    icon: '🎯',
    color: Colors.primary,
  },
  {
    id: 2,
    title: 'Track Applications',
    description: 'Keep track of all your job applications and their status in one place.',
    icon: '📊',
    color: Colors.secondary,
  },
  {
    id: 3,
    title: 'Build Your Profile',
    description: 'Create a compelling profile that showcases your skills and experience.',
    icon: '👤',
    color: Colors.accent,
  },
  {
    id: 4,
    title: 'Get Notified',
    description: 'Stay updated with job matches, application updates, and career opportunities.',
    icon: '🔔',
    color: Colors.success,
  },
];

const OnboardingScreen: React.FC = () => {
  const theme = useTheme();
  const { state, login, navigateToScreen } = useApp();
  const isDark = state.theme === 'dark';
  
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  
  const scrollX = useSharedValue(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < onboardingSlides.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    }
  };

  const handleSkip = () => {
    navigateToScreen('login');
  };

  const handleGetStarted = () => {
    navigateToScreen('login');
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth,
    ];

    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0, 1, 0],
        Extrapolate.CLAMP
      );

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ scale }],
      };
    });

    return (
      <Animated.View key={slide.id} style={[styles.slide, animatedStyle]}>
        <View style={styles.slideContent}>
          <View style={[styles.iconContainer, { backgroundColor: slide.color }]}>
            <Text style={styles.icon}>{slide.icon}</Text>
          </View>
          
          <Text 
            variant="headlineMedium" 
            style={[
              styles.title,
              { color: isDark ? Colors.white : Colors.textPrimary }
            ]}
          >
            {slide.title}
          </Text>
          
          <Text 
            variant="bodyLarge" 
            style={[
              styles.description,
              { color: isDark ? Colors.gray : Colors.textSecondary }
            ]}
          >
            {slide.description}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {onboardingSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === currentPage 
                  ? (isDark ? Colors.primary : Colors.primary)
                  : (isDark ? Colors.gray : Colors.border),
                width: index === currentPage ? 24 : 8,
              }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? Colors.background : Colors.background }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Button 
          mode="text" 
          onPress={handleSkip}
          textColor={isDark ? Colors.gray : Colors.textSecondary}
        >
          Skip
        </Button>
      </View>

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => handlePageChange(e.nativeEvent.position)}
        onPageScroll={(e) => {
          scrollX.value = e.nativeEvent.position * screenWidth + e.nativeEvent.offset;
        }}
      >
        {onboardingSlides.map((slide, index) => renderSlide(slide, index))}
      </PagerView>

      <View style={styles.footer}>
        {renderPagination()}
        
        <View style={styles.buttonContainer}>
          {currentPage < onboardingSlides.length - 1 ? (
            <Button
              mode="contained"
              onPress={handleNext}
              style={styles.nextButton}
              buttonColor={isDark ? Colors.primary : Colors.primary}
            >
              Next
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleGetStarted}
              style={styles.getStartedButton}
              buttonColor={isDark ? Colors.primary : Colors.primary}
            >
              Get Started
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
  },
  pager: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Sizes.xl,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.xxl,
    elevation: Sizes.elevation3,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Sizes.lg,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Sizes.lg,
    paddingBottom: Sizes.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.xl,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    // Additional styles if needed
  },
  nextButton: {
    borderRadius: Sizes.radiusMd,
  },
  getStartedButton: {
    borderRadius: Sizes.radiusMd,
  },
});

export default OnboardingScreen;
