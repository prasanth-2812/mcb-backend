import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { 
  Text, 
  Card, 
  useTheme, 
  Button, 
  RadioButton, 
  Switch,
  Divider,
  IconButton,
  Surface
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { ThemeMode } from '../context/EnhancedThemeContext';

const ThemeSettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, toggleTheme } = useApp();
  const isDark = state.theme === 'dark';

  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const themeOptions = [
    {
      value: 'light' as ThemeMode,
      label: 'Light',
      description: 'Clean and bright interface',
      icon: 'weather-sunny',
      preview: Colors.background
    },
    {
      value: 'dark' as ThemeMode,
      label: 'Dark',
      description: 'Easy on the eyes in low light',
      icon: 'weather-night',
      preview: DarkColors.background
    },
    {
      value: 'system' as ThemeMode,
      label: 'System',
      description: 'Follows your device setting',
      icon: 'cog',
      preview: isDark ? DarkColors.background : Colors.background
    }
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    // Apply theme change immediately
    if (mode !== 'system') {
      toggleTheme();
    }
  };

  const renderThemeOption = (option: typeof themeOptions[0]) => (
    <Card 
      key={option.value}
      style={[
        styles.themeOption,
        { 
          backgroundColor: isDark ? DarkColors.surface : Colors.surface,
          borderColor: themeMode === option.value ? Colors.primary : (isDark ? DarkColors.border : Colors.border),
          borderWidth: themeMode === option.value ? 2 : 1
        }
      ]}
    >
      <Card.Content>
        <View style={styles.themeOptionContent}>
          <View style={styles.themeOptionLeft}>
            <MaterialCommunityIcons 
              name={option.icon} 
              size={24} 
              color={themeMode === option.value ? Colors.primary : (isDark ? DarkColors.textSecondary : Colors.textSecondary)} 
            />
            <View style={styles.themeOptionText}>
              <Text variant="titleMedium" style={[styles.themeOptionLabel, { color: isDark ? DarkColors.text : Colors.text }]}>
                {option.label}
              </Text>
              <Text variant="bodySmall" style={[styles.themeOptionDescription, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
                {option.description}
              </Text>
            </View>
          </View>
          <View style={styles.themeOptionRight}>
            <RadioButton
              value={option.value}
              status={themeMode === option.value ? 'checked' : 'unchecked'}
              onPress={() => handleThemeChange(option.value)}
            />
            <View 
              style={[
                styles.themePreview, 
                { backgroundColor: option.preview }
              ]} 
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? DarkColors.background : Colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor={isDark ? DarkColors.text : Colors.text}
        />
        <Text variant="headlineSmall" style={[styles.headerTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
          Theme Settings
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Selection */}
        <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Choose Theme
            </Text>
            <Text variant="bodyMedium" style={[styles.sectionDescription, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
              Select your preferred appearance
            </Text>
            
            <View style={styles.themeOptions}>
              {themeOptions.map(renderThemeOption)}
            </View>
          </Card.Content>
        </Card>

        {/* Advanced Settings */}
        <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Advanced Settings
            </Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons 
                  name="auto-fix" 
                  size={20} 
                  color={isDark ? DarkColors.textSecondary : Colors.textSecondary} 
                />
                <View style={styles.settingText}>
                  <Text variant="bodyMedium" style={[styles.settingLabel, { color: isDark ? DarkColors.text : Colors.text }]}>
                    Auto Switch
                  </Text>
                  <Text variant="bodySmall" style={[styles.settingDescription, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
                    Automatically switch based on time of day
                  </Text>
                </View>
              </View>
              <Switch
                value={autoSwitch}
                onValueChange={setAutoSwitch}
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons 
                  name="contrast" 
                  size={20} 
                  color={isDark ? DarkColors.textSecondary : Colors.textSecondary} 
                />
                <View style={styles.settingText}>
                  <Text variant="bodyMedium" style={[styles.settingLabel, { color: isDark ? DarkColors.text : Colors.text }]}>
                    High Contrast
                  </Text>
                  <Text variant="bodySmall" style={[styles.settingDescription, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
                    Increase contrast for better visibility
                  </Text>
                </View>
              </View>
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons 
                  name="motion" 
                  size={20} 
                  color={isDark ? DarkColors.textSecondary : Colors.textSecondary} 
                />
                <View style={styles.settingText}>
                  <Text variant="bodyMedium" style={[styles.settingLabel, { color: isDark ? DarkColors.text : Colors.text }]}>
                    Reduce Motion
                  </Text>
                  <Text variant="bodySmall" style={[styles.settingDescription, { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }]}>
                    Minimize animations and transitions
                  </Text>
                </View>
              </View>
              <Switch
                value={reduceMotion}
                onValueChange={setReduceMotion}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Theme Preview */}
        <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Preview
            </Text>
            
            <View style={[styles.previewContainer, { backgroundColor: isDark ? DarkColors.background : Colors.background }]}>
              <View style={[styles.previewHeader, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
                <View style={styles.previewHeaderContent}>
                  <View style={[styles.previewAvatar, { backgroundColor: Colors.primary }]} />
                  <View style={styles.previewText}>
                    <View style={[styles.previewLine, { backgroundColor: isDark ? DarkColors.textSecondary : Colors.textSecondary }]} />
                    <View style={[styles.previewLineShort, { backgroundColor: isDark ? DarkColors.textSecondary : Colors.textSecondary }]} />
                  </View>
                </View>
              </View>
              
              <View style={styles.previewContent}>
                <View style={[styles.previewCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
                  <View style={[styles.previewCardLine, { backgroundColor: isDark ? DarkColors.textSecondary : Colors.textSecondary }]} />
                  <View style={[styles.previewCardLine, { backgroundColor: isDark ? DarkColors.textSecondary : Colors.textSecondary }]} />
                  <View style={[styles.previewCardLineShort, { backgroundColor: isDark ? DarkColors.textSecondary : Colors.textSecondary }]} />
                </View>
                
                <View style={[styles.previewCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
                  <View style={[styles.previewCardLine, { backgroundColor: isDark ? DarkColors.textSecondary : Colors.textSecondary }]} />
                  <View style={[styles.previewCardLine, { backgroundColor: isDark ? DarkColors.textSecondary : Colors.textSecondary }]} />
                  <View style={[styles.previewCardLineShort, { backgroundColor: isDark ? DarkColors.textSecondary : Colors.textSecondary }]} />
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={[styles.sectionCard, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Quick Actions
            </Text>
            
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={toggleTheme}
                style={styles.actionButton}
                icon="theme-light-dark"
              >
                Toggle Theme
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => setThemeMode('system')}
                style={styles.actionButton}
                icon="cog"
              >
                Reset to System
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  headerRight: {
    width: 48,
  },
  content: {
    flex: 1,
    padding: Sizes.md,
  },
  sectionCard: {
    marginBottom: Sizes.md,
    elevation: 2,
    borderRadius: Sizes.radiusLg,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: Sizes.xs,
  },
  sectionDescription: {
    marginBottom: Sizes.md,
  },
  themeOptions: {
    gap: Sizes.sm,
  },
  themeOption: {
    borderRadius: Sizes.radiusMd,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeOptionText: {
    marginLeft: Sizes.md,
    flex: 1,
  },
  themeOptionLabel: {
    fontWeight: '500',
    marginBottom: Sizes.xs,
  },
  themeOptionDescription: {
    fontSize: 12,
  },
  themeOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themePreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: Sizes.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizes.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: Sizes.md,
    flex: 1,
  },
  settingLabel: {
    fontWeight: '500',
    marginBottom: Sizes.xs,
  },
  settingDescription: {
    fontSize: 12,
  },
  divider: {
    marginVertical: Sizes.xs,
  },
  previewContainer: {
    borderRadius: Sizes.radiusMd,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewHeader: {
    padding: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  previewHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Sizes.sm,
  },
  previewText: {
    flex: 1,
  },
  previewLine: {
    height: 8,
    borderRadius: 4,
    marginBottom: Sizes.xs,
  },
  previewLineShort: {
    height: 6,
    borderRadius: 3,
    width: '60%',
  },
  previewContent: {
    padding: Sizes.md,
    gap: Sizes.sm,
  },
  previewCard: {
    padding: Sizes.sm,
    borderRadius: Sizes.radiusSm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewCardLine: {
    height: 6,
    borderRadius: 3,
    marginBottom: Sizes.xs,
  },
  previewCardLineShort: {
    height: 4,
    borderRadius: 2,
    width: '40%',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Sizes.sm,
  },
  actionButton: {
    flex: 1,
  },
});

export default ThemeSettingsScreen;
