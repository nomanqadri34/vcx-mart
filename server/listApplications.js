require('dotenv').config();
const mongoose = require('mongoose');
const SellerApplication = require('./src/models/SellerApplication');

async function listApplications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    const applications = await SellerApplication.find({})
      .populate('user', 'firstName lastName email')
      .select('applicationId businessName status submittedAt');
    
    if (applications.length === 0) {
      console.log('No seller applications found in database');
    } else {
      console.log('Seller applications in database:');
      applications.forEach(app => {
        console.log(`- ${app.applicationId}: ${app.businessName} by ${app.user?.firstName} ${app.user?.lastName} (${app.user?.email}) - Status: ${app.status}`);
      });
    }
    
  } catch (error) {
    console.error('Error listing applications:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

listApplications();