import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, DarkColors } from '../constants/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;
  
  // Neutral colors
  white: string;
  black: string;
  gray: string;
  lightGray: string;
  darkGray: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Text colors
  text: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  
  // Border colors
  border: string;
  borderLight: string;
  
  // Shadow colors
  shadow: string;
  shadowDark: string;
  
  // Gradient colors
  gradientStart: string;
  gradientEnd: string;
  
  // Application status colors
  applied: string;
  shortlisted: string;
  interview: string;
  rejected: string;
  offered: string;
  
  // Additional colors
  card: string;
  input: string;
  button: string;
  buttonText: string;
  link: string;
  overlay: string;
  placeholder: string;
  
  // GitHub-inspired colors
  headerBg: string;
  sidebarBg: string;
  searchBg: string;
  searchBorder: string;
  tabBg: string;
  tabActive: string;
  tabInactive: string;
  
  // Priority colors
  high: string;
  medium: string;
  low: string;
  
  // Job status colors
  pending: string;
  inProgress: string;
  completed: string;
  cancelled: string;
}

export interface ThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const EnhancedThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemeMode();
  }, []);

  useEffect(() => {
    updateTheme();
  }, [themeMode, systemColorScheme]);

  const loadThemeMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('themeMode');
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setThemeMode(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('❌ Failed to load theme mode:', error);
    }
  };

  const updateTheme = () => {
    let shouldBeDark = false;
    
    switch (themeMode) {
      case 'light':
        shouldBeDark = false;
        break;
      case 'dark':
        shouldBeDark = true;
        break;
      case 'system':
        shouldBeDark = systemColorScheme === 'dark';
        break;
    }
    
    setIsDark(shouldBeDark);
  };

  const handleSetThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem('themeMode', mode);
      console.log('✅ Theme mode saved:', mode);
    } catch (error) {
      console.error('❌ Failed to save theme mode:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    handleSetThemeMode(newMode);
  };

  const theme: ThemeColors = isDark ? DarkColors : Colors;

  const contextValue: ThemeContextType = {
    theme,
    isDark,
    themeMode,
    setThemeMode: handleSetThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default EnhancedThemeProvider;
