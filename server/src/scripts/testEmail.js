const { sendEmail } = require('../utils/emailService');
require('dotenv').config();

async function testEmail() {
    try {
        console.log('Testing email service...');

        const result = await sendEmail({
            to: 'test@example.com',
            subject: 'Test Email',
            html: '<h1>Test Email</h1><p>This is a test email.</p>'
        });

        console.log('Email test successful:', result.messageId);
    } catch (error) {
        console.error('Email test failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

testEmail();