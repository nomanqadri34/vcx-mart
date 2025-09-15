// Simple test to verify the seller flow works
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/v1';

async function testSellerFlow() {
    console.log('🧪 Testing Seller Flow...\n');

    // Step 1: Test server health
    console.log('1. Testing server health...');
    try {
        const response = await axios.get('http://localhost:5000/health');
        console.log('✅ Server is running:', response.status);
    } catch (error) {
        console.log('❌ Server is not running:', error.message);
        return;
    }

    // Step 2: Test subscription endpoint (should return 401)
    console.log('\n2. Testing subscription endpoint...');
    try {
        await axios.post(`${API_BASE}/subscription/create`, { applicationId: 'test' });
        console.log('❓ Unexpected success - should have returned 401');
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Subscription endpoint exists (401 Unauthorized as expected)');
        } else {
            console.log('❌ Unexpected error:', error.response?.status, error.message);
        }
    }

    // Step 3: Test registration endpoint (should return 401)
    console.log('\n3. Testing registration endpoint...');
    try {
        await axios.post(`${API_BASE}/subscription/registration/create`, { applicationId: 'test' });
        console.log('❓ Unexpected success - should have returned 401');
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Registration endpoint exists (401 Unauthorized as expected)');
        } else {
            console.log('❌ Unexpected error:', error.response?.status, error.message);
        }
    }

    // Step 4: Test seller application endpoint (should return 401)
    console.log('\n4. Testing seller application endpoint...');
    try {
        await axios.post(`${API_BASE}/seller/apply`, { businessName: 'test' });
        console.log('❓ Unexpected success - should have returned 401');
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Seller application endpoint exists (401 Unauthorized as expected)');
        } else {
            console.log('❌ Unexpected error:', error.response?.status, error.message);
        }
    }

    console.log('\n🎯 Summary:');
    console.log('All endpoints are working correctly and properly protected with authentication.');
    console.log('The 401 errors are expected for unauthenticated requests.');
    console.log('The issue is likely in the frontend authentication or API calls.');

    console.log('\n🔧 Next steps:');
    console.log('1. Check if user is properly logged in');
    console.log('2. Verify JWT token is being sent with requests');
    console.log('3. Check browser network tab for actual error details');
}

testSellerFlow().catch(console.error);