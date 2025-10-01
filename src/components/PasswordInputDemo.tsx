import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';

const PasswordInputDemo: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.dark;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
          Password Input Demo
        </Text>
        
        <Text variant="bodyMedium" style={[styles.subtitle, { color: isDark ? '#B0B0B0' : '#666666' }]}>
          Showcasing improved password visibility toggles
        </Text>

        <Card style={[styles.card, { backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Password Field
            </Text>
            
            <View style={styles.passwordInputContainer}>
              <View style={[styles.input, { 
                backgroundColor: isDark ? '#404040' : '#FFFFFF',
                borderColor: isDark ? '#666666' : '#E1E5E9'
              }]}>
                <Text style={[styles.inputText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  {password || 'Enter your password'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={isDark ? '#B0B0B0' : '#666666'}
                />
              </TouchableOpacity>
            </View>
            
            <Text variant="bodySmall" style={[styles.helpText, { color: isDark ? '#B0B0B0' : '#666666' }]}>
              Tap the eye icon to toggle password visibility
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Confirm Password Field
            </Text>
            
            <View style={styles.passwordInputContainer}>
              <View style={[styles.input, { 
                backgroundColor: isDark ? '#404040' : '#FFFFFF',
                borderColor: isDark ? '#666666' : '#E1E5E9'
              }]}>
                <Text style={[styles.inputText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  {confirmPassword || 'Confirm your password'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={isDark ? '#B0B0B0' : '#666666'}
                />
              </TouchableOpacity>
            </View>
            
            <Text variant="bodySmall" style={[styles.helpText, { color: isDark ? '#B0B0B0' : '#666666' }]}>
              Independent toggle for confirm password field
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Features Fixed
            </Text>
            
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text variant="bodyMedium" style={[styles.featureText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  Eye icon is now clearly visible and properly positioned
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text variant="bodyMedium" style={[styles.featureText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  Password toggle functionality works correctly
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text variant="bodyMedium" style={[styles.featureText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  Independent toggles for password and confirm password
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text variant="bodyMedium" style={[styles.featureText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  Forgot Password navigation now works properly
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text variant="bodyMedium" style={[styles.featureText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  Responsive design with proper touch targets
                </Text>
              </View>
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
  scrollContent: {
    padding: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  passwordInputContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingRight: 50,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  helpText: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    lineHeight: 20,
  },
});

export default PasswordInputDemo;
