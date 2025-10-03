const fetch = require('node-fetch').default;

const API_BASE = 'http://10.115.43.116:4000/api';

async function testReactNativeApply() {
  console.log('🧪 Testing React Native Apply Flow...\n');

  try {
    // Step 1: Login (simulating React Native login)
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
    console.log('Token:', authToken.substring(0, 20) + '...');

    // Step 2: Test the exact same request that React Native makes
    console.log('\n2. 📝 Testing React Native apply request...');
    
    // Simulate the exact request from applicationsService
    const applyResponse = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        jobId: '2', // Use a different job ID
        coverLetter: 'I am very interested in this position.',
        resumeUrl: 'https://example.com/resume.pdf'
      })
    });

    console.log(`Apply response status: ${applyResponse.status}`);
    console.log(`Apply response headers:`, Object.fromEntries(applyResponse.headers.entries()));
    
    if (applyResponse.ok) {
      const application = await applyResponse.json();
      console.log('✅ Application successful:', application.id);
    } else {
      const errorText = await applyResponse.text();
      console.log('❌ Application failed:', errorText);
      
      // Try to parse as JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.log('Error JSON:', errorJson);
      } catch (e) {
        console.log('Raw error response:', errorText);
      }
    }

    // Step 3: Test multiple applications (like the React Native app might do)
    console.log('\n3. 🔄 Testing multiple applications...');
    
    for (let i = 3; i <= 5; i++) {
      console.log(`\n--- Testing job ${i} ---`);
      
      const multiApplyResponse = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          jobId: i.toString(),
          coverLetter: `Application for job ${i}`,
          resumeUrl: 'https://example.com/resume.pdf'
        })
      });

      console.log(`Job ${i} apply status: ${multiApplyResponse.status}`);
      
      if (multiApplyResponse.ok) {
        const application = await multiApplyResponse.json();
        console.log(`✅ Job ${i} application successful:`, application.id);
      } else {
        const errorText = await multiApplyResponse.text();
        console.log(`❌ Job ${i} application failed:`, errorText);
      }
    }

    console.log('\n🎉 React Native Apply Test Completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testReactNativeApply();
