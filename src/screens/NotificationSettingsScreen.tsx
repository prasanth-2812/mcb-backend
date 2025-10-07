import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { 
  Text, 
  Card, 
  Switch, 
  useTheme, 
  Button, 
  Divider,
  List,
  IconButton,
  Portal
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { pushNotificationService, NotificationSettings } from '../services/pushNotificationService';

const NotificationSettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  const [settings, setSettings] = useState<NotificationSettings>({
    jobMatches: true,
    applicationUpdates: true,
    interviewReminders: true,
    generalNotifications: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await pushNotificationService.getNotificationSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('❌ Failed to load notification settings:', error);
    }
  };

  const updateSetting = async (key: keyof NotificationSettings, value: any) => {
    try {
      setIsLoading(true);
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await pushNotificationService.updateNotificationSettings({ [key]: value });
      console.log('✅ Notification setting updated:', key, value);
    } catch (error) {
      console.error('❌ Failed to update notification setting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuietHours = async (key: 'enabled' | 'start' | 'end', value: any) => {
    try {
      setIsLoading(true);
      const newQuietHours = { ...settings.quietHours, [key]: value };
      const newSettings = { ...settings, quietHours: newQuietHours };
      setSettings(newSettings);
      await pushNotificationService.updateNotificationSettings({ quietHours: newQuietHours });
      console.log('✅ Quiet hours updated:', key, value);
    } catch (error) {
      console.error('❌ Failed to update quiet hours:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeChange = (time: { hours: number; minutes: number }, type: 'start' | 'end') => {
    const timeString = `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
    updateQuietHours(type, timeString);
  };

  const testNotification = async () => {
    try {
      await pushNotificationService.sendGeneralNotification(
        'Test Notification',
        'This is a test notification from MCB App',
        { test: true }
      );
    } catch (error) {
      console.error('❌ Failed to send test notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await pushNotificationService.clearAllNotifications();
    } catch (error) {
      console.error('❌ Failed to clear notifications:', error);
    }
  };

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
          Notification Settings
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notification Types */}
        <Card style={[styles.card, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Notification Types
            </Text>
            
            <List.Item
              title="Job Matches"
              description="Get notified when new jobs match your profile"
              left={(props) => <List.Icon {...props} icon="target" />}
              right={() => (
                <Switch
                  value={settings.jobMatches}
                  onValueChange={(value) => updateSetting('jobMatches', value)}
                  disabled={isLoading}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Application Updates"
              description="Updates on your job applications"
              left={(props) => <List.Icon {...props} icon="file-document-multiple" />}
              right={() => (
                <Switch
                  value={settings.applicationUpdates}
                  onValueChange={(value) => updateSetting('applicationUpdates', value)}
                  disabled={isLoading}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Interview Reminders"
              description="Reminders for upcoming interviews"
              left={(props) => <List.Icon {...props} icon="calendar-clock" />}
              right={() => (
                <Switch
                  value={settings.interviewReminders}
                  onValueChange={(value) => updateSetting('interviewReminders', value)}
                  disabled={isLoading}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="General Notifications"
              description="App updates and general announcements"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={settings.generalNotifications}
                  onValueChange={(value) => updateSetting('generalNotifications', value)}
                  disabled={isLoading}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Quiet Hours */}
        <Card style={[styles.card, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Quiet Hours
            </Text>
            
            <List.Item
              title="Enable Quiet Hours"
              description="Pause notifications during specified hours"
              left={(props) => <List.Icon {...props} icon="moon" />}
              right={() => (
                <Switch
                  value={settings.quietHours.enabled}
                  onValueChange={(value) => updateQuietHours('enabled', value)}
                  disabled={isLoading}
                />
              )}
            />
            
            {settings.quietHours.enabled && (
              <>
                <Divider />
                
                <List.Item
                  title="Start Time"
                  description={settings.quietHours.start}
                  left={(props) => <List.Icon {...props} icon="clock-start" />}
                  onPress={() => setShowStartTimePicker(true)}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                />
                
                <Divider />
                
                <List.Item
                  title="End Time"
                  description={settings.quietHours.end}
                  left={(props) => <List.Icon {...props} icon="clock-end" />}
                  onPress={() => setShowEndTimePicker(true)}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                />
              </>
            )}
          </Card.Content>
        </Card>

        {/* Test & Actions */}
        <Card style={[styles.card, { backgroundColor: isDark ? DarkColors.surface : Colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? DarkColors.text : Colors.text }]}>
              Test & Actions
            </Text>
            
            <Button
              mode="outlined"
              onPress={testNotification}
              style={styles.actionButton}
              icon="bell-ring"
            >
              Send Test Notification
            </Button>
            
            <Button
              mode="outlined"
              onPress={clearAllNotifications}
              style={styles.actionButton}
              icon="bell-off"
              textColor={Colors.error}
            >
              Clear All Notifications
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Time Pickers */}
      <Portal>
        <TimePickerModal
          visible={showStartTimePicker}
          onDismiss={() => setShowStartTimePicker(false)}
          onConfirm={(time) => {
            handleTimeChange(time, 'start');
            setShowStartTimePicker(false);
          }}
          label="Select start time"
          mode="24h"
        />
        
        <TimePickerModal
          visible={showEndTimePicker}
          onDismiss={() => setShowEndTimePicker(false)}
          onConfirm={(time) => {
            handleTimeChange(time, 'end');
            setShowEndTimePicker(false);
          }}
          label="Select end time"
          mode="24h"
        />
      </Portal>
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
  card: {
    marginBottom: Sizes.md,
    elevation: 2,
    borderRadius: Sizes.radiusLg,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: Sizes.md,
  },
  actionButton: {
    marginVertical: Sizes.xs,
  },
});

export default NotificationSettingsScreen;
