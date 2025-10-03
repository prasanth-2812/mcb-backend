const fetch = require('node-fetch').default;

const API_BASE = 'http://10.115.43.116:4000/api';

async function testApplicationsAPI() {
  console.log('🧪 Testing Applications API...\n');

  try {
    // Step 1: Login first
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
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    const authToken = loginData.token;
    console.log('✅ Login successful');

    // Step 2: Test applications endpoint
    console.log('\n2. 📝 Testing applications endpoint...');
    const applyResponse = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        jobId: '1',
        coverLetter: 'I am very interested in this position.',
        resumeUrl: 'https://example.com/resume.pdf'
      })
    });

    console.log(`Apply response status: ${applyResponse.status}`);
    
    if (applyResponse.ok) {
      const application = await applyResponse.json();
      console.log('✅ Application successful:', application.id);
    } else {
      const error = await applyResponse.text();
      console.log('❌ Application failed:', error);
      
      // Try to parse as JSON for more details
      try {
        const errorJson = JSON.parse(error);
        console.log('Error details:', errorJson);
      } catch (e) {
        console.log('Raw error response:', error);
      }
    }

    // Step 3: Test getting applications
    console.log('\n3. 📋 Testing get applications...');
    const getApplicationsResponse = await fetch(`${API_BASE}/applications`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    console.log(`Get applications status: ${getApplicationsResponse.status}`);
    
    if (getApplicationsResponse.ok) {
      const applications = await getApplicationsResponse.json();
      console.log(`✅ Get applications successful: ${applications.length} applications`);
    } else {
      const error = await getApplicationsResponse.text();
      console.log('❌ Get applications failed:', error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testApplicationsAPI();
