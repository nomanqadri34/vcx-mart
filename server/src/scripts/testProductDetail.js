const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function testProductDetail() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get the product ID from the error (68b0546...)
        // Let's first find any product to test with
        const products = await Product.find().limit(5);
        console.log('Found products:', products.length);

        if (products.length === 0) {
            console.log('No products found in database');
            return;
        }

        // Test with the first product
        const testProductId = products[0]._id;
        console.log('Testing with product ID:', testProductId);

        // Try to fetch the product like the API does
        const product = await Product.findById(testProductId)
            .populate('category', 'name slug')
            .populate('seller', 'firstName lastName')
            .lean();

        if (!product) {
            console.log('Product not found');
        } else {
            console.log('Product found successfully:');
            console.log('- Name:', product.name);
            console.log('- Category:', product.category);
            console.log('- Seller:', product.seller);
            console.log('- Status:', product.status);
            console.log('- Images:', product.images?.length || 0);
        }

        // Test with the specific ID from the error
        const errorId = '68b0546'; // This seems to be truncated
        console.log('\nTesting with error ID (might be invalid):', errorId);

        try {
            const errorProduct = await Product.findById(errorId);
            console.log('Error ID product:', errorProduct);
        } catch (err) {
            console.log('Error with specific ID:', err.message);
        }

    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testProductDetail();