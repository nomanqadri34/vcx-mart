require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const makeUserAdmin = async (email) => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptomart');
    console.log('✅ Connected to database');

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found with email:', email);
      return;
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    console.log('✅ User role updated successfully:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node makeUserAdmin.js <email>');
  console.log('Example: node makeUserAdmin.js admin@example.com');
  process.exit(1);
}

makeUserAdmin(email);