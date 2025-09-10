const axios = require('axios');

const testProductsAPI = async () => {
    try {
        console.log('Testing products API...');

        // Test the products endpoint
        const response = await axios.get('http://localhost:5000/api/v1/products');

        console.log('API Response Status:', response.status);
        console.log('API Response Data:', JSON.stringify(response.data, null, 2));

        const products = response.data.data.products;
        console.log(`\nFound ${products.length} products`);

        if (products.length > 0) {
            console.log('\nFirst product details:');
            const product = products[0];
            console.log(`- Name: ${product.name}`);
            console.log(`- Status: ${product.status}`);
            console.log(`- Approved: ${product.isApproved}`);
            console.log(`- Price: ₹${product.price || product.basePrice}`);
            console.log(`- Category: ${product.category?.name}`);
            console.log(`- Images: ${product.images?.length || 0}`);
            if (product.images && product.images.length > 0) {
                console.log(`- First image URL: ${product.images[0].url}`);
            }
        }

    } catch (error) {
        console.error('Error testing API:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
};

testProductsAPI();