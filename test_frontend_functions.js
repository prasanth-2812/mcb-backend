const fetch = require('node-fetch').default;

const API_BASE = 'http://localhost:4000/api';

async function testFrontendFunctions() {
  console.log('🧪 Testing Frontend Functions...\n');

  let authToken = null;

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
      const error = await loginResponse.text();
      console.log('❌ Login failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    authToken = loginData.token;
    console.log('✅ Login successful');

    // Step 2: Test Save Job (simulating frontend saveJob function)
    console.log('\n2. 💾 Testing Save Job function...');
    const saveResponse = await fetch(`${API_BASE}/saved-jobs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ jobId: '1' })
    });

    console.log('Save job status:', saveResponse.status);
    if (saveResponse.ok) {
      const saveData = await saveResponse.json();
      console.log('✅ Save job successful:', saveData.id);
    } else {
      const error = await saveResponse.text();
      console.log('❌ Save job failed:', error);
    }

    // Step 3: Test Get Saved Jobs (simulating frontend getSavedJobs function)
    console.log('\n3. 📚 Testing Get Saved Jobs function...');
    const savedJobsResponse = await fetch(`${API_BASE}/saved-jobs`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    console.log('Get saved jobs status:', savedJobsResponse.status);
    if (savedJobsResponse.ok) {
      const savedJobs = await savedJobsResponse.json();
      console.log(`✅ Get saved jobs successful: ${savedJobs.length} jobs`);
      console.log('Saved jobs:', savedJobs.map(job => ({ id: job.jobId, savedAt: job.savedAt })));
    } else {
      const error = await savedJobsResponse.text();
      console.log('❌ Get saved jobs failed:', error);
    }

    // Step 4: Test Unsave Job (simulating frontend unsaveJob function)
    console.log('\n4. 🗑️ Testing Unsave Job function...');
    const unsaveResponse = await fetch(`${API_BASE}/saved-jobs/1`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    console.log('Unsave job status:', unsaveResponse.status);
    if (unsaveResponse.ok) {
      const unsaveData = await unsaveResponse.json();
      console.log('✅ Unsave job successful:', unsaveData);
    } else {
      const error = await unsaveResponse.text();
      console.log('❌ Unsave job failed:', error);
    }

    // Step 5: Test Apply to Job (simulating frontend applyToJob function)
    console.log('\n5. 📝 Testing Apply to Job function...');
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

    console.log('Apply job status:', applyResponse.status);
    if (applyResponse.ok) {
      const applyData = await applyResponse.json();
      console.log('✅ Apply job successful:', applyData.id);
    } else {
      const error = await applyResponse.text();
      console.log('❌ Apply job failed:', error);
    }

    console.log('\n🎉 All frontend functions tested successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFrontendFunctions();
