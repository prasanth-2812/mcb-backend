import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, useTheme, Divider, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import NotificationItem from '../components/NotificationItem';
import { Notification } from '../types';
import notificationsData from '../data/notifications.json';

const NotificationsScreen: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groupedNotifications, setGroupedNotifications] = useState<{
    today: Notification[];
    thisWeek: Notification[];
    older: Notification[];
  }>({ today: [], thisWeek: [], older: [] });
  
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    // Load notifications if not already loaded
    if (state.notifications.length === 0) {
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notificationsData });
    }

    // Animate content entrance
    contentOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  useEffect(() => {
    // Group notifications by time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const grouped = {
      today: [] as Notification[],
      thisWeek: [] as Notification[],
      older: [] as Notification[]
    };

    state.notifications.forEach(notification => {
      const notificationDate = new Date(notification.createdAt);
      
      if (notificationDate >= today) {
        grouped.today.push(notification);
      } else if (notificationDate >= weekAgo) {
        grouped.thisWeek.push(notification);
      } else {
        grouped.older.push(notification);
      }
    });

    setGroupedNotifications(grouped);
    setNotifications(state.notifications);
  }, [state.notifications]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const getNotificationIcon = (type: string, priority: string): string => {
    if (priority === 'high') return 'alert-circle-outline';
    
    switch (type) {
      case 'interview':
        return 'calendar-clock-outline';
      case 'application':
        return 'file-document-outline';
      case 'recommendation':
        return 'lightbulb-outline';
      case 'profile':
        return 'account-circle-outline';
      case 'deadline':
        return 'clock-alert-outline';
      case 'rejection':
        return 'close-circle-outline';
      case 'company':
        return 'domain';
      case 'assessment':
        return 'school-outline';
      case 'tip':
        return 'information-outline';
      case 'digest':
        return 'newspaper-outline';
      default:
        return 'bell-outline';
    }
  };

  const getNotificationColor = (type: string, priority: string): string => {
    if (priority === 'high') return '#F44336';
    
    switch (type) {
      case 'interview':
        return '#4CAF50';
      case 'application':
        return '#1976D2';
      case 'recommendation':
        return '#FF9800';
      case 'deadline':
        return '#F44336';
      case 'rejection':
        return '#9E9E9E';
      case 'company':
        return '#2196F3';
      default:
        return '#666666';
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const markAsRead = (notificationId: string) => {
    dispatch({ 
      type: 'UPDATE_NOTIFICATION', 
      payload: { id: notificationId, isRead: true } 
    });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const isUrgent = item.priority === 'high';
    const iconName = getNotificationIcon(item.type, item.priority);
    const iconColor = getNotificationColor(item.type, item.priority);

    return (
      <Animated.View style={contentAnimatedStyle}>
        <Card style={[
          styles.notificationCard,
          { 
            backgroundColor: isDark ? Colors.darkGray : Colors.white,
            borderLeftWidth: isUrgent ? 4 : 0,
            borderLeftColor: isUrgent ? '#F44336' : 'transparent'
          }
        ]}>
          <Card.Content style={styles.notificationContent}>
            <TouchableOpacity 
              onPress={() => markAsRead(item.id)}
              style={styles.notificationTouchable}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationIconContainer}>
                  <MaterialCommunityIcons 
                    name={iconName} 
                    size={24} 
                    color={iconColor} 
                  />
                  {!item.isRead && (
                    <View style={styles.unreadDot} />
                  )}
                </View>
                
                <View style={styles.notificationInfo}>
                  <View style={styles.notificationTitleRow}>
                    <Text 
                      variant="titleMedium" 
                      style={[
                        styles.notificationTitle,
                        { 
                          color: isDark ? Colors.white : Colors.textPrimary,
                          fontWeight: item.isRead ? '400' : '600'
                        }
                      ]}
                    >
                      {item.title}
                    </Text>
                    {isUrgent && (
                      <Chip 
                        style={styles.urgentChip}
                        textStyle={styles.urgentChipText}
                      >
                        Urgent
                      </Chip>
                    )}
                  </View>
                  
                  <Text 
                    variant="bodyMedium" 
                    style={[
                      styles.notificationMessage,
                      { color: isDark ? Colors.gray : Colors.textSecondary }
                    ]}
                  >
                    {item.message}
                  </Text>
                  
                  <View style={styles.notificationMeta}>
                    <Text 
                      variant="bodySmall" 
                      style={[
                        styles.notificationTime,
                        { color: isDark ? Colors.gray : Colors.textSecondary }
                      ]}
                    >
                      {formatTimeAgo(item.createdAt)}
                    </Text>
                    
                    <View style={styles.notificationType}>
                      <Chip 
                        style={[styles.typeChip, { backgroundColor: iconColor + '20' }]}
                        textStyle={[styles.typeChipText, { color: iconColor }]}
                      >
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Chip>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };

  const renderNotificationGroup = (title: string, notifications: Notification[]) => {
    if (notifications.length === 0) return null;

    return (
      <View style={styles.groupContainer}>
        <View style={styles.groupHeader}>
          <Text variant="titleMedium" style={styles.groupTitle}>
            {title}
          </Text>
          <Text variant="bodySmall" style={styles.groupCount}>
            {notifications.length} notifications
          </Text>
        </View>
        
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const getUrgentCount = () => {
    return notifications.filter(n => n.priority === 'high' && !n.isRead).length;
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? Colors.background : Colors.background }
    ]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? Colors.background : Colors.background}
      />
      
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text 
              variant="headlineMedium" 
              style={[
                styles.title,
                { color: isDark ? Colors.white : Colors.textPrimary }
              ]}
            >
              Notifications
            </Text>
            {getUnreadCount() > 0 && (
              <TouchableOpacity onPress={markAllAsRead}>
                <Text variant="bodyMedium" style={styles.markAllText}>
                  Mark All Read
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#1976D2" />
              <Text variant="bodyMedium" style={styles.statText}>
                {getUnreadCount()} unread
              </Text>
            </View>
            
            {getUrgentCount() > 0 && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#F44336" />
                <Text variant="bodyMedium" style={[styles.statText, styles.urgentStatText]}>
                  {getUrgentCount()} urgent
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Notifications by Group */}
        <FlatList
          data={[
            { title: 'Today', notifications: groupedNotifications.today },
            { title: 'This Week', notifications: groupedNotifications.thisWeek },
            { title: 'Older', notifications: groupedNotifications.older }
          ]}
          renderItem={({ item }) => renderNotificationGroup(item.title, item.notifications)}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.groupSeparator} />}
        />

        {/* Empty State */}
        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-outline" size={64} color="#B0BEC5" />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              No notifications yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              You'll receive updates about your applications and job recommendations here
            </Text>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
  },
  markAllText: {
    color: '#1976D2',
    fontWeight: '500',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 6,
    color: '#666666',
  },
  urgentStatText: {
    color: '#F44336',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  groupCount: {
    color: '#666666',
  },
  groupSeparator: {
    height: 20,
  },
  separator: {
    height: 8,
  },
  notificationCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationContent: {
    padding: 0,
  },
  notificationTouchable: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
  },
  notificationIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1976D2',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    flex: 1,
    marginRight: 8,
  },
  urgentChip: {
    backgroundColor: '#F44336',
    height: 20,
  },
  urgentChipText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  notificationMessage: {
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    opacity: 0.7,
  },
  notificationType: {
    flexDirection: 'row',
  },
  typeChip: {
    height: 20,
  },
  typeChipText: {
    fontSize: 10,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#999999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default NotificationsScreen;