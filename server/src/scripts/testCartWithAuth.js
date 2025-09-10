const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testCartWithAuth() {
    try {
        console.log('🧪 Testing Cart API with Authentication...\n');

        // Test 1: Login to get auth token
        console.log('1. Attempting to login...');
        let authToken;
        try {
            const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'test@example.com',
                password: 'testpassword123'
            });

            if (loginResponse.data.success) {
                authToken = loginResponse.data.data.accessToken;
                console.log('✅ Login successful, token received');
            } else {
                console.log('❌ Login failed:', loginResponse.data.error);
                console.log('💡 You may need to create a test user first');
                return;
            }
        } catch (error) {
            console.log('❌ Login request failed:', error.response?.data || error.message);
            console.log('💡 You may need to create a test user first');
            return;
        }

        // Test 2: Test session endpoint with auth
        console.log('\n2. Testing session endpoint with auth...');
        try {
            const sessionResponse = await axios.get(`${BASE_URL}/cart/test`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            if (sessionResponse.data.success) {
                console.log('✅ Session test successful');
                console.log('Session ID:', sessionResponse.data.data.sessionId);
                console.log('User ID:', sessionResponse.data.data.userId);
                console.log('Cart items:', sessionResponse.data.data.cart?.length || 0);
            } else {
                console.log('❌ Session test failed:', sessionResponse.data.error);
            }
        } catch (error) {
            console.log('❌ Session test error:', error.response?.data || error.message);
        }

        // Test 3: Get current cart
        console.log('\n3. Getting current cart...');
        try {
            const cartResponse = await axios.get(`${BASE_URL}/cart`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            if (cartResponse.data.success) {
                console.log('✅ Cart retrieved successfully');
                console.log('Cart items:', cartResponse.data.data.cart?.length || 0);
                console.log('Cart total:', cartResponse.data.data.cartTotal);
                console.log('Cart count:', cartResponse.data.data.cartCount);
            } else {
                console.log('❌ Failed to get cart:', cartResponse.data.error);
            }
        } catch (error) {
            console.log('❌ Get cart error:', error.response?.data || error.message);
        }

        // Test 4: Get a sample product to add to cart
        console.log('\n4. Fetching sample product...');
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

        // Test 5: Add item to cart
        console.log('\n5. Adding item to cart...');
        try {
            const addResponse = await axios.post(`${BASE_URL}/cart/add`, {
                productId: sampleProduct._id,
                quantity: 1,
                variants: {}
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            if (addResponse.data.success) {
                console.log('✅ Item added to cart successfully');
                console.log('Cart items after adding:', addResponse.data.data.cart?.length || 0);
                console.log('Cart count after adding:', addResponse.data.data.cartCount);
            } else {
                console.log('❌ Failed to add item to cart:', addResponse.data.error);
            }
        } catch (error) {
            console.log('❌ Add to cart error:', error.response?.data || error.message);
        }

        // Test 6: Get updated cart
        console.log('\n6. Getting updated cart...');
        try {
            const updatedCartResponse = await axios.get(`${BASE_URL}/cart`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            if (updatedCartResponse.data.success) {
                console.log('✅ Updated cart retrieved successfully');
                console.log('Cart items:', updatedCartResponse.data.data.cart?.length || 0);
                console.log('Cart total:', updatedCartResponse.data.data.cartTotal);
                console.log('Cart count:', updatedCartResponse.data.data.cartCount);

                if (updatedCartResponse.data.data.cart?.length > 0) {
                    console.log('First cart item:', {
                        productId: updatedCartResponse.data.data.cart[0].productId,
                        name: updatedCartResponse.data.data.cart[0].name,
                        quantity: updatedCartResponse.data.data.cart[0].quantity,
                        price: updatedCartResponse.data.data.cart[0].price
                    });
                }
            } else {
                console.log('❌ Failed to get updated cart:', updatedCartResponse.data.error);
            }
        } catch (error) {
            console.log('❌ Get updated cart error:', error.response?.data || error.message);
        }

        console.log('\n🎉 Cart API test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testCartWithAuth();
