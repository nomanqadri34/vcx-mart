# Cloudinary Integration Implementation

## Overview

Implemented unsigned Cloudinary uploads for both category and product images using the hardcoded configuration:

- Cloud Name: `dfisnbg4l`
- Upload Preset: `ml_default`

## Components Created

### 1. Cloudinary Utility (`client/src/utils/cloudinary.js`)

- `uploadToCloudinary()` - Single file upload
- `uploadMultipleToCloudinary()` - Multiple files upload
- `getCloudinaryUrl()` - Generate URLs with transformations
- Uses unsigned uploads with hardcoded preset

### 2. ImageUpload Component (`client/src/components/ImageUpload.jsx`)

- Reusable drag-and-drop image upload component
- Supports single and multiple file uploads
- Shows upload progress and preview
- Integrates with Cloudinary utility

### 3. CategorySelector Component (`client/src/components/CategorySelector.jsx`)

- Hierarchical category selection with tree view
- Allows sellers to create new categories inline
- Integrates with SellerCategoryForm

### 4. SellerCategoryForm Component (`client/src/components/SellerCategoryForm.jsx`)

- Modal form for sellers to create categories
- Includes image upload functionality
- Validates required fields

## Updated Components

### 1. CategoryManagement (`client/src/pages/admin/CategoryManagement.jsx`)

- Added image upload field using ImageUpload component
- Updated form submission to handle Cloudinary images
- Stores image URL and publicId in database

### 2. AddProduct (`client/src/pages/seller/AddProduct.jsx`)

- Replaced file upload with Cloudinary ImageUpload component
- Updated CategorySelector with creation capability
- Modified form submission to send image data directly

## Backend Updates

### 1. Category Model (`server/src/models/Category.js`)

- Already had image fields with URL and publicId support
- Added createdBy field for permission checking

### 2. Product Model (`server/src/models/Product.js`)

- Updated images array to include publicId field
- Supports Cloudinary image structure

### 3. Category Routes (`server/src/routes/category.js`)

- Updated POST route to allow sellers to create categories
- Added image field handling
- Implemented permission checks (sellers can create, admins have full control)

### 4. Product Routes (`server/src/routes/product.js`)

- Removed multer file upload middleware
- Updated to accept images array directly from frontend
- Validates image array presence

## Features Implemented

### For Admins:

- Create main categories with images
- Full category management with image support
- Set featured categories and commission rates

### For Sellers:

- Create categories with images (non-featured by default)
- Add products with multiple Cloudinary images
- Category selection with inline creation option

### Image Handling:

- Unsigned Cloudinary uploads (no server-side processing needed)
- Automatic folder organization (categories/, products/)
- Image preview and removal functionality
- Drag-and-drop upload interface

## Usage Examples

### Upload Single Image:

```javascript
import { uploadToCloudinary } from "../utils/cloudinary";

const result = await uploadToCloudinary(file, "categories");
// Returns: { url: 'https://...', publicId: '...' }
```

### Use ImageUpload Component:

```jsx
<ImageUpload
  onUpload={handleImageUpload}
  multiple={true}
  folder="products"
  maxFiles={10}
  existingImages={images}
/>
```

### Create Category with Image:

```javascript
const categoryData = {
  name: "Electronics",
  description: "Electronic items",
  image: {
    url: "https://res.cloudinary.com/dfisnbg4l/...",
    publicId: "categories/electronics_abc123",
  },
};
```

## Testing

- Created test utility (`client/src/utils/testCloudinary.js`) to verify uploads
- All components include error handling and loading states
- Form validation ensures required fields are filled

## Security Notes

- Uses unsigned uploads with preset `ml_default`
- No API keys exposed in frontend code
- Server validates user permissions for category creation
- Images are organized by folder (categories/, products/)

## Next Steps

1. Test the integration with actual image uploads
2. Add image optimization and transformation options
3. Implement image deletion from Cloudinary when items are removed
4. Add image compression before upload for better performance
