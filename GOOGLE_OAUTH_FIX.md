# Google OAuth Setup and Troubleshooting Guide

## Common Google OAuth Issues and Solutions

### 1. Check Environment Variables

Ensure your `.env` file in the client directory has the correct Google Client ID:

```env
VITE_GOOGLE_CLIENT_ID=1049841659754-e6m0o1nollbfklte5qfb0lkhorkqj3vv.apps.googleusercontent.com
VITE_ENABLE_GOOGLE_AUTH=true
```

### 2. Google Console Configuration

#### Step 1: Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one

#### Step 2: Enable Google+ API

1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" API

#### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "VCX MART"
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if in testing mode

#### Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add authorized origins:
   - `http://localhost:3000`
   - `http://localhost:5173`
   - `http://127.0.0.1:3000`
   - `http://127.0.0.1:5173`
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `http://localhost:5173/auth/google/callback`

### 3. Common Error Solutions

#### Error: "Invalid Client ID"

- Verify the Client ID in your `.env` file matches Google Console
- Ensure no extra spaces or characters
- Restart your development server after changing `.env`

#### Error: "Unauthorized domain"

- Add your domain to authorized origins in Google Console
- For development, add `localhost:3000` and `localhost:5173`
- Clear browser cache and cookies

#### Error: "Popup blocked"

- Ensure popups are allowed for your domain
- Try using `useOneTap={false}` in GoogleLogin component

#### Error: "Network error"

- Check if Google APIs are accessible
- Verify internet connection
- Try disabling ad blockers

### 4. Updated LoginPage with Better Error Handling

Replace the GoogleLogin component in your LoginPage with this improved version:

```jsx
<GoogleLogin
  onSuccess={handleGoogleLogin}
  onError={(error) => {
    console.error("Google OAuth Error:", error);
    setError(
      "Google login failed. Please check your internet connection and try again."
    );
  }}
  useOneTap={false} // Disable one-tap for debugging
  theme="outline"
  size="large"
  text="continue_with"
  shape="rectangular"
  className="w-full"
  auto_select={false} // Disable auto-select for debugging
/>
```

### 5. Debug Component

Add this debug component to your login page to check configuration:

```jsx
// Add this to your LoginPage for debugging
{
  process.env.NODE_ENV === "development" && (
    <div className="mt-4 p-4 bg-gray-100 rounded">
      <h4 className="font-bold">Debug Info:</h4>
      <p>
        Client ID:{" "}
        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? "Configured" : "Missing"}
      </p>
      <p>Auth Enabled: {import.meta.env.VITE_ENABLE_GOOGLE_AUTH}</p>
    </div>
  );
}
```

### 6. Alternative: Disable Google OAuth Temporarily

If you want to disable Google OAuth temporarily, update your `.env`:

```env
VITE_ENABLE_GOOGLE_AUTH=false
```

Then wrap the GoogleLogin component:

```jsx
{
  import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true" && (
    <div className="mt-6">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={(error) => {
          console.error("Google OAuth Error:", error);
          setError("Google login failed. Please try again.");
        }}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        className="w-full"
      />
    </div>
  );
}
```

### 7. Server-Side Configuration

Ensure your server `.env` has the correct Google configuration:

```env
GOOGLE_CLIENT_ID=1049841659754-e6m0o1nollbfklte5qfb0lkhorkqj3vv.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### 8. Testing Steps

1. **Clear browser cache and cookies**
2. **Restart development servers** (both client and server)
3. **Check browser console** for specific error messages
4. **Test with different browsers**
5. **Verify Google Console settings**

### 9. Production Considerations

For production deployment:

- Add your production domain to Google Console
- Use HTTPS (required for Google OAuth)
- Update redirect URIs to production URLs
- Set proper CORS headers

### 10. Quick Fix Commands

```bash
# Restart client with cleared cache
cd client
rm -rf node_modules/.vite
npm run dev

# Check environment variables
echo $VITE_GOOGLE_CLIENT_ID

# Test API connectivity
curl -I https://accounts.google.com
```

If you're still having issues, please share:

1. The exact error message from browser console
2. Your Google Console OAuth configuration
3. Whether this is happening in development or production
