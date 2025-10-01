import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface OnboardingIllustrationFallbackProps {
  type: 'job-search' | 'track-applications' | 'build-profile' | 'notifications';
  size?: number;
  color?: string;
}

const OnboardingIllustrationFallback: React.FC<OnboardingIllustrationFallbackProps> = ({
  type,
  size = 200,
  color = '#1976D2'
}) => {
  const getIconName = () => {
    switch (type) {
      case 'job-search':
        return 'briefcase-search';
      case 'track-applications':
        return 'file-document-multiple';
      case 'build-profile':
        return 'account-edit';
      case 'notifications':
        return 'bell-ring';
      default:
        return 'briefcase-search';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'job-search':
        return '#E3F2FD';
      case 'track-applications':
        return '#F3E5F5';
      case 'build-profile':
        return '#E8F5E8';
      case 'notifications':
        return '#FFF3E0';
      default:
        return '#E3F2FD';
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.backgroundCircle, { backgroundColor: getBackgroundColor() }]}>
        <MaterialCommunityIcons 
          name={getIconName()} 
          size={size * 0.4} 
          color={color} 
        />
      </View>
      
      {/* Additional decorative elements */}
      <View style={[styles.decorativeCircle1, { backgroundColor: color, opacity: 0.1 }]} />
      <View style={[styles.decorativeCircle2, { backgroundColor: color, opacity: 0.05 }]} />
      <View style={[styles.decorativeCircle3, { backgroundColor: color, opacity: 0.08 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    width: '80%',
    height: '80%',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    top: 20,
    right: 30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    bottom: 30,
    left: 20,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    top: 50,
    left: 10,
  },
});

export default OnboardingIllustrationFallback;
