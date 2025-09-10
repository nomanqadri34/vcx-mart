const axios = require('axios');

async function testProductAPI() {
    try {
        console.log('Testing Product API...');

        // Test getting all products first
        const productsResponse = await axios.get('http://localhost:5000/api/v1/products');
        console.log('Products API Status:', productsResponse.status);
        console.log('Products found:', productsResponse.data.data.products.length);

        if (productsResponse.data.data.products.length > 0) {
            const firstProduct = productsResponse.data.data.products[0];
            console.log('First product ID:', firstProduct._id);

            // Test getting single product
            const productResponse = await axios.get(`http://localhost:5000/api/v1/products/${firstProduct._id}`);
            console.log('Single Product API Status:', productResponse.status);
            console.log('Product name:', productResponse.data.data.product.name);
            console.log('Product category:', productResponse.data.data.product.category?.name);
            console.log('Product seller:', productResponse.data.data.product.seller?.firstName);
        }

    } catch (error) {
        console.error('API Test Error:', error.response?.status, error.response?.data || error.message);
    }
}

testProductAPI();