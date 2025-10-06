import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

interface RealJobDataToggleProps {
  useRealData: boolean;
  onToggle: () => void;
  isDark: boolean;
}

const RealJobDataToggle: React.FC<RealJobDataToggleProps> = ({
  useRealData,
  onToggle,
  isDark
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text variant="bodySmall" style={[styles.label, { 
          color: isDark ? DarkColors.textSecondary : Colors.textSecondary 
        }]}>
          Data Source:
        </Text>
        <Button
          mode={useRealData ? "contained" : "outlined"}
          onPress={onToggle}
          style={[
            styles.toggleButton,
            useRealData ? styles.realDataButton : styles.demoDataButton
          ]}
          compact
          icon={useRealData ? "earth" : "database"}
        >
          {useRealData ? 'Live Jobs' : 'Demo Jobs'}
        </Button>
      </View>
      <Text variant="bodySmall" style={[styles.description, { 
        color: isDark ? DarkColors.textSecondary : Colors.textSecondary 
      }]}>
        {useRealData 
          ? 'Real-time job data from Indeed, LinkedIn, RemoteOK, and more' 
          : 'Sample job data for demonstration'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizes.xs,
  },
  label: {
    fontWeight: '500',
  },
  toggleButton: {
    borderRadius: Sizes.radiusMd,
  },
  realDataButton: {
    backgroundColor: Colors.success,
  },
  demoDataButton: {
    borderColor: Colors.primary,
  },
  description: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default RealJobDataToggle;
