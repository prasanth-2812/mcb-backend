const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log
});

async function testUserDetailed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    const [users] = await sequelize.query('SELECT * FROM users WHERE email = ?', {
      replacements: ['john.doe@example.com'],
      type: sequelize.QueryTypes.SELECT
    });
    
    console.log('User data:');
    console.log('- ID type:', typeof users.id);
    console.log('- ID value:', users.id);
    console.log('- Email:', users.email);
    console.log('- Role:', users.role);
    console.log('- Role type:', typeof users.role);
    
    // Test JWT with the actual user data
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    try {
      const token = jwt.sign(
        { id: users.id, email: users.email, role: users.role }, 
        JWT_SECRET
      );
      console.log('✅ JWT token generated with actual user data');
    } catch (jwtError) {
      console.error('❌ JWT error with actual user data:', jwtError.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testUserDetailed();
