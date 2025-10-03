// Profile service for handling user profile API calls
const API_BASE_URL = 'http://10.115.43.116:4000/api';
const API_BASE_URL_FALLBACK = 'http://localhost:4000/api';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'employee' | 'employer';
  skills?: string[];
  resumeUrl?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  skills?: string[];
}

export interface SkillsResponse {
  skills: string[];
}

class ProfileService {
  private async getAuthToken(): Promise<string | null> {
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const urls = [API_BASE_URL, API_BASE_URL_FALLBACK];
    
    for (let i = 0; i < urls.length; i++) {
      const baseUrl = urls[i];
      const url = `${baseUrl}${endpoint}`;
      
      console.log(`🌐 Profile API Request: ${options.method || 'GET'} ${url}`);
      
      const token = await this.getAuthToken();
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      try {
        console.log(`📡 Attempting profile connection to: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Profile response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Profile HTTP Error Response:`, errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Profile API request successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ Profile API request failed for ${url}:`, error);
        
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All profile API endpoints failed. Last error: ${errorMessage}`);
        }
        
        console.log(`🔄 Trying fallback profile URL...`);
      }
    }
    
    throw new Error('No profile API endpoints available');
  }

  private async uploadFile<T>(endpoint: string, file: any, fieldName: string): Promise<T> {
    const urls = [API_BASE_URL, API_BASE_URL_FALLBACK];
    
    for (let i = 0; i < urls.length; i++) {
      const baseUrl = urls[i];
      const url = `${baseUrl}${endpoint}`;
      
      console.log(`🌐 Profile Upload Request: POST ${url}`);
      
      const token = await this.getAuthToken();
      
      const formData = new FormData();
      formData.append(fieldName, file);
      
      const config: RequestInit = {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      };

      try {
        console.log(`📡 Attempting profile upload to: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for uploads
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Profile upload response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Profile Upload HTTP Error Response:`, errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Profile upload successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ Profile upload failed for ${url}:`, error);
        
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All profile upload endpoints failed. Last error: ${errorMessage}`);
        }
        
        console.log(`🔄 Trying fallback profile upload URL...`);
      }
    }
    
    throw new Error('No profile upload endpoints available');
  }

  // Get user profile
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/profile');
  }

  // Update user profile
  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    return this.request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Upload resume
  async uploadResume(file: any): Promise<{ resumeUrl: string }> {
    return this.uploadFile<{ resumeUrl: string }>('/profile/upload-resume', file, 'resume');
  }

  // Upload profile picture/avatar
  async uploadAvatar(file: any): Promise<{ avatarUrl: string }> {
    return this.uploadFile<{ avatarUrl: string }>('/profile/upload-avatar', file, 'avatar');
  }

  // Get user skills
  async getSkills(): Promise<SkillsResponse> {
    return this.request<SkillsResponse>('/profile/skills');
  }

  // Update user skills
  async updateSkills(skills: string[]): Promise<SkillsResponse> {
    return this.request<SkillsResponse>('/profile/skills', {
      method: 'PUT',
      body: JSON.stringify({ skills }),
    });
  }

  // Add skill
  async addSkill(skill: string): Promise<SkillsResponse> {
    try {
      const currentSkills = await this.getSkills();
      const updatedSkills = [...currentSkills.skills, skill];
      return this.updateSkills(updatedSkills);
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  }

  // Remove skill
  async removeSkill(skill: string): Promise<SkillsResponse> {
    try {
      const currentSkills = await this.getSkills();
      const updatedSkills = currentSkills.skills.filter(s => s !== skill);
      return this.updateSkills(updatedSkills);
    } catch (error) {
      console.error('Error removing skill:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;
