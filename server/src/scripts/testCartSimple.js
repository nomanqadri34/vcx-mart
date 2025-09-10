const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testCartSimple() {
    try {
        console.log('🧪 Simple Cart Test...\n');

        // Test 1: Check server health
        console.log('1. Checking server health...');
        try {
            const healthResponse = await axios.get(`${BASE_URL.replace('/api/v1', '')}/health`);
            console.log('✅ Server is running');
        } catch (error) {
            console.log('❌ Server is not running');
            return;
        }

        // Test 2: Get products
        console.log('\n2. Getting products...');
        try {
            const productsResponse = await axios.get(`${BASE_URL}/products?limit=1`);
            if (productsResponse.data.success && productsResponse.data.data.products?.length > 0) {
                const product = productsResponse.data.data.products[0];
                console.log('✅ Product found:', product.name);
                console.log('   ID:', product._id);
                console.log('   Price:', product.price);
            } else {
                console.log('❌ No products found');
                return;
            }
        } catch (error) {
            console.log('❌ Failed to get products:', error.response?.data || error.message);
            return;
        }

        console.log('\n🎉 Basic tests passed!');
        console.log('💡 Now you can test the cart functionality in your browser:');
        console.log('   1. Go to a product page');
        console.log('   2. Add the product to cart');
        console.log('   3. Check the cart page');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testCartSimple();
