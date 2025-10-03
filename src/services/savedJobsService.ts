// Saved Jobs service for handling saved jobs API calls
const API_BASE_URL = 'http://10.115.43.116:4000/api';
const API_BASE_URL_FALLBACK = 'http://10.115.43.116:4000/api';

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  type?: string;
  category?: string;
  isRemote?: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

class SavedJobsService {
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
      
      console.log(`🌐 Saved Jobs API Request: ${options.method || 'GET'} ${url}`);
      
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
        console.log(`📡 Attempting saved jobs connection to: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Saved Jobs response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // Handle 409 (already saved) gracefully
          if (response.status === 409) {
            console.log(`ℹ️ Job already saved: ${errorData.message}`);
            return { id: 'already-saved', message: errorData.message };
          }
          
          console.error(`❌ Saved Jobs HTTP Error Response:`, errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Saved Jobs API request successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ Saved Jobs API request failed for ${url}:`, error);
        
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All saved jobs API endpoints failed. Last error: ${errorMessage}`);
        }
        
        console.log(`🔄 Trying fallback saved jobs URL...`);
      }
    }
    
    throw new Error('No saved jobs API endpoints available');
  }

  // Get user's saved jobs
  async getSavedJobs(): Promise<Job[]> {
    return this.request<Job[]>('/saved-jobs');
  }

  // Save a job
  async saveJob(jobId: string): Promise<SavedJob> {
    return this.request<SavedJob>('/saved-jobs', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  }

  // Unsave a job
  async unsaveJob(jobId: string): Promise<{ deleted: boolean }> {
    return this.request<{ deleted: boolean }>(`/saved-jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  // Check if job is saved
  async isJobSaved(jobId: string): Promise<boolean> {
    try {
      const savedJobs = await this.getSavedJobs();
      return savedJobs.some(job => job.id === jobId);
    } catch (error) {
      console.error('Error checking if job is saved:', error);
      return false;
    }
  }

  // Get saved job IDs only (for quick checks)
  async getSavedJobIds(): Promise<string[]> {
    try {
      const savedJobs = await this.getSavedJobs();
      return savedJobs.map(job => job.id);
    } catch (error) {
      console.error('Error getting saved job IDs:', error);
      return [];
    }
  }
}

export const savedJobsService = new SavedJobsService();
export default savedJobsService;

