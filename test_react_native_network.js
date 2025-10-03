const fetch = require('node-fetch').default;

const API_BASE = 'http://10.115.43.116:4000/api';

async function testReactNativeNetworkConnection() {
  console.log('🧪 Testing React Native Network Connection...\n');

  try {
    // Test 1: Health check
    console.log('1. 🔍 Testing health endpoint...');
    const healthResponse = await fetch('http://10.115.43.116:4000/health');
    console.log('Health status:', healthResponse.status);
    
    if (!healthResponse.ok) {
      throw new Error('Health check failed');
    }
    console.log('✅ Health check passed');

    // Test 2: Jobs endpoint
    console.log('\n2. 📋 Testing jobs endpoint...');
    const jobsResponse = await fetch(`${API_BASE}/jobs`);
    console.log('Jobs status:', jobsResponse.status);
    
    if (!jobsResponse.ok) {
      throw new Error('Jobs endpoint failed');
    }
    
    const jobs = await jobsResponse.json();
    console.log(`✅ Jobs endpoint passed: ${jobs.length} jobs received`);

    // Test 3: Login endpoint
    console.log('\n3. 🔐 Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john.doe@example.com',
        password: 'password123'
      })
    });
    console.log('Login status:', loginResponse.status);
    
    if (!loginResponse.ok) {
      throw new Error('Login endpoint failed');
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login endpoint passed:', loginData.user.name);

    // Test 4: Authenticated endpoint
    console.log('\n4. 🔒 Testing authenticated endpoint...');
    const profileResponse = await fetch(`${API_BASE}/profile`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    console.log('Profile status:', profileResponse.status);
    
    if (!profileResponse.ok) {
      throw new Error('Profile endpoint failed');
    }
    
    const profile = await profileResponse.json();
    console.log('✅ Profile endpoint passed:', profile.name);

    console.log('\n🎉 All Network Tests Passed!');
    console.log('\n📱 Your React Native app should now be able to:');
    console.log('   ✅ Connect to the API server');
    console.log('   ✅ Fetch jobs from the API');
    console.log('   ✅ Authenticate users');
    console.log('   ✅ Access protected endpoints');
    console.log('\n🚀 The "Network request failed" error should be resolved!');

  } catch (error) {
    console.error('❌ Network test failed:', error.message);
    console.error('\n🔍 Troubleshooting tips:');
    console.error('   1. Make sure the API server is running on port 4000');
    console.error('   2. Check if the IP address 10.115.43.116 is correct');
    console.error('   3. Verify firewall settings allow connections on port 4000');
    console.error('   4. Try restarting the React Native app');
  }
}

testReactNativeNetworkConnection();
