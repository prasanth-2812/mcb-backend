const fetch = require('node-fetch').default;

const API_BASE = 'http://10.115.43.116:4000/api';

async function testSaveUnsaveMultiple() {
  console.log('🧪 Testing Save/Unsave Multiple Times...\n');

  let authToken = null;
  let jobId = null;

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
    console.log('✅ Login successful');

    // Step 2: Get a job to test with
    console.log('\n2. 📋 Getting a job to test with...');
    const jobsResponse = await fetch(`${API_BASE}/jobs`);
    const jobs = await jobsResponse.json();
    jobId = jobs[0].id;
    console.log(`✅ Using job: ${jobs[0].title} (ID: ${jobId})`);

    // Step 3: Test multiple save/unsave cycles
    console.log('\n3. 🔄 Testing multiple save/unsave cycles...');
    
    for (let i = 1; i <= 5; i++) {
      console.log(`\n--- Cycle ${i} ---`);
      
      // Save job
      console.log(`🔄 Saving job (attempt ${i})...`);
      const saveResponse = await fetch(`${API_BASE}/saved-jobs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ jobId })
      });
      
      console.log(`Save response: ${saveResponse.status}`);
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
      console.log(`🔄 Unsaving job (attempt ${i})...`);
      const unsaveResponse = await fetch(`${API_BASE}/saved-jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      console.log(`Unsave response: ${unsaveResponse.status}`);
      if (unsaveResponse.ok) {
        const result = await unsaveResponse.json();
        console.log(`✅ Job unsaved successfully: ${result.deleted}`);
      } else {
        const error = await unsaveResponse.text();
        console.log('❌ Unsave failed:', error);
      }
      
      // Check saved jobs again
      const savedJobsResponse2 = await fetch(`${API_BASE}/saved-jobs`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const savedJobs2 = await savedJobsResponse2.json();
      console.log(`📚 Saved jobs count after unsave: ${savedJobs2.length}`);
    }

    console.log('\n🎉 Multiple Save/Unsave Test Completed!');
    console.log('\n📱 Expected behavior:');
    console.log('   ✅ First save: Should work (201 status)');
    console.log('   ✅ Subsequent saves: Should return 409 (already saved)');
    console.log('   ✅ Unsave: Should work (200 status)');
    console.log('   ✅ Multiple cycles: Should work consistently');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSaveUnsaveMultiple();
