import React, { createContext, useContext, useState, useEffect } from 'react';
import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { useColorScheme } from 'react-native';

// Blue & White Theme Colors
const blueWhiteColors = {
  primary: '#3b82f6',
  primaryVariant: '#2563eb',
  secondary: '#03DAC6',
  secondaryVariant: '#018786',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  background: '#f9fafb',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onSurface: '#1A1A1A',
  onBackground: '#1A1A1A',
  onError: '#FFFFFF',
  outline: '#E0E0E0',
  shadow: '#000000',
  inverseSurface: '#2C2C2C',
  inverseOnSurface: '#FFFFFF',
  inversePrimary: '#90CAF9',
  elevation: {
    level0: 'transparent',
    level1: '#FFFFFF',
    level2: '#FFFFFF',
    level3: '#FFFFFF',
    level4: '#FFFFFF',
    level5: '#FFFFFF',
  },
  // Custom colors for job seeker app
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  lightGray: '#B0BEC5',
  darkGray: '#424242',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E0E0E0',
  divider: '#F0F0F0',
  // Status colors
  applied: '#1976D2',
  shortlisted: '#FF9800',
  interview: '#4CAF50',
  rejected: '#F44336',
  accepted: '#4CAF50',
  // Priority colors
  high: '#F44336',
  medium: '#FF9800',
  low: '#4CAF50',
  // Job type colors
  fulltime: '#1976D2',
  parttime: '#FF9800',
  contract: '#4CAF50',
  remote: '#9C27B0',
};

const darkColors = {
  ...blueWhiteColors,
  primary: '#90CAF9',
  primaryVariant: '#42A5F5',
  secondary: '#03DAC6',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  background: '#121212',
  onPrimary: '#000000',
  onSecondary: '#000000',
  onSurface: '#FFFFFF',
  onBackground: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0BEC5',
  textTertiary: '#757575',
  border: '#424242',
  divider: '#2C2C2C',
};

// Font configuration
const fontConfig = {
  fontFamily: 'System',
  fontWeight: '400' as const,
  fontSize: 16,
};

const fonts = configureFonts({
  config: {
    displayLarge: { ...fontConfig, fontSize: 57, fontWeight: '400' },
    displayMedium: { ...fontConfig, fontSize: 45, fontWeight: '400' },
    displaySmall: { ...fontConfig, fontSize: 36, fontWeight: '400' },
    headlineLarge: { ...fontConfig, fontSize: 32, fontWeight: '400' },
    headlineMedium: { ...fontConfig, fontSize: 28, fontWeight: '400' },
    headlineSmall: { ...fontConfig, fontSize: 24, fontWeight: '400' },
    titleLarge: { ...fontConfig, fontSize: 22, fontWeight: '400' },
    titleMedium: { ...fontConfig, fontSize: 16, fontWeight: '500' },
    titleSmall: { ...fontConfig, fontSize: 14, fontWeight: '500' },
    bodyLarge: { ...fontConfig, fontSize: 16, fontWeight: '400' },
    bodyMedium: { ...fontConfig, fontSize: 14, fontWeight: '400' },
    bodySmall: { ...fontConfig, fontSize: 12, fontWeight: '400' },
    labelLarge: { ...fontConfig, fontSize: 14, fontWeight: '500' },
    labelMedium: { ...fontConfig, fontSize: 12, fontWeight: '500' },
    labelSmall: { ...fontConfig, fontSize: 11, fontWeight: '500' },
  },
});

// Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: blueWhiteColors,
  fonts,
  roundness: 12,
};

// Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: darkColors,
  fonts,
  roundness: 12,
};

interface ThemeContextType {
  theme: typeof lightTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setIsDark(theme === 'dark');
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme utilities
export const getThemeColors = (isDark: boolean) => {
  return isDark ? darkColors : blueWhiteColors;
};

export const getStatusColor = (status: string, isDark: boolean = false) => {
  const colors = getThemeColors(isDark);
  switch (status.toLowerCase()) {
    case 'applied':
      return colors.applied;
    case 'shortlisted':
      return colors.shortlisted;
    case 'interview':
      return colors.interview;
    case 'rejected':
      return colors.rejected;
    case 'accepted':
      return colors.accepted;
    default:
      return colors.textSecondary;
  }
};

export const getPriorityColor = (priority: string, isDark: boolean = false) => {
  const colors = getThemeColors(isDark);
  switch (priority.toLowerCase()) {
    case 'high':
      return colors.high;
    case 'medium':
      return colors.medium;
    case 'low':
      return colors.low;
    default:
      return colors.textSecondary;
  }
};

export const getJobTypeColor = (type: string, isDark: boolean = false) => {
  const colors = getThemeColors(isDark);
  switch (type.toLowerCase()) {
    case 'full-time':
    case 'fulltime':
      return colors.fulltime;
    case 'part-time':
    case 'parttime':
      return colors.parttime;
    case 'contract':
      return colors.contract;
    case 'remote':
      return colors.remote;
    default:
      return colors.primary;
  }
};
