// Companies service for handling companies API calls
const API_BASE_URL = 'http://192.168.3.203:4000/api';
const API_BASE_URL_FALLBACK = 'http://localhost:4000/api';

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size?: string;
  location?: string;
  foundedYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyJobsResponse {
  company: Company;
  jobs: Job[];
  total: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  location?: string;
  type?: string;
  category?: string;
  isRemote?: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

class CompaniesService {
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
      
      console.log(`🌐 Companies API Request: ${options.method || 'GET'} ${url}`);
      
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
        console.log(`📡 Attempting companies connection to: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Companies response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Companies HTTP Error Response:`, errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Companies API request successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ Companies API request failed for ${url}:`, error);
        
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All companies API endpoints failed. Last error: ${errorMessage}`);
        }
        
        console.log(`🔄 Trying fallback companies URL...`);
      }
    }
    
    throw new Error('No companies API endpoints available');
  }

  // Get all companies
  async getCompanies(): Promise<Company[]> {
    return this.request<Company[]>('/companies');
  }

  // Get company details by ID
  async getCompany(id: string): Promise<Company> {
    return this.request<Company>(`/companies/${id}`);
  }

  // Get jobs by company
  async getCompanyJobs(companyId: string): Promise<CompanyJobsResponse> {
    return this.request<CompanyJobsResponse>(`/companies/${companyId}/jobs`);
  }

  // Search companies by name
  async searchCompanies(query: string): Promise<Company[]> {
    try {
      const companies = await this.getCompanies();
      return companies.filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        (company.industry && company.industry.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching companies:', error);
      return [];
    }
  }

  // Get companies by industry
  async getCompaniesByIndustry(industry: string): Promise<Company[]> {
    try {
      const companies = await this.getCompanies();
      return companies.filter(company => 
        company.industry?.toLowerCase() === industry.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting companies by industry:', error);
      return [];
    }
  }

  // Get companies by size
  async getCompaniesBySize(size: string): Promise<Company[]> {
    try {
      const companies = await this.getCompanies();
      return companies.filter(company => 
        company.size?.toLowerCase() === size.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting companies by size:', error);
      return [];
    }
  }

  // Get companies by location
  async getCompaniesByLocation(location: string): Promise<Company[]> {
    try {
      const companies = await this.getCompanies();
      return companies.filter(company => 
        company.location?.toLowerCase().includes(location.toLowerCase())
      );
    } catch (error) {
      console.error('Error getting companies by location:', error);
      return [];
    }
  }

  // Get featured companies (companies with most jobs)
  async getFeaturedCompanies(limit: number = 10): Promise<Company[]> {
    try {
      const companies = await this.getCompanies();
      
      // Sort by number of jobs (this would ideally come from the API)
      // For now, just return the first N companies
      return companies.slice(0, limit);
    } catch (error) {
      console.error('Error getting featured companies:', error);
      return [];
    }
  }

  // Get company statistics
  async getCompanyStats(companyId: string): Promise<{
    totalJobs: number;
    activeJobs: number;
    averageSalary?: number;
    employeeCount?: number;
  }> {
    try {
      const companyJobs = await this.getCompanyJobs(companyId);
      return {
        totalJobs: companyJobs.total,
        activeJobs: companyJobs.jobs.length,
        // These would typically come from the API
        averageSalary: undefined,
        employeeCount: undefined,
      };
    } catch (error) {
      console.error('Error getting company stats:', error);
      return {
        totalJobs: 0,
        activeJobs: 0,
      };
    }
  }
}

export const companiesService = new CompaniesService();
export default companiesService;

