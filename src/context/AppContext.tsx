import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppContextType, AppAction, UserProfile, Job, Application, Notification } from '../types';
import { loadInitialData, loadDataFromAPI } from '../utils/dataLoader';

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

  const loadAppData = async () => {
    try {
      const [user, applications, notifications, savedJobs, appliedJobs, theme] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('applications'),
        AsyncStorage.getItem('notifications'),
        AsyncStorage.getItem('savedJobs'),
        AsyncStorage.getItem('appliedJobs'),
        AsyncStorage.getItem('theme'),
      ]);

      // Always load jobs from API, never from AsyncStorage
      try {
        console.log('🔄 Loading fresh jobs from API...');
        const apiData = await loadDataFromAPI();
        dispatch({ type: 'SET_JOBS', payload: apiData.jobs });
        console.log(`✅ Loaded ${apiData.jobs.length} jobs from API`);
      } catch (apiError) {
        console.error('❌ API loading failed:', apiError);
        dispatch({ type: 'SET_JOBS', payload: [] });
      }

      // Load user data if exists, otherwise use API data
      if (!user) {
        try {
          const apiData = await loadDataFromAPI();
          dispatch({ type: 'SET_USER', payload: apiData.user });
          dispatch({ type: 'SET_APPLICATIONS', payload: apiData.applications });
          dispatch({ type: 'SET_NOTIFICATIONS', payload: apiData.notifications });
        } catch (apiError) {
          console.error('API loading failed, no fallback data:', apiError);
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'SET_APPLICATIONS', payload: [] });
          dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
        }
      } else {
        if (user) {
          dispatch({ type: 'SET_USER', payload: JSON.parse(user) });
        }
        if (applications) {
          dispatch({ type: 'SET_APPLICATIONS', payload: JSON.parse(applications) });
        }
        if (notifications) {
          dispatch({ type: 'SET_NOTIFICATIONS', payload: JSON.parse(notifications) });
        }
        if (savedJobs) {
          // savedJobs is an array of job IDs, not jobs
          // This should be handled by a different action if needed
        }
        if (appliedJobs) {
          // appliedJobs is an array of job IDs, not jobs  
          // This should be handled by a different action if needed
        }
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
  const login = (user: UserProfile) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
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

  const navigateToScreen = (screen: 'onboarding' | 'login' | 'signup' | 'main') => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    applyToJob,
    saveJob,
    unsaveJob,
    markNotificationAsRead,
    updateProfile,
    toggleTheme,
    navigateToScreen,
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
