# Gmail SMTP Setup Guide for OTP Email Delivery

## Current Issue
OTP emails are not being delivered to Gmail addresses due to SMTP configuration problems.

## Step-by-Step Solution

### 1. Generate New Gmail App Password

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Sign in with `varuntejabodepudi@gmail.com`

2. **Enable 2-Factor Authentication** (if not already enabled)
   - Go to Security → 2-Step Verification
   - Follow the setup process

3. **Generate App Password**
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" as the app
   - Select "Other (custom name)" as device
   - Enter "Cryptomart Server" as the name
   - Click "Generate"
   - **Copy the 16-character password** (format: xxxx xxxx xxxx xxxx)

### 2. Update Environment Variables

Replace the current SMTP_PASS in your `.env` file:

```env
SMTP_PASS=your-new-16-character-app-password
```

### 3. Test Email Configuration

Run the test script:

```bash
cd server
node testEmailFix.js
```

### 4. Common Gmail Issues & Solutions

#### Issue: "Invalid login" error
**Solution:** 
- Ensure 2FA is enabled
- Generate a fresh App Password
- Use the Gmail address as SMTP_USER

#### Issue: "Less secure app access" error
**Solution:**
- Don't use "Less secure app access" (deprecated)
- Use App Passwords instead

#### Issue: Emails going to spam
**Solution:**
- Use your actual Gmail address as EMAIL_FROM
- Add SPF record if using custom domain

### 5. Alternative Solutions

If Gmail continues to fail, consider these alternatives:

#### Option A: Use SendGrid (Recommended)
```env
# Replace Gmail config with SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

#### Option B: Use Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
EMAIL_FROM=noreply@yourdomain.com
```

### 6. Verification Steps

After updating configuration:

1. **Test SMTP Connection:**
   ```bash
   node testEmailFix.js
   ```

2. **Test Registration Flow:**
   - Register a new user with your Gmail address
   - Check if OTP email arrives

3. **Check Server Logs:**
   ```bash
   tail -f logs/combined.log
   ```

### 7. Troubleshooting Commands

```bash
# Check if email service is working
node src/scripts/testEmail.js

# Verify email configuration
node -e "require('./src/utils/emailService').verifyEmailConfig().then(console.log)"

# Test OTP generation
node -e "
const User = require('./src/models/User');
const user = new User({email: 'test@test.com'});
console.log('OTP:', user.generateEmailVerificationOTP());
"
```

## Expected Results

After fixing the configuration:
- ✅ SMTP connection should verify successfully
- ✅ Test emails should be delivered to Gmail
- ✅ Registration OTP emails should arrive within 1-2 minutes
- ✅ No "skipped-no-config" messages in logs