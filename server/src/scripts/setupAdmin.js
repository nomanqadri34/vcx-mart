require('dotenv').config();
const mongoose = require('mongoose');
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

const createAdminUser = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            email: 'admin@vcxmart.com',
            password: 'Admin@123456',
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
        console.log('Admin user created successfully!');
        console.log('Email: admin@vcxmart.com');
        console.log('Password: Admin@123456');
        console.log('Please change the password after first login.');

        process.exit(0);

    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();