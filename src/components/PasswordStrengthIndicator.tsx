import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { getPasswordStrength } from '../utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showIndicator?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showIndicator = true,
}) => {
  if (!password || !showIndicator) return null;

  const strength = getPasswordStrength(password);

  return (
    <View style={styles.container}>
      <View style={styles.strengthBar}>
        <ProgressBar
          progress={strength.score / 4}
          color={strength.color}
          style={styles.progressBar}
        />
      </View>
      <Text variant="bodySmall" style={[styles.strengthText, { color: strength.color }]}>
        Password strength: {strength.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default PasswordStrengthIndicator;
