const mongoose = require('mongoose');
require('dotenv').config();

const fixProductIndexes = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('products');

        // Get all indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(idx => idx.name));

        // Drop problematic indexes that don't exist in current schema
        const indexesToDrop = ['slug_1', 'subcategory_1'];

        for (const indexName of indexesToDrop) {
            try {
                await collection.dropIndex(indexName);
                console.log(`Dropped index: ${indexName}`);
            } catch (error) {
                console.log(`Index ${indexName} not found or error dropping:`, error.message);
            }
        }

        console.log('Product indexes fix completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing product indexes:', error);
        process.exit(1);
    }
};

fixProductIndexes();