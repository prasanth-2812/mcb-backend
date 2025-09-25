import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';
import CustomTabBar from '../components/CustomTabBar';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import JobsScreen from '../screens/JobsScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import ApplicationsScreen from '../screens/ApplicationsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
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

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
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
          options={{ 
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
    default:
      return <OnboardingScreen />;
  }
};

export default AppNavigator;
