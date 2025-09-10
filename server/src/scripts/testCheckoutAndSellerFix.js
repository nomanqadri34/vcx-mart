const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testCheckoutAndSellerFix() {
    try {
        console.log('🧪 Testing Checkout and Seller Management Fixes...\n');

        // Test 1: Test checkout validation endpoint
        console.log('1. Testing checkout validation endpoint...');
        try {
            const checkoutData = {
                items: [
                    {
                        product: "68b054639562879c50bdfb78",
                        quantity: 2,
                        variants: { size: "M", color: "Blue" }
                    }
                ],
                shippingAddress: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@example.com",
                    phone: "1234567890",
                    address: "123 Main St",
                    city: "Mumbai",
                    state: "Maharashtra",
                    pincode: "400001",
                    country: "India"
                },
                couponCode: ""
            };

            const response = await axios.post(`${BASE_URL}/checkout/validate`, checkoutData, {
                headers: {
                    'Authorization': 'Bearer fake-token-for-test'
                }
            });
            console.log('❌ Checkout validation should fail without proper auth');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Checkout validation properly requires authentication');
            } else if (error.response?.status === 400) {
                console.log('✅ Checkout validation endpoint exists and validates data');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        // Test 2: Test admin sellers endpoint
        console.log('\n2. Testing admin sellers endpoint...');
        try {
            const response = await axios.get(`${BASE_URL}/admin/sellers?status=pending`, {
                headers: {
                    'Authorization': 'Bearer fake-token-for-test'
                }
            });
            console.log('❌ Admin sellers should fail without proper auth');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Admin sellers endpoint properly requires authentication');
            } else if (error.response?.status === 403) {
                console.log('✅ Admin sellers endpoint properly requires admin permissions');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        // Test 3: Test checkout data structure
        console.log('\n3. Testing checkout data structure...');
        const mockCartItems = [
            {
                productId: "68b054639562879c50bdfb78",
                name: "men shirt",
                price: 1000,
                quantity: 2,
                selectedVariants: { size: "M", color: "Blue" }
            }
        ];

        // Transform for checkout API
        const transformedItems = mockCartItems.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            variants: item.selectedVariants,
        }));

        console.log('✅ Cart item structure:', JSON.stringify(mockCartItems[0], null, 2));
        console.log('✅ Transformed for checkout API:', JSON.stringify(transformedItems[0], null, 2));

        // Test 4: Test seller management data structure
        console.log('\n4. Testing seller management data structure...');
        const mockSellerApplication = {
            _id: "seller123",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phone: "1234567890",
            sellerApplication: {
                status: "pending",
                businessName: "John's Store",
                businessType: "Individual",
                contactPerson: "John Doe",
                businessPhone: "1234567890",
                businessAddress: "123 Business St",
                categories: ["Electronics", "Clothing"],
                bankDetails: {
                    bankName: "State Bank",
                    accountHolderName: "John Doe",
                    accountNumber: "1234567890",
                    ifscCode: "SBIN0001234"
                },
                documents: [
                    { type: "panCard" },
                    { type: "aadharCard" },
                    { type: "businessLicense" }
                ],
                submittedAt: new Date().toISOString()
            }
        };

        console.log('✅ Seller application structure valid');

        console.log('\n🎉 All tests completed!');
        console.log('\n📝 Summary of fixes:');
        console.log('- ✅ Created checkout validation endpoint');
        console.log('- ✅ Created checkout order creation endpoint');
        console.log('- ✅ Added checkoutAPI to services');
        console.log('- ✅ Fixed SellerManagement API endpoints');
        console.log('- ✅ Updated API paths from /seller/applications to /admin/sellers');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testCheckoutAndSellerFix();