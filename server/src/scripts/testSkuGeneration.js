const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const testSkuGeneration = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');

        // Create a test product without SKU
        const testProduct = new Product({
            name: 'Test Product for SKU Generation',
            description: 'This is a test product to verify SKU auto-generation',
            price: 29.99,
            category: '66d123456789abcdef123456', // Use a dummy ObjectId
            seller: '66d123456789abcdef123457', // Use a dummy ObjectId
            images: [{
                url: 'https://example.com/test.jpg',
                publicId: 'test_image',
                alt: 'Test Image',
                isPrimary: true,
                order: 0
            }],
            status: 'draft'
        });

        console.log('Product before save - SKU:', testProduct.sku);

        // Save the product (this should trigger SKU generation)
        await testProduct.save();

        console.log('Product after save - SKU:', testProduct.sku);
        console.log('SKU generation test completed successfully');

        // Clean up - remove the test product
        await Product.findByIdAndDelete(testProduct._id);
        console.log('Test product cleaned up');

        process.exit(0);
    } catch (error) {
        console.error('Error testing SKU generation:', error);
        process.exit(1);
    }
};

testSkuGeneration();