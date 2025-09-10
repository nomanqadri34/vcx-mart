# Cart Testing Guide

## Issue Identified
The cart was not persisting items because:
1. Session cookies weren't being sent properly
2. Session configuration was missing key properties
3. Session ID was changing between requests

## Fixes Applied

### 1. Session Configuration (server/src/server.js)
```javascript
app.use(session({
  name: 'cryptomart.session',        // Added session name
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-development',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptomart',
    ttl: 24 * 60 * 60,
    touchAfter: 24 * 3600           // Added lazy session update
  }),
  cookie: {
    secure: false,                   // Set to false for development
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'                  // Added sameSite for cross-origin
  },
}));
```

### 2. Axios Configuration (client/src/services/api.js)
```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // ✅ This ensures cookies are sent
});
```

### 3. Added Debug Logging
Temporarily added debug logging to cart routes to track session behavior.

## Testing Steps

1. **Restart the server** with the new session configuration
2. **Clear browser cookies** for localhost:5173
3. **Login to the application**
4. **Add a product to cart** from ProductDetailPage
5. **Navigate to cart page** to verify items persist
6. **Refresh the page** to test session persistence

## Expected Behavior
- Products should be added to cart successfully
- Cart should show items on CartPage
- Cart should persist after page refresh
- Session ID should remain consistent between requests

## Debug Information
Check browser Network tab for:
- Cookie headers being sent with requests
- Session cookie (cryptomart.session) being set
- Cart API responses containing cart data

Check server logs for:
- Consistent session IDs across requests
- Cart data being saved and retrieved from session
- No session store errors
