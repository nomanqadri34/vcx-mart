# VCX MART - Complete Setup Guide

## Overview

This guide will help you set up the complete VCX MART marketplace with user, seller, and admin dashboards.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Crptomart

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create `.env` file in the server directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/vcxmart

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@vcxmart.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Session Secret
SESSION_SECRET=your-session-secret-here

# Security
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Environment
NODE_ENV=development
```

### 3. Database Setup

```bash
# From the server directory
cd server

# Create admin user
npm run setup:admin

# Seed categories
npm run seed:categories

# Or run both at once
npm run setup
```

### 4. Start the Applications

```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Start the client
cd client
npm run dev
```

## Default Accounts

### Admin Account

- **Email**: admin@vcxmart.com
- **Password**: Admin@123456
- **Role**: Admin
- **Access**: Full platform management

### Test User Flow

1. Register a new user account
2. Verify email (check console logs for verification link)
3. Apply to become a seller
4. Login as admin to approve the application
5. User becomes a seller and can access seller dashboard

## User Roles & Permissions

### 1. User (Default)

- **Dashboard**: `/user/dashboard`
- **Capabilities**:
  - View and manage orders
  - Update profile and addresses
  - Apply to become a seller
  - Track seller application status

### 2. Seller (Approved Users)

- **Dashboard**: `/seller/dashboard`
- **Capabilities**:
  - All user capabilities
  - Manage products and inventory
  - Process orders
  - View sales analytics
  - Upload product images

### 3. Admin

- **Dashboard**: `/admin/dashboard`
- **Capabilities**:
  - All user and seller capabilities
  - Review seller applications
  - Approve/reject seller requests
  - Manage platform users
  - View platform analytics

## Key Features

### Seller Application System

1. **Multi-step Application Form**:

   - Business information
   - Document uploads (PAN, Aadhaar, etc.)
   - Bank details for payments
   - Terms acceptance

2. **Admin Review Process**:

   - Detailed application viewing
   - Document verification
   - Approve with automatic role upgrade
   - Reject with detailed feedback

3. **Email Notifications**:
   - Application received confirmation
   - Admin notification of new applications
   - Approval/rejection notifications

### Product Management

1. **Seller Product Operations**:

   - Create products with images
   - Manage inventory and pricing
   - Set product status (draft/active/inactive)
   - SEO optimization fields

2. **Category System**:
   - Hierarchical categories
   - Commission rates per category
   - Easy product categorization

### Dashboard Features

1. **User Dashboard**:

   - Order tracking
   - Seller application CTA
   - Real-time application status

2. **Seller Dashboard**:

   - Sales analytics with charts
   - Product management interface
   - Low stock alerts
   - Performance metrics

3. **Admin Dashboard**:
   - Platform overview
   - Seller application queue
   - User and seller management
   - System analytics

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Seller Management

- `POST /api/v1/seller/apply` - Submit seller application
- `GET /api/v1/seller/application/status` - Get application status
- `GET /api/v1/seller/applications` - List applications (Admin)
- `PUT /api/v1/seller/applications/:id/approve` - Approve application
- `PUT /api/v1/seller/applications/:id/reject` - Reject application

### Product Management

- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/seller` - Get seller's products
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Categories

- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/tree` - Get category tree

## File Structure

```
Crptomart/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── user/       # User dashboard
│   │   │   ├── seller/     # Seller dashboard & forms
│   │   │   └── admin/      # Admin dashboard
│   │   ├── components/     # Reusable components
│   │   └── contexts/       # React contexts
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── scripts/        # Setup scripts
└── uploads/                # File uploads
    ├── products/           # Product images
    └── seller-documents/   # Seller documents
```

## Testing the Complete Flow

### 1. User Registration & Seller Application

1. Visit `http://localhost:3000`
2. Register a new account
3. Verify email (check server console for link)
4. Login and go to user dashboard
5. Click "Become a Seller"
6. Fill out the multi-step application form
7. Upload required documents
8. Submit application

### 2. Admin Review Process

1. Login as admin (admin@vcxmart.com)
2. Go to Admin Dashboard
3. Click "Seller Management"
4. Review pending applications
5. Click "Review" on an application
6. Approve or reject with feedback

### 3. Seller Dashboard Access

1. Once approved, user can access seller dashboard
2. Navigate to `/seller/dashboard`
3. Add products using "Add Product"
4. Manage inventory and view analytics

## Troubleshooting

### Common Issues

1. **Server won't start - "slugify not found"**

   ```bash
   cd server
   npm install slugify
   ```

2. **Database connection error**

   - Check MongoDB is running
   - Verify MONGODB_URI in .env file

3. **Email notifications not working**

   - Configure SMTP settings in .env
   - Use app passwords for Gmail

4. **File uploads failing**
   - Check uploads directory permissions
   - Verify multer configuration

### Development Tips

1. **Reset Database**

   ```bash
   # Drop database and recreate
   npm run setup
   ```

2. **View Logs**

   - Server logs in console
   - Client logs in browser console

3. **API Testing**
   - Use Postman or similar tool
   - Check `/health` endpoint for server status

## Production Deployment

### Environment Variables

- Set NODE_ENV=production
- Use secure JWT secrets
- Configure proper SMTP settings
- Set up file storage (AWS S3, etc.)

### Security Considerations

- Enable HTTPS
- Configure CORS properly
- Set up rate limiting
- Implement proper file validation
- Use environment-specific secrets

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review server and client logs
3. Verify environment configuration
4. Test API endpoints individually

The system is designed to be production-ready with proper error handling, validation, and security measures in place.
