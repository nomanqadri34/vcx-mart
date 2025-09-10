const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
require('dotenv').config();

const checkProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');

        // Count total products
        const totalProducts = await Product.countDocuments();
        console.log(`Total products in database: ${totalProducts}`);

        // Count by status
        const statusCounts = await Product.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        console.log('Products by status:', statusCounts);

        // Get a few sample products
        const sampleProducts = await Product.find()
            .populate('category', 'name')
            .populate('seller', 'firstName lastName')
            .limit(3)
            .lean();

        console.log('\nSample products:');
        sampleProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   Status: ${product.status}`);
            console.log(`   Approved: ${product.isApproved}`);
            console.log(`   Category: ${product.category?.name || 'No category'}`);
            console.log(`   Seller: ${product.seller?.firstName || 'No seller'} ${product.seller?.lastName || ''}`);
            console.log(`   Price: ₹${product.price || product.basePrice}`);
            console.log(`   Images: ${product.images?.length || 0}`);
            console.log('');
        });

        // Check what the API query would return
        const apiQuery = {
            status: 'active',
            isApproved: true
        };

        const apiResults = await Product.find(apiQuery)
            .populate('category', 'name slug')
            .populate('seller', 'firstName lastName')
            .limit(10)
            .lean();

        console.log(`Products that would be returned by API (active + approved): ${apiResults.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Error checking products:', error);
        process.exit(1);
    }
};

checkProducts();