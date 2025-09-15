# 🔧 API Error Fixes - 401/404 Subscription Issues

## ❌ **Issues Identified**
1. **401 Unauthorized** - Authentication issues with subscription API
2. **404 Not Found** - Subscription endpoints not accessible
3. **Cross-Origin-Opener-Policy** - Razorpay popup issues
4. **Wrong API URL** - Client hitting production instead of localhost

## ✅ **Fixes Applied**

### **Fix 1: Enhanced Error Handling (SubscriptionPayment.jsx)**
```javascript
// BEFORE: Basic error handling
catch (error) {
  console.error('Subscription creation failed:', error);
  toast.error('Failed to create subscription');
}

// AFTER: Specific error handling
catch (error) {
  if (error.response?.status === 401) {
    toast.error('Authentication failed. Please login again.');
  } else if (error.response?.status === 404) {
    toast.error('Subscription service not available. Please try again later.');
  } else if (error.response?.status === 400) {
    toast.error(error.response?.data?.error?.message || 'Invalid request');
  } else {
    toast.error('Failed to create subscription. Please try again.');
  }
}
```

### **Fix 2: Authentication Checks**
```javascript
// NEW: Check authentication before API calls
const token = localStorage.getItem('accessToken');
if (!token) {
  toast.error('Please login to continue');
  return;
}

// NEW: Check applicationId before subscription
if (!applicationId) {
  toast.error('Application ID is required for subscription');
  return;
}
```

### **Fix 3: Enhanced Registration Payment Error Handling**
```javascript
// BEFORE: Generic error handling
catch (error) {
  console.error('Payment error:', error);
  toast.error('Failed to initiate payment');
}

// AFTER: Specific error handling
catch (error) {
  if (error.response?.status === 401) {
    toast.error('Authentication failed. Please login again.');
  } else if (error.response?.status === 404) {
    toast.error('Payment service not available. Please try again later.');
  } else if (error.response?.status === 400) {
    toast.error(error.response?.data?.error?.message || 'Invalid payment request');
  } else {
    toast.error('Failed to initiate payment. Please try again.');
  }
}
```

### **Fix 4: Debug Component (DebugAPIStatus.jsx)**
```javascript
// NEW: Real-time API status monitoring
const DebugAPIStatus = () => {
  const [status, setStatus] = useState({
    server: 'checking...',
    auth: 'checking...',
    subscription: 'checking...',
    user: null
  });

  // Check server health, authentication, and subscription endpoints
  const checkAPIStatus = async () => {
    // Server health check
    // Authentication check  
    // Subscription endpoint check
  };
};
```

### **Fix 5: API Test Script (test-subscription-api.js)**
```javascript
// NEW: Node.js script to test API endpoints
async function testSubscriptionAPI() {
  // Test subscription/create endpoint
  // Test subscription/status endpoint  
  // Test server health
}
```

## 🔍 **Debugging Steps**

### **Step 1: Check API Status**
1. Go to `http://localhost:5173/seller/apply`
2. Look for the debug panel in bottom-right corner
3. Check if all services show ✅ status

### **Step 2: Verify Server is Running**
```bash
# Run the API test script
node test-subscription-api.js
```

### **Step 3: Check Authentication**
1. Open browser DevTools → Application → Local Storage
2. Verify `accessToken` exists and is valid
3. If missing, login again

### **Step 4: Check API URL**
1. Open DevTools → Network tab
2. Submit application form
3. Verify requests go to `localhost:5000` not `vcx-mart.onrender.com`

## 🎯 **Expected Results After Fixes**

### **Registration Payment:**
- ✅ Authentication check passes
- ✅ API call to `/subscription/registration/create` succeeds
- ✅ Payment simulation completes
- ✅ Moves to subscription step

### **Subscription Setup:**
- ✅ Authentication check passes  
- ✅ ApplicationId validation passes
- ✅ API call to `/subscription/create` succeeds
- ✅ Payment link generated
- ✅ Redirects to payment page

### **Error Handling:**
- ✅ Clear error messages for each failure type
- ✅ Authentication prompts when needed
- ✅ Retry suggestions for temporary failures

## 🚀 **Testing Workflow**

1. **Start servers:**
   ```bash
   # Terminal 1: Start backend
   cd server && npm run dev
   
   # Terminal 2: Start frontend  
   cd client && npm run dev
   ```

2. **Test the flow:**
   - Go to `http://localhost:5173/seller/apply`
   - Check debug panel shows all ✅
   - Fill application form
   - Complete registration payment
   - Setup subscription
   - Verify no 401/404 errors

3. **If issues persist:**
   - Check debug panel for specific failures
   - Run `node test-subscription-api.js`
   - Check server logs for errors
   - Verify environment variables are correct

## 🔧 **Quick Fixes for Common Issues**

### **401 Unauthorized:**
- Clear localStorage and login again
- Check if JWT_SECRET matches between client/server
- Verify token is being sent in Authorization header

### **404 Not Found:**
- Verify server is running on port 5000
- Check subscription routes are mounted in server.js
- Confirm API_URL in client/.env is correct

### **Cross-Origin Issues:**
- Check CORS configuration in server
- Verify withCredentials setting in axios
- Check if popup blockers are interfering