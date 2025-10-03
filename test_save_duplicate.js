const fetch = require('node-fetch').default;

const API_BASE = 'http://10.115.43.116:4000/api';

async function testSaveDuplicate() {
  console.log('🧪 Testing Save Duplicate Jobs...\n');

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

    // Step 3: Save job first time
    console.log('\n3. 🔄 Saving job first time...');
    const saveResponse1 = await fetch(`${API_BASE}/saved-jobs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ jobId })
    });
    
    console.log(`First save response: ${saveResponse1.status}`);
    if (saveResponse1.status === 201) {
      console.log('✅ First save successful');
    } else {
      const error1 = await saveResponse1.text();
      console.log('❌ First save failed:', error1);
    }

    // Step 4: Try to save same job again
    console.log('\n4. 🔄 Trying to save same job again...');
    const saveResponse2 = await fetch(`${API_BASE}/saved-jobs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ jobId })
    });
    
    console.log(`Second save response: ${saveResponse2.status}`);
    if (saveResponse2.status === 201) {
      console.log('✅ Second save successful');
    } else if (saveResponse2.status === 409) {
      const error2 = await saveResponse2.json();
      console.log('ℹ️ Second save returned 409 (expected):', error2.message);
    } else {
      const error2 = await saveResponse2.text();
      console.log('❌ Second save failed:', error2);
    }

    // Step 5: Check saved jobs count
    console.log('\n5. 📚 Checking saved jobs count...');
    const savedJobsResponse = await fetch(`${API_BASE}/saved-jobs`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const savedJobs = await savedJobsResponse.json();
    console.log(`📚 Total saved jobs: ${savedJobs.length}`);

    console.log('\n🎉 Duplicate Save Test Completed!');
    console.log('\n📱 Expected behavior:');
    console.log('   ✅ First save: Should work (201 status)');
    console.log('   ✅ Second save: Should return 409 (already saved)');
    console.log('   ✅ Saved jobs count: Should remain 1');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSaveDuplicate();
