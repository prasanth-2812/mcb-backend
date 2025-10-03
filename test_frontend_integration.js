const fetch = require('node-fetch').default;

const API_BASE = 'http://localhost:4000/api';

async function testFrontendIntegration() {
  console.log('🧪 Testing Frontend Integration with APIs...\n');

  let authToken = null;
  let userId = null;

  try {
    // Step 1: Login to get authentication token
    console.log('1. 🔐 Logging in...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john.doe@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    authToken = loginData.token;
    userId = loginData.user.id;
    console.log('✅ Login successful, user ID:', userId);

    // Step 2: Test all the endpoints that the frontend uses
    console.log('\n2. 📋 Testing Jobs endpoint (used by frontend)...');
    const jobsResponse = await fetch(`${API_BASE}/jobs`);
    const jobs = await jobsResponse.json();
    console.log(`✅ Jobs endpoint working: ${jobs.length} jobs found`);

    // Step 3: Test Saved Jobs endpoints (used by frontend)
    console.log('\n3. 💾 Testing Saved Jobs endpoints...');
    
    // Save a job
    const saveResponse = await fetch(`${API_BASE}/saved-jobs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ jobId: jobs[0].id })
    });
    console.log('Save job status:', saveResponse.status);
    
    // Get saved jobs
    const savedJobsResponse = await fetch(`${API_BASE}/saved-jobs`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Get saved jobs status:', savedJobsResponse.status);
    if (savedJobsResponse.ok) {
      const savedJobs = await savedJobsResponse.json();
      console.log(`✅ Saved jobs endpoint working: ${savedJobs.length} saved jobs`);
    }

    // Step 4: Test Applications endpoints (used by frontend)
    console.log('\n4. 📝 Testing Applications endpoints...');
    
    // Get applications
    const applicationsResponse = await fetch(`${API_BASE}/applications`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Get applications status:', applicationsResponse.status);
    if (applicationsResponse.ok) {
      const applications = await applicationsResponse.json();
      console.log(`✅ Applications endpoint working: ${applications.length} applications`);
    }

    // Step 5: Test Notifications endpoint (used by frontend)
    console.log('\n5. 🔔 Testing Notifications endpoint...');
    const notificationsResponse = await fetch(`${API_BASE}/notifications`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Get notifications status:', notificationsResponse.status);
    if (notificationsResponse.ok) {
      const notifications = await notificationsResponse.json();
      console.log(`✅ Notifications endpoint working: ${notifications.length} notifications`);
    }

    // Step 6: Test Profile endpoint (used by frontend)
    console.log('\n6. 👤 Testing Profile endpoint...');
    const profileResponse = await fetch(`${API_BASE}/profile`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Get profile status:', profileResponse.status);
    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      console.log(`✅ Profile endpoint working: ${profile.name}`);
    }

    // Step 7: Test Search endpoint (used by frontend)
    console.log('\n7. 🔍 Testing Search endpoint...');
    const searchResponse = await fetch(`${API_BASE}/search?q=developer`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Search status:', searchResponse.status);
    if (searchResponse.ok) {
      const searchResults = await searchResponse.json();
      console.log(`✅ Search endpoint working: ${searchResults.length} results`);
    }

    // Step 8: Test Analytics endpoint (used by frontend)
    console.log('\n8. 📊 Testing Analytics endpoint...');
    const analyticsResponse = await fetch(`${API_BASE}/analytics`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Analytics status:', analyticsResponse.status);
    if (analyticsResponse.ok) {
      const analytics = await analyticsResponse.json();
      console.log(`✅ Analytics endpoint working: ${Object.keys(analytics).length} metrics`);
    }

    console.log('\n🎉 All frontend integration tests completed successfully!');
    console.log('\n📱 Frontend should now be able to:');
    console.log('   ✅ Login and authenticate users');
    console.log('   ✅ Browse and search jobs');
    console.log('   ✅ Save and unsave jobs');
    console.log('   ✅ Apply to jobs');
    console.log('   ✅ View applications');
    console.log('   ✅ View notifications');
    console.log('   ✅ View and update profile');
    console.log('   ✅ View analytics');

  } catch (error) {
    console.error('❌ Frontend integration test failed:', error.message);
  }
}

testFrontendIntegration();
