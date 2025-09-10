require('express-async-errors');
require('dotenv').config();

// TIMEOUTS DISABLED: All timeout configurations have been removed to prevent timeout errors
// This includes database connection timeouts, server timeouts, and request timeouts

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csrf = require('csurf');

const connectDB = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import routes
const authRoutes = require('./routes/auth');
const sellerRoutes = require('./routes/seller');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const cartRoutes = require('./routes/cart');
const couponRoutes = require('./routes/coupons');
const reviewRoutes = require('./routes/reviews');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === 'production') {
      // Production: only allow specific domains
      const allowedOrigins = ['https://vcxmart.com','https://vcxmartapp.netlify.app'];
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Development: allow localhost with any port
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Disable timeouts for all requests
app.use((req, res, next) => {
  // Remove any default timeouts
  req.setTimeout(0);
  res.setTimeout(0);
  next();
});

// Compression middleware
app.use(compression());

// Logging middleware - Only log errors and important info
app.use(morgan('combined', {
  stream: {
    write: message => {
      // Only log important messages, filter out cart API calls
      if (!message.includes('/api/v1/cart') && !message.includes('Not Found')) {
        logger.info(message.trim());
      }
    }
  }
}));

// Session configuration
app.use(session({
  name: 'cryptomart.session',
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-development',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptomart',
    ttl: 24 * 60 * 60, // 1 day
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: false, // Set to false for development, true for production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'lax' // Important for cross-origin requests
  },
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use(`/api/${process.env.API_VERSION || 'v1'}/auth`, authRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/seller`, sellerRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/products`, productRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/cart`, cartRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/categories`, categoryRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/users`, userRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/orders`, orderRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/admin`, adminRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/payments`, paymentRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/coupons`, couponRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/reviews`, reviewRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/upload`, uploadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      console.log('📱 API available at: http://localhost:' + PORT + '/api/v1');
      console.log('🏥 Health check: http://localhost:' + PORT + '/health');
      console.log('='.repeat(60));
    }, {
      // Disable server timeouts
      timeout: 0,
      keepAlive: true,
      keepAliveTimeout: 0
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
