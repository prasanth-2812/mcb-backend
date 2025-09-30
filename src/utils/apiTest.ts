import { apiService } from '../services/api';

export const testApiConnection = async () => {
  console.log('🧪 Starting API connection test...');
  
  try {
    // Test 1: Health Check
    console.log('🔍 Testing health endpoint...');
    const health = await apiService.healthCheck();
    console.log('✅ Health check passed:', health);
    
    // Test 2: Jobs endpoint
    console.log('📋 Testing jobs endpoint...');
    const jobs = await apiService.getJobs();
    console.log(`✅ Jobs endpoint passed: ${jobs.length} jobs received`);
    
    // Test 3: Sample job data
    if (jobs.length > 0) {
      const sampleJob = jobs[0];
      console.log('📊 Sample job:', {
        id: sampleJob.id,
        title: sampleJob.title,
        company: sampleJob.company,
        location: sampleJob.location
      });
    }
    
    console.log('🎉 All API tests passed successfully!');
    return { success: true, jobsCount: jobs.length };
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return { success: false, error: error.message };
  }
};
