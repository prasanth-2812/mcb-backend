import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
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
  quote: string;
  icon: string;
  color: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Find Your Dream Job',
    description: 'Discover thousands of job opportunities tailored to your skills and preferences.',
    quote: 'From small beginnings to big dreams, every job matters here.',
    icon: 'briefcase-search-outline',
    color: '#1976D2',
  },
  {
    id: 2,
    title: 'Track Applications',
    description: 'Keep track of all your job applications and their status in one place.',
    quote: 'Stay organized, whether it\'s a government post or your first step in a career.',
    icon: 'file-document-outline',
    color: '#1976D2',
  },
  {
    id: 3,
    title: 'Build Your Profile',
    description: 'Create a compelling profile that showcases your skills and experience.',
    quote: 'Showcase your skills, no matter how big or small – opportunities await you.',
    icon: 'account-circle-outline',
    color: '#1976D2',
  },
  {
    id: 4,
    title: 'Get Notified',
    description: 'Stay updated with job matches, application updates, and career opportunities.',
    quote: 'Never miss an update, because the right job can change everything.',
    icon: 'bell-outline',
    color: '#1976D2',
  },
];

const OnboardingScreen: React.FC = () => {
  const theme = useTheme();
  const { state, login, navigateToScreen } = useApp();
  const isDark = state.theme === 'dark';
  
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  
  const scrollX = useSharedValue(0);
  const iconScale = useSharedValue(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Bounce animation for icon
    iconScale.value = withSpring(1.2, { damping: 8, stiffness: 100 }, () => {
      iconScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    });
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

    const iconAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: iconScale.value }],
      };
    });

    return (
      <Animated.View key={slide.id} style={[styles.slide, animatedStyle]}>
        <View style={styles.slideContent}>
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            <MaterialCommunityIcons 
              name={slide.icon} 
              size={48} 
              color="#FFFFFF" 
            />
          </Animated.View>
          
          <Text 
            variant="headlineLarge" 
            style={styles.title}
          >
            {slide.title}
          </Text>
          
          <Text 
            variant="bodyLarge" 
            style={styles.description}
          >
            {slide.description}
          </Text>

          <Text 
            variant="bodyMedium" 
            style={styles.quote}
          >
            "{slide.quote}"
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {onboardingSlides.map((_, index) => {
          const isActive = index === currentPage;
          
          const dotAnimatedStyle = useAnimatedStyle(() => {
            const scale = withSpring(isActive ? 1.2 : 1, {
              damping: 8,
              stiffness: 100,
            });
            
            return {
              transform: [{ scale }],
            };
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: isActive ? '#1976D2' : '#E0E0E0',
                  width: isActive ? 24 : 8,
                },
                dotAnimatedStyle,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with Logo and Skip Button */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Button 
          mode="text" 
          onPress={handleSkip}
          textColor="#1976D2"
          style={styles.skipButton}
        >
          Skip
        </Button>
      </View>

      {/* PagerView */}
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

      {/* Footer with Pagination and Buttons */}
      <View style={styles.footer}>
        {renderPagination()}
        
        <View style={styles.buttonContainer}>
          {currentPage < onboardingSlides.length - 1 ? (
            <Button
              mode="contained"
              onPress={handleNext}
              style={styles.nextButton}
              buttonColor="#1976D2"
              contentStyle={styles.buttonContent}
            >
              Next
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleGetStarted}
              style={styles.getStartedButton}
              buttonColor="#1976D2"
              contentStyle={styles.buttonContent}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logo: {
    width: 120,
    height: 40,
  },
  skipButton: {
    marginLeft: 16,
  },
  pager: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    // Gradient background
    backgroundColor: '#1976D2',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333333',
    fontSize: 28,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    color: '#666666',
    fontSize: 16,
  },
  quote: {
    textAlign: 'center',
    lineHeight: 22,
    color: '#1976D2',
    fontSize: 14,
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    width: '100%',
  },
  nextButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  getStartedButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
});

export default OnboardingScreen;
