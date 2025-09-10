const { sendEmail, verifyEmailConfig } = require('./src/utils/emailService');
require('dotenv').config();

async function testEmailConfiguration() {
    console.log('🔧 Testing Gmail SMTP Configuration...\n');
    
    // Test 1: Verify email configuration
    console.log('1. Verifying SMTP connection...');
    try {
        const isValid = await verifyEmailConfig();
        if (isValid) {
            console.log('✅ SMTP connection verified successfully');
        } else {
            console.log('❌ SMTP connection failed');
            return;
        }
    } catch (error) {
        console.log('❌ SMTP verification error:', error.message);
        return;
    }
    
    // Test 2: Send test OTP email
    console.log('\n2. Sending test OTP email...');
    try {
        const result = await sendEmail({
            to: 'varuntejabodepudi@gmail.com', // Send to your own email
            template: 'emailVerificationOTP',
            data: {
                firstName: 'Test User',
                otp: '123456'
            }
        });
        
        if (result.messageId && result.messageId !== 'skipped-no-config') {
            console.log('✅ Test OTP email sent successfully');
            console.log('📧 Message ID:', result.messageId);
            console.log('📬 Check your Gmail inbox for the OTP email');
        } else {
            console.log('⚠️ Email was skipped:', result.messageId);
        }
    } catch (error) {
        console.log('❌ Failed to send test email:', error.message);
        console.log('Stack:', error.stack);
    }
    
    // Test 3: Check environment variables
    console.log('\n3. Environment Variables Check:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***configured***' : 'NOT SET');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
}

testEmailConfiguration();