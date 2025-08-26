# Production Deployment Guide for Ayesha Academy

## Issue Identified
The authentication failure in production was caused by incorrect `NEXTAUTH_URL` configuration. The environment variable was set to `http://localhost:3001` instead of the production domain.

## Fixed Issues
1. **NextAuth URL Configuration**: Updated to support both development and production environments
2. **Cookie Settings**: Added secure cookies for production with proper domain settings
3. **Security Headers**: Added production security headers
4. **Environment Variables**: Properly configured for production deployment

## Netlify Environment Variables Setup

In your Netlify dashboard, go to **Site settings > Environment variables** and add these:

### Required Environment Variables
```
NEXTAUTH_URL=https://ayeshaacademypurnea.online
MONGODB_URI=mongodb+srv://firdoshanjum09:Br11ae%404942@ayeshaacademy.eve12y1.mongodb.net/?retryWrites=true&w=majority&appName=AyeshaAcademy
AUTH_SECRET=jEJgpe4NWKkAjao6Rrw2pGbWyN0JRsVe4IHePsxk1kA=
NEXTAUTH_SECRET=uYzvYF/Gk+2G2SYbS8Zs1jljGIBu3t4TQUoPhsvJ5IQ=
NODE_ENV=production
```

## Domain Configuration
Ensure your domain is properly configured:
- Primary domain: `https://ayeshaacademypurnea.online`
- Redirect all variants to primary domain
- Enable HTTPS (should be automatic with Netlify)

## Deployment Steps

### Step 1: Update Environment Variables
1. Go to Netlify Dashboard → Your Site → Site settings → Environment variables
2. Add all the environment variables listed above
3. Make sure `NEXTAUTH_URL` points to your production domain with HTTPS

### Step 2: Redeploy Site
1. In Netlify Dashboard → Deploys
2. Click "Trigger deploy" → "Deploy site"
3. Or push changes to your connected Git repository

### Step 3: Test Authentication
1. Visit https://ayeshaacademypurnea.online/login
2. Try logging in with test credentials:
   - Admin: Mobile: 9999999999, Password: admin123
   - Student: Mobile: 8888888888, Password: student123
   - Teacher: Mobile: 6666666666, Password: teacher123

## Changes Made

### 1. auth.ts
- Added production-specific cookie configuration
- Set secure cookies for production environment
- Added proper domain settings for cookies
- Added debug mode for development

### 2. next.config.ts
- Added production optimizations (SWC minify, compression)
- Added security headers for production
- Disabled PWA in development
- Added build optimizations

### 3. netlify.toml
- Created Netlify-specific configuration
- Added proper redirects for API routes
- Added security headers at CDN level
- Configured Next.js plugin for Netlify

### 4. Environment Configuration
- Added clear documentation for production vs development variables
- Separated local development from production configuration

## Verification Checklist

After deployment, verify these work:

- [ ] Homepage loads correctly
- [ ] Login page accessible at `/login`
- [ ] Authentication works with test credentials
- [ ] Redirects to correct dashboard after login
- [ ] Sessions persist across browser refreshes
- [ ] Logout functionality works
- [ ] Protected routes require authentication

## Troubleshooting

### If login still fails:
1. Check Netlify deploy logs for errors
2. Verify all environment variables are set correctly
3. Ensure `NEXTAUTH_URL` uses HTTPS and matches your domain exactly
4. Check browser console for JavaScript errors
5. Verify MongoDB connection (check if IP is whitelisted)

### If getting redirect loops:
1. Clear browser cookies for your domain
2. Check that `NEXTAUTH_URL` matches your actual domain
3. Verify middleware.ts is working correctly

### If session doesn't persist:
1. Check cookie settings in browser dev tools
2. Verify `AUTH_SECRET` is the same in all environments
3. Check if domain in auth.ts cookie config is correct

## Security Notes

The production deployment now includes:
- Secure HTTPS-only cookies
- CSRF protection
- XSS protection headers  
- Content type sniffing protection
- Frame-busting headers
- Strict referrer policy

## Support

If issues persist after following this guide:
1. Check Netlify function logs for errors
2. Verify MongoDB Atlas network access includes Netlify IPs
3. Ensure all environment variables are exactly as specified
4. Contact the development team with specific error messages

## Database Seeding

If you need to add test users to production database, run:
```bash
# Only run this once in production
npm run seed
```

This will create the test users needed for authentication testing.