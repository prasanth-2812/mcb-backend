// Use your computer's IP address instead of localhost for React Native
const API_BASE_URL = 'http://10.184.72.116:4000/api';
// Fallback to localhost for web development
const API_BASE_URL_FALLBACK = 'http://localhost:4000/api';

export interface ApiJob {
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

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'employee' | 'employer';
  createdAt: string;
  updatedAt: string;
}

export interface ApiCandidate {
  id: number;
  name: string;
  jobTitle?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Try primary URL first, then fallback
    const urls = [API_BASE_URL, API_BASE_URL_FALLBACK];
    
    for (let i = 0; i < urls.length; i++) {
      const baseUrl = urls[i];
      const url = `${baseUrl}${endpoint}`;
      
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      try {
        console.log(`📡 Attempting connection to: ${url}`);
        const response = await fetch(url, config);
        
        console.log(`📊 Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API request successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ API request failed for ${url}:`, error);
        
        // If this is the last URL, throw the error
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All API endpoints failed. Last error: ${errorMessage}`);
        }
        
        // Otherwise, try the next URL
        console.log(`🔄 Trying fallback URL...`);
      }
    }
    
    throw new Error('No API endpoints available');
  }

  // Jobs API
  async getJobs(): Promise<ApiJob[]> {
    return this.request<ApiJob[]>('/jobs');
  }

  async getJob(id: string): Promise<ApiJob> {
    return this.request<ApiJob>(`/jobs/${id}`);
  }

  async createJob(job: Partial<ApiJob>): Promise<ApiJob> {
    return this.request<ApiJob>('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  async updateJob(id: string, job: Partial<ApiJob>): Promise<ApiJob> {
    return this.request<ApiJob>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(job),
    });
  }

  async deleteJob(id: string): Promise<{ deleted: number }> {
    return this.request<{ deleted: number }>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Users API
  async getUsers(): Promise<ApiUser[]> {
    return this.request<ApiUser[]>('/users');
  }

  async getUser(id: string): Promise<ApiUser> {
    return this.request<ApiUser>(`/users/${id}`);
  }

  async createUser(user: Partial<ApiUser>): Promise<ApiUser> {
    return this.request<ApiUser>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: Partial<ApiUser>): Promise<ApiUser> {
    return this.request<ApiUser>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string): Promise<{ deleted: number }> {
    return this.request<{ deleted: number }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Candidates API
  async getCandidates(): Promise<ApiCandidate[]> {
    return this.request<ApiCandidate[]>('/candidates');
  }

  async getCandidate(id: number): Promise<ApiCandidate> {
    return this.request<ApiCandidate>(`/candidates/${id}`);
  }

  async createCandidate(candidate: Partial<ApiCandidate>): Promise<ApiCandidate> {
    return this.request<ApiCandidate>('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidate),
    });
  }

  async updateCandidate(id: number, candidate: Partial<ApiCandidate>): Promise<ApiCandidate> {
    return this.request<ApiCandidate>(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(candidate),
    });
  }

  async deleteCandidate(id: number): Promise<{ deleted: number }> {
    return this.request<{ deleted: number }>(`/candidates/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    // Health endpoint is at root level, not under /api
    const urls = ['http://10.184.72.116:4000/health', 'http://localhost:4000/health'];
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      console.log(`🌐 Health Check: GET ${url}`);
      
      try {
        console.log(`📡 Attempting health check: ${url}`);
        const response = await fetch(url);
        
        console.log(`📊 Health response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ Health check successful:`, data);
        return data;
      } catch (error) {
        console.error(`❌ Health check failed for ${url}:`, error);
        
        // If this is the last URL, throw the error
        if (i === urls.length - 1) {
          throw new Error(`All health check endpoints failed. Last error: ${error.message}`);
        }
        
        // Otherwise, try the next URL
        console.log(`🔄 Trying fallback health check URL...`);
      }
    }
    
    throw new Error('No health check endpoints available');
  }
}

export const apiService = new ApiService();
export default apiService;
