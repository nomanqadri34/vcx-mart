const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
require('dotenv').config();

const approveProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');

        // Find an admin user to set as approver
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('No admin user found. Creating a dummy admin for approval...');
            // For development, we'll just use a dummy ObjectId
        }

        // Get all unapproved products
        const unapprovedProducts = await Product.find({ isApproved: false });
        console.log(`Found ${unapprovedProducts.length} unapproved products`);

        if (unapprovedProducts.length === 0) {
            console.log('All products are already approved');
            process.exit(0);
        }

        // Approve all products
        const result = await Product.updateMany(
            { isApproved: false },
            {
                $set: {
                    isApproved: true,
                    approvedAt: new Date(),
                    approvedBy: adminUser?._id || new mongoose.Types.ObjectId()
                }
            }
        );

        console.log(`Approved ${result.modifiedCount} products`);

        // Show updated status
        const approvedProducts = await Product.find({ isApproved: true })
            .populate('category', 'name')
            .select('name status isApproved category')
            .lean();

        console.log('\nApproved products:');
        approvedProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} (${product.status}) - Category: ${product.category?.name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error approving products:', error);
        process.exit(1);
    }
};

approveProducts();