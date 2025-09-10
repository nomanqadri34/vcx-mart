# Dashboard System Documentation

## Overview

This document describes the enhanced dashboard system with proper role-based access control and seller application workflow.

## User Roles

### 1. User (Default Role)

- **Dashboard**: `/user/dashboard`
- **Features**:
  - View order history and status
  - Manage profile and addresses
  - Apply to become a seller
  - Track seller application status

### 2. Seller (Approved Users)

- **Dashboard**: `/seller/dashboard`
- **Features**:
  - Manage products and inventory
  - Process orders
  - View sales analytics
  - Track performance metrics
  - Low stock alerts

### 3. Admin

- **Dashboard**: `/admin/dashboard`
- **Features**:
  - Review seller applications
  - Approve/reject seller requests
  - Manage users and sellers
  - View platform analytics
  - Handle disputes and refunds

## Seller Application Workflow

### 1. Application Submission

- Users can apply to become sellers from their dashboard
- Multi-step application form with:
  - Business information
  - Document uploads (PAN, Aadhaar, etc.)
  - Bank details
  - Terms acceptance

### 2. Admin Review Process

- Applications appear in admin dashboard
- Detailed application view with all submitted information
- Approve or reject with reason
- Email notifications sent automatically

### 3. Status Updates

- Real-time status tracking for applicants
- Email notifications for status changes
- Automatic role upgrade upon approval

## API Endpoints

### Seller Application Endpoints

- `POST /api/v1/seller/apply` - Submit seller application
- `GET /api/v1/seller/application/status` - Get application status
- `GET /api/v1/seller/applications` - List applications (Admin)
- `GET /api/v1/seller/applications/:id` - Get specific application (Admin)
- `PUT /api/v1/seller/applications/:id/approve` - Approve application (Admin)
- `PUT /api/v1/seller/applications/:id/reject` - Reject application (Admin)

## File Structure

### Client Components

```
client/src/
├── pages/
│   ├── user/
│   │   └── UserDashboard.jsx
│   ├── seller/
│   │   ├── SellerApplication.jsx
│   │   └── SellerDashboard.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       └── SellerManagement.jsx
└── components/
    └── DashboardRouter.jsx
```

### Server Components

```
server/src/
├── routes/
│   └── seller.js
├── models/
│   └── User.js (enhanced with seller fields)
└── utils/
    └── emailService.js (with seller templates)
```

## Features Implemented

### User Dashboard Enhancements

- ✅ Seller application CTA for eligible users
- ✅ Application status tracking
- ✅ Dynamic content based on user role
- ✅ Integration with seller application API

### Seller Dashboard

- ✅ Sales overview and analytics
- ✅ Order management interface
- ✅ Product management links
- ✅ Low stock alerts
- ✅ Performance metrics

### Admin Dashboard

- ✅ Seller application management
- ✅ Application review interface
- ✅ Approve/reject functionality
- ✅ Detailed application viewing

### Backend Features

- ✅ File upload handling for documents
- ✅ Email notification system
- ✅ Role-based access control
- ✅ Application status tracking
- ✅ Comprehensive validation

## Email Templates

The system includes email templates for:

- Seller application received confirmation
- Admin notification of new applications
- Application approval notification
- Application rejection with reason

## Security Features

- Role-based route protection
- File upload validation
- Input sanitization
- Authentication middleware
- CSRF protection for file uploads

## Usage Instructions

### For Users

1. Register and verify email
2. Access user dashboard
3. Click "Become a Seller" to apply
4. Fill out the multi-step application
5. Track application status in dashboard

### For Admins

1. Access admin dashboard
2. Navigate to "Seller Management"
3. Review pending applications
4. View detailed application information
5. Approve or reject with feedback

## Environment Variables

Ensure these are set in your `.env` file:

```
FRONTEND_URL=http://localhost:3000
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

## Next Steps

To further enhance the system:

1. Add product management for sellers
2. Implement order processing workflow
3. Add analytics and reporting
4. Create seller onboarding flow
5. Add seller performance metrics

## Product Management System

### Features Added

- ✅ Complete product CRUD operations
- ✅ Image upload and management (up to 10 images per product)
- ✅ Category and subcategory support
- ✅ SKU and inventory tracking
- ✅ Product status management (draft, active, inactive, archived)
- ✅ SEO fields and metadata
- ✅ Seller-specific product filtering
- ✅ Product approval workflow
- ✅ Bulk operations and status updates

### API Endpoints Added

- `GET /api/v1/products` - Get all products (public)
- `GET /api/v1/products/seller` - Get seller's products
- `POST /api/v1/products` - Create new product
- `GET /api/v1/products/:id` - Get single product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product (soft delete)
- `PUT /api/v1/products/:id/status` - Update product status
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/tree` - Get category tree

### Components Added

```
client/src/pages/seller/
├── ProductManagement.jsx - Product listing and management
└── AddProduct.jsx - Product creation form
```

### Database Seeding

- Category seeding script: `server/src/scripts/seedCategories.js`
- Run with: `node server/src/scripts/seedCategories.js`

### File Upload Structure

```
server/uploads/
├── products/ - Product images
└── seller-documents/ - Seller application documents
```

## Usage Instructions

### For Sellers

1. Access seller dashboard after approval
2. Navigate to "My Products" to manage listings
3. Click "Add Product" to create new listings
4. Upload product images and fill details
5. Products start as "draft" and need activation
6. Monitor inventory and low stock alerts

### Product Workflow

1. Seller creates product (status: draft)
2. Seller activates product (status: active)
3. Admin can approve/reject products
4. Approved products appear in public listings
5. Sellers can deactivate or archive products

## Technical Implementation

### Image Handling

- Multer for file uploads
- 5MB size limit per image
- JPEG, PNG, WebP formats supported
- Automatic filename generation
- Image preview in forms

### Product Model Features

- Comprehensive product schema
- Variant support for different options
- Inventory tracking with reservations
- SEO optimization fields
- Performance metrics (views, sales, ratings)
- Audit trail with created/updated by

### Security Features

- Seller can only manage own products
- File type validation
- Size limits on uploads
- Role-based access control
- Input sanitization and validation
