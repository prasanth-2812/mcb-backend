const fetch = require('node-fetch').default;

const API_BASE = 'http://localhost:4000/api';

async function testAnalyticsWithEmployer() {
  console.log('🧪 Testing Analytics with Employer User...\n');

  try {
    // Step 1: Login as employer user
    console.log('1. 🔐 Logging in as employer...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'hr@techcorp.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    const authToken = loginData.token;
    console.log('✅ Login successful as employer');

    // Step 2: Test Analytics endpoints
    console.log('\n2. 📊 Testing Analytics endpoints...');
    
    // Test user analytics (should work for any authenticated user)
    console.log('\n2a. Testing /analytics/user...');
    const userAnalyticsResponse = await fetch(`${API_BASE}/analytics/user`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('User analytics status:', userAnalyticsResponse.status);
    if (userAnalyticsResponse.ok) {
      const userAnalytics = await userAnalyticsResponse.json();
      console.log('✅ User analytics successful:', Object.keys(userAnalytics));
    } else {
      const error = await userAnalyticsResponse.text();
      console.log('❌ User analytics failed:', error);
    }

    // Test application analytics (should work for employer)
    console.log('\n2b. Testing /analytics/applications...');
    const appAnalyticsResponse = await fetch(`${API_BASE}/analytics/applications`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Application analytics status:', appAnalyticsResponse.status);
    if (appAnalyticsResponse.ok) {
      const appAnalytics = await appAnalyticsResponse.json();
      console.log('✅ Application analytics successful:', Object.keys(appAnalytics));
    } else {
      const error = await appAnalyticsResponse.text();
      console.log('❌ Application analytics failed:', error);
    }

    // Test job analytics (should work for employer)
    console.log('\n2c. Testing /analytics/jobs...');
    const jobAnalyticsResponse = await fetch(`${API_BASE}/analytics/jobs`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Job analytics status:', jobAnalyticsResponse.status);
    if (jobAnalyticsResponse.ok) {
      const jobAnalytics = await jobAnalyticsResponse.json();
      console.log('✅ Job analytics successful:', Object.keys(jobAnalytics));
    } else {
      const error = await jobAnalyticsResponse.text();
      console.log('❌ Job analytics failed:', error);
    }

    console.log('\n🎉 Analytics test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAnalyticsWithEmployer();
