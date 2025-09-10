# VCX MART Order Management System with NimbusPost Integration

## Overview
Complete order management system with multi-vendor support, NimbusPost shipping integration, and comprehensive tracking capabilities.

## Features Implemented

### 1. Order Model (`/server/src/models/Order.js`)
- **Multi-vendor Support**: Orders can contain items from multiple sellers
- **Comprehensive Status Tracking**: pending → confirmed → processing → shipped → delivered
- **Payment Integration**: Support for COD, Razorpay, GoKwik, and crypto payments
- **Address Management**: Separate shipping and billing addresses
- **NimbusPost Integration**: Built-in shipping and tracking support
- **Notifications**: Email/SMS notifications for status updates
- **Cancellation/Returns**: Support for order cancellation and return requests

### 2. NimbusPost Service (`/server/src/services/nimbusPostService.js`)
- **Authentication**: Automatic token management
- **Shipping Rates**: Get real-time shipping costs
- **Order Creation**: Create shipping orders with pickup scheduling
- **Tracking**: Real-time shipment tracking
- **Label Generation**: Shipping labels and manifests
- **Webhook Support**: Automatic status updates
- **Cancellation**: Cancel shipments with refund calculation

### 3. Order Routes (`/server/src/routes/orders.js`)

#### Customer Routes
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/my-orders` - Get user's orders with pagination
- `GET /api/v1/orders/:id` - Get specific order details
- `PUT /api/v1/orders/:id/cancel` - Cancel order
- `GET /api/v1/orders/:id/track` - Track order shipment

#### Seller Routes
- `GET /api/v1/orders/seller/my-orders` - Get seller's orders
- `PUT /api/v1/orders/:id/status` - Update order status
- `POST /api/v1/orders/:id/ship` - Create shipping for order

#### Admin Routes
- `GET /api/v1/orders/admin/all` - Get all orders with filters
- `GET /api/v1/orders/admin/stats` - Get order statistics
- `POST /api/v1/orders/webhook/nimbus` - NimbusPost webhook handler

### 4. Client Components

#### User Orders (`/client/src/pages/user/MyOrders.jsx`)
- **Order Listing**: Paginated list of user orders
- **Status Filtering**: Filter by order status
- **Order Details**: View complete order information
- **Tracking**: Track shipments with real-time updates
- **Cancellation**: Cancel eligible orders
- **Return/Exchange**: Request returns for delivered orders

#### Seller Orders (`/client/src/pages/seller/SellerOrders.jsx`)
- **Order Management**: View and manage seller-specific orders
- **Status Updates**: Update order status through workflow
- **Shipping Creation**: Create NimbusPost shipments
- **Customer Information**: View customer details and addresses
- **Bulk Actions**: Process multiple orders efficiently

#### Admin Orders (`/client/src/pages/admin/AdminOrders.jsx`)
- **Comprehensive Dashboard**: View all platform orders
- **Advanced Filtering**: Filter by status, date, seller, customer
- **Statistics**: Real-time order and revenue statistics
- **Search**: Search by order number, customer name, phone
- **Status Management**: Update any order status
- **Export Capabilities**: Export order data for reporting

## NimbusPost Integration Setup

### Environment Variables
```env
# NimbusPost Shipping
NIMBUS_POST_BASE_URL=https://api.nimbuspost.com/v1
NIMBUS_POST_API_KEY=your-nimbus-api-key
NIMBUS_POST_USERNAME=your-nimbus-username
NIMBUS_POST_PASSWORD=your-nimbus-password
NIMBUS_POST_WAREHOUSE_ID=your-warehouse-id
```

### Webhook Configuration
- **Endpoint**: `POST /api/v1/orders/webhook/nimbus`
- **Purpose**: Receive real-time shipping status updates
- **Security**: Implement webhook signature verification in production

## Order Workflow

### 1. Order Creation
```javascript
// Customer places order
const orderData = {
  items: [{ product: 'productId', quantity: 2, variants: {} }],
  shippingAddress: { /* address details */ },
  paymentMethod: 'razorpay',
  shippingMethod: 'standard'
};

// System processes:
// 1. Validates products and stock
// 2. Calculates totals (subtotal + shipping + tax)
// 3. Updates product stock
// 4. Sends confirmation emails
// 5. Notifies sellers
```

### 2. Order Processing
```javascript
// Seller confirms order
await updateOrderStatus(orderId, 'confirmed', 'Order confirmed by seller');

// System creates shipping (for prepaid orders)
const shippingResult = await createNimbusShipping(order);
if (shippingResult.success) {
  // Updates order with tracking information
  await order.addTracking(shippingResult);
}
```

### 3. Shipping & Tracking
```javascript
// Get real-time tracking
const trackingData = await nimbusPostService.trackShipment(trackingNumber);

// Webhook updates (automatic)
// NimbusPost sends status updates to webhook endpoint
// System automatically updates order status based on shipping status
```

## API Usage Examples

### Create Order
```javascript
import { orderAPI } from './services/api';

