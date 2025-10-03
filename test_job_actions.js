const fetch = require('node-fetch').default;

const API_BASE = 'http://localhost:4000/api';

async function testJobActions() {
  console.log('🧪 Testing Job Actions APIs...\n');

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

    // Step 2: Get available jobs
    console.log('\n2. 📋 Getting available jobs...');
    const jobsResponse = await fetch(`${API_BASE}/jobs`);
    const jobs = await jobsResponse.json();
    console.log(`✅ Found ${jobs.length} jobs`);
    
    if (jobs.length === 0) {
      console.log('❌ No jobs available for testing');
      return;
    }

    const testJob = jobs[0];
    console.log(`📝 Testing with job: "${testJob.title}" (ID: ${testJob.id})`);

    // Step 3: Test Save Job
    console.log('\n3. 💾 Testing Save Job...');
    const saveResponse = await fetch(`${API_BASE}/saved-jobs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        jobId: testJob.id
      })
    });

    console.log('Save job status:', saveResponse.status);
    if (saveResponse.ok) {
      const saveData = await saveResponse.json();
      console.log('✅ Job saved successfully:', saveData.id);
    } else {
      const error = await saveResponse.text();
      console.log('❌ Save job failed:', error);
    }

    // Step 4: Test Get Saved Jobs
    console.log('\n4. 📚 Testing Get Saved Jobs...');
    const savedJobsResponse = await fetch(`${API_BASE}/saved-jobs`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    console.log('Get saved jobs status:', savedJobsResponse.status);
    if (savedJobsResponse.ok) {
      const savedJobs = await savedJobsResponse.json();
      console.log(`✅ Found ${savedJobs.length} saved jobs`);
    } else {
      const error = await savedJobsResponse.text();
      console.log('❌ Get saved jobs failed:', error);
    }

    // Step 5: Test Apply to Job
    console.log('\n5. 📝 Testing Apply to Job...');
    const applyResponse = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        jobId: testJob.id,
        coverLetter: 'I am very interested in this position and would love to contribute to your team.',
        resumeUrl: 'https://example.com/resume.pdf'
      })
    });

    console.log('Apply job status:', applyResponse.status);
    if (applyResponse.ok) {
      const applyData = await applyResponse.json();
      console.log('✅ Job application submitted successfully:', applyData.id);
    } else {
      const error = await applyResponse.text();
      console.log('❌ Apply job failed:', error);
    }

    // Step 6: Test Get User Applications
    console.log('\n6. 📋 Testing Get User Applications...');
    const applicationsResponse = await fetch(`${API_BASE}/applications`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    console.log('Get applications status:', applicationsResponse.status);
    if (applicationsResponse.ok) {
      const applications = await applicationsResponse.json();
      console.log(`✅ Found ${applications.length} applications`);
    } else {
      const error = await applicationsResponse.text();
      console.log('❌ Get applications failed:', error);
    }

    // Step 7: Test Unsave Job (if we have a saved job)
    console.log('\n7. 🗑️ Testing Unsave Job...');
    const unsaveResponse = await fetch(`${API_BASE}/saved-jobs/${testJob.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    console.log('Unsave job status:', unsaveResponse.status);
    if (unsaveResponse.ok) {
      console.log('✅ Job unsaved successfully');
    } else {
      const error = await unsaveResponse.text();
      console.log('❌ Unsave job failed:', error);
    }

    console.log('\n🎉 All job action tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testJobActions();
