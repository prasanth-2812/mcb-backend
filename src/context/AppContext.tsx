import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppContextType, AppAction, UserProfile, Job, Application, Notification } from '../types';
import { loadInitialData, loadDataFromAPI } from '../utils/dataLoader';
import { authService, AuthResponse } from '../services/authService';

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
        console.log(`📱 Loaded ${jobs.length} cached jobs`);
      }

      // Then load fresh data from API
      console.log('🔄 Loading fresh jobs from API in background...');
      const apiData = await loadDataFromAPI();
      dispatch({ type: 'SET_JOBS', payload: apiData.jobs });
      
      // Cache the fresh data
      await AsyncStorage.setItem('cachedJobs', JSON.stringify(apiData.jobs));
      console.log(`✅ Loaded ${apiData.jobs.length} fresh jobs from API`);
    } catch (apiError) {
      console.error('❌ API loading failed:', apiError);
      // Keep cached jobs if API fails
    }
  };

  const loadAppData = async () => {
    try {
      // Load local data first (fast)
      const [authToken, user, applications, notifications, savedJobs, appliedJobs, theme, onboardingComplete] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('applications'),
        AsyncStorage.getItem('notifications'),
        AsyncStorage.getItem('savedJobs'),
        AsyncStorage.getItem('appliedJobs'),
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
          
          // Load user-specific data
          if (applications) {
            dispatch({ type: 'SET_APPLICATIONS', payload: JSON.parse(applications) });
          }
          if (notifications) {
            dispatch({ type: 'SET_NOTIFICATIONS', payload: JSON.parse(notifications) });
          }
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

  const applyToJob = (jobId: string) => {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return;

    const newApplication: Application = {
      id: Date.now().toString(),
      jobId,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      statusHistory: [{
        status: 'Applied',
        date: new Date().toISOString().split('T')[0],
        description: 'Application submitted successfully'
      }],
      notes: '',
      interviewDate: null,
      salary: job.salary,
      location: job.location,
    };

    dispatch({ type: 'ADD_APPLICATION', payload: newApplication });
  };

  const saveJob = (jobId: string) => {
    dispatch({ type: 'SAVE_JOB', payload: jobId });
  };

  const unsaveJob = (jobId: string) => {
    dispatch({ type: 'UNSAVE_JOB', payload: jobId });
  };

  const markNotificationAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const navigateToScreen = (screen: 'onboarding' | 'login' | 'signup' | 'forgot-password' | 'main') => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
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