const newOrder = await orderAPI.createOrder({
  items: [
    {
      product: '64f8b2c1234567890abcdef1',
      quantity: 2,
      variants: { size: 'M', color: 'Blue' }
    }
  ],
  shippingAddress: {
    name: 'John Doe',
    phone: '9876543210',
    addressLine1: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  },
  paymentMethod: 'razorpay'
});
```

### Get User Orders
```javascript
const orders = await orderAPI.getMyOrders({
  page: 1,
  limit: 10,
  status: 'shipped'
});
```

### Update Order Status (Seller)
```javascript
await orderAPI.updateOrderStatus(
  orderId, 
  'shipped', 
  'Order shipped via NimbusPost'
);
```

### Track Order
```javascript
const tracking = await orderAPI.trackOrder(orderId);
console.log(tracking.data.trackingHistory);
```

## Database Schema

### Order Document Structure
```javascript
{
  _id: ObjectId,
  orderNumber: "ORD-1703123456-0001",
  customer: ObjectId, // User reference
  items: [{
    product: ObjectId,
    seller: ObjectId,
    name: "Product Name",
    price: 999,
    quantity: 2,
    subtotal: 1998,
    status: "shipped",
    tracking: {
      trackingNumber: "NP123456789",
      nimbusOrderId: "NIMBUS123",
      estimatedDelivery: Date
    }
  }],
  subtotal: 1998,
  shippingCost: 50,
  tax: 359.64,
  total: 2407.64,
  status: "shipped",
  paymentMethod: "razorpay",
  paymentStatus: "paid",
  shipping: {
    trackingNumber: "NP123456789",
    nimbusOrderId: "NIMBUS123",
    estimatedDelivery: Date,
    trackingUrl: "https://track.nimbuspost.com/NP123456789"
  },
  shippingAddress: { /* address object */ },
  placedAt: Date,
  shippedAt: Date,
  deliveredAt: Date
}
```

## Status Flow

### Order Status Progression
1. **pending** - Order placed, awaiting confirmation
2. **confirmed** - Seller confirmed, ready for processing
3. **processing** - Order being prepared for shipment
4. **shipped** - Order dispatched with tracking
5. **delivered** - Order successfully delivered
6. **cancelled** - Order cancelled (before shipping)
7. **returned** - Order returned by customer

### Payment Status
- **pending** - Payment not yet processed
- **paid** - Payment successful
- **failed** - Payment failed
- **refunded** - Payment refunded
- **partially_refunded** - Partial refund processed

## Email Notifications

### Automated Emails
- **Order Confirmation** - Sent to customer on order creation
- **Seller Notification** - Sent to sellers for new orders
- **Status Updates** - Sent on each status change
- **Shipping Notification** - Sent when order is shipped
- **Delivery Confirmation** - Sent when order is delivered
- **Cancellation Notice** - Sent when order is cancelled

## Security Features

### Access Control
- **Customer Access**: Can only view/cancel their own orders
- **Seller Access**: Can only manage orders containing their products
- **Admin Access**: Full access to all orders and statistics

### Data Protection
- **PII Handling**: Customer data properly masked in logs
- **Payment Security**: Payment details encrypted and tokenized
- **Webhook Security**: Signature verification for NimbusPost webhooks

## Performance Optimizations

### Database Indexing
```javascript
// Order indexes for optimal query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ 'items.seller': 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'shipping.trackingNumber': 1 });
```

### Pagination
- All order lists use cursor-based pagination
- Configurable page sizes (default: 10 items)
- Efficient counting for large datasets

### Caching Strategy
- Order statistics cached for 5 minutes
- Tracking data cached for 30 minutes
- Shipping rates cached for 1 hour

## Error Handling

### Common Error Scenarios
- **Insufficient Stock** - Prevents order creation
- **Invalid Address** - Validates shipping addresses
- **Payment Failures** - Handles payment gateway errors
- **Shipping Errors** - Graceful NimbusPost API error handling
- **Network Issues** - Retry mechanisms for external APIs

### Logging
- All order operations logged with correlation IDs
- Error tracking with stack traces
- Performance monitoring for slow queries

## Testing

### Unit Tests
- Order model validation
- Status transition logic
- Payment calculation accuracy
- NimbusPost service integration

### Integration Tests
- Complete order workflow
- Multi-vendor order processing
- Webhook handling
- Email notification delivery

## Deployment Considerations

### Environment Setup
1. Configure NimbusPost API credentials
2. Set up webhook endpoints with proper SSL
3. Configure email service (SMTP/SendGrid)
4. Set up monitoring and alerting
5. Configure backup and disaster recovery

### Monitoring
- Order processing metrics
- Shipping success rates
- Payment failure rates
- API response times
- Error rates and alerts

## Future Enhancements

### Planned Features
- **Bulk Order Processing** - Handle large order volumes
- **Advanced Analytics** - Detailed reporting and insights
- **Multi-Currency Support** - International order processing
- **Subscription Orders** - Recurring order management
- **Inventory Integration** - Real-time stock synchronization
- **Mobile App APIs** - Native mobile app support

This comprehensive order management system provides a robust foundation for multi-vendor ecommerce operations with integrated shipping and tracking capabilities through NimbusPost.