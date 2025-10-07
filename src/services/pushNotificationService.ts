// Push Notification Service
// import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'job_match' | 'application_update' | 'interview_reminder' | 'general';
  data?: any;
  scheduled?: boolean;
  scheduledTime?: Date;
}

export interface NotificationSettings {
  jobMatches: boolean;
  applicationUpdates: boolean;
  interviewReminders: boolean;
  generalNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

class PushNotificationService {
  private isInitialized = false;
  private notificationSettings: NotificationSettings = {
    jobMatches: true,
    applicationUpdates: true,
    interviewReminders: true,
    generalNotifications: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🔔 Initializing push notifications...');

      // Check if PushNotification is available
      if (!PushNotification || typeof PushNotification.configure !== 'function') {
        console.warn('⚠️ PushNotification not available, skipping initialization');
        this.isInitialized = true;
        return;
      }

      // Configure push notifications
      PushNotification.configure({
        onRegister: (token) => {
          console.log('📱 Push notification token:', token);
          this.saveToken(token.token);
        },
        onNotification: (notification) => {
          console.log('📨 Push notification received:', notification);
          this.handleNotification(notification);
        },
        onAction: (notification) => {
          console.log('🔔 Push notification action:', notification);
          this.handleNotificationAction(notification);
        },
        onRegistrationError: (error) => {
          console.error('❌ Push notification registration error:', error);
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: Platform.OS === 'ios',
      });

      // Create notification channel for Android
      if (Platform.OS === 'android') {
        PushNotification.createChannel(
          {
            channelId: 'mcb-notifications',
            channelName: 'MCB Notifications',
            channelDescription: 'Notifications for job matches and application updates',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          (created) => console.log(`📱 Notification channel created: ${created}`)
        );
      }

      // Load notification settings
      await this.loadNotificationSettings();
      
      this.isInitialized = true;
      console.log('✅ Push notifications initialized');
    } catch (error) {
      console.error('❌ Failed to initialize push notifications:', error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (!PushNotification || typeof PushNotification.requestPermissions !== 'function') {
        console.warn('⚠️ PushNotification.requestPermissions not available');
        return false;
      }
      
      const permissions = await PushNotification.requestPermissions();
      console.log('🔔 Notification permissions:', permissions);
      return permissions.alert && permissions.badge && permissions.sound;
    } catch (error) {
      console.error('❌ Failed to request notification permissions:', error);
      return false;
    }
  }

  async sendLocalNotification(notification: NotificationData): Promise<void> {
    try {
      console.log('📤 Sending local notification:', notification);

      // Check if notifications are enabled for this type
      if (!this.isNotificationEnabled(notification.type)) {
        console.log('🔕 Notifications disabled for type:', notification.type);
        return;
      }

      // Check quiet hours
      if (this.isQuietHours()) {
        console.log('🔕 Quiet hours active, scheduling notification');
        await this.scheduleNotification(notification);
        return;
      }

      if (PushNotification && typeof PushNotification.localNotification === 'function') {
        PushNotification.localNotification({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          playSound: true,
          soundName: 'default',
          actions: this.getNotificationActions(notification.type),
          userInfo: {
            type: notification.type,
            data: notification.data,
          },
          channelId: 'mcb-notifications',
        });
      } else {
        console.warn('⚠️ PushNotification.localNotification not available');
      }

      console.log('✅ Local notification sent');
    } catch (error) {
      console.error('❌ Failed to send local notification:', error);
    }
  }

  async scheduleNotification(notification: NotificationData): Promise<void> {
    try {
      console.log('⏰ Scheduling notification:', notification);

      const scheduledTime = notification.scheduledTime || this.getNextAvailableTime();
      
      PushNotification.localNotificationSchedule({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        date: scheduledTime,
        playSound: true,
        soundName: 'default',
        actions: this.getNotificationActions(notification.type),
        userInfo: {
          type: notification.type,
          data: notification.data,
          scheduled: true,
        },
        channelId: 'mcb-notifications',
      });

      console.log('✅ Notification scheduled for:', scheduledTime);
    } catch (error) {
      console.error('❌ Failed to schedule notification:', error);
    }
  }

  async sendJobMatchNotification(jobTitle: string, company: string, jobId: string): Promise<void> {
    const notification: NotificationData = {
      id: `job_match_${jobId}_${Date.now()}`,
      title: '🎯 New Job Match!',
      message: `${jobTitle} at ${company} matches your profile`,
      type: 'job_match',
      data: { jobId, jobTitle, company }
    };

    await this.sendLocalNotification(notification);
  }

  async sendApplicationUpdateNotification(
    jobTitle: string, 
    company: string, 
    status: string, 
    applicationId: string
  ): Promise<void> {
    const statusEmoji = this.getStatusEmoji(status);
    const notification: NotificationData = {
      id: `app_update_${applicationId}_${Date.now()}`,
      title: `${statusEmoji} Application Update`,
      message: `Your application for ${jobTitle} at ${company} is now ${status}`,
      type: 'application_update',
      data: { applicationId, jobTitle, company, status }
    };

    await this.sendLocalNotification(notification);
  }

  async sendInterviewReminderNotification(
    jobTitle: string,
    company: string,
    interviewTime: Date,
    interviewId: string
  ): Promise<void> {
    const notification: NotificationData = {
      id: `interview_reminder_${interviewId}_${Date.now()}`,
      title: '📅 Interview Reminder',
      message: `Interview for ${jobTitle} at ${company} in 1 hour`,
      type: 'interview_reminder',
      data: { interviewId, jobTitle, company, interviewTime },
      scheduled: true,
      scheduledTime: new Date(interviewTime.getTime() - 60 * 60 * 1000) // 1 hour before
    };

    await this.scheduleNotification(notification);
  }

  async sendGeneralNotification(title: string, message: string, data?: any): Promise<void> {
    const notification: NotificationData = {
      id: `general_${Date.now()}`,
      title,
      message,
      type: 'general',
      data
    };

    await this.sendLocalNotification(notification);
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      this.notificationSettings = { ...this.notificationSettings, ...settings };
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(this.notificationSettings));
      console.log('✅ Notification settings updated');
    } catch (error) {
      console.error('❌ Failed to update notification settings:', error);
    }
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    return this.notificationSettings;
  }

