// Search service for handling search and filter API calls
const API_BASE_URL = 'http://10.115.43.116:4000/api';
const API_BASE_URL_FALLBACK = 'http://localhost:4000/api';

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

export interface SearchParams {
  q?: string;
  location?: string;
  type?: string;
  category?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  experience?: string;
  companySize?: string;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'salary';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  jobTypes: string[];
  locations: string[];
  categories: string[];
  experienceLevels: string[];
  companySizes: string[];
  salaryRanges: { min: number; max: number }[];
}

class SearchService {
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
      
      console.log(`🌐 Search API Request: ${options.method || 'GET'} ${url}`);
      
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
        console.log(`📡 Attempting search connection to: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Search response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Search HTTP Error Response:`, errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Search API request successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ Search API request failed for ${url}:`, error);
        
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All search API endpoints failed. Last error: ${errorMessage}`);
        }
        
        console.log(`🔄 Trying fallback search URL...`);
      }
    }
    
    throw new Error('No search API endpoints available');
  }

  // Search jobs with parameters
  async searchJobs(params: SearchParams = {}): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/search/jobs?${queryString}` : '/search/jobs';
    
    return this.request<SearchResponse>(endpoint);
  }

  // Get available filter options
  async getFilterOptions(): Promise<FilterOptions> {
    return this.request<FilterOptions>('/jobs/filters');
  }

  // Get recommended jobs for user
  async getRecommendedJobs(limit: number = 10): Promise<Job[]> {
    return this.request<Job[]>(`/jobs/recommended?limit=${limit}`);
  }

  // Search jobs by query only
  async searchByQuery(query: string, limit: number = 20): Promise<Job[]> {
    try {
      const response = await this.searchJobs({ q: query, limit });
      return response.jobs;
    } catch (error) {
      console.error('Error searching by query:', error);
      return [];
    }
  }

  // Search jobs by location
  async searchByLocation(location: string, limit: number = 20): Promise<Job[]> {
    try {
      const response = await this.searchJobs({ location, limit });
      return response.jobs;
    } catch (error) {
      console.error('Error searching by location:', error);
      return [];
    }
  }

  // Search jobs by type
  async searchByType(type: string, limit: number = 20): Promise<Job[]> {
    try {
      const response = await this.searchJobs({ type, limit });
      return response.jobs;
    } catch (error) {
      console.error('Error searching by type:', error);
      return [];
    }
  }

  // Search remote jobs
  async searchRemoteJobs(limit: number = 20): Promise<Job[]> {
    try {
      const response = await this.searchJobs({ isRemote: true, limit });
      return response.jobs;
    } catch (error) {
      console.error('Error searching remote jobs:', error);
      return [];
    }
  }

  // Advanced search with multiple filters
  async advancedSearch(filters: {
    query?: string;
    location?: string;
    type?: string;
    category?: string;
    isRemote?: boolean;
    salaryMin?: number;
    salaryMax?: number;
    experience?: string;
    companySize?: string;
    sortBy?: 'relevance' | 'date' | 'salary';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<SearchResponse> {
    return this.searchJobs(filters);
  }

  // Get trending job searches
  async getTrendingSearches(): Promise<string[]> {
    try {
      // This would typically come from analytics API
      // For now, return some common searches
      return [
        'React Developer',
        'Remote Jobs',
        'Frontend Developer',
        'Full Stack Developer',
        'UI/UX Designer',
        'Data Scientist',
        'Product Manager',
        'DevOps Engineer'
      ];
    } catch (error) {
      console.error('Error getting trending searches:', error);
      return [];
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      // This would typically call a suggestions API
      // For now, return some basic suggestions based on query
      const suggestions = [
        'React Developer',
        'React Native Developer',
        'React.js Developer',
        'Remote React Jobs',
        'React Frontend Developer'
      ];
      
      return suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }
}

export const searchService = new SearchService();
export default searchService;

