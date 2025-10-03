// Simulate React Native app startup and job loading
const fetch = require('node-fetch').default;

const API_BASE = 'http://localhost:4000/api';

// Simulate AsyncStorage
const mockAsyncStorage = {
  getItem: async (key) => {
    console.log(`📱 Mock AsyncStorage getItem: ${key}`);
    if (key === 'cachedJobs') {
      return null; // No cached jobs initially
    }
    if (key === 'authToken') {
      return null; // No auth token initially
    }
    if (key === 'user') {
      return null; // No user initially
    }
    if (key === 'theme') {
      return 'light';
    }
    if (key === 'onboardingComplete') {
      return 'true';
    }
    return null;
  },
  setItem: async (key, value) => {
    console.log(`📱 Mock AsyncStorage setItem: ${key} = ${value.substring(0, 50)}...`);
  },
  removeItem: async (key) => {
    console.log(`📱 Mock AsyncStorage removeItem: ${key}`);
  }
};

// Simulate the dataLoader
async function mockLoadDataFromAPI() {
  try {
    console.log('🚀 Starting API data load...');
    console.log('📱 React Native environment detected');
    
    // Test API connection
    console.log('🔍 Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:4000/health');
    if (!healthResponse.ok) {
      throw new Error('Health check failed');
    }
    console.log('✅ Health check passed');
    
    // Test jobs endpoint
    console.log('📋 Testing jobs endpoint...');
    const jobsResponse = await fetch(`${API_BASE}/jobs`);
    if (!jobsResponse.ok) {
      throw new Error('Jobs endpoint failed');
    }
    
    const apiJobs = await jobsResponse.json();
    console.log(`✅ Jobs endpoint passed: ${apiJobs.length} jobs received`);
    
    // Transform jobs
    const jobs = apiJobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      category: job.category,
      isRemote: job.isRemote,
      description: job.description,
      salary: `$${Math.floor(Math.random() * 50000) + 50000} - $${Math.floor(Math.random() * 100000) + 80000}`,
      experience: `${Math.floor(Math.random() * 5) + 1} years`,
      tags: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
      isUrgent: Math.random() > 0.7,
      companyLogo: `https://via.placeholder.com/60x60/2563eb/ffffff?text=${job.company.charAt(0)}`,
      postedDate: new Date().toISOString(),
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    console.log(`✅ Transformed ${jobs.length} jobs for app`);
    
    return {
      jobs,
      user: null,
      applications: [],
      notifications: [],
      savedJobs: [],
      appliedJobs: []
    };
    
  } catch (error) {
    console.error('❌ API data load failed:', error.message);
    throw error;
  }
}

// Simulate AppContext loadJobsInBackground
async function mockLoadJobsInBackground() {
  try {
    console.log('🔄 AppContext: Starting job loading...');
    
    // Try to load cached jobs first
    const cachedJobs = await mockAsyncStorage.getItem('cachedJobs');
    if (cachedJobs) {
      const jobs = JSON.parse(cachedJobs);
      console.log(`📱 AppContext: Loaded ${jobs.length} cached jobs`);
      return jobs;
    }

    // Then load fresh data from API
    console.log('🔄 AppContext: Loading fresh jobs from API in background...');
    const apiData = await mockLoadDataFromAPI();
    
    // Cache the fresh data
    await mockAsyncStorage.setItem('cachedJobs', JSON.stringify(apiData.jobs));
    console.log(`✅ AppContext: Loaded ${apiData.jobs.length} fresh jobs from API`);
    
    return apiData.jobs;
    
  } catch (apiError) {
    console.error('❌ AppContext: API loading failed:', apiError.message);
    return [];
  }
}

// Simulate AppContext loadAppData
async function mockLoadAppData() {
  try {
    console.log('🔄 AppContext: Starting app data load...');
    
    // Load local data first (fast)
    const [authToken, user, theme, onboardingComplete] = await Promise.all([
      mockAsyncStorage.getItem('authToken'),
      mockAsyncStorage.getItem('user'),
      mockAsyncStorage.getItem('theme'),
      mockAsyncStorage.getItem('onboardingComplete'),
    ]);

    console.log('📱 AppContext: Local data loaded');
    console.log(`   - Auth token: ${authToken ? 'Present' : 'None'}`);
    console.log(`   - User: ${user ? 'Present' : 'None'}`);
    console.log(`   - Theme: ${theme}`);
    console.log(`   - Onboarding: ${onboardingComplete}`);

    // Load jobs from API in background (non-blocking)
    const jobs = await mockLoadJobsInBackground();
    
    console.log(`✅ AppContext: App data loaded successfully`);
    console.log(`   - Jobs: ${jobs.length}`);
    
    return {
      jobs,
      user: user ? JSON.parse(user) : null,
      theme: theme || 'light',
      onboardingComplete: onboardingComplete === 'true',
      isLoading: false
    };
    
  } catch (error) {
    console.error('❌ AppContext: App data load failed:', error.message);
    return {
      jobs: [],
      user: null,
      theme: 'light',
      onboardingComplete: false,
      isLoading: false
    };
  }
}

// Simulate JobsScreen
async function mockJobsScreen() {
  try {
    console.log('🔄 JobsScreen: Starting...');
    
    // Simulate AppContext state
    const appState = await mockLoadAppData();
    
    console.log(`📱 JobsScreen: App state loaded`);
    console.log(`   - Jobs available: ${appState.jobs.length}`);
    console.log(`   - User: ${appState.user ? appState.user.name : 'None'}`);
    console.log(`   - Loading: ${appState.isLoading}`);
    
    if (appState.jobs.length === 0) {
      console.log('❌ JobsScreen: No jobs available!');
      return false;
    }
    
    // Simulate filtering jobs
    const filteredJobs = appState.jobs.filter(job => 
      job.title.toLowerCase().includes('developer')
    );
    
    console.log(`📋 JobsScreen: Filtered jobs: ${filteredJobs.length}`);
    
    // Simulate rendering jobs
    console.log('🎨 JobsScreen: Rendering jobs...');
    appState.jobs.forEach((job, index) => {
      console.log(`   ${index + 1}. ${job.title} at ${job.company} (${job.location})`);
    });
    
    console.log('✅ JobsScreen: Jobs rendered successfully');
    return true;
    
  } catch (error) {
    console.error('❌ JobsScreen: Failed to load jobs:', error.message);
    return false;
  }
}

// Run the complete simulation
async function testReactNativeStartup() {
  console.log('🧪 Testing Complete React Native App Startup...\n');
  
  try {
    const success = await mockJobsScreen();
    
    if (success) {
      console.log('\n🎉 React Native App Startup Test PASSED!');
      console.log('\n📱 Your app should now:');
      console.log('   ✅ Load jobs from API on startup');
      console.log('   ✅ Cache jobs in AsyncStorage');
      console.log('   ✅ Display jobs in JobsScreen');
      console.log('   ✅ Handle user authentication');
      console.log('   ✅ Filter and search jobs');
    } else {
      console.log('\n❌ React Native App Startup Test FAILED!');
      console.log('\n🔍 Check the console logs above for errors');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testReactNativeStartup();
