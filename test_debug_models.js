const { SavedJob, Application, Job, User } = require('./api/dist/models');

async function testModels() {
  try {
    console.log('Testing model associations...');
    
    // Test SavedJob model
    console.log('\n1. Testing SavedJob model...');
    const savedJobs = await SavedJob.findAll({
      where: { userId: '1' }
    });
    console.log('✅ SavedJob.findAll works, found:', savedJobs.length);
    
    // Test Application model
    console.log('\n2. Testing Application model...');
    const applications = await Application.findAll({
      where: { userId: '1' }
    });
    console.log('✅ Application.findAll works, found:', applications.length);
    
    // Test with include (this might be the issue)
    console.log('\n3. Testing SavedJob with Job include...');
    try {
      const savedJobsWithJob = await SavedJob.findAll({
        where: { userId: '1' },
        include: [{ model: Job, as: 'job' }]
      });
      console.log('✅ SavedJob with include works, found:', savedJobsWithJob.length);
    } catch (error) {
      console.log('❌ SavedJob with include failed:', error.message);
    }
    
    // Test Application with Job include
    console.log('\n4. Testing Application with Job include...');
    try {
      const applicationsWithJob = await Application.findAll({
        where: { userId: '1' },
        include: [{ model: Job, as: 'job' }]
      });
      console.log('✅ Application with include works, found:', applicationsWithJob.length);
    } catch (error) {
      console.log('❌ Application with include failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Model test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testModels();
