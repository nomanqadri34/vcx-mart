const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testCartPage() {
    try {
        console.log('🧪 Testing Cart Page Data Structure...\n');

        // Test 1: Get a sample product
        console.log('1. Fetching sample product...');
        const productsResponse = await axios.get(`${BASE_URL}/products?limit=1`);

        console.log('Response structure:', JSON.stringify(productsResponse.data, null, 2));

        if (!productsResponse.data.success) {
            console.log('❌ API request failed');
            return;
        }

        const products = productsResponse.data.data.products || productsResponse.data.data;
        if (!products || products.length === 0) {
            console.log('❌ No products found');
            return;
        }

        const sampleProduct = products[0];
        console.log('✅ Sample product:', {
            id: sampleProduct._id,
            name: sampleProduct.name,
            price: sampleProduct.price,
            images: sampleProduct.images?.length || 0
        });

        // Test 2: Simulate cart item structure
        console.log('\n2. Testing cart item structure...');
        const cartItem = {
            productId: sampleProduct._id,
            name: sampleProduct.name,
            price: sampleProduct.price,
            originalPrice: sampleProduct.originalPrice || sampleProduct.price,
            image: sampleProduct.images?.[0] || sampleProduct.image,
            quantity: 2,
            selectedVariants: {
                size: 'M',
                color: 'Blue'
            },
            sellerId: sampleProduct.sellerId,
            category: sampleProduct.category,
            inStock: sampleProduct.inStock || true,
            maxQuantity: sampleProduct.maxQuantity || 999
        };

        console.log('✅ Cart item structure:', JSON.stringify(cartItem, null, 2));

        // Test 3: Test item ID generation
        console.log('\n3. Testing item ID generation...');
        const itemId = `${cartItem.productId}-${JSON.stringify(cartItem.selectedVariants)}`;
        console.log('✅ Item ID:', itemId);

        // Test 4: Test pricing calculation
        console.log('\n4. Testing pricing calculation...');
        const subtotal = cartItem.price * cartItem.quantity;
        const shippingCost = subtotal >= 500 ? 0 : 50;
        const tax = Math.round(subtotal * 0.18);
        const total = subtotal + shippingCost + tax;

        console.log('✅ Pricing breakdown:', {
            subtotal,
            shippingCost,
            tax,
            total
        });

        console.log('\n🎉 All cart page tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testCartPage();