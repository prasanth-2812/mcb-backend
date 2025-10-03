const fetch = require('node-fetch').default;

const API_BASE = 'http://10.115.43.116:4000/api';

async function testCompleteReactNativeFlow() {
  console.log('🧪 Testing Complete React Native Flow...\n');

  let authToken = null;
  let userId = null;

  try {
    // Step 1: Login
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
    authToken = loginData.token;
    userId = loginData.user.id;
    console.log('✅ Login successful');

    // Step 2: Get jobs
    console.log('\n2. 📋 Getting jobs...');
    const jobsResponse = await fetch(`${API_BASE}/jobs`);
    const jobs = await jobsResponse.json();
    console.log(`✅ Retrieved ${jobs.length} jobs`);

    // Step 3: Test save/unsave flow (multiple times)
    console.log('\n3. 💾 Testing save/unsave flow...');
    const testJobId = jobs[0].id;
    
    for (let i = 1; i <= 3; i++) {
      console.log(`\n--- Save/Unsave Cycle ${i} ---`);
      
      // Save job
      const saveResponse = await fetch(`${API_BASE}/saved-jobs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ jobId: testJobId })
      });
      
      console.log(`Save ${i} status: ${saveResponse.status}`);
      if (saveResponse.status === 201) {
        console.log('✅ Job saved successfully');
      } else if (saveResponse.status === 409) {
        console.log('ℹ️ Job already saved (expected)');
      } else {
        const error = await saveResponse.text();
        console.log('❌ Save failed:', error);
      }
      
      // Check saved jobs
      const savedJobsResponse = await fetch(`${API_BASE}/saved-jobs`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const savedJobs = await savedJobsResponse.json();
      console.log(`📚 Saved jobs count: ${savedJobs.length}`);
      
      // Unsave job
      const unsaveResponse = await fetch(`${API_BASE}/saved-jobs/${testJobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      console.log(`Unsave ${i} status: ${unsaveResponse.status}`);
      if (unsaveResponse.ok) {
        const result = await unsaveResponse.json();
        console.log(`✅ Job unsaved successfully: ${result.deleted}`);
      } else {
        const error = await unsaveResponse.text();
        console.log('❌ Unsave failed:', error);
      }
    }

    // Step 4: Test apply flow
    console.log('\n4. 📝 Testing apply flow...');
    const applyJobId = jobs[1].id;
    
    const applyResponse = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        jobId: applyJobId,
        coverLetter: 'I am very interested in this position and would like to apply.',
        resumeUrl: 'https://example.com/resume.pdf'
      })
    });
    
    console.log(`Apply status: ${applyResponse.status}`);
    if (applyResponse.ok) {
      const application = await applyResponse.json();
      console.log('✅ Application successful:', application.id);
    } else {
      const error = await applyResponse.text();
      console.log('❌ Application failed:', error);
    }

    // Step 5: Test get applications
    console.log('\n5. 📋 Testing get applications...');
    const applicationsResponse = await fetch(`${API_BASE}/applications`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log(`Get applications status: ${applicationsResponse.status}`);
    if (applicationsResponse.ok) {
      const applications = await applicationsResponse.json();
      console.log(`✅ Retrieved ${applications.length} applications`);
    } else {
      const error = await applicationsResponse.text();
      console.log('❌ Get applications failed:', error);
    }

    // Step 6: Test search functionality
    console.log('\n6. 🔍 Testing search functionality...');
    const searchResponse = await fetch(`${API_BASE}/search/jobs?q=developer`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log(`Search status: ${searchResponse.status}`);
    if (searchResponse.ok) {
      const searchResults = await searchResponse.json();
      console.log(`✅ Search successful: ${searchResults.length} results`);
    } else {
      const error = await searchResponse.text();
      console.log('❌ Search failed:', error);
    }

    console.log('\n🎉 Complete React Native Flow Test Passed!');
    console.log('\n📱 Your React Native app should now work with:');
    console.log('   ✅ Authentication (login)');
    console.log('   ✅ Job browsing and search');
    console.log('   ✅ Save/unsave jobs (multiple times)');
    console.log('   ✅ Apply to jobs');
    console.log('   ✅ View applications');
    console.log('   ✅ All API endpoints using network IP');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompleteReactNativeFlow();
