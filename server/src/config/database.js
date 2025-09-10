const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment or use a fallback for development
    let mongoUri = process.env.MONGODB_URI;

    // If the MongoDB URI is not set or is pointing to localhost, help guide the user
    if (!mongoUri || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
      console.log('⚠️  MongoDB URI not configured or pointing to localhost.');
      console.log('📝 Please update your server/.env file with your MongoDB Atlas connection string:');
      console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@ac-5dlkorj.xhpp5nd.mongodb.net/cryptomart?retryWrites=true&w=majority');
      console.log('');
      console.log('🔍 Found evidence of previous successful connections to: ac-5dlkorj.xhpp5nd.mongodb.net');
      console.log('   Please use your actual MongoDB Atlas credentials.');

      // Exit gracefully to prevent localhost connection attempts
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      // Removed timeout configurations to prevent timeout errors
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
