// Auth service for handling authentication API calls
const API_BASE_URL = 'http://192.168.3.203:4000/api';
const API_BASE_URL_FALLBACK = 'http://localhost:4000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'employee' | 'employer';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
}

class AuthService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const urls = [API_BASE_URL, API_BASE_URL_FALLBACK];
    
    for (let i = 0; i < urls.length; i++) {
      const baseUrl = urls[i];
      const url = `${baseUrl}${endpoint}`;
      
      console.log(`🌐 Auth API Request: ${options.method || 'GET'} ${url}`);
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      try {
        console.log(`📡 Attempting auth connection to: ${url}`);
        
        // Add timeout to prevent long waits
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Auth response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Auth HTTP Error Response:`, errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Auth API request successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ Auth API request failed for ${url}:`, error);
        
        // If this is the last URL, throw the error
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All auth API endpoints failed. Last error: ${errorMessage}`);
        }
        
        // Otherwise, try the next URL
        console.log(`🔄 Trying fallback auth URL...`);
      }
    }
    
    throw new Error('No auth API endpoints available');
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('🔄 Attempting registration with data:', { 
      email: userData.email, 
      name: userData.name,
      role: userData.role 
    });
    
    try {
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      console.log('✅ Registration successful');
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  }

  async getCurrentUser(token: string): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Health check for auth service
  async healthCheck(): Promise<{ status: string }> {
    const urls = ['http://10.184.72.116:4000/health', 'http://localhost:4000/health'];
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      console.log(`🌐 Auth Health Check: GET ${url}`);
      
      try {
        console.log(`📡 Attempting auth health check: ${url}`);
        
        // Add timeout for health check
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(url, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Auth health response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ Auth health check successful:`, data);
        return data;
      } catch (error) {
        console.error(`❌ Auth health check failed for ${url}:`, error);
        
        // If this is the last URL, throw the error
        if (i === urls.length - 1) {
          throw new Error(`All auth health check endpoints failed. Last error: ${error.message}`);
        }
        
        // Otherwise, try the next URL
        console.log(`🔄 Trying fallback auth health check URL...`);
      }
    }
    
    throw new Error('No auth health check endpoints available');
  }
}

export const authService = new AuthService();
export default authService;
