const fetch = require('node-fetch').default;

async function testSimple() {
  try {
    console.log('Testing simple endpoints...');
    
    // Test health
    const health = await fetch('http://localhost:4000/health');
    console.log('Health:', health.status);
    
    // Test jobs
    const jobs = await fetch('http://localhost:4000/api/jobs');
    console.log('Jobs:', jobs.status);
    
    // Test auth register
    console.log('\nTesting register...');
    const register = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    });
    console.log('Register:', register.status);
    
    if (!register.ok) {
      const error = await register.text();
      console.log('Register error:', error);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSimple();
