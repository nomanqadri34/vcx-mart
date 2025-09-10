const mongoose = require('mongoose');
require('dotenv').config();

const fixSkuIndex = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('products');

        // Get all indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(idx => idx.name));

        // Drop all SKU-related indexes
        const skuIndexes = indexes.filter(idx =>
            idx.name.includes('sku') ||
            (idx.key && (idx.key.sku || idx.key['variants.sku']))
        );

        for (const index of skuIndexes) {
            try {
                await collection.dropIndex(index.name);
                console.log(`Dropped index: ${index.name}`);
            } catch (error) {
                console.log(`Error dropping index ${index.name}:`, error.message);
            }
        }

        // Create new sparse unique index for sku
        await collection.createIndex({ sku: 1 }, { unique: true, sparse: true });
        console.log('Created new sparse unique index for sku');

        console.log('SKU index fix completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing SKU index:', error);
        process.exit(1);
    }
};

fixSkuIndex();