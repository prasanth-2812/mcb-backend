const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function testLogin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Find user
    const [user] = await sequelize.query('SELECT * FROM users WHERE email = ?', {
      replacements: ['john.doe@example.com'],
      type: sequelize.QueryTypes.SELECT
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    
    // Test password verification
    const valid = await bcrypt.compare('password123', user.password);
    console.log('✅ Password valid:', valid);
    
    if (valid) {
      // Test JWT token generation
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, 
        JWT_SECRET
      );
      console.log('✅ JWT token generated');
      
      // Test user.toJSON() equivalent
      const { password: _, ...userData } = user;
      console.log('✅ User data prepared:', { id: userData.id, email: userData.email, name: userData.name });
      
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testLogin();
