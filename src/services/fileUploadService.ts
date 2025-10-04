import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export interface FileUploadResult {
  success: boolean;
  uri?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  error?: string;
}

export class FileUploadService {
  // Request permissions for camera and media library
  static async requestPermissions(): Promise<boolean> {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  // Pick image from camera or gallery
  static async pickImage(): Promise<FileUploadResult> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return {
          success: false,
          error: 'Camera and media library permissions are required'
        };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.Images],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) {
        return {
          success: false,
          error: 'Image selection cancelled'
        };
      }

      const asset = result.assets[0];
      if (!asset) {
        return {
          success: false,
          error: 'No image selected'
        };
      }

      return {
        success: true,
        uri: asset.uri,
        fileName: asset.fileName || `profile_${Date.now()}.jpg`,
        fileSize: asset.fileSize,
        mimeType: asset.type || 'image/jpeg'
      };
    } catch (error) {
      console.error('Error picking image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to pick image'
      };
    }
  }

  // Take photo with camera
  static async takePhoto(): Promise<FileUploadResult> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return {
          success: false,
          error: 'Camera permission is required'
        };
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) {
        return {
          success: false,
          error: 'Photo capture cancelled'
        };
      }

      const asset = result.assets[0];
      if (!asset) {
        return {
          success: false,
          error: 'No photo captured'
        };
      }

      return {
        success: true,
        uri: asset.uri,
        fileName: asset.fileName || `photo_${Date.now()}.jpg`,
        fileSize: asset.fileSize,
        mimeType: asset.type || 'image/jpeg'
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to take photo'
      };
    }
  }

  // Pick document (resume)
  static async pickDocument(): Promise<FileUploadResult> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return {
          success: false,
          error: 'Document selection cancelled'
        };
      }

      const asset = result.assets[0];
      if (!asset) {
        return {
          success: false,
          error: 'No document selected'
        };
      }

      return {
        success: true,
        uri: asset.uri,
        fileName: asset.name,
        fileSize: asset.size,
        mimeType: asset.mimeType || 'application/pdf'
      };
    } catch (error) {
      console.error('Error picking document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to pick document'
      };
    }
  }

  // Upload file to server
  static async uploadFile(
    uri: string, 
    fileName: string, 
    mimeType: string,
    uploadType: 'avatar' | 'resume'
  ): Promise<FileUploadResult> {
    try {
      const formData = new FormData();
      
      // Create file object for upload
      const file = {
        uri: uri,
        type: mimeType,
        name: fileName,
      } as any;

      formData.append('file', file);
      formData.append('type', uploadType);

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'}/api/profile/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      
      return {
        success: true,
        uri: result.url || result.avatarUrl || result.resumeUrl,
        fileName: result.fileName || fileName,
        fileSize: result.fileSize,
        mimeType: result.mimeType || mimeType
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file'
      };
    }
  }

  // Get auth token from AsyncStorage
  private static async getAuthToken(): Promise<string> {
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const token = await AsyncStorage.getItem('authToken');
      return token || '';
    } catch (error) {
      console.error('Error getting auth token:', error);
      return '';
    }
  }

  // Validate file size and type
  static validateFile(fileSize: number, mimeType: string, maxSizeMB: number = 10): { valid: boolean; error?: string } {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (fileSize > maxSizeBytes) {
      return {
        valid: false,
        error: `File size must be less than ${maxSizeMB}MB`
      };
    }

    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (mimeType.startsWith('image/') && !allowedImageTypes.includes(mimeType)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, and GIF images are allowed'
      };
    }

    if (mimeType.startsWith('application/') && !allowedDocTypes.includes(mimeType)) {
      return {
        valid: false,
        error: 'Only PDF and Word documents are allowed'
      };
    }

    return { valid: true };
  }
}
