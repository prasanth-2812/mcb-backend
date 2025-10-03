// Notifications service for handling notifications API calls
const API_BASE_URL = 'http://10.115.43.116:4000/api';
const API_BASE_URL_FALLBACK = 'http://localhost:4000/api';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'job' | 'system' | 'message';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: 'application' | 'job' | 'system' | 'message';
  userId: string;
}

export interface UpdateNotificationRequest {
  title?: string;
  message?: string;
  isRead?: boolean;
}

class NotificationsService {
  private async getAuthToken(): Promise<string | null> {
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const urls = [API_BASE_URL, API_BASE_URL_FALLBACK];
    
    for (let i = 0; i < urls.length; i++) {
      const baseUrl = urls[i];
      const url = `${baseUrl}${endpoint}`;
      
      console.log(`🌐 Notifications API Request: ${options.method || 'GET'} ${url}`);
      
      const token = await this.getAuthToken();
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      try {
        console.log(`📡 Attempting notifications connection to: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Notifications response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Notifications HTTP Error Response:`, errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Notifications API request successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ Notifications API request failed for ${url}:`, error);
        
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All notifications API endpoints failed. Last error: ${errorMessage}`);
        }
        
        console.log(`🔄 Trying fallback notifications URL...`);
      }
    }
    
    throw new Error('No notifications API endpoints available');
  }

  // Get user's notifications
  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/notifications');
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<Notification> {
    return this.request<Notification>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // Update notification
  async updateNotification(id: string, updateData: UpdateNotificationRequest): Promise<Notification> {
    return this.request<Notification>(`/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Delete notification
  async deleteNotification(id: string): Promise<{ deleted: boolean }> {
    return this.request<{ deleted: boolean }>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Create notification (admin/employer use)
  async createNotification(notificationData: CreateNotificationRequest): Promise<Notification> {
    return this.request<Notification>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter(notification => !notification.isRead).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ updated: number }> {
    try {
      const notifications = await this.getNotifications();
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      const promises = unreadNotifications.map(notification => 
        this.markAsRead(notification.id)
      );
      
      await Promise.all(promises);
      
      return { updated: unreadNotifications.length };
    } catch (error) {
      console.error('Error marking all as read:', error);
      return { updated: 0 };
    }
  }
}

export const notificationsService = new NotificationsService();
export default notificationsService;

