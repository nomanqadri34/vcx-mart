const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - Cryptomart',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cryptomart</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName}!</h2>
            <p>Thank you for registering with Cryptomart. To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${data.verificationLink}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${data.verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with Cryptomart, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Cryptomart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  emailVerificationOTP: (data) => ({
    subject: 'Verify Your Email - Cryptomart',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .otp-code { font-size: 32px; font-weight: bold; text-align: center; color: #4f46e5; background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 4px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cryptomart</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName}!</h2>
            <p>Thank you for registering with Cryptomart. To complete your registration, please use the verification code below:</p>
            <div class="otp-code">${data.otp}</div>
            <p><strong>Your verification code is: ${data.otp}</strong></p>
            <p>Enter this 6-digit code on the verification page to complete your registration.</p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't create an account with Cryptomart, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Cryptomart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Reset Your Password - Cryptomart',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cryptomart</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName}!</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${data.resetLink}" class="button">Reset Password</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${data.resetLink}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Cryptomart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmation #${data.orderNumber} - Cryptomart`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cryptomart</h1>
          </div>
          <div class="content">
            <h2>Thank you for your order, ${data.customerName}!</h2>
            <p>Your order has been confirmed and is being processed. Here are the details:</p>
            <div class="order-details">
              <h3>Order #${data.orderNumber}</h3>
              <p><strong>Order Date:</strong> ${data.orderDate}</p>
              <p><strong>Total Amount:</strong> ₹${data.totalAmount}</p>
              <p><strong>Shipping Address:</strong></p>
              <p>${data.shippingAddress}</p>
            </div>
            <p>We'll send you updates on your order status. You can also track your order in your account dashboard.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Cryptomart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  sellerApplicationStatus: (data) => ({
    subject: `Seller Application ${data.status} - Cryptomart`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seller Application Status</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .status { padding: 20px; margin: 20px 0; border-radius: 6px; }
          .approved { background: #d1fae5; border: 1px solid #10b981; }
          .rejected { background: #fee2e2; border: 1px solid #ef4444; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cryptomart</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.businessName}!</h2>
            <div class="status ${data.status === 'approved' ? 'approved' : 'rejected'}">
              <h3>Your seller application has been <strong>${data.status}</strong></h3>
              ${data.status === 'approved' ?
        '<p>Congratulations! You can now start selling on Cryptomart.</p>' :
        `<p>Reason: ${data.rejectionReason || 'Please contact support for more details.'}</p>`
      }
            </div>
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Cryptomart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  welcomeEmail: (data) => ({
    subject: 'Welcome to Cryptomart!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Cryptomart</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Cryptomart!</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName}!</h2>
            <p>Welcome to Cryptomart! We're excited to have you as part of our community.</p>
            <p>Start exploring our marketplace and discover amazing products from trusted sellers.</p>
            <p>If you have any questions or need assistance, our support team is here to help.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Cryptomart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  sellerApplicationReceived: (data) => ({
    subject: 'Seller Application Received - VCX MART',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seller Application Received</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59332; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VCX MART</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName}!</h2>
            <p>Thank you for submitting your seller application for <strong>${data.businessName}</strong>.</p>
            <div class="highlight">
              <p><strong>Application ID:</strong> ${data.applicationId}</p>
              <p><strong>Status:</strong> Under Review</p>
            </div>
            <p>Our team will review your application within 2-3 business days. We'll notify you via email once the review is complete.</p>
            <p>During the review process, we may contact you if we need any additional information or documentation.</p>
            <p>Thank you for choosing VCX MART as your selling platform!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 VCX MART. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  newSellerApplication: (data) => ({
    subject: 'New Seller Application - VCX MART',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Seller Application</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .details { background: white; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VCX MART Admin</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.adminName}!</h2>
            <p>A new seller application has been submitted and requires your review.</p>
            <div class="details">
              <p><strong>Applicant:</strong> ${data.sellerName}</p>
              <p><strong>Business Name:</strong> ${data.businessName}</p>
              <p><strong>Application ID:</strong> ${data.applicationId}</p>
            </div>
            <p>Please review the application and take appropriate action.</p>
            <a href="${data.reviewUrl}" class="button">Review Application</a>
          </div>
          <div class="footer">
            <p>&copy; 2024 VCX MART. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  sellerApplicationApproved: (data) => ({
    subject: 'Seller Application Approved - VCX MART',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seller Application Approved</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .success { background: #d1fae5; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #059669; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName}!</h2>
            <div class="success">
              <h3>Your seller application has been approved!</h3>
              <p>Welcome to the VCX MART seller community. Your business <strong>${data.businessName}</strong> is now ready to start selling.</p>
            </div>
            <p>You can now:</p>
            <ul>
              <li>Access your seller dashboard</li>
              <li>List your products</li>
              <li>Manage orders and inventory</li>
              <li>Track your sales and analytics</li>
            </ul>
            <a href="${data.dashboardUrl}" class="button">Go to Seller Dashboard</a>
            <p>If you need any assistance getting started, our support team is here to help.</p>
            <p>Welcome aboard and happy selling!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 VCX MART. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  sellerApplicationRejected: (data) => ({
    subject: 'Seller Application Update - VCX MART',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seller Application Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #f59332; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .reason { background: #fee2e2; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VCX MART</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName}!</h2>
            <p>Thank you for your interest in becoming a seller on VCX MART. After reviewing your application for <strong>${data.businessName}</strong>, we regret to inform you that we cannot approve it at this time.</p>
            <div class="reason">
              <h4>Reason for rejection:</h4>
              <p>${data.reason}</p>
            </div>
            <p>We encourage you to address the concerns mentioned above and reapply. Our team is committed to helping genuine businesses succeed on our platform.</p>
            <a href="${data.reapplyUrl}" class="button">Apply Again</a>
            <p>If you have any questions or need clarification, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 VCX MART. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async (options) => {
  try {
    // Check if email configuration is available
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn('Email configuration not available, skipping email send');
      return { messageId: 'skipped-no-config' };
    }

    const transporter = createTransporter();

    // Get template if specified
    let emailContent = {};
    if (options.template && emailTemplates[options.template]) {
      emailContent = emailTemplates[options.template](options.data || {});
    }

    const mailOptions = {
      from: `"Cryptomart" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject || emailContent.subject,
      html: options.html || emailContent.html,
      text: options.text || emailContent.text
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info('Email sent successfully', {
      messageId: info.messageId,
      to: options.to,
      subject: mailOptions.subject
    });

    return info;
  } catch (error) {
    logger.error('Failed to send email:', error);

    // Don't throw error for email failures in development
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Email failed in development mode, continuing...');
      return { messageId: 'failed-dev-mode', error: error.message };
    }

    throw error;
  }
};

// Send bulk emails
const sendBulkEmails = async (emails) => {
  try {
    const transporter = createTransporter();
    const results = [];

    for (const email of emails) {
      try {
        const info = await transporter.sendMail(email);
        results.push({ success: true, messageId: info.messageId, to: email.to });
      } catch (error) {
        logger.error(`Failed to send email to ${email.to}:`, error);
        results.push({ success: false, to: email.to, error: error.message });
      }
    }

    return results;
  } catch (error) {
    logger.error('Failed to send bulk emails:', error);
    throw error;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Email configuration verification failed:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  verifyEmailConfig,
  emailTemplates
};
