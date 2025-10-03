const fetch = require('node-fetch').default;

const API_BASE = 'http://localhost:4000/api';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:4000/health');
    console.log('Health check status:', healthResponse.status);
    
    // Test jobs endpoint
    console.log('\n2. Testing jobs endpoint...');
    const jobsResponse = await fetch(`${API_BASE}/jobs`);
    console.log('Jobs status:', jobsResponse.status);
    if (jobsResponse.ok) {
      const jobs = await jobsResponse.json();
      console.log('Jobs count:', jobs.length);
    }

    // Test login
    console.log('\n3. Testing login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john.doe@example.com',
        password: 'password123'
      })
    });
    console.log('Login status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('Login successful, token received');
      
      // Test authenticated endpoint
      console.log('\n4. Testing authenticated endpoint...');
      const meResponse = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${loginData.token}` }
      });
      console.log('Me endpoint status:', meResponse.status);
    } else {
      const errorData = await loginResponse.text();
      console.log('Login error:', errorData);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();
