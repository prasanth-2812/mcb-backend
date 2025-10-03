const { User } = require('./dist/models');

async function testSequelize() {
  try {
    console.log('Testing Sequelize User model...');
    
    // Test the exact query from the login function
    const user = await User.findOne({ where: { email: 'john.doe@example.com' } });
    
    if (!user) {
      console.log('❌ User not found with Sequelize');
      return;
    }
    
    console.log('✅ User found with Sequelize');
    console.log('- ID:', user.id);
    console.log('- ID type:', typeof user.id);
    console.log('- Email:', user.email);
    console.log('- Role:', user.role);
    
    // Test password verification
    const bcrypt = require('bcryptjs');
    const valid = await bcrypt.compare('password123', user.password);
    console.log('✅ Password valid:', valid);
    
    if (valid) {
      // Test JWT generation
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, 
        JWT_SECRET
      );
      console.log('✅ JWT token generated');
      
      // Test user.toJSON()
      const { password: _, ...userData } = user.toJSON();
      console.log('✅ User data prepared:', { id: userData.id, email: userData.email, name: userData.name });
    }
    
  } catch (error) {
    console.error('❌ Sequelize error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSequelize();
