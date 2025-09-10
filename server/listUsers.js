require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    const users = await User.find({}).select('firstName lastName email role');
    
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      console.log('Users in database:');
      users.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
      });
    }
    
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

listUsers();