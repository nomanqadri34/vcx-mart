const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testCartSession() {
    try {
        console.log('🔍 Testing Cart Session Management...\n');

        // Create an axios instance with cookie support
        const api = axios.create({
            baseURL: BASE_URL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Test 1: Login first
        console.log('1️⃣ Logging in...');
        const loginResponse = await api.post('/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });

        if (loginResponse.data.success) {
            console.log('✅ Login successful');
            const token = loginResponse.data.data.accessToken;
            api.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log('❌ Login failed:', loginResponse.data.error);
            return;
        }

        // Test 2: Test session endpoint
        console.log('\n2️⃣ Testing session...');
        try {
            const sessionResponse = await api.get('/cart/test');
            console.log('✅ Session test response:', sessionResponse.data);
        } catch (error) {
            console.log('❌ Session test failed:', error.response?.data || error.message);
        }

        // Test 3: Get empty cart
        console.log('\n3️⃣ Getting cart (should be empty)...');
        try {
            const emptyCartResponse = await api.get('/cart');
            console.log('✅ Empty cart response:', emptyCartResponse.data);
        } catch (error) {
            console.log('❌ Get cart failed:', error.response?.data || error.message);
        }

        // Test 4: Add item to cart
        console.log('\n4️⃣ Adding item to cart...');
        try {
            const addToCartResponse = await api.post('/cart/add', {
                productId: '68b054639562879c50bdfb78', // Use the product ID from logs
                quantity: 1,
                variants: { size: 'M', color: 'blue' }
            });
            console.log('✅ Add to cart response:', addToCartResponse.data);
        } catch (error) {
            console.log('❌ Add to cart failed:', error.response?.data || error.message);
        }

        // Test 5: Get cart after adding
        console.log('\n5️⃣ Getting cart after adding item...');
        try {
            const cartAfterAddResponse = await api.get('/cart');
            console.log('✅ Cart after add response:', cartAfterAddResponse.data);
        } catch (error) {
            console.log('❌ Get cart after add failed:', error.response?.data || error.message);
        }

        // Test 6: Simulate a new request (like refresh)
        console.log('\n6️⃣ Testing cart persistence (simulating page refresh)...');
        try {
            const persistenceResponse = await api.get('/cart');
            console.log('✅ Cart persistence response:', persistenceResponse.data);

            if (persistenceResponse.data.data.cart && persistenceResponse.data.data.cart.length > 0) {
                console.log('🎉 Cart persistence WORKS!');
            } else {
                console.log('⚠️ Cart persistence FAILED - cart is empty after refresh');
            }
        } catch (error) {
            console.log('❌ Cart persistence test failed:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testCartSession();
