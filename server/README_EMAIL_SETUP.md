# Email Setup Guide for Cryptomart Backend

## Overview
The backend includes a complete email verification system that sends verification emails when users register.

## Required Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```bash
# Email Configuration (Required for email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (Required for verification links)
FRONTEND_URL=http://localhost:5173

# Other required variables
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cryptomart
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
```

## Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Email Verification Flow

1. **User Registration**: User fills out registration form
2. **Backend Processing**: 
   - Creates user account (unverified)
   - Generates 6-digit verification OTP
   - Sends verification email with OTP
   - Returns success message (no auto-login)
3. **Email Verification**: User enters OTP from email
4. **Frontend Verification**: User submits OTP for verification
5. **Login**: User can now log in with verified account

## Testing Email Functionality

1. **Start the backend server**:
   ```bash
   cd server
   npm start
   ```

2. **Register a new user** through the frontend
3. **Check your email** for verification link
4. **Click the verification link** to verify the account
5. **Try logging in** with the verified account

## Troubleshooting

### Email Not Sending
- Check SMTP credentials in `.env`
- Verify Gmail app password is correct
- Check if 2FA is enabled on Gmail account
- Check backend logs for SMTP errors

### Verification Code Not Working
- Ensure `FRONTEND_URL` is correct in `.env`
- Check if frontend is running on the specified port
- Verify the verification route is properly configured
- OTP expires after 10 minutes - request a new one if needed

### Login Still Fails After Verification
- Check if user document was updated in database
- Verify `isEmailVerified` field is set to `true`
- Check backend logs for verification errors

## Production Considerations

1. **Use Professional Email Service**:
   - SendGrid, Mailgun, or AWS SES
   - Better deliverability and monitoring
   - Higher sending limits

2. **Update Environment Variables**:
   - Set `NODE_ENV=production`
   - Use production SMTP credentials
   - Set `FRONTEND_URL` to your domain

3. **Email Templates**:
   - Customize email templates in `src/utils/emailService.js`
   - Add your company branding
   - Include proper legal disclaimers

## Security Notes

- Email verification OTPs expire after 10 minutes
- Failed verification attempts are logged
- OTPs are single-use
- User accounts remain unverified until email is confirmed
