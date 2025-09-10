# Google OAuth Setup Guide for Cryptomart Frontend

## Overview
This guide will help you set up Google OAuth authentication for the Cryptomart frontend application.

## Prerequisites
- Google Cloud Console account
- Cryptomart backend server running with Google OAuth endpoints

## Step 1: Google Cloud Console Setup

### 1.1 Create a New Project or Select Existing
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

### 1.2 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: `Cryptomart`
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses for testing)

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set authorized JavaScript origins:
   - `http://localhost:5173` (Vite dev server)
   - `http://localhost:3000` (if using different port)
   - Your production domain (when deployed)
5. Set authorized redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:3000`
   - Your production domain
6. Copy the **Client ID** (you'll need this for the frontend)

## Step 2: Frontend Environment Configuration

### 2.1 Create Environment File
1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Google Client ID:
   ```bash
   VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
   ```

### 2.2 Environment Variables Reference
```bash
# Required for Google OAuth
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com

# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# Feature Flags
VITE_ENABLE_GOOGLE_AUTH=true
```

## Step 3: Backend Configuration

### 3.1 Update Backend Environment
Make sure your backend `.env` file includes:
```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
```

### 3.2 Verify Backend Endpoints
Ensure these endpoints are working in your backend:
- `POST /api/v1/auth/google` - Google OAuth authentication
- `POST /api/v1/auth/google/link` - Link existing account
- `POST /api/v1/auth/google/unlink` - Unlink Google account

## Step 4: Testing Google OAuth

### 4.1 Start Both Servers
1. **Backend**: `cd server && npm start`
2. **Frontend**: `cd client && npm run dev`

### 4.2 Test Authentication Flow
1. Go to `/register` or `/login`
2. Click "Sign in with Google" or "Sign up with Google"
3. Complete Google OAuth flow
4. Verify you're redirected to the appropriate dashboard

## Step 5: Troubleshooting

### Common Issues

#### 1. "Invalid Client ID" Error
- Verify `VITE_GOOGLE_CLIENT_ID` in `.env.local`
- Check that the Client ID matches exactly from Google Cloud Console
- Ensure the domain is added to authorized origins

#### 2. "Redirect URI Mismatch" Error
- Add your development URL to authorized redirect URIs in Google Cloud Console
- Check that `GOOGLE_REDIRECT_URI` in backend matches

#### 3. CORS Issues
- Verify backend CORS configuration allows your frontend domain
- Check that `FRONTEND_URL` in backend `.env` is correct

#### 4. "Google OAuth not working" Error
- Check browser console for JavaScript errors
- Verify all required packages are installed
- Check network tab for failed API calls

### Debug Steps
1. **Check Browser Console** for JavaScript errors
2. **Check Network Tab** for failed API requests
3. **Check Backend Logs** for authentication errors
4. **Verify Environment Variables** are loaded correctly

## Step 6: Production Deployment

### 6.1 Update Google Cloud Console
1. Add your production domain to authorized origins
2. Add your production domain to authorized redirect URIs
3. Update OAuth consent screen with production information

### 6.2 Update Environment Variables
```bash
# Production
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
VITE_API_URL=https://your-api-domain.com/api/v1
```

### 6.3 Security Considerations
- Never expose `GOOGLE_CLIENT_SECRET` in frontend code
- Use HTTPS in production
- Implement proper session management
- Add rate limiting for OAuth endpoints

## Additional Features

### One-Tap Sign-In
The implementation includes Google's One-Tap sign-in feature, which provides a seamless authentication experience.

### Account Linking
Users can link their existing Cryptomart account with Google OAuth for convenience.

### Error Handling
Comprehensive error handling for various OAuth failure scenarios.

## Support

If you encounter issues:
1. Check this guide first
2. Review browser console and network logs
3. Check backend server logs
4. Verify all environment variables are set correctly
5. Ensure Google Cloud Console configuration is correct

## Security Notes

- Google OAuth tokens are handled securely
- No sensitive information is stored in localStorage
- Authentication state is managed through secure HTTP-only cookies
- All OAuth flows use HTTPS in production
