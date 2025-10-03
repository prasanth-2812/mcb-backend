// Analytics service for handling analytics API calls
const API_BASE_URL = 'http://10.115.43.116:4000/api';
const API_BASE_URL_FALLBACK = 'http://localhost:4000/api';

export interface ApplicationStats {
  totalApplications: number;
  pendingApplications: number;
  reviewedApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  applicationRate: number; // applications per week/month
  successRate: number; // acceptance rate
  averageResponseTime: number; // in days
  applicationsByMonth: { month: string; count: number }[];
  applicationsByStatus: { status: string; count: number }[];
  applicationsByJobType: { type: string; count: number }[];
}

export interface JobStats {
  totalJobsViewed: number;
  jobsViewedToday: number;
  jobsViewedThisWeek: number;
  jobsViewedThisMonth: number;
  mostViewedJobTypes: { type: string; views: number }[];
  mostViewedCompanies: { company: string; views: number }[];
  searchQueries: { query: string; count: number }[];
  jobsByLocation: { location: string; count: number }[];
  jobsByCategory: { category: string; count: number }[];
}

export interface UserActivityStats {
  totalSessions: number;
  averageSessionDuration: number; // in minutes
  lastActiveDate: string;
  profileCompletionRate: number;
  skillsAdded: number;
  resumeUploads: number;
  profileViews: number;
  savedJobsCount: number;
  applicationsCount: number;
  activityByDay: { date: string; activity: number }[];
  activityByHour: { hour: number; activity: number }[];
  mostActiveDays: string[];
  mostActiveHours: number[];
}

export interface DashboardStats {
  applications: ApplicationStats;
  jobs: JobStats;
  user: UserActivityStats;
  lastUpdated: string;
}

class AnalyticsService {
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
      
      console.log(`🌐 Analytics API Request: ${options.method || 'GET'} ${url}`);
      
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
        console.log(`📡 Attempting analytics connection to: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Analytics response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Analytics HTTP Error Response:`, errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Analytics API request successful: ${endpoint}`);
        return data;
      } catch (error) {
        console.error(`❌ Analytics API request failed for ${url}:`, error);
        
        if (i === urls.length - 1) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`All analytics API endpoints failed. Last error: ${errorMessage}`);
        }
        
        console.log(`🔄 Trying fallback analytics URL...`);
      }
    }
    
    throw new Error('No analytics API endpoints available');
  }

  // Get application statistics
  async getApplicationStats(): Promise<ApplicationStats> {
    return this.request<ApplicationStats>('/analytics/applications');
  }

  // Get job view statistics
  async getJobStats(): Promise<JobStats> {
    return this.request<JobStats>('/analytics/jobs');
  }

  // Get user activity analytics
  async getUserStats(): Promise<UserActivityStats> {
    return this.request<UserActivityStats>('/analytics/user');
  }

  // Get comprehensive dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [applications, jobs, user] = await Promise.all([
        this.getApplicationStats(),
        this.getJobStats(),
        this.getUserStats(),
      ]);

      return {
        applications,
        jobs,
        user,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  // Get application trends over time
  async getApplicationTrends(period: 'week' | 'month' | 'year' = 'month'): Promise<{
    period: string;
    data: { date: string; applications: number }[];
  }> {
    try {
      const stats = await this.getApplicationStats();
      return {
        period,
        data: stats.applicationsByMonth,
      };
    } catch (error) {
      console.error('Error getting application trends:', error);
      return {
        period,
        data: [],
      };
    }
  }

  // Get job search insights
  async getJobSearchInsights(): Promise<{
    topSearches: { query: string; count: number }[];
    topJobTypes: { type: string; views: number }[];
    topLocations: { location: string; count: number }[];
    topCompanies: { company: string; views: number }[];
  }> {
    try {
      const jobStats = await this.getJobStats();
      return {
        topSearches: jobStats.searchQueries,
        topJobTypes: jobStats.mostViewedJobTypes,
        topLocations: jobStats.jobsByLocation,
        topCompanies: jobStats.mostViewedCompanies,
      };
    } catch (error) {
      console.error('Error getting job search insights:', error);
      return {
        topSearches: [],
        topJobTypes: [],
        topLocations: [],
        topCompanies: [],
      };
    }
  }

  // Get user performance metrics
  async getUserPerformance(): Promise<{
    profileCompletion: number;
    applicationSuccessRate: number;
    averageResponseTime: number;
    mostActiveTime: string;
    improvementSuggestions: string[];
  }> {
    try {
      const [applicationStats, userStats] = await Promise.all([
        this.getApplicationStats(),
        this.getUserStats(),
      ]);

      const improvementSuggestions: string[] = [];
      
      if (userStats.profileCompletionRate < 80) {
        improvementSuggestions.push('Complete your profile to increase visibility');
      }
      
      if (applicationStats.successRate < 0.1) {
        improvementSuggestions.push('Consider improving your application materials');
      }
      
      if (applicationStats.averageResponseTime > 7) {
        improvementSuggestions.push('Try applying to more recent job postings');
      }

      return {
        profileCompletion: userStats.profileCompletionRate,
        applicationSuccessRate: applicationStats.successRate,
        averageResponseTime: applicationStats.averageResponseTime,
        mostActiveTime: userStats.mostActiveHours.length > 0 
          ? `${userStats.mostActiveHours[0]}:00` 
          : 'Unknown',
        improvementSuggestions,
      };
    } catch (error) {
      console.error('Error getting user performance:', error);
      return {
        profileCompletion: 0,
        applicationSuccessRate: 0,
        averageResponseTime: 0,
        mostActiveTime: 'Unknown',
        improvementSuggestions: [],
      };
    }
  }

  // Track job view (for analytics)
  async trackJobView(jobId: string): Promise<void> {
    try {
      // This would typically send a tracking event to the analytics API
      console.log(`📊 Tracking job view: ${jobId}`);
      // In a real implementation, this would make an API call to track the view
    } catch (error) {
      console.error('Error tracking job view:', error);
    }
  }

  // Track search query (for analytics)
  async trackSearchQuery(query: string): Promise<void> {
    try {
      // This would typically send a tracking event to the analytics API
      console.log(`📊 Tracking search query: ${query}`);
      // In a real implementation, this would make an API call to track the search
    } catch (error) {
      console.error('Error tracking search query:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;

