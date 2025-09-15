// Test script to verify subscription API endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/v1';

// Test function
async function testSubscriptionAPI() {
    console.log('🧪 Testing Subscription API Endpoints...\n');

    // Test 1: Check if subscription routes are accessible (should return 401 without auth)
    try {
        console.log('1. Testing /subscription/create (without auth) - should return 401');
        await axios.post(`${API_BASE}/subscription/create`, { applicationId: 'test' });
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Endpoint exists - returns 401 (Unauthorized) as expected');
        } else if (error.response?.status === 404) {
            console.log('❌ Endpoint not found - 404 error');
        } else {
            console.log('❓ Unexpected error:', error.response?.status, error.message);
        }
    }

    // Test 2: Check subscription status endpoint
    try {
        console.log('\n2. Testing /subscription/status/test (without auth) - should return 401');
        await axios.get(`${API_BASE}/subscription/status/test`);
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Endpoint exists - returns 401 (Unauthorized) as expected');
        } else if (error.response?.status === 404) {
            console.log('❌ Endpoint not found - 404 error');
        } else {
            console.log('❓ Unexpected error:', error.response?.status, error.message);
        }
    }

    // Test 3: Check if server is running
    try {
        console.log('\n3. Testing server health...');
        const response = await axios.get(`${API_BASE}/health`);
        console.log('✅ Server is running:', response.status);
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Server is not running on localhost:5000');
        } else {
            console.log('❓ Server health check failed:', error.message);
        }
    }

    console.log('\n🏁 Test completed');
}

// Run the test
testSubscriptionAPI().catch(console.error);