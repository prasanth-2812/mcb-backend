import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URLs
const API_BASE_URL = 'http://10.115.43.116:4000/api';
const API_BASE_URL_FALLBACK = 'http://localhost:4000/api';

export interface JobApplicationResponse {
  message: string;
  jobId: string;
  userId: string;
  appliedAt: string;
}

class JobApplicationService {
  private async getAuthToken(): Promise<string | null> {
    try {
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
      
      console.log(`🌐 Job Application API Request: ${options.method || 'POST'} ${url}`);
      
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
        console.log(`📡 Attempting job application connection to: ${url}`);
        
        // Add timeout to prevent long waits
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Job application response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Job application HTTP Error Response:`, errorData);
          
          // Handle 401 specifically
          if (response.status === 401) {
            throw new Error('AUTHENTICATION_REQUIRED');
          }
          
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Job application API request successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ Job application API request failed for ${url}:`, error);
        
        // If this is the last URL, throw the error
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All job application API endpoints failed. Last error: ${errorMessage}`);
        }
        
        // Otherwise, try the next URL
        console.log(`🔄 Trying fallback job application URL...`);
      }
    }
    
    throw new Error('No job application API endpoints available');
  }

  async applyToJob(jobId: string): Promise<JobApplicationResponse> {
    try {
      console.log(`🔄 Applying to job: ${jobId}`);
      
      const response = await this.request<JobApplicationResponse>(`/jobs/${jobId}/apply`, {
        method: 'POST',
      });
      
      console.log('✅ Job application successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Job application failed:', error);
      throw error;
    }
  }

  // Save pending job application for after login
  async savePendingApplication(jobId: string): Promise<void> {
    try {
      await AsyncStorage.setItem('pendingJobApplication', jobId);
      console.log(`💾 Saved pending job application: ${jobId}`);
    } catch (error) {
      console.error('❌ Failed to save pending application:', error);
    }
  }

  // Get and clear pending job application
  async getPendingApplication(): Promise<string | null> {
    try {
      const jobId = await AsyncStorage.getItem('pendingJobApplication');
      if (jobId) {
        await AsyncStorage.removeItem('pendingJobApplication');
        console.log(`📤 Retrieved pending job application: ${jobId}`);
      }
      return jobId;
    } catch (error) {
      console.error('❌ Failed to get pending application:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      return !!token;
    } catch (error) {
      console.error('❌ Failed to check authentication:', error);
      return false;
    }
  }
}

export const jobApplicationService = new JobApplicationService();
export default jobApplicationService;
