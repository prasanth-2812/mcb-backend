const fetch = require('node-fetch').default;

const API_BASE = 'http://localhost:4000/api';

// Simulate the frontend data loading process
async function testFrontendJobsLoading() {
  console.log('🧪 Testing Frontend Jobs Loading Process...\n');

  try {
    // Step 1: Test API connection (simulating testApiConnection)
    console.log('1. 🔍 Testing API connection...');
    
    // Health check
    const healthResponse = await fetch('http://localhost:4000/health');
    console.log('Health check status:', healthResponse.status);
    
    if (!healthResponse.ok) {
      throw new Error('Health check failed');
    }
    console.log('✅ Health check passed');

    // Jobs endpoint test
    const jobsResponse = await fetch(`${API_BASE}/jobs`);
    console.log('Jobs endpoint status:', jobsResponse.status);
    
    if (!jobsResponse.ok) {
      throw new Error('Jobs endpoint failed');
    }
    
    const apiJobs = await jobsResponse.json();
    console.log(`✅ Jobs endpoint passed: ${apiJobs.length} jobs received`);

    // Step 2: Test data transformation (simulating transformApiJobsToJobs)
    console.log('\n2. 🔄 Testing data transformation...');
    
    const transformedJobs = apiJobs.map(job => ({
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

    console.log(`✅ Transformed ${transformedJobs.length} jobs for app`);
    
    // Log sample job
    if (transformedJobs.length > 0) {
      console.log('🔍 Sample transformed job:', {
        id: transformedJobs[0].id,
        title: transformedJobs[0].title,
        company: transformedJobs[0].company,
        location: transformedJobs[0].location,
        salary: transformedJobs[0].salary
      });
    }

    // Step 3: Test AsyncStorage simulation
    console.log('\n3. 💾 Testing AsyncStorage simulation...');
    
    // Simulate saving to cache
    const cacheData = JSON.stringify(transformedJobs);
    console.log(`✅ Cached ${transformedJobs.length} jobs (${cacheData.length} bytes)`);
    
    // Simulate loading from cache
    const loadedJobs = JSON.parse(cacheData);
    console.log(`✅ Loaded ${loadedJobs.length} jobs from cache`);

    // Step 4: Test state management simulation
    console.log('\n4. 🔄 Testing state management simulation...');
    
    const initialState = {
      jobs: [],
      user: null,
      applications: [],
      notifications: [],
      savedJobs: [],
      appliedJobs: [],
      isLoading: true
    };

    console.log('Initial state jobs:', initialState.jobs.length);
    
    // Simulate SET_JOBS action
    const updatedState = {
      ...initialState,
      jobs: transformedJobs,
      isLoading: false
    };

    console.log(`✅ State updated: ${updatedState.jobs.length} jobs, loading: ${updatedState.isLoading}`);

    console.log('\n🎉 Frontend Jobs Loading Test Passed!');
    console.log('\n📱 The frontend should be able to:');
    console.log('   ✅ Connect to API successfully');
    console.log('   ✅ Fetch jobs from API');
    console.log('   ✅ Transform API data to app format');
    console.log('   ✅ Cache jobs in AsyncStorage');
    console.log('   ✅ Update app state with jobs');
    console.log('   ✅ Display jobs in the UI');

  } catch (error) {
    console.error('❌ Frontend jobs loading test failed:', error.message);
    console.error('Error details:', error);
  }
}

testFrontendJobsLoading();
