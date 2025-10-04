import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppContextType, AppAction, UserProfile, Job, Application, Notification } from '../types';
import { loadInitialData, loadDataFromAPI } from '../utils/dataLoader';
import { authService, AuthResponse } from '../services/authService';
import { applicationsService } from '../services/applicationsService';
import { savedJobsService } from '../services/savedJobsService';
import { notificationsService } from '../services/notificationsService';
import { profileService } from '../services/profileService';
import { searchService } from '../services/searchService';
import { companiesService } from '../services/companiesService';
import { analyticsService } from '../services/analyticsService';

// Initial state
const initialState: AppState = {
  user: null,
  jobs: [],
  applications: [],
  notifications: [],
  savedJobs: [],
  appliedJobs: [],
  isAuthenticated: false,
  isLoading: true,
  theme: 'light',
  currentScreen: 'onboarding',
  onboardingComplete: false,
  navigationParams: {},
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload 
      };
    
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'ADD_APPLICATION':
      return { 
        ...state, 
        applications: [...state.applications, action.payload],
        appliedJobs: [...state.appliedJobs, action.payload.jobId]
      };
    
    case 'ADD_APPLIED_JOB':
      return { 
        ...state, 
        appliedJobs: [...state.appliedJobs, action.payload]
      };
    
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app => 
          app.id === action.payload.id ? action.payload : app
        )
      };
    
    case 'SAVE_JOB':
      return {
        ...state,
        savedJobs: [...state.savedJobs, action.payload]
      };
    
    case 'UNSAVE_JOB':
      return {
        ...state,
        savedJobs: state.savedJobs.filter(id => id !== action.payload)
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        )
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    
    case 'SET_CURRENT_SCREEN':
      return {
        ...state,
        currentScreen: action.payload
      };
    
    case 'SET_NAVIGATION_PARAMS':
      return {
        ...state,
        navigationParams: action.payload
      };
    
    case 'SET_ONBOARDING_COMPLETE':
      return {
        ...state,
        onboardingComplete: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadAppData();
  }, []);

  // Save data to AsyncStorage whenever state changes
  useEffect(() => {
    saveAppData();
  }, [state]);

  const loadJobsInBackground = async () => {
    try {
      // Try to load cached jobs first
      const cachedJobs = await AsyncStorage.getItem('cachedJobs');
      if (cachedJobs) {
        const jobs = JSON.parse(cachedJobs);
        dispatch({ type: 'SET_JOBS', payload: jobs });
      }

      // Then load fresh data from API
      const apiData = await loadDataFromAPI();
      dispatch({ type: 'SET_JOBS', payload: apiData.jobs });
      
      // Cache the fresh data
      await AsyncStorage.setItem('cachedJobs', JSON.stringify(apiData.jobs));
    } catch (apiError) {
      console.error('❌ AppContext: API loading failed:', apiError);
      // Keep cached jobs if API fails
    }
  };

  const loadAppData = async () => {
    try {
      // Load local data first (fast)
      const [authToken, user, theme, onboardingComplete] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('onboardingComplete'),
      ]);

      // Set onboarding status
      dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: onboardingComplete === 'true' });
      console.log('🔄 Onboarding complete:', onboardingComplete === 'true');

      // Set loading to false first to show UI
      dispatch({ type: 'SET_LOADING', payload: false });

      // Load jobs from API in background (non-blocking)
      loadJobsInBackground();

      // Check if user has valid authentication token
      if (authToken) {
        try {
          console.log('🔄 Validating auth token...', authToken.substring(0, 20) + '...');
          const userProfile = await authService.getCurrentUser(authToken);
          
          // Convert API user to app user profile
          const appUserProfile: UserProfile = {
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone || '',
            location: '',
            skills: [],
            resume: { fileName: '', uploaded: false },
            profilePicture: { uri: '', uploaded: false },
            profileCompletion: 50,
            preferences: {
              role: userProfile.role === 'employer' ? 'Hiring Manager' : 'Software Developer',
              location: '',
              type: 'Full-time',
            },
          };
          
          dispatch({ type: 'SET_USER', payload: appUserProfile });
          console.log('✅ User authenticated with valid token');
          console.log('🔐 Authentication state:', { isAuthenticated: true, userId: appUserProfile.id });
          
          // Load user-specific data from APIs
          loadUserData();
        } catch (tokenError) {
          console.error('❌ Token validation failed:', tokenError);
          // Token is invalid, clear auth data
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'SET_APPLICATIONS', payload: [] });
          dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
        }
      } else {
        // No token, user is not authenticated
        console.log('ℹ️ No auth token found, user not authenticated');
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_APPLICATIONS', payload: [] });
        dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
        console.log('🔐 Authentication state:', { isAuthenticated: false, userId: null });
      }
      
      if (theme) {
        dispatch({ type: 'SET_THEME', payload: theme as 'light' | 'dark' });
      }
    } catch (error) {
      console.error('Error loading app data:', error);
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_JOBS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadUserData = async () => {
    try {
      console.log('🔄 Loading user-specific data from APIs...');
      
      // Load data from APIs in parallel
      const [applications, notifications, savedJobs] = await Promise.allSettled([
        applicationsService.getApplications(),
        notificationsService.getNotifications(),
        savedJobsService.getSavedJobIds(),
      ]);

      // Handle applications
      if (applications.status === 'fulfilled') {
        dispatch({ type: 'SET_APPLICATIONS', payload: applications.value });
        console.log('✅ Loaded applications:', applications.value.length);
      } else {
        console.error('❌ Failed to load applications:', applications.reason);
      }

      // Handle notifications
      if (notifications.status === 'fulfilled') {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications.value });
        console.log('✅ Loaded notifications:', notifications.value.length);
      } else {
        console.error('❌ Failed to load notifications:', notifications.reason);
      }

      // Handle saved jobs
      if (savedJobs.status === 'fulfilled') {
        dispatch({ type: 'SET_SAVED_JOBS', payload: savedJobs.value });
        console.log('✅ Loaded saved jobs:', savedJobs.value.length);
      } else {
        console.error('❌ Failed to load saved jobs:', savedJobs.reason);
      }
    } catch (error) {
      console.error('❌ Error loading user data:', error);
    }
  };

  const saveAppData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(state.user)),
        // Don't save jobs to AsyncStorage - always load fresh from API
        AsyncStorage.setItem('applications', JSON.stringify(state.applications)),
        AsyncStorage.setItem('notifications', JSON.stringify(state.notifications)),
        AsyncStorage.setItem('savedJobs', JSON.stringify(state.savedJobs)),
        AsyncStorage.setItem('appliedJobs', JSON.stringify(state.appliedJobs)),
        AsyncStorage.setItem('theme', state.theme),
      ]);
    } catch (error) {
      console.error('Error saving app data:', error);
    }
  };

  // Context methods
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔄 Attempting login...');
      const response: AuthResponse = await authService.login({ email, password });
      
      // Store token
      await AsyncStorage.setItem('authToken', response.token);
      
      // Convert API user to app user profile
      const userProfile: UserProfile = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: '',
        location: '',
        skills: [],
        resume: { fileName: '', uploaded: false },
        profilePicture: { uri: '', uploaded: false },
        profileCompletion: 50,
        preferences: {
          role: response.user.role === 'employer' ? 'Hiring Manager' : 'Software Developer',
          location: '',
          type: 'Full-time',
        },
      };
      
      dispatch({ type: 'SET_USER', payload: userProfile });
      console.log('✅ Login successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔄 Attempting registration...');
      const response: AuthResponse = await authService.register({
        ...userData,
        role: 'employee'
      });
      
      // Store token
      await AsyncStorage.setItem('authToken', response.token);
      
      // Convert API user to app user profile
      const userProfile: UserProfile = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: userData.phone || '',
        location: '',
        skills: [],
        resume: { fileName: '', uploaded: false },
        profilePicture: { uri: '', uploaded: false },
        profileCompletion: 25,
        preferences: {
          role: 'Software Developer',
          location: '',
          type: 'Full-time',
        },
      };
      
      dispatch({ type: 'SET_USER', payload: userProfile });
      console.log('✅ Registration successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // Remove all auth-related data from storage
      await Promise.all([
        AsyncStorage.removeItem('authToken'),
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('applications'),
        AsyncStorage.removeItem('notifications'),
        AsyncStorage.removeItem('savedJobs'),
        AsyncStorage.removeItem('appliedJobs'),
      ]);
      
      // Clear all user data from state
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_APPLICATIONS', payload: [] });
      dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
      dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'onboarding' });
      
      console.log('✅ Logout successful - all data cleared');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const applyToJob = async (jobId: string, coverLetter?: string, resumeUrl?: string) => {
    try {
      const response = await applicationsService.applyToJob({
        jobId,
        coverLetter,
        resumeUrl,
      });

      // Convert API response to app format
      const newApplication: Application = {
        id: response.id,
        jobId: response.jobId,
        jobTitle: state.jobs.find(j => j.id === jobId)?.title || 'Unknown Job',
        company: state.jobs.find(j => j.id === jobId)?.company || 'Unknown Company',
        appliedDate: response.appliedAt.split('T')[0],
        status: response.status === 'pending' ? 'Applied' : response.status,
        statusHistory: [{
          status: response.status === 'pending' ? 'Applied' : response.status,
          date: response.appliedAt.split('T')[0],
          description: 'Application submitted successfully'
        }],
        notes: '',
        interviewDate: null,
        salary: state.jobs.find(j => j.id === jobId)?.salary || '',
        location: state.jobs.find(j => j.id === jobId)?.location || '',
      };

      dispatch({ type: 'ADD_APPLICATION', payload: newApplication });
      dispatch({ type: 'ADD_APPLIED_JOB', payload: jobId });
    } catch (error) {
      console.error('❌ Failed to apply to job:', error);
      throw error;
    }
  };

  const saveJob = async (jobId: string) => {
    try {
      const result = await savedJobsService.saveJob(jobId);
      
      // Check if job was already saved
      if (result.id === 'already-saved') {
        // Still update the state to reflect the current saved status
        if (!state.savedJobs.includes(jobId)) {
          dispatch({ type: 'SAVE_JOB', payload: jobId });
        }
      } else {
        dispatch({ type: 'SAVE_JOB', payload: jobId });
      }
    } catch (error) {
      console.error('❌ Failed to save job:', error);
      throw error;
    }
  };

  const unsaveJob = async (jobId: string) => {
    try {
      await savedJobsService.unsaveJob(jobId);
      dispatch({ type: 'UNSAVE_JOB', payload: jobId });
    } catch (error) {
      console.error('❌ Failed to unsave job:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      // Still update local state even if API fails
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      // Update profile via API
      const updatedProfile = await profileService.updateProfile({
        name: profile.name,
        phone: profile.phone,
        skills: profile.skills,
      });
      
      // Update local state
      dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      // Still update local state even if API fails
      dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    }
  };

  // New methods for API integration
  const refreshApplications = async () => {
    try {
      const applications = await applicationsService.getApplications();
      dispatch({ type: 'SET_APPLICATIONS', payload: applications });
    } catch (error) {
      console.error('❌ Failed to refresh applications:', error);
    }
  };

  const refreshNotifications = async () => {
    try {
      const notifications = await notificationsService.getNotifications();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    } catch (error) {
      console.error('❌ Failed to refresh notifications:', error);
    }
  };

  const refreshSavedJobs = async () => {
    try {
      const savedJobIds = await savedJobsService.getSavedJobIds();
      dispatch({ type: 'SET_SAVED_JOBS', payload: savedJobIds });
    } catch (error) {
      console.error('❌ Failed to refresh saved jobs:', error);
    }
  };

  const searchJobs = async (query: string, filters?: any) => {
    try {
      const results = await searchService.searchJobs({ q: query, ...filters });
      return results.jobs;
    } catch (error) {
      console.error('❌ Failed to search jobs:', error);
      return [];
    }
  };

  const getRecommendedJobs = async () => {
    try {
      const jobs = await searchService.getRecommendedJobs();
      return jobs;
    } catch (error) {
      console.error('❌ Failed to get recommended jobs:', error);
      return [];
    }
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const navigateToScreen = (screen: 'onboarding' | 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'main', params?: any) => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
    if (params) {
      dispatch({ type: 'SET_NAVIGATION_PARAMS', payload: params });
    }
  };

  const setOnboardingComplete = (complete: boolean) => {
    dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: complete });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    register,
    logout,
    applyToJob,
    saveJob,
    unsaveJob,
    markNotificationAsRead,
    updateProfile,
    toggleTheme,
    navigateToScreen,
    setOnboardingComplete,
    refreshApplications,
    refreshNotifications,
    refreshSavedJobs,
    searchJobs,
    getRecommendedJobs,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
