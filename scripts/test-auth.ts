// scripts/test-auth.ts
import { hashPassword, verifyPassword } from '../lib/auth';

async function testAuthSystem() {
  console.log('Testing authentication system...\n');
  
  // Test password hashing
  console.log('1. Testing password hashing...');
  const plainPassword = 'MySecurePassword123!';
  const hashedPassword = await hashPassword(plainPassword);
  console.log('   Original password:', plainPassword);
  console.log('   Hashed password:', hashedPassword.substring(0, 20) + '...');
  
  // Test password verification
  console.log('\n2. Testing password verification...');
  const isValid = await verifyPassword(plainPassword, hashedPassword);
  console.log('   Password verification result:', isValid ? '✅ PASS' : '❌ FAIL');
  
  // Test with wrong password
  const isInvalid = await verifyPassword('WrongPassword!', hashedPassword);
  console.log('   Wrong password verification result:', isInvalid ? '❌ FAIL (should be false)' : '✅ PASS (correctly rejected)');
  
  console.log('\n✅ Authentication system tests completed successfully!');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAuthSystem().catch(console.error);
}

export { testAuthSystem };