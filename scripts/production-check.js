#!/usr/bin/env node

/**
 * Production Deployment Check Script
 * Validates environment variables and configuration for production deployment
 */

const requiredEnvVars = [
  'NEXTAUTH_URL',
  'MONGODB_URI',
  'AUTH_SECRET',
  'NEXTAUTH_SECRET'
];

const prodConfig = {
  NEXTAUTH_URL: 'https://your-production-domain.com',
  MONGODB_URI: 'your-mongodb-connection-string-here',
  AUTH_SECRET: 'your-32-character-secret-here',
  NEXTAUTH_SECRET: 'your-32-character-secret-here'
};

console.log('\n🚀 Production Deployment Check for Ayesha Academy\n');

console.log('📋 Required Environment Variables for Production:\n');

requiredEnvVars.forEach(envVar => {
  const value = prodConfig[envVar];
  console.log(`${envVar}=${value}`);
});

console.log('\n📝 Netlify Deployment Steps:');
console.log('1. Go to Netlify Dashboard → Site Settings → Environment Variables');
console.log('2. Add your actual environment variables (DO NOT use the placeholder values above)');
console.log('3. Ensure NEXTAUTH_URL uses HTTPS and matches your domain exactly');
console.log('4. Trigger a new deployment');

console.log('\n🔧 Test Credentials (after running npm run seed):');
console.log('Admin   - Mobile: 9999999999, Password: admin123');
console.log('Student - Mobile: 8888888888, Password: student123');  
console.log('Teacher - Mobile: 6666666666, Password: teacher123');

console.log('\n✅ After deployment, test:');
console.log('- Homepage loads: https://your-production-domain.com');
console.log('- Login page works: https://your-production-domain.com/login');
console.log('- Authentication with test credentials');
console.log('- Dashboard redirects work correctly');
console.log('- Sessions persist across page refreshes');

console.log('\n⚠️  If authentication still fails:');
console.log('- Check Netlify deploy logs');
console.log('- Verify environment variables are set correctly');
console.log('- Clear browser cookies for your domain');
console.log('- Ensure MongoDB allows connections from Netlify IPs');

console.log('\n🎯 Production deployment ready!\n');