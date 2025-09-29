import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, useTheme, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { Notification } from '../types';
import notificationsData from '../data/notifications.json';

const NotificationsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groupedNotifications, setGroupedNotifications] = useState<{
    today: Notification[];
    thisWeek: Notification[];
    older: Notification[];
  }>({ today: [], thisWeek: [], older: [] });
  

  useEffect(() => {
    // Load notifications if not already loaded
    if (state.notifications.length === 0) {
      const transformedNotifications = notificationsData.map(notification => ({
        ...notification,
        timestamp: notification.createdAt
      }));
      dispatch({ type: 'SET_NOTIFICATIONS', payload: transformedNotifications as any });
    }

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
      const notificationDate = new Date(notification.timestamp);
      
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

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'interview':
        // Navigate to applications screen
        (navigation as any).navigate('Applications');
        break;
      case 'application':
      case 'application_update':
        // Navigate to applications screen
        (navigation as any).navigate('Applications');
        break;
      case 'recommendation':
      case 'job_match':
        // Navigate to jobs screen
        (navigation as any).navigate('Jobs');
        break;
      case 'profile':
      case 'profile_reminder':
        // Navigate to profile screen
        (navigation as any).navigate('Profile');
        break;
      default:
        // Default to home screen
        (navigation as any).navigate('Home');
        break;
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
      type: 'MARK_NOTIFICATION_READ', 
      payload: notificationId 
    });
  };

  const markAllAsRead = () => {
    // Mark all notifications as read
    state.notifications.forEach(notification => {
      if (!notification.isRead) {
        dispatch({ 
          type: 'MARK_NOTIFICATION_READ', 
          payload: notification.id 
        });
      }
    });
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const getUrgentCount = () => {
    return notifications.filter(n => n.priority === 'high' && !n.isRead).length;
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const isUrgent = item.priority === 'high';
    const isUnread = !item.isRead;
    const iconName = getNotificationIcon(item.type, item.priority);
    const iconColor = getNotificationColor(item.type, item.priority);

    return (
      <Card style={[
        styles.notificationCard,
        {
          backgroundColor: isUnread ? '#F8F9FA' : '#FFFFFF',
          borderLeftWidth: isUrgent ? 3 : 0,
          borderLeftColor: isUrgent ? '#F44336' : 'transparent'
        }
      ]}>
        <Card.Content style={styles.notificationContent}>
          <TouchableOpacity 
            onPress={() => handleNotificationPress(item)}
            style={styles.notificationTouchable}
            activeOpacity={0.7}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.notificationIconContainer}>
                <MaterialCommunityIcons 
                  name={iconName} 
                  size={20} 
                  color={iconColor} 
                />
              </View>
              
              <View style={styles.notificationInfo}>
                <View style={styles.notificationTitleRow}>
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.notificationTitle,
                      { 
                        color: '#333333',
                        fontWeight: isUnread ? '500' : '400'
                      }
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text 
                    variant="bodySmall" 
                    style={styles.notificationTime}
                  >
                    {formatTimeAgo(item.timestamp)}
                  </Text>
                </View>
                
                <Text 
                  variant="bodyMedium" 
                  style={styles.notificationMessage}
                >
                  {item.message}
                </Text>
                
                <View style={styles.notificationMeta}>
                  <Chip 
                    style={[styles.typeChip, { backgroundColor: iconColor + '15' }]}
                    textStyle={[styles.typeChipText, { color: iconColor }]}
                    compact={false}
                  >
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Chip>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    );
  };

  const renderNotificationGroup = (title: string, notifications: Notification[]) => {
    if (notifications.length === 0) return null;

    return (
      <View style={styles.groupContainer}>
        <Text variant="titleSmall" style={styles.groupTitle}>
          {title}
        </Text>
        
        <View style={styles.groupContent}>
          {notifications.map((notification, index) => (
            <View key={notification.id}>
              {renderNotificationItem({ item: notification })}
              {index < notifications.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.content}>
        {/* Simple Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text variant="headlineSmall" style={styles.title}>
              Notifications
            </Text>
            {getUnreadCount() > 0 && (
              <Button 
                mode="text" 
                onPress={markAllAsRead}
                textColor="#1976D2"
                style={styles.markAllButton}
                labelStyle={styles.markAllText}
              >
                Mark All Read
              </Button>
            )}
          </View>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="bell-outline" size={16} color="#1976D2" />
              <Text variant="bodySmall" style={styles.statText}>
                {getUnreadCount()} unread
              </Text>
            </View>
            
            {getUrgentCount() > 0 && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#F44336" />
                <Text variant="bodySmall" style={[styles.statText, styles.urgentStatText]}>
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
            <MaterialCommunityIcons name="bell-outline" size={48} color="#B0BEC5" />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No notifications yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              You'll receive updates about your applications and job recommendations here
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F8F9FA',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: '600',
    color: '#333333',
  },
  markAllButton: {
    margin: 0,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 6,
    color: '#666666',
    fontSize: 12,
  },
  urgentStatText: {
    color: '#F44336',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupContent: {
    gap: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  groupSeparator: {
    height: 16,
  },
  notificationCard: {
    borderRadius: 8,
    elevation: 0,
    backgroundColor: '#FFFFFF',
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
    marginRight: 12,
    marginTop: 2,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  notificationTitle: {
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  notificationTime: {
    color: '#999999',
    fontSize: 12,
  },
  notificationMessage: {
    color: '#666666',
    lineHeight: 18,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  typeChip: {
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 8,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;