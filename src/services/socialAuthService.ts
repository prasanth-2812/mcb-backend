// Social Authentication Service
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SocialUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'linkedin' | 'facebook' | 'github';
}

export interface SocialAuthResult {
  success: boolean;
  user?: SocialUser;
  token?: string;
  error?: string;
}

class SocialAuthService {
  private readonly API_BASE_URL = 'http://192.168.3.203:4000/api';

  // Google Sign-In
  async signInWithGoogle(): Promise<SocialAuthResult> {
    try {
      console.log('🔐 Signing in with Google...');
      
      // In a real implementation, you would use:
      // import { GoogleSignin } from '@react-native-google-signin/google-signin';
      // const userInfo = await GoogleSignin.signIn();
      
      // For now, simulate Google sign-in
      const mockGoogleUser: SocialUser = {
        id: 'google_' + Date.now(),
        email: 'user@gmail.com',
        name: 'John Doe',
        picture: 'https://via.placeholder.com/100x100/4285F4/FFFFFF?text=G',
        provider: 'google'
      };

      const result = await this.authenticateWithBackend(mockGoogleUser);
      
      if (result.success) {
        await this.saveSocialAuthData(mockGoogleUser, result.token!);
        console.log('✅ Google sign-in successful');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Google sign-in failed:', error);
      return {
        success: false,
        error: 'Google sign-in failed. Please try again.'
      };
    }
  }

  // LinkedIn Sign-In
  async signInWithLinkedIn(): Promise<SocialAuthResult> {
    try {
      console.log('🔐 Signing in with LinkedIn...');
      
      // In a real implementation, you would use:
      // import { LinkedInSDK } from 'react-native-linkedin-sdk';
      // const result = await LinkedInSDK.login();
      
      // For now, simulate LinkedIn sign-in
      const mockLinkedInUser: SocialUser = {
        id: 'linkedin_' + Date.now(),
        email: 'user@linkedin.com',
        name: 'John Doe',
        picture: 'https://via.placeholder.com/100x100/0077B5/FFFFFF?text=L',
        provider: 'linkedin'
      };

      const result = await this.authenticateWithBackend(mockLinkedInUser);
      
      if (result.success) {
        await this.saveSocialAuthData(mockLinkedInUser, result.token!);
        console.log('✅ LinkedIn sign-in successful');
      }
      
      return result;
    } catch (error) {
      console.error('❌ LinkedIn sign-in failed:', error);
      return {
        success: false,
        error: 'LinkedIn sign-in failed. Please try again.'
      };
    }
  }

  // Facebook Sign-In
  async signInWithFacebook(): Promise<SocialAuthResult> {
    try {
      console.log('🔐 Signing in with Facebook...');
      
      // In a real implementation, you would use:
      // import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
      // const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      // For now, simulate Facebook sign-in
      const mockFacebookUser: SocialUser = {
        id: 'facebook_' + Date.now(),
        email: 'user@facebook.com',
        name: 'John Doe',
        picture: 'https://via.placeholder.com/100x100/1877F2/FFFFFF?text=F',
        provider: 'facebook'
      };

      const result = await this.authenticateWithBackend(mockFacebookUser);
      
      if (result.success) {
        await this.saveSocialAuthData(mockFacebookUser, result.token!);
        console.log('✅ Facebook sign-in successful');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Facebook sign-in failed:', error);
      return {
        success: false,
        error: 'Facebook sign-in failed. Please try again.'
      };
    }
  }

  // GitHub Sign-In
  async signInWithGitHub(): Promise<SocialAuthResult> {
    try {
      console.log('🔐 Signing in with GitHub...');
      
      // In a real implementation, you would use:
      // import { GitHubAuth } from 'react-native-github-auth';
      // const result = await GitHubAuth.login();
      
      // For now, simulate GitHub sign-in
      const mockGitHubUser: SocialUser = {
        id: 'github_' + Date.now(),
        email: 'user@github.com',
        name: 'John Doe',
        picture: 'https://via.placeholder.com/100x100/333333/FFFFFF?text=GH',
        provider: 'github'
      };

      const result = await this.authenticateWithBackend(mockGitHubUser);
      
      if (result.success) {
        await this.saveSocialAuthData(mockGitHubUser, result.token!);
        console.log('✅ GitHub sign-in successful');
      }
      
      return result;
    } catch (error) {
      console.error('❌ GitHub sign-in failed:', error);
      return {
        success: false,
        error: 'GitHub sign-in failed. Please try again.'
      };
    }
  }

  // Authenticate with backend
  private async authenticateWithBackend(socialUser: SocialUser): Promise<SocialAuthResult> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: socialUser.provider,
          providerId: socialUser.id,
          email: socialUser.email,
          name: socialUser.name,
          picture: socialUser.picture,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        user: socialUser,
        token: data.token
      };
    } catch (error) {
      console.error('❌ Backend authentication failed:', error);
      return {
        success: false,
        error: 'Authentication failed. Please try again.'
      };
    }
  }

  // Save social auth data
  private async saveSocialAuthData(user: SocialUser, token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('socialUser', JSON.stringify(user));
      console.log('💾 Social auth data saved');
    } catch (error) {
      console.error('❌ Failed to save social auth data:', error);
    }
  }

  // Get saved social user
  async getSavedSocialUser(): Promise<SocialUser | null> {
    try {
      const userData = await AsyncStorage.getItem('socialUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Failed to get saved social user:', error);
      return null;
    }
  }

  // Check if user is signed in with social provider
  async isSocialUserSignedIn(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const socialUser = await this.getSavedSocialUser();
      return !!(token && socialUser);
    } catch (error) {
      console.error('❌ Failed to check social sign-in status:', error);
      return false;
    }
  }

  // Sign out from social provider
  async signOut(): Promise<void> {
    try {
      console.log('🔐 Signing out from social provider...');
      
      // Clear stored data
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('socialUser');
      
      // In a real implementation, you would also sign out from the provider:
      // await GoogleSignin.signOut();
      // await LoginManager.logOut();
      
      console.log('✅ Social sign-out successful');
    } catch (error) {
      console.error('❌ Social sign-out failed:', error);
    }
  }

  // Get available social providers
  getAvailableProviders(): string[] {
    return ['google', 'linkedin', 'facebook', 'github'];
  }

  // Check if provider is available
  isProviderAvailable(provider: string): boolean {
    const availableProviders = this.getAvailableProviders();
    return availableProviders.includes(provider);
  }

  // Get provider display name
  getProviderDisplayName(provider: string): string {
    const names: { [key: string]: string } = {
      google: 'Google',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      github: 'GitHub'
    };
    return names[provider] || provider;
  }

  // Get provider icon
  getProviderIcon(provider: string): string {
    const icons: { [key: string]: string } = {
      google: 'google',
      linkedin: 'linkedin',
      facebook: 'facebook',
      github: 'github'
    };
    return icons[provider] || 'account';
  }

  // Get provider color
  getProviderColor(provider: string): string {
    const colors: { [key: string]: string } = {
      google: '#4285F4',
      linkedin: '#0077B5',
      facebook: '#1877F2',
      github: '#333333'
    };
    return colors[provider] || '#666666';
  }
}

export const socialAuthService = new SocialAuthService();
export default socialAuthService;
