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

const createTestUser = async () => {
    try {
        await connectDB();

        // Check if test user already exists
        const existingUser = await User.findOne({ email: 'test@example.com' });
        if (existingUser) {
            console.log('Test user already exists:', existingUser.email);
            console.log('You can use this user to test the cart functionality');
            process.exit(0);
        }

        // Create test user
        const testUser = new User({
            email: 'test@example.com',
            password: 'testpassword123',
            firstName: 'Test',
            lastName: 'User',
            phone: '1234567890',
            role: 'user',
            isEmailVerified: true,
            isActive: true,
            'privacyConsent.termsAccepted': true,
            'privacyConsent.termsAcceptedAt': new Date(),
            'privacyConsent.dataProcessingConsent': true,
            'privacyConsent.dataProcessingConsentAt': new Date()
        });

        await testUser.save();
        console.log('Test user created successfully!');
        console.log('Email: test@example.com');
        console.log('Password: testpassword123');
        console.log('You can now use this user to test the cart functionality');

        process.exit(0);

    } catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
};

createTestUser();
