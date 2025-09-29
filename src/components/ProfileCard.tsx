import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Text, ProgressBar, useTheme } from 'react-native-paper';
import { UserProfile } from '../types';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

interface ProfileCardProps {
  profile: UserProfile;
  onPress?: () => void;
  showCompletion?: boolean;
  compact?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onPress, 
  showCompletion = true,
  compact = false 
}) => {
  const theme = useTheme();
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return Colors.success;
    if (percentage >= 60) return Colors.warning;
    return Colors.error;
  };

  const getCompletionText = (percentage: number) => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good progress';
    return 'Needs attention';
  };

  return (
    <Card 
      style={[
        styles.card, 
        compact && styles.compactCard,
        { backgroundColor: isDark ? Colors.darkGray : Colors.white }
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Profile for ${profile.name}`}
      accessibilityHint="Tap to view full profile"
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.info}>
            <Text 
              variant="titleMedium" 
              style={[styles.name, { color: isDark ? Colors.white : Colors.textPrimary }]}
              numberOfLines={1}
            >
              {profile.name}
            </Text>
            <Text 
              variant="bodyMedium" 
              style={[styles.title, { color: isDark ? Colors.gray : Colors.textSecondary }]}
              numberOfLines={1}
            >
              {profile.preferences.role}
            </Text>
            <Text 
              variant="bodySmall" 
              style={[styles.location, { color: isDark ? Colors.gray : Colors.textSecondary }]}
              numberOfLines={1}
            >
              {profile.location}
            </Text>
          </View>
        </View>

        {showCompletion && (
          <View style={styles.completionSection}>
            <View style={styles.completionHeader}>
              <Text 
                variant="bodySmall" 
                style={[styles.completionLabel, { color: isDark ? Colors.gray : Colors.textSecondary }]}
              >
                Profile Completion
              </Text>
              <Text 
                variant="bodySmall" 
                style={[styles.completionPercentage, { color: getCompletionColor(profile.profileCompletion) }]}
              >
                {profile.profileCompletion}%
              </Text>
            </View>
            <ProgressBar 
              progress={profile.profileCompletion / 100}
              color={getCompletionColor(profile.profileCompletion)}
              style={styles.progressBar}
            />
            <Text 
              variant="bodySmall" 
              style={[styles.completionText, { color: getCompletionColor(profile.profileCompletion) }]}
            >
              {getCompletionText(profile.profileCompletion)}
            </Text>
          </View>
        )}

        {!compact && (
          <View style={styles.skillsSection}>
            <Text 
              variant="bodySmall" 
              style={[styles.skillsLabel, { color: isDark ? Colors.gray : Colors.textSecondary }]}
            >
              Top Skills
            </Text>
            <View style={styles.skills}>
              {profile.skills.slice(0, 4).map((skill, index) => (
                <View 
                  key={index}
                  style={[
                    styles.skillChip,
                    { backgroundColor: isDark ? Colors.lightGray : Colors.lightGray }
                  ]}
                >
                  <Text 
                    variant="bodySmall" 
                    style={[
                      styles.skillText,
                      { color: isDark ? Colors.textPrimary : Colors.textSecondary }
                    ]}
                  >
                    {skill}
                  </Text>
                </View>
              ))}
              {profile.skills.length > 4 && (
                <View 
                  style={[
                    styles.skillChip,
                    { backgroundColor: isDark ? Colors.lightGray : Colors.lightGray }
                  ]}
                >
                  <Text 
                    variant="bodySmall" 
                    style={[
                      styles.skillText,
                      { color: isDark ? Colors.textPrimary : Colors.textSecondary }
                    ]}
                  >
                    +{profile.skills.length - 4}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Sizes.md,
    marginVertical: Sizes.sm,
    elevation: Sizes.elevation2,
    borderRadius: Sizes.radiusMd,
  },
  compactCard: {
    marginHorizontal: 0,
    marginVertical: Sizes.xs,
  },
  content: {
    padding: Sizes.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Sizes.md,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Sizes.md,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    marginBottom: Sizes.xs,
  },
  title: {
    marginBottom: Sizes.xs,
  },
  location: {
    // Additional styles if needed
  },
  completionSection: {
    marginBottom: Sizes.md,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.xs,
  },
  completionLabel: {
    // Additional styles if needed
  },
  completionPercentage: {
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: Sizes.xs,
  },
  completionText: {
    fontSize: Sizes.fontSizeXs,
    fontWeight: '500',
  },
  skillsSection: {
    // Additional styles if needed
  },
  skillsLabel: {
    marginBottom: Sizes.sm,
    fontWeight: '500',
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: Sizes.radiusSm,
    marginRight: Sizes.xs,
    marginBottom: Sizes.xs,
  },
  skillText: {
    fontSize: Sizes.fontSizeXs,
  },
});

export default ProfileCard;
