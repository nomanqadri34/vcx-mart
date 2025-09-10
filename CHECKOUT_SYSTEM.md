# Checkout System with GoKwik Integration

## Overview

Complete checkout system with GoKwik payment gateway integration, supporting both online payments and Cash on Delivery (COD).

## Features

### ✅ Backend Features

- **Order Management**: Complete order lifecycle management
- **GoKwik Integration**: Secure payment processing with GoKwik
- **Multiple Payment Methods**: Online payments (UPI, Cards, Net Banking) and COD
- **Address Management**: Shipping and billing address handling
- **Order Validation**: Real-time inventory and pricing validation
- **Webhook Support**: Automatic payment status updates
- **Coupon System**: Basic coupon code support
- **Security**: Signature verification for webhooks

### ✅ Frontend Features

- **Responsive Checkout**: Mobile-friendly checkout flow
- **Address Forms**: Complete shipping/billing address forms
- **Payment Selection**: Choose between online payment and COD
- **Order Summary**: Real-time pricing calculations
- **Success/Cancel Pages**: Proper order confirmation and cancellation handling
- **Order Tracking**: View order details and status

## GoKwik Configuration

### Environment Variables

```env
# GoKwik Configuration
GOKWIK_MERCHANT_ID=19inooi6rd1d
GOKWIK_APP_ID=a90aea436db5351552c1907a11f1deef
GOKWIK_APP_SECRET=ee6609c739748dd900b1e87556648e0f
GOKWIK_ID=43431
GOKWIK_BASE_URL=https://api.gokwik.co
```

## API Endpoints

### Checkout Routes (`/api/v1/checkout`)

- `POST /validate` - Validate checkout data and calculate totals
- `POST /create-order` - Create order and initiate payment
- `GET /order/:orderNumber` - Get order details
- `POST /verify-payment` - Verify payment status

### Payment Routes (`/api/v1/payments`)

- `POST /gokwik/webhook` - Handle GoKwik payment webhooks
- `POST /refund` - Process refunds

## Frontend Routes

- `/checkout` - Main checkout page
- `/checkout/success/:orderNumber` - Order success page
- `/checkout/cancel` - Payment cancellation page

## Database Models

### Order Schema

```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  items: [OrderItem],
  shippingAddress: Address,
  billingAddress: Address,
  payment: {
    method: String,
    status: String,
    transactionId: String,
    gokwikOrderId: String,
    amount: Number
  },
  pricing: {
    subtotal: Number,
    shippingCost: Number,
    tax: Number,
    discount: Number,
    total: Number
  },
  status: String,
  timestamps: true
}
```

## Usage Flow

### 1. Checkout Process

1. User adds items to cart
2. User proceeds to checkout
3. System validates items and calculates pricing
4. User fills shipping address
5. User selects payment method
6. Order is created in database

### 2. Payment Flow (GoKwik)

1. Order created with GoKwik payment method
2. GoKwik payment order created via API
3. User redirected to GoKwik payment page
4. Payment processed by GoKwik
5. Webhook updates order status
6. User redirected to success/cancel page

### 3. COD Flow

1. Order created with COD method
2. Order status set to 'confirmed'
3. User redirected to success page
4. Payment collected on delivery

## Security Features

### Webhook Verification

- Signature verification using HMAC-SHA256
- Timestamp validation
- Secure payload processing

### Input Validation

- Address validation
- Phone number validation
- Email validation
- Product availability checks
- Stock quantity validation

## Testing

### Manual Testing Steps

1. **Setup**: Ensure server is running with GoKwik credentials
2. **Login**: Login as a user
3. **Add to Cart**: Add products to cart
4. **Checkout**: Navigate to `/checkout`
5. **Fill Details**: Complete shipping address
6. **Payment**: Test both COD and GoKwik payments
7. **Verify**: Check order creation and status updates

### Test Script

```bash
node server/src/scripts/testCheckout.js
```

## Error Handling

### Common Errors

- **Product not found**: Invalid product ID in cart
- **Insufficient stock**: Product out of stock
- **Invalid address**: Missing required address fields
- **Payment failure**: GoKwik payment processing errors
- **Webhook errors**: Invalid signature or payload

### Error Responses

```javascript
{
  success: false,
  error: {
    message: "Error description",
    details: [] // Validation errors
  }
}
```

## Pricing Calculation

### Components

- **Subtotal**: Sum of all item prices
- **Shipping**: Free above ₹500, otherwise ₹50
- **Tax**: 18% GST on subtotal
- **Discount**: Coupon-based discounts
- **Total**: Subtotal + Shipping + Tax - Discount

## Order Status Flow

1. **pending** - Order created, payment pending
2. **confirmed** - Payment successful or COD order
3. **processing** - Order being prepared
4. **shipped** - Order dispatched
5. **delivered** - Order delivered
6. **cancelled** - Order cancelled
7. **refunded** - Payment refunded

## Integration Notes

### GoKwik Requirements

- Valid merchant credentials
- Webhook endpoint accessible from internet
- SSL certificate for production
- Proper error handling for payment failures

### Frontend Integration

- Cart context for item management
- Authentication context for user data
- Toast notifications for user feedback
- Loading states for better UX

## Production Checklist

### Security

- [ ] Use HTTPS for all endpoints
- [ ] Validate webhook signatures
- [ ] Sanitize user inputs
- [ ] Rate limit API endpoints
- [ ] Log security events

### Performance

- [ ] Optimize database queries
- [ ] Cache product data
- [ ] Compress API responses
- [ ] Monitor API response times

### Monitoring

- [ ] Set up error tracking
- [ ] Monitor payment success rates
- [ ] Track order completion rates
- [ ] Alert on webhook failures

## Support

### GoKwik Support

- Documentation: [GoKwik API Docs]
- Support: Contact GoKwik support team
- Test Environment: Use test credentials for development

### Troubleshooting

1. **Payment not working**: Check GoKwik credentials and network connectivity
2. **Webhook not received**: Verify webhook URL and firewall settings
3. **Order not created**: Check validation errors and database connectivity
4. **Address validation**: Ensure all required fields are provided

## Future Enhancements

### Planned Features

- [ ] Multiple payment gateways
- [ ] Advanced coupon system
- [ ] Subscription orders
- [ ] Split payments
- [ ] Installment payments
- [ ] Wallet integration
- [ ] Loyalty points
- [ ] Gift cards

### Optimization

- [ ] Async order processing
- [ ] Background payment verification
- [ ] Order status notifications
- [ ] Email confirmations
- [ ] SMS notifications
