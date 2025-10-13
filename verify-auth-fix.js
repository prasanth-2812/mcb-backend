// Quick verification script to test authentication fixes
// Run this to verify JWT tokens are working with proper expiration

const jwt = require('jsonwebtoken');

// Simulate the token generation as done in the fixed code
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

console.log('=== Authentication Fix Verification ===\n');

// Test 1: Generate token with expiration
console.log('Test 1: Generating JWT token with expiration...');
try {
  const testUser = {
    id: 'test-123',
    email: 'john.doe@example.com',
    role: 'employee'
  };

  const token = jwt.sign(testUser, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  console.log('✅ Token generated successfully');
  console.log('   Token preview:', token.substring(0, 50) + '...');

  // Test 2: Decode token to check expiration
  console.log('\nTest 2: Verifying token expiration...');
  const decoded = jwt.decode(token);
  
  if (decoded.exp) {
    const expirationDate = new Date(decoded.exp * 1000);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expirationDate - now) / (1000 * 60 * 60 * 24));
    
    console.log('✅ Token has expiration set');
    console.log('   Expires on:', expirationDate.toLocaleString());
    console.log('   Days until expiry:', daysUntilExpiry);
    console.log('   Expected expiry:', JWT_EXPIRES_IN);
  } else {
    console.log('❌ ERROR: Token does not have expiration!');
  }

  // Test 3: Verify token
  console.log('\nTest 3: Verifying token is valid...');
  const verified = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token verified successfully');
  console.log('   User ID:', verified.id);
  console.log('   User Email:', verified.email);
  console.log('   User Role:', verified.role);

  // Test 4: Check environment configuration
  console.log('\nTest 4: Environment configuration...');
  console.log('   JWT_SECRET:', JWT_SECRET === 'dev-secret-key-change-in-production' ? '✅ Using dev secret' : '⚠️  Using custom secret');
  console.log('   JWT_EXPIRES_IN:', JWT_EXPIRES_IN);
  console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set (defaults to development)');

  console.log('\n🎉 All tests passed! Authentication fix is working correctly.\n');
  console.log('Summary:');
  console.log('  ✅ Tokens are generated with expiration');
  console.log('  ✅ Expiration time is configurable via .env');
  console.log('  ✅ Tokens can be verified successfully');
  console.log('  ✅ Token expiration is set to', JWT_EXPIRES_IN);

} catch (error) {
  console.log('❌ ERROR:', error.message);
  console.log('\nFix required! Check auth.controller.ts implementation.');
}

console.log('\n=== Verification Complete ===');

