# Authentication Setup Guide

This document explains how the authentication system is implemented in the Cryptomart frontend and how to use it.

## Overview

The authentication system is built using React Context API and provides:
- User registration and login
- JWT token management with automatic refresh
- Role-based access control (User, Seller, Admin)
- Google OAuth integration
- Password reset functionality
- Email and phone verification
- Secure token storage

## Architecture

### 1. Context Providers

The app is wrapped with two main context providers:

```jsx
// App.jsx
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <CartProvider>
      {/* Your app components */}
    </CartProvider>
  </AuthProvider>
</QueryClientProvider>
```

### 2. API Service Layer

All API calls are centralized in `src/services/api.js` with:
- Axios instance with interceptors
- Automatic token management
- Error handling and toast notifications
- Token refresh logic

### 3. Authentication Context

Located at `src/contexts/AuthContext.jsx`, provides:

#### State
- `user`: Current user object
- `loading`: Loading state for auth operations
- `isAuthenticated`: Boolean indicating if user is logged in

#### Functions
- `login(email, password, deviceInfo)`: User login
- `register(userData)`: User registration
- `logout()`: User logout
- `forgotPassword(email)`: Send password reset email
- `resetPassword(token, newPassword)`: Reset password
- `verifyEmail(token)`: Verify email address
- `sendOTP(phone)`: Send OTP for phone verification
- `verifyOTP(otp)`: Verify phone OTP
- `googleAuth(idToken, deviceInfo)`: Google OAuth login
- `applyAsSeller(sellerData)`: Submit seller application
- `updateProfile(profileData)`: Update user profile

## Usage Examples

### 1. Using Authentication in Components

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password123');
    if (result.success) {
      // Redirect or show success message
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### 2. Protected Routes

```jsx
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// In your routing
<Route 
  path="/user/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['user', 'seller', 'admin']}>
      <UserDashboard />
    </ProtectedRoute>
  } 
/>
```

### 3. Role-Based Access Control

```jsx
const MyComponent = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminPanel />;
  }

  if (user?.role === 'seller') {
    return <SellerPanel />;
  }

  return <UserPanel />;
};
```

## API Endpoints

The authentication system connects to these backend endpoints:

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Send password reset email
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/send-otp` - Send phone OTP
- `POST /api/v1/auth/verify-otp` - Verify phone OTP
- `POST /api/v1/auth/google` - Google OAuth
- `GET /api/v1/auth/me` - Get current user profile

### User Management
- `PUT /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/seller/apply` - Apply as seller

## Token Management

### Storage
- Access tokens are stored in `localStorage.accessToken`
- Refresh tokens are stored in `localStorage.refreshToken`
- User data is stored in `localStorage.user`

### Automatic Refresh
The system automatically refreshes expired access tokens:
1. When a request returns 401 (Unauthorized)
2. Uses the refresh token to get a new access token
3. Retries the original request
4. If refresh fails, redirects to login

### Security Features
- Tokens are automatically included in API requests
- Failed refresh attempts clear all stored data
- Automatic logout on token expiration
- Secure token storage in localStorage

## Environment Configuration

Create a `.env.local` file in the client directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Feature Flags
VITE_ENABLE_GOOGLE_AUTH=true
VITE_ENABLE_CRYPTO_PAYMENTS=true
```

## Error Handling

The system provides comprehensive error handling:
- Network errors with user-friendly messages
- Validation errors from the backend
- Automatic retry for failed requests
- Toast notifications for all errors
- Graceful fallbacks for authentication failures

## Google OAuth Integration

The authentication system includes full Google OAuth support for seamless sign-in and registration.

### Features
- **One-Tap Sign-In**: Google's modern authentication experience
- **Automatic Account Creation**: New users are automatically registered
- **Account Linking**: Existing users can link their Google account
- **Secure Token Handling**: OAuth tokens are processed securely on the backend

### Setup Requirements
1. **Google Cloud Console**: Create OAuth 2.0 credentials
2. **Frontend Environment**: Set `VITE_GOOGLE_CLIENT_ID`
3. **Backend Environment**: Configure Google OAuth endpoints
4. **Domain Configuration**: Add authorized origins and redirect URIs

### Implementation Details
```jsx
// Google OAuth is integrated using @react-oauth/google
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

// App.jsx wrapper
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  {/* Your app components */}
</GoogleOAuthProvider>

// Login/Register buttons
<GoogleLogin
  onSuccess={handleGoogleAuth}
  onError={handleGoogleError}
  useOneTap
  theme="outline"
  size="large"
  text="continue_with"
/>
```

### Authentication Flow
1. User clicks Google Sign-In button
2. Google OAuth popup/redirect opens
3. User authenticates with Google
4. Frontend receives OAuth credential
5. Credential is sent to backend for verification
6. Backend creates/updates user account
7. User is logged in and redirected

For complete setup instructions, see `GOOGLE_OAUTH_SETUP.md`.

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Manual Testing
1. Start the backend server
2. Start the frontend: `npm start`
3. Test registration and login flows
4. Test protected routes
5. Test token refresh
6. Test logout functionality

## Troubleshooting

### Common Issues

1. **Token not being sent**
   - Check if user is authenticated
   - Verify localStorage has accessToken
   - Check browser console for errors

2. **401 errors on every request**
   - Token might be expired
   - Check refresh token logic
   - Verify backend is running

3. **Google OAuth not working**
   - Check REACT_APP_GOOGLE_CLIENT_ID
   - Verify Google OAuth is enabled in backend
   - Check browser console for OAuth errors

4. **Protected routes not working**
   - Verify user role matches allowedRoles
   - Check if user is properly authenticated
   - Verify ProtectedRoute component is imported

### Debug Mode

Enable debug logging by setting in browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for production)
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Access tokens expire quickly (15 minutes default)
4. **Refresh Token Rotation**: Implement refresh token rotation for production
5. **CSRF Protection**: Backend provides CSRF protection for sensitive operations

## Production Deployment

1. Update environment variables
2. Enable HTTPS
3. Configure proper CORS settings
4. Set up monitoring and logging
5. Implement rate limiting
6. Add security headers
7. Enable CSP (Content Security Policy)

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify backend is running and accessible
3. Check network tab for failed requests
4. Review this documentation
5. Check backend logs for server-side issues
