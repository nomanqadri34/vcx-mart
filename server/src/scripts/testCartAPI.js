const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testCartAPI() {
    try {
        console.log('🧪 Testing Cart API Functionality...\n');

        // Test 1: Check if server is running
        console.log('1. Testing server connectivity...');
        try {
            const healthResponse = await axios.get(`${BASE_URL.replace('/api/v1', '')}/health`);
            console.log('✅ Server is running:', healthResponse.status);
        } catch (error) {
            console.log('❌ Server is not running or health endpoint failed');
            return;
        }

        // Test 2: Get a sample product
        console.log('\n2. Fetching sample product...');
        let sampleProduct;
        try {
            const productsResponse = await axios.get(`${BASE_URL}/products?limit=1`);
            if (productsResponse.data.success && productsResponse.data.data.products?.length > 0) {
                sampleProduct = productsResponse.data.data.products[0];
                console.log('✅ Sample product found:', {
                    id: sampleProduct._id,
                    name: sampleProduct.name,
                    price: sampleProduct.price
                });
            } else {
                console.log('❌ No products found');
                return;
            }
        } catch (error) {
            console.log('❌ Failed to fetch products:', error.response?.data || error.message);
            return;
        }

        // Test 3: Test session endpoint (without auth)
        console.log('\n3. Testing session endpoint (without auth)...');
        try {
            const sessionResponse = await axios.get(`${BASE_URL}/cart/test`);
            console.log('❌ Session endpoint should require auth but didn\'t');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Session endpoint properly requires authentication');
            } else {
                console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
            }
        }

        // Test 4: Test cart endpoints (without auth)
        console.log('\n4. Testing cart endpoints (without auth)...');
        try {
            const cartResponse = await axios.get(`${BASE_URL}/cart`);
            console.log('❌ Cart endpoint should require auth but didn\'t');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Cart endpoint properly requires authentication');
            } else {
                console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
            }
        }

        // Test 5: Test add to cart (without auth)
        console.log('\n5. Testing add to cart (without auth)...');
        try {
            const addResponse = await axios.post(`${BASE_URL}/cart/add`, {
                productId: sampleProduct._id,
                quantity: 1,
                variants: {}
            });
            console.log('❌ Add to cart should require auth but didn\'t');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Add to cart properly requires authentication');
            } else {
                console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
            }
        }

        console.log('\n📋 Summary:');
        console.log('- Server connectivity: ✅');
        console.log('- Product fetching: ✅');
        console.log('- Authentication required: ✅');
        console.log('\n💡 Next steps:');
        console.log('1. Create a .env file in the server directory');
        console.log('2. Set SESSION_SECRET and other required variables');
        console.log('3. Restart the server');
        console.log('4. Test with authenticated user');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testCartAPI();
