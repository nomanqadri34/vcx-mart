require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function makeAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Find user by email (replace with your email)
    const email = 'varuntejabodepudi@gmail.com'; // Change this to your email
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ User ${user.firstName} ${user.lastName} (${user.email}) is now an admin`);
    
  } catch (error) {
    console.error('Error making user admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();