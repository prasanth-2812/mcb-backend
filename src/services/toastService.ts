import { Alert } from 'react-native';

export interface ToastOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

class ToastService {
  private static instance: ToastService;
  private currentToast: any = null;

  static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  show(options: ToastOptions): void {
    const { title, message, type = 'info' } = options;
    
    // Clear any existing toast
    if (this.currentToast) {
      clearTimeout(this.currentToast);
    }

    // Create appropriate alert based on type
    switch (type) {
      case 'success':
        Alert.alert(
          title || 'Success',
          message,
          [{ text: 'OK', style: 'default' }],
          { cancelable: true }
        );
        break;
      
      case 'error':
        Alert.alert(
          title || 'Error',
          message,
          [{ text: 'OK', style: 'destructive' }],
          { cancelable: true }
        );
        break;
      
      case 'warning':
        Alert.alert(
          title || 'Warning',
          message,
          [{ text: 'OK', style: 'default' }],
          { cancelable: true }
        );
        break;
      
      default:
        Alert.alert(
          title || 'Info',
          message,
          [{ text: 'OK', style: 'default' }],
          { cancelable: true }
        );
        break;
    }
  }

  success(message: string, title?: string): void {
    this.show({ message, title, type: 'success' });
  }

  error(message: string, title?: string): void {
    this.show({ message, title, type: 'error' });
  }

  warning(message: string, title?: string): void {
    this.show({ message, title, type: 'warning' });
  }

  info(message: string, title?: string): void {
    this.show({ message, title, type: 'info' });
  }

  // Job application specific toasts
  jobAppliedSuccessfully(): void {
    this.success('✅ Job applied successfully!', 'Application Submitted');
  }

  jobApplyFailed(): void {
    this.error('❌ Failed to apply, please try again', 'Application Failed');
  }

  loginSuccessful(): void {
    this.success('🎉 Login Successful!', 'Welcome Back');
  }

  loginFailed(): void {
    this.warning('⚠️ Invalid credentials', 'Login Failed');
  }

  authenticationRequired(): void {
    this.warning('Please log in to apply for jobs', 'Authentication Required');
  }
}

export const toast = ToastService.getInstance();
export default toast;
