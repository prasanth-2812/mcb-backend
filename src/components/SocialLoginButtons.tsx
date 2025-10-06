import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, DarkColors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { socialAuthService, SocialAuthResult } from '../services/socialAuthService';

interface SocialLoginButtonsProps {
  onLoginSuccess: (result: SocialAuthResult) => void;
  onLoginError: (error: string) => void;
  isDark: boolean;
  disabled?: boolean;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onLoginSuccess,
  onLoginError,
  isDark,
  disabled = false
}) => {
  const theme = useTheme();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'google',
      color: '#4285F4',
      backgroundColor: '#4285F4'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'linkedin',
      color: '#0077B5',
      backgroundColor: '#0077B5'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'facebook',
      color: '#1877F2',
      backgroundColor: '#1877F2'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'github',
      color: '#333333',
      backgroundColor: '#333333'
    }
  ];

  const handleSocialLogin = async (provider: string) => {
    if (disabled || loadingProvider) return;

    try {
      setLoadingProvider(provider);
      console.log(`🔐 Starting ${provider} login...`);

      let result: SocialAuthResult;

      switch (provider) {
        case 'google':
          result = await socialAuthService.signInWithGoogle();
          break;
        case 'linkedin':
          result = await socialAuthService.signInWithLinkedIn();
          break;
        case 'facebook':
          result = await socialAuthService.signInWithFacebook();
          break;
        case 'github':
          result = await socialAuthService.signInWithGitHub();
          break;
        default:
          throw new Error('Unsupported provider');
      }

      if (result.success) {
        console.log(`✅ ${provider} login successful`);
        onLoginSuccess(result);
      } else {
        console.error(`❌ ${provider} login failed:`, result.error);
        onLoginError(result.error || `${provider} login failed`);
      }
    } catch (error) {
      console.error(`❌ ${provider} login error:`, error);
      onLoginError(`${provider} login failed. Please try again.`);
    } finally {
      setLoadingProvider(null);
    }
  };

  const renderSocialButton = (provider: typeof socialProviders[0]) => {
    const isLoading = loadingProvider === provider.id;
    const isDisabled = disabled || loadingProvider;

    return (
      <TouchableOpacity
        key={provider.id}
        style={[
          styles.socialButton,
          {
            backgroundColor: isDark ? DarkColors.surface : Colors.surface,
            borderColor: provider.color,
            opacity: isDisabled ? 0.6 : 1
          }
        ]}
        onPress={() => handleSocialLogin(provider.id)}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <View style={styles.socialButtonContent}>
          {isLoading ? (
            <ActivityIndicator 
              size="small" 
              color={provider.color} 
              style={styles.socialButtonIcon}
            />
          ) : (
            <MaterialCommunityIcons
              name={provider.icon}
              size={20}
              color={provider.color}
              style={styles.socialButtonIcon}
            />
          )}
          <Text
            variant="bodyMedium"
            style={[
              styles.socialButtonText,
              {
                color: isDark ? DarkColors.text : Colors.text,
                opacity: isLoading ? 0.7 : 1
              }
            ]}
          >
            {isLoading ? 'Signing in...' : `Continue with ${provider.name}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={[styles.dividerLine, { backgroundColor: isDark ? DarkColors.border : Colors.border }]} />
        <Text
          variant="bodySmall"
          style={[
            styles.dividerText,
            { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }
          ]}
        >
          Or continue with
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: isDark ? DarkColors.border : Colors.border }]} />
      </View>

      <View style={styles.buttonsContainer}>
        {socialProviders.map(renderSocialButton)}
      </View>

      <Text
        variant="bodySmall"
        style={[
          styles.disclaimerText,
          { color: isDark ? DarkColors.textSecondary : Colors.textSecondary }
        ]}
      >
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Sizes.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Sizes.md,
    fontSize: 12,
  },
  buttonsContainer: {
    gap: Sizes.sm,
  },
  socialButton: {
    borderRadius: Sizes.radiusMd,
    borderWidth: 1,
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonIcon: {
    marginRight: Sizes.sm,
  },
  socialButtonText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  disclaimerText: {
    textAlign: 'center',
    marginTop: Sizes.lg,
    fontSize: 11,
    lineHeight: 16,
  },
});

export default SocialLoginButtons;