  async clearAllNotifications(): Promise<void> {
    try {
      PushNotification.cancelAllLocalNotifications();
      console.log('✅ All notifications cleared');
    } catch (error) {
      console.error('❌ Failed to clear notifications:', error);
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await PushNotification.getApplicationIconBadgeNumber();
    } catch (error) {
      console.error('❌ Failed to get badge count:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      PushNotification.setApplicationIconBadgeNumber(count);
    } catch (error) {
      console.error('❌ Failed to set badge count:', error);
    }
  }

  // Private helper methods
  private async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('pushNotificationToken', token);
      console.log('💾 Push notification token saved');
    } catch (error) {
      console.error('❌ Failed to save push notification token:', error);
    }
  }

  private async loadNotificationSettings(): Promise<void> {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      if (settings) {
        this.notificationSettings = JSON.parse(settings);
        console.log('📱 Notification settings loaded');
      }
    } catch (error) {
      console.error('❌ Failed to load notification settings:', error);
    }
  }

  private isNotificationEnabled(type: string): boolean {
    switch (type) {
      case 'job_match':
        return this.notificationSettings.jobMatches;
      case 'application_update':
        return this.notificationSettings.applicationUpdates;
      case 'interview_reminder':
        return this.notificationSettings.interviewReminders;
      case 'general':
        return this.notificationSettings.generalNotifications;
      default:
        return true;
    }
  }

  private isQuietHours(): boolean {
    if (!this.notificationSettings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = this.notificationSettings.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = this.notificationSettings.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime < endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private getNextAvailableTime(): Date {
    const now = new Date();
    const [endHour, endMin] = this.notificationSettings.quietHours.end.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(endHour, endMin, 0, 0);
    
    if (endTime <= now) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    return endTime;
  }

  private getNotificationActions(type: string): string[] {
    switch (type) {
      case 'job_match':
        return ['View Job', 'Save Job'];
      case 'application_update':
        return ['View Application', 'View Job'];
      case 'interview_reminder':
        return ['View Details', 'Reschedule'];
      default:
        return ['View', 'Dismiss'];
    }
  }

  private getStatusEmoji(status: string): string {
    switch (status.toLowerCase()) {
      case 'shortlisted':
        return '🎯';
      case 'interview':
        return '📅';
      case 'accepted':
        return '🎉';
      case 'rejected':
        return '😔';
      default:
        return '📝';
    }
  }

  private handleNotification(notification: any): void {
    console.log('📨 Handling notification:', notification);
    // Handle notification tap
    if (notification.userInteraction) {
      this.handleNotificationTap(notification);
    }
  }

  private handleNotificationAction(notification: any): void {
    console.log('🔔 Handling notification action:', notification);
    // Handle notification action
  }

  private handleNotificationTap(notification: any): void {
    console.log('👆 Notification tapped:', notification);
    // Navigate to appropriate screen based on notification type
    const { type, data } = notification.userInfo || {};
    
    switch (type) {
      case 'job_match':
        // Navigate to job details
        break;
      case 'application_update':
        // Navigate to applications screen
        break;
      case 'interview_reminder':
        // Navigate to interview details
        break;
      default:
        // Navigate to notifications screen
        break;
    }
  }
}

export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
