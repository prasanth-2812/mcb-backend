const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log
});

async function testUser() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    const [users] = await sequelize.query('SELECT * FROM users WHERE email = ?', {
      replacements: ['john.doe@example.com'],
      type: sequelize.QueryTypes.SELECT
    });
    
    console.log('Users found:', users);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testUser();
