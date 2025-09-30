import profileData from '../data/profile.json';
import { apiService } from '../services/api';
import { transformApiJobsToJobs, transformApiUserToUser } from './apiDataTransformer';
import { testApiConnection } from './apiTest';

export const loadInitialData = () => {
  return {
    user: profileData,
    jobs: [],
    applications: [],
    notifications: [],
    savedJobs: [],
    appliedJobs: [],
  };
};

// Load data from API
export const loadDataFromAPI = async () => {
  try {
    console.log('🚀 Starting API data load...');
    console.log('📱 React Native environment detected');
    
    // Run comprehensive API test
    const testResult = await testApiConnection();
    
    if (!testResult.success) {
      throw new Error(`API test failed: ${testResult.error}`);
    }
    
    console.log('💚 API connection test passed, proceeding with data load...');
    
    // Fetch jobs from API
    console.log('📋 Fetching jobs from API...');
    const apiJobs = await apiService.getJobs();
    console.log(`📊 Raw API jobs received:`, apiJobs.length, 'jobs');
    
    const jobs = transformApiJobsToJobs(apiJobs);
    console.log(`✅ Transformed ${jobs.length} jobs for app`);
    
    // Log first job for debugging
    if (jobs.length > 0) {
      console.log('🔍 Sample job data:', {
        id: jobs[0].id,
        title: jobs[0].title,
        company: jobs[0].company,
        location: jobs[0].location
      });
    }
    
    return {
      jobs,
      // Keep other data as fallback for now
      user: profileData,
      applications: [],
      notifications: [],
      savedJobs: [],
      appliedJobs: [],
    };
  } catch (error) {
    console.error('❌ Failed to load data from API:', error);
    console.log('🔄 No fallback - API data only');
    
    // No fallback - return empty jobs array if API fails
    return {
      jobs: [],
      user: profileData,
      applications: [],
      notifications: [],
      savedJobs: [],
      appliedJobs: [],
    };
  }
};
