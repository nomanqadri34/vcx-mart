require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const User = require('../models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

const seedCategories = async () => {
    try {
        await connectDB();

        // Find an admin user to use as creator
        let adminUser = await User.findOne({ role: 'admin' });
        
        if (!adminUser) {
            // Create a default admin user if none exists
            adminUser = new User({
                email: 'admin@vcxmart.com',
                password: 'Admin@123',
                firstName: 'Admin',
                lastName: 'User',
                phone: '9999999999',
                role: 'admin',
                isEmailVerified: true,
                isActive: true,
                'privacyConsent.termsAccepted': true,
                'privacyConsent.termsAcceptedAt': new Date(),
                'privacyConsent.dataProcessingConsent': true,
                'privacyConsent.dataProcessingConsentAt': new Date()
            });
            await adminUser.save();
            console.log('Created default admin user');
        }

        // Clear existing categories
        await Category.deleteMany({});
        console.log('Cleared existing categories');

        // Create main categories
        const categories = [
            {
                name: 'Electronics',
                description: 'Electronic devices and gadgets',
                order: 1,
                isFeatured: true,
                commission: { rate: 8, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Fashion',
                description: 'Clothing, shoes, and accessories',
                order: 2,
                isFeatured: true,
                commission: { rate: 12, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Home & Garden',
                description: 'Home improvement and garden supplies',
                order: 3,
                isFeatured: true,
                commission: { rate: 10, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Sports & Fitness',
                description: 'Sports equipment and fitness gear',
                order: 4,
                isFeatured: false,
                commission: { rate: 9, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Books & Media',
                description: 'Books, movies, music, and games',
                order: 5,
                isFeatured: false,
                commission: { rate: 15, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Beauty & Health',
                description: 'Beauty products and health supplements',
                order: 6,
                isFeatured: true,
                commission: { rate: 11, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Automotive',
                description: 'Car parts and automotive accessories',
                order: 7,
                isFeatured: false,
                commission: { rate: 7, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Toys & Games',
                description: 'Toys for children and board games',
                order: 8,
                isFeatured: false,
                commission: { rate: 13, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Jewelry & Watches',
                description: 'Jewelry, watches, and accessories',
                order: 9,
                isFeatured: false,
                commission: { rate: 6, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Food & Beverages',
                description: 'Food items and beverages',
                order: 10,
                isFeatured: false,
                commission: { rate: 14, type: 'percentage' },
                createdBy: adminUser._id
            }
        ];

        const createdCategories = await Category.insertMany(categories);
        console.log(`Created ${createdCategories.length} categories`);

        // Create some subcategories for Electronics
        const electronicsCategory = createdCategories.find(cat => cat.name === 'Electronics');
        const electronicsSubcategories = [
            {
                name: 'Smartphones',
                description: 'Mobile phones and accessories',
                parent: electronicsCategory._id,
                order: 1,
                commission: { rate: 5, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Laptops',
                description: 'Laptops and notebooks',
                parent: electronicsCategory._id,
                order: 2,
                commission: { rate: 4, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Audio & Video',
                description: 'Headphones, speakers, and audio equipment',
                parent: electronicsCategory._id,
                order: 3,
                commission: { rate: 8, type: 'percentage' },
                createdBy: adminUser._id
            }
        ];

        const electronicsSubcats = await Category.insertMany(electronicsSubcategories);
        console.log(`Created ${electronicsSubcats.length} electronics subcategories`);

        // Create some subcategories for Fashion
        const fashionCategory = createdCategories.find(cat => cat.name === 'Fashion');
        const fashionSubcategories = [
            {
                name: "Men's Clothing",
                description: 'Clothing for men',
                parent: fashionCategory._id,
                order: 1,
                commission: { rate: 12, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: "Women's Clothing",
                description: 'Clothing for women',
                parent: fashionCategory._id,
                order: 2,
                commission: { rate: 12, type: 'percentage' },
                createdBy: adminUser._id
            },
            {
                name: 'Shoes',
                description: 'Footwear for all',
                parent: fashionCategory._id,
                order: 3,
                commission: { rate: 10, type: 'percentage' },
                createdBy: adminUser._id
            }
        ];

        const fashionSubcats = await Category.insertMany(fashionSubcategories);
        console.log(`Created ${fashionSubcats.length} fashion subcategories`);

        console.log('Categories seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();