const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

console.log('JWT_SECRET:', JWT_SECRET);
console.log('JWT_EXPIRES_IN:', JWT_EXPIRES_IN);

try {
  const token = jwt.sign(
    { id: 1, email: 'john.doe@example.com', role: 'employee' }, 
    JWT_SECRET
  );
  console.log('✅ JWT token generated successfully');
  console.log('Token length:', token.length);
  
  // Test token verification
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ JWT token verified successfully');
  console.log('Decoded payload:', decoded);
  
} catch (error) {
  console.error('❌ JWT error:', error.message);
}
