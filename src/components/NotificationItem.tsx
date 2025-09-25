import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Notification } from '../types';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  onMarkAsRead?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onPress, 
  onMarkAsRead 
}) => {
  const theme = useTheme();
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    onPress();
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead && !notification.isRead) {
      opacity.value = withTiming(0.7, { duration: 200 });
      onMarkAsRead(notification.id);
    }
  };

  const getNotificationIcon = () => {
    // Check for urgent priority first
    if (notification.priority === 'high') {
      return 'alert-circle-outline';
    }
    
    switch (notification.type) {
      case 'application_update':
        return 'bell-outline';
      case 'interview':
        return 'calendar-clock-outline';
      case 'job_match':
        return 'briefcase-outline';
      case 'application_rejected':
        return 'close-circle-outline';
      case 'profile_reminder':
        return 'account-circle-outline';
      case 'weekly_digest':
        return 'email-outline';
      default:
        return 'bell-outline';
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case 'application_update':
        return Colors.info;
      case 'interview':
        return Colors.warning;
      case 'job_match':
        return Colors.success;
      case 'application_rejected':
        return Colors.error;
      case 'profile_reminder':
        return Colors.primary;
      case 'weekly_digest':
        return Colors.gray;
      default:
        return Colors.primary;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'high':
        return Colors.error;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.gray;
      default:
        return Colors.primary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Animated.View style={animatedStyle}>
      <Card 
        style={[
          styles.card,
          { 
            backgroundColor: isDark ? Colors.darkGray : Colors.white,
            borderLeftColor: getNotificationColor(),
            borderLeftWidth: notification.isRead ? 0 : 4,
          }
        ]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={notification.title}
        accessibilityHint="Tap to view notification details"
      >
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <IconButton
                icon={() => <MaterialCommunityIcons name={getNotificationIcon()} size={24} color={getNotificationColor()} />}
                style={[
                  styles.icon,
                  { backgroundColor: isDark ? Colors.lightGray : Colors.lightGray }
                ]}
              />
            </View>
            
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text 
                  variant="titleSmall" 
                  style={[
                    styles.title,
                    { 
                      color: isDark ? Colors.white : Colors.textPrimary,
                      fontWeight: notification.isRead ? '400' : '600'
                    }
                  ]}
                  numberOfLines={2}
                >
                  {notification.title}
                </Text>
                {!notification.isRead && (
                  <View 
                    style={[
                      styles.unreadDot,
                      { backgroundColor: getPriorityColor() }
                    ]} 
                  />
                )}
              </View>
              
              <Text 
                variant="bodyMedium" 
                style={[
                  styles.message,
                  { color: isDark ? Colors.gray : Colors.textSecondary }
                ]}
                numberOfLines={3}
              >
                {notification.message}
              </Text>
              
              <View style={styles.footer}>
                <Text 
                  variant="bodySmall" 
                  style={[
                    styles.timestamp,
                    { color: isDark ? Colors.gray : Colors.textSecondary }
                  ]}
                >
                  {formatTimestamp(notification.timestamp)}
                </Text>
                
                <View style={styles.priorityContainer}>
                  <View 
                    style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor() }
                    ]} 
                  />
                  <Text 
                    variant="bodySmall" 
                    style={[
                      styles.priorityText,
                      { color: getPriorityColor() }
                    ]}
                  >
                    {notification.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Sizes.md,
    marginVertical: Sizes.xs,
    elevation: Sizes.elevation1,
    borderRadius: Sizes.radiusMd,
  },
  content: {
    padding: Sizes.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: Sizes.md,
  },
  icon: {
    margin: 0,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Sizes.xs,
  },
  title: {
    flex: 1,
    marginRight: Sizes.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: Sizes.xs,
  },
  message: {
    marginBottom: Sizes.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: Sizes.fontSizeXs,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Sizes.xs,
  },
  priorityText: {
    fontSize: Sizes.fontSizeXs,
    fontWeight: '600',
  },
});

export default NotificationItem;
