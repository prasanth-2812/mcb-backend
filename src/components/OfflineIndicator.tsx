import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { offlineService, SyncStatus } from '../services/offlineService';

interface OfflineIndicatorProps {
  isDark: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isDark }) => {
  const theme = useTheme();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(offlineService.getSyncStatus());
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    const unsubscribe = offlineService.subscribe(setSyncStatus);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!syncStatus.isOnline) {
      // Slide down when offline
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide up when online
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [syncStatus.isOnline]);

  if (syncStatus.isOnline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? DarkColors.warning : Colors.warning,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="wifi-off"
          size={16}
          color={Colors.white}
        />
        <Text variant="bodySmall" style={styles.text}>
          You're offline. Changes will sync when you're back online.
        </Text>
        {syncStatus.pendingActions > 0 && (
          <Text variant="bodySmall" style={styles.pendingText}>
            {syncStatus.pendingActions} pending
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
  },
  text: {
    color: Colors.white,
    marginLeft: Sizes.sm,
    flex: 1,
    fontWeight: '500',
  },
  pendingText: {
    color: Colors.white,
    marginLeft: Sizes.sm,
    fontWeight: 'bold',
  },
});

export default OfflineIndicator;
