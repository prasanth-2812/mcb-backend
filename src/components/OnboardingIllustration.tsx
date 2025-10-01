import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { 
  Path, 
  Circle, 
  Rect, 
  G, 
  Defs, 
  LinearGradient, 
  Stop,
  Ellipse,
  Polygon
} from 'react-native-svg';

interface OnboardingIllustrationProps {
  type: 'job-search' | 'track-applications' | 'build-profile' | 'notifications';
  size?: number;
  color?: string;
}

const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({
  type,
  size = 200,
  color = '#1976D2'
}) => {
  const renderJobSearch = () => (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="jobSearchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </LinearGradient>
      </Defs>
      
      {/* Background Circle */}
      <Circle cx="100" cy="100" r="95" fill="url(#jobSearchGradient)" opacity="0.1" />
      
      {/* Briefcase */}
      <G transform="translate(60, 80)">
        <Rect x="0" y="20" width="80" height="50" rx="8" fill={color} opacity="0.9" />
        <Rect x="10" y="10" width="60" height="15" rx="4" fill={color} opacity="0.7" />
        <Rect x="15" y="5" width="50" height="8" rx="2" fill={color} opacity="0.5" />
        <Circle cx="20" cy="45" r="3" fill="#FFFFFF" opacity="0.8" />
        <Circle cx="60" cy="45" r="3" fill="#FFFFFF" opacity="0.8" />
      </G>
      
      {/* Search Magnifying Glass */}
      <G transform="translate(120, 50)">
        <Circle cx="0" cy="0" r="25" fill="none" stroke={color} strokeWidth="4" opacity="0.8" />
        <Path d="M20 20 L35 35" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      </G>
      
      {/* Job Cards */}
      <G transform="translate(30, 140)">
        <Rect x="0" y="0" width="40" height="25" rx="4" fill={color} opacity="0.3" />
        <Rect x="2" y="2" width="36" height="21" rx="2" fill="#FFFFFF" opacity="0.9" />
        <Rect x="5" y="5" width="30" height="3" rx="1" fill={color} opacity="0.6" />
        <Rect x="5" y="10" width="20" height="2" rx="1" fill={color} opacity="0.4" />
        <Rect x="5" y="14" width="25" height="2" rx="1" fill={color} opacity="0.4" />
      </G>
      
      <G transform="translate(130, 140)">
        <Rect x="0" y="0" width="40" height="25" rx="4" fill={color} opacity="0.3" />
        <Rect x="2" y="2" width="36" height="21" rx="2" fill="#FFFFFF" opacity="0.9" />
        <Rect x="5" y="5" width="30" height="3" rx="1" fill={color} opacity="0.6" />
        <Rect x="5" y="10" width="20" height="2" rx="1" fill={color} opacity="0.4" />
        <Rect x="5" y="14" width="25" height="2" rx="1" fill={color} opacity="0.4" />
      </G>
      
      {/* Success Checkmarks */}
      <G transform="translate(50, 120)">
        <Circle cx="0" cy="0" r="8" fill="#4CAF50" />
        <Path d="M-3 -1 L-1 1 L3 -3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
      
      <G transform="translate(150, 120)">
        <Circle cx="0" cy="0" r="8" fill="#4CAF50" />
        <Path d="M-3 -1 L-1 1 L3 -3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );

  const renderTrackApplications = () => (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </LinearGradient>
      </Defs>
      
      {/* Background Circle */}
      <Circle cx="100" cy="100" r="95" fill="url(#trackGradient)" opacity="0.1" />
      
      {/* Document Stack */}
      <G transform="translate(70, 60)">
        <Rect x="0" y="0" width="60" height="80" rx="4" fill={color} opacity="0.9" />
        <Rect x="5" y="5" width="50" height="70" rx="2" fill="#FFFFFF" opacity="0.95" />
        
        {/* Document Lines */}
        <Rect x="10" y="15" width="40" height="2" rx="1" fill={color} opacity="0.6" />
        <Rect x="10" y="20" width="35" height="2" rx="1" fill={color} opacity="0.4" />
        <Rect x="10" y="25" width="30" height="2" rx="1" fill={color} opacity="0.4" />
        <Rect x="10" y="30" width="40" height="2" rx="1" fill={color} opacity="0.6" />
        <Rect x="10" y="35" width="25" height="2" rx="1" fill={color} opacity="0.4" />
        <Rect x="10" y="40" width="35" height="2" rx="1" fill={color} opacity="0.4" />
        <Rect x="10" y="45" width="30" height="2" rx="1" fill={color} opacity="0.4" />
        <Rect x="10" y="50" width="40" height="2" rx="1" fill={color} opacity="0.6" />
        <Rect x="10" y="55" width="25" height="2" rx="1" fill={color} opacity="0.4" />
        <Rect x="10" y="60" width="35" height="2" rx="1" fill={color} opacity="0.4" />
      </G>
      
      {/* Progress Bar */}
      <G transform="translate(50, 160)">
        <Rect x="0" y="0" width="100" height="8" rx="4" fill={color} opacity="0.2" />
        <Rect x="0" y="0" width="75" height="8" rx="4" fill={color} opacity="0.8" />
        <Circle cx="75" cy="4" r="6" fill="#FFFFFF" />
      </G>
      
      {/* Status Icons */}
      <G transform="translate(40, 100)">
        <Circle cx="0" cy="0" r="12" fill="#4CAF50" />
        <Path d="M-4 -2 L-2 0 L4 -4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
      
      <G transform="translate(80, 100)">
        <Circle cx="0" cy="0" r="12" fill="#FF9800" />
        <Path d="M-3 -3 L3 3 M3 -3 L-3 3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </G>
      
      <G transform="translate(120, 100)">
        <Circle cx="0" cy="0" r="12" fill="#2196F3" />
        <Path d="M-4 0 L0 4 L4 0" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
      
      <G transform="translate(160, 100)">
        <Circle cx="0" cy="0" r="12" fill="#9C27B0" />
        <Path d="M-3 -3 L3 3 M3 -3 L-3 3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </G>
    </Svg>
  );

  const renderBuildProfile = () => (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </LinearGradient>
      </Defs>
      
      {/* Background Circle */}
      <Circle cx="100" cy="100" r="95" fill="url(#profileGradient)" opacity="0.1" />
      
      {/* Profile Card */}
      <G transform="translate(50, 50)">
        <Rect x="0" y="0" width="100" height="120" rx="8" fill="#FFFFFF" opacity="0.95" />
        <Rect x="0" y="0" width="100" height="40" rx="8" fill={color} opacity="0.9" />
        
        {/* Profile Picture */}
        <Circle cx="50" cy="30" r="15" fill="#FFFFFF" opacity="0.9" />
        <Circle cx="50" cy="30" r="12" fill={color} opacity="0.7" />
        <Path d="M44 30 C44 26, 46 24, 50 24 C54 24, 56 26, 56 30 C56 34, 54 36, 50 36 C46 36, 44 34, 44 30" fill="#FFFFFF" />
        <Path d="M42 38 C42 35, 44 33, 50 33 C56 33, 58 35, 58 38" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        
        {/* Profile Info */}
        <Rect x="10" y="50" width="80" height="3" rx="1" fill={color} opacity="0.6" />
        <Rect x="10" y="58" width="60" height="2" rx="1" fill={color} opacity="0.4" />
        <Rect x="10" y="65" width="70" height="2" rx="1" fill={color} opacity="0.4" />
        
        {/* Skills Tags */}
        <G transform="translate(10, 75)">
          <Rect x="0" y="0" width="25" height="12" rx="6" fill={color} opacity="0.3" />
          <Rect x="2" y="2" width="21" height="8" rx="4" fill={color} opacity="0.6" />
          <Rect x="30" y="0" width="20" height="12" rx="6" fill={color} opacity="0.3" />
          <Rect x="32" y="2" width="16" height="8" rx="4" fill={color} opacity="0.6" />
          <Rect x="55" y="0" width="30" height="12" rx="6" fill={color} opacity="0.3" />
          <Rect x="57" y="2" width="26" height="8" rx="4" fill={color} opacity="0.6" />
        </G>
        
        {/* Experience Bar */}
        <G transform="translate(10, 95)">
          <Rect x="0" y="0" width="80" height="4" rx="2" fill={color} opacity="0.2" />
          <Rect x="0" y="0" width="60" height="4" rx="2" fill={color} opacity="0.8" />
        </G>
      </G>
      
      {/* Edit Icon */}
      <G transform="translate(140, 80)">
        <Circle cx="0" cy="0" r="20" fill={color} opacity="0.9" />
        <Path d="M-8 -8 L8 8 M8 -8 L-8 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <Circle cx="0" cy="0" r="2" fill="#FFFFFF" />
      </G>
      
      {/* Plus Icons for Adding Skills */}
      <G transform="translate(30, 140)">
        <Circle cx="0" cy="0" r="8" fill="#4CAF50" />
        <Path d="M-4 0 L4 0 M0 -4 L0 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </G>
      
      <G transform="translate(170, 140)">
        <Circle cx="0" cy="0" r="8" fill="#4CAF50" />
        <Path d="M-4 0 L4 0 M0 -4 L0 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </G>
    </Svg>
  );

  const renderNotifications = () => (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="notificationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </LinearGradient>
      </Defs>
      
      {/* Background Circle */}
      <Circle cx="100" cy="100" r="95" fill="url(#notificationGradient)" opacity="0.1" />
      
      {/* Phone/Device */}
      <G transform="translate(60, 40)">
        <Rect x="0" y="0" width="80" height="140" rx="12" fill="#2C2C2C" opacity="0.9" />
        <Rect x="5" y="10" width="70" height="120" rx="8" fill="#FFFFFF" opacity="0.95" />
        
        {/* Notification Bell */}
        <G transform="translate(40, 20)">
          <Path d="M0 0 C-8 -4, -12 4, -8 8 C-4 12, 0 8, 4 8 C8 4, 4 -4, 0 0" fill={color} opacity="0.9" />
          <Circle cx="0" cy="4" r="2" fill="#FFFFFF" />
          <Rect x="-1" y="8" width="2" height="6" fill={color} opacity="0.9" />
        </G>
        
        {/* Notification Items */}
        <G transform="translate(10, 40)">
          <Rect x="0" y="0" width="60" height="15" rx="3" fill={color} opacity="0.1" />
          <Rect x="2" y="2" width="56" height="11" rx="2" fill="#FFFFFF" opacity="0.9" />
          <Circle cx="8" cy="7" r="3" fill={color} opacity="0.6" />
          <Rect x="15" y="4" width="35" height="2" rx="1" fill={color} opacity="0.6" />
          <Rect x="15" y="7" width="25" height="1" rx="0.5" fill={color} opacity="0.4" />
        </G>
        
        <G transform="translate(10, 60)">
          <Rect x="0" y="0" width="60" height="15" rx="3" fill={color} opacity="0.1" />
          <Rect x="2" y="2" width="56" height="11" rx="2" fill="#FFFFFF" opacity="0.9" />
          <Circle cx="8" cy="7" r="3" fill="#FF9800" opacity="0.6" />
          <Rect x="15" y="4" width="35" height="2" rx="1" fill={color} opacity="0.6" />
          <Rect x="15" y="7" width="25" height="1" rx="0.5" fill={color} opacity="0.4" />
        </G>
        
        <G transform="translate(10, 80)">
          <Rect x="0" y="0" width="60" height="15" rx="3" fill={color} opacity="0.1" />
          <Rect x="2" y="2" width="56" height="11" rx="2" fill="#FFFFFF" opacity="0.9" />
          <Circle cx="8" cy="7" r="3" fill="#4CAF50" opacity="0.6" />
          <Rect x="15" y="4" width="35" height="2" rx="1" fill={color} opacity="0.6" />
          <Rect x="15" y="7" width="25" height="1" rx="0.5" fill={color} opacity="0.4" />
        </G>
      </G>
      
      {/* Notification Badge */}
      <G transform="translate(130, 30)">
        <Circle cx="0" cy="0" r="12" fill="#F44336" />
        <Text x="0" y="4" textAnchor="middle" fontSize="10" fill="#FFFFFF" fontWeight="bold">3</Text>
      </G>
      
      {/* Success Checkmarks */}
      <G transform="translate(30, 120)">
        <Circle cx="0" cy="0" r="8" fill="#4CAF50" />
        <Path d="M-3 -1 L-1 1 L3 -3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
      
      <G transform="translate(170, 120)">
        <Circle cx="0" cy="0" r="8" fill="#4CAF50" />
        <Path d="M-3 -1 L-1 1 L3 -3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );

  const renderIllustration = () => {
    switch (type) {
      case 'job-search':
        return renderJobSearch();
      case 'track-applications':
        return renderTrackApplications();
      case 'build-profile':
        return renderBuildProfile();
      case 'notifications':
        return renderNotifications();
      default:
        return renderJobSearch();
    }
  };

  return (
    <View style={styles.container}>
      {renderIllustration()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingIllustration;
