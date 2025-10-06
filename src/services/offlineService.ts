// Offline Support Service - Offline-first architecture
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as FileSystem from 'expo-file-system';
import { Job, Application, Notification } from '../types';

export interface OfflineData {
  jobs: Job[];
  applications: Application[];
  notifications: Notification[];
  lastSync: string;
  pendingActions: PendingAction[];
}

export interface PendingAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'job' | 'application' | 'notification';
  data: any;
  timestamp: string;
  retryCount: number;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingActions: number;
  syncInProgress: boolean;
}

class OfflineService {
  private isOnline = true;
  private syncInProgress = false;
  private listeners: ((status: SyncStatus) => void)[] = [];

  constructor() {
    this.initializeNetworkListener();
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      if (!wasOnline && this.isOnline) {
        console.log('🌐 Network connection restored, starting sync...');
        this.syncPendingActions();
      }
      
      this.notifyListeners();
    });
  }

  // Subscribe to network status changes
  subscribe(listener: (status: SyncStatus) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    const status = this.getSyncStatus();
    this.listeners.forEach(listener => listener(status));
  }

  // Get current sync status
  getSyncStatus(): SyncStatus {
    return {
      isOnline: this.isOnline,
      lastSync: null, // Will be loaded from storage
      pendingActions: 0, // Will be loaded from storage
      syncInProgress: this.syncInProgress
    };
  }

  // Save data for offline access
  async saveOfflineData(data: Partial<OfflineData>): Promise<void> {
    try {
      console.log('💾 Saving offline data...');
      
      const existingData = await this.getOfflineData();
      const updatedData = { ...existingData, ...data, lastSync: new Date().toISOString() };
      
      await AsyncStorage.setItem('offlineData', JSON.stringify(updatedData));
      console.log('✅ Offline data saved');
    } catch (error) {
      console.error('❌ Failed to save offline data:', error);
    }
  }

  // Load offline data
  async getOfflineData(): Promise<OfflineData> {
    try {
      const data = await AsyncStorage.getItem('offlineData');
      if (data) {
        return JSON.parse(data);
      }
      return {
        jobs: [],
        applications: [],
        notifications: [],
        lastSync: '',
        pendingActions: []
      };
    } catch (error) {
      console.error('❌ Failed to load offline data:', error);
      return {
        jobs: [],
        applications: [],
        notifications: [],
        lastSync: '',
        pendingActions: []
      };
    }
  }

  // Add pending action for later sync
  async addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    try {
      const pendingAction: PendingAction = {
        ...action,
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        retryCount: 0
      };

      const offlineData = await this.getOfflineData();
      offlineData.pendingActions.push(pendingAction);
      
      await this.saveOfflineData(offlineData);
      console.log('📝 Pending action added:', pendingAction.type, pendingAction.entity);
    } catch (error) {
      console.error('❌ Failed to add pending action:', error);
    }
  }

  // Sync pending actions when online
  async syncPendingActions(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) {
      return;
    }

    try {
      this.syncInProgress = true;
      console.log('🔄 Syncing pending actions...');

      const offlineData = await this.getOfflineData();
      const pendingActions = offlineData.pendingActions;
      
      if (pendingActions.length === 0) {
        console.log('✅ No pending actions to sync');
        return;
      }

      const successfulActions: string[] = [];
      const failedActions: PendingAction[] = [];

      for (const action of pendingActions) {
        try {
          await this.executePendingAction(action);
          successfulActions.push(action.id);
          console.log('✅ Synced action:', action.type, action.entity);
        } catch (error) {
          console.error('❌ Failed to sync action:', action.id, error);
          action.retryCount++;
          failedActions.push(action);
        }
      }

      // Remove successful actions and update failed ones
      const updatedPendingActions = failedActions.filter(action => action.retryCount < 3);
      await this.saveOfflineData({ pendingActions: updatedPendingActions });

      console.log(`✅ Sync completed: ${successfulActions.length} successful, ${failedActions.length} failed`);
    } catch (error) {
      console.error('❌ Sync failed:', error);
    } finally {
      this.syncInProgress = false;
      this.notifyListeners();
    }
  }

  // Execute a pending action
  private async executePendingAction(action: PendingAction): Promise<void> {
    // This would integrate with your actual API services
    // For now, we'll simulate the API calls
    
    switch (action.entity) {
      case 'job':
        await this.syncJobAction(action);
        break;
      case 'application':
        await this.syncApplicationAction(action);
        break;
      case 'notification':
        await this.syncNotificationAction(action);
        break;
    }
  }

  private async syncJobAction(action: PendingAction): Promise<void> {
    // Simulate job API calls
    console.log('🔄 Syncing job action:', action.type, action.data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async syncApplicationAction(action: PendingAction): Promise<void> {
    // Simulate application API calls
    console.log('🔄 Syncing application action:', action.type, action.data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async syncNotificationAction(action: PendingAction): Promise<void> {
    // Simulate notification API calls
    console.log('🔄 Syncing notification action:', action.type, action.data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Cache jobs for offline access
  async cacheJobs(jobs: Job[]): Promise<void> {
    try {
      console.log('💾 Caching jobs for offline access...');
      await this.saveOfflineData({ jobs });
      console.log(`✅ Cached ${jobs.length} jobs`);
    } catch (error) {
      console.error('❌ Failed to cache jobs:', error);
    }
  }

  // Get cached jobs
  async getCachedJobs(): Promise<Job[]> {
    try {
      const offlineData = await this.getOfflineData();
      return offlineData.jobs;
    } catch (error) {
      console.error('❌ Failed to get cached jobs:', error);
      return [];
    }
  }

  // Cache applications for offline access
  async cacheApplications(applications: Application[]): Promise<void> {
    try {
      console.log('💾 Caching applications for offline access...');
      await this.saveOfflineData({ applications });
      console.log(`✅ Cached ${applications.length} applications`);
    } catch (error) {
      console.error('❌ Failed to cache applications:', error);
    }
  }

  // Get cached applications
  async getCachedApplications(): Promise<Application[]> {
    try {
      const offlineData = await this.getOfflineData();
      return offlineData.applications;
    } catch (error) {
      console.error('❌ Failed to get cached applications:', error);
      return [];
    }
  }

  // Cache notifications for offline access
  async cacheNotifications(notifications: Notification[]): Promise<void> {
    try {
      console.log('💾 Caching notifications for offline access...');
      await this.saveOfflineData({ notifications });
      console.log(`✅ Cached ${notifications.length} notifications`);
    } catch (error) {
      console.error('❌ Failed to cache notifications:', error);
      return [];
    }
  }

  // Get cached notifications
  async getCachedNotifications(): Promise<Notification[]> {
    try {
      const offlineData = await this.getOfflineData();
      return offlineData.notifications;
    } catch (error) {
      console.error('❌ Failed to get cached notifications:', error);
      return [];
    }
  }

  // Check if data is available offline
  async isDataAvailableOffline(entity: 'jobs' | 'applications' | 'notifications'): Promise<boolean> {
    try {
      const offlineData = await this.getOfflineData();
      return offlineData[entity].length > 0;
    } catch (error) {
      console.error('❌ Failed to check offline data availability:', error);
      return false;
    }
  }

  // Get offline data age
  async getOfflineDataAge(): Promise<number> {
    try {
      const offlineData = await this.getOfflineData();
      if (!offlineData.lastSync) return Infinity;
      
      const lastSync = new Date(offlineData.lastSync);
      const now = new Date();
      return now.getTime() - lastSync.getTime();
    } catch (error) {
      console.error('❌ Failed to get offline data age:', error);
      return Infinity;
    }
  }

  // Clear all offline data
  async clearOfflineData(): Promise<void> {
    try {
      console.log('🗑️ Clearing offline data...');
      await AsyncStorage.removeItem('offlineData');
      console.log('✅ Offline data cleared');
    } catch (error) {
      console.error('❌ Failed to clear offline data:', error);
    }
  }

  // Force sync when online
  async forceSync(): Promise<void> {
    if (this.isOnline) {
      await this.syncPendingActions();
    }
  }

  // Get network status
  isNetworkOnline(): boolean {
    return this.isOnline;
  }

  // Get pending actions count
  async getPendingActionsCount(): Promise<number> {
    try {
      const offlineData = await this.getOfflineData();
      return offlineData.pendingActions.length;
    } catch (error) {
      console.error('❌ Failed to get pending actions count:', error);
      return 0;
    }
  }
}

export const offlineService = new OfflineService();
export default offlineService;
