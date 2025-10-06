// Applications service for handling job applications API calls
const API_BASE_URL = 'http://192.168.3.203:4000/api';
const API_BASE_URL_FALLBACK = 'http://10.115.43.116:4000/api';

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationRequest {
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface UpdateApplicationRequest {
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
  resumeUrl?: string;
}

class ApplicationsService {
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
      
      console.log(`🌐 Applications API Request: ${options.method || 'GET'} ${url}`);
      
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
        console.log(`📡 Attempting applications connection to: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Applications response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Applications HTTP Error Response:`, errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Applications API request successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ Applications API request failed for ${url}:`, error);
        
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All applications API endpoints failed. Last error: ${errorMessage}`);
        }
        
        console.log(`🔄 Trying fallback applications URL...`);
      }
    }
    
    throw new Error('No applications API endpoints available');
  }

  // Get all user's applications
  async getApplications(): Promise<Application[]> {
    return this.request<Application[]>('/applications');
  }

  // Apply to a job
  async applyToJob(applicationData: CreateApplicationRequest): Promise<Application> {
    return this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  // Get specific application
  async getApplication(id: string): Promise<Application> {
    return this.request<Application>(`/applications/${id}`);
  }

  // Update application
  async updateApplication(id: string, updateData: UpdateApplicationRequest): Promise<Application> {
    return this.request<Application>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Withdraw application
  async withdrawApplication(id: string): Promise<{ deleted: boolean }> {
    return this.request<{ deleted: boolean }>(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  // Get applications for a specific job (employer view)
  async getJobApplications(jobId: string): Promise<Application[]> {
    return this.request<Application[]>(`/applications/job/${jobId}`);
  }

  // Check if user has applied to a job
  async hasAppliedToJob(jobId: string): Promise<boolean> {
    try {
      const applications = await this.getApplications();
      return applications.some(app => app.jobId === jobId);
    } catch (error) {
      console.error('Error checking application status:', error);
      return false;
    }
  }
}

export const applicationsService = new ApplicationsService();
export default applicationsService;

