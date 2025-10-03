import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import CustomTabBar from '../components/CustomTabBar';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import JobsScreen from '../screens/JobsScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import JobDetailsPage from '../screens/JobDetailsPage';
import JobApplicationScreen from '../screens/JobApplicationScreen';
import ApplicationPage from '../screens/ApplicationPage';
import ApplicationsScreen from '../screens/ApplicationsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ResumeBuilderScreen from '../screens/ResumeBuilderScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          borderBottomColor: isDark ? '#404040' : '#E0E0E0',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerTintColor: isDark ? '#FFFFFF' : '#1A1A1A',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Dashboard',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen}
        options={{ 
          title: 'Find Jobs',
          tabBarLabel: 'Jobs',
        }}
      />
      <Tab.Screen 
        name="Applications" 
        component={ApplicationsScreen}
        options={{ 
          title: 'My Applications',
          tabBarLabel: 'Applied',
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
          tabBarLabel: 'Alerts',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'My Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Jobs-only navigator for browsing without authentication
const JobsOnlyNavigator = () => {
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  console.log('🔄 JobsOnlyNavigator - currentScreen:', state.currentScreen);

  // Check if we need to show a specific screen (like forgot password)
  if (state.currentScreen === 'forgot-password') {
    console.log('🔄 JobsOnlyNavigator: Showing ForgotPasswordScreen');
    return <ForgotPasswordScreen />;
  }

  if (state.currentScreen === 'signup') {
    console.log('🔄 JobsOnlyNavigator: Showing SignupScreen');
    return <SignupScreen />;
  }

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          borderBottomColor: isDark ? '#404040' : '#E0E0E0',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerTintColor: isDark ? '#FFFFFF' : '#1A1A1A',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen}
        options={{ 
          title: 'Find Jobs',
          tabBarLabel: 'Jobs',
        }}
      />
      <Tab.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          title: 'Sign In',
          tabBarLabel: 'Sign In',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { state } = useApp();

  // Show splash screen while loading
  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!state.onboardingComplete ? (
          // Show onboarding if not completed
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : state.isAuthenticated ? (
          // Show full app if authenticated
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="SavedJobs" 
              component={SavedJobsScreen}
              options={{ 
                title: 'Saved Jobs',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#F9F9F9',
                },
                headerTintColor: '#1A1A1A',
                headerTitleStyle: {
                  fontWeight: '600',
                  fontSize: 18,
                },
              }}
            />
            <Stack.Screen 
              name="JobDetails" 
              component={JobDetailsScreen as any}
              options={({ route }) => ({ 
                title: 'Job Details',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#F9F9F9',
                },
                headerTintColor: '#1A1A1A',
                headerTitleStyle: {
                  fontWeight: '600',
                  fontSize: 18,
                },
              })}
            />
            <Stack.Screen 
              name="JobApplication" 
              component={JobApplicationScreen as any}
              options={{ 
                title: 'Apply for Job',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ 
                title: 'Edit Profile',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="ResumeBuilder" 
              component={ResumeBuilderScreen}
              options={{ 
                title: 'Resume Builder',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#F9F9F9',
                },
                headerTintColor: '#1A1A1A',
                headerTitleStyle: {
                  fontWeight: '600',
                  fontSize: 18,
                },
              }}
            />
            <Stack.Screen 
              name="JobDetailsPage" 
              component={JobDetailsPage}
              options={{ 
                title: 'Job Details',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="ApplicationPage" 
              component={ApplicationPage}
              options={{ 
                title: 'Application',
                headerShown: false,
              }}
            />
          </>
        ) : (
          // Show jobs without authentication (browse mode)
          <>
            <Stack.Screen name="Main" component={JobsOnlyNavigator} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen 
              name="JobDetails" 
              component={JobDetailsScreen as any}
              options={({ route }) => ({ 
                title: 'Job Details',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#F9F9F9',
                },
                headerTintColor: '#1A1A1A',
                headerTitleStyle: {
                  fontWeight: '600',
                  fontSize: 18,
                },
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AuthNavigator = () => {
  const { state } = useApp();

  if (state.isLoading) {
    return <SplashScreen />;
  }

  if (state.isAuthenticated) {
    return <MainTabNavigator />;
  }

  // Show the appropriate screen based on currentScreen state
  switch (state.currentScreen) {
    case 'onboarding':
      return <OnboardingScreen />;
    case 'login':
      return <LoginScreen />;
    case 'signup':
      return <SignupScreen />;
    case 'forgot-password':
      return <ForgotPasswordScreen />;
    default:
      return <OnboardingScreen />;
  }
};

export default AppNavigator;
