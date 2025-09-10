const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
require('dotenv').config();

const sampleProducts = [
    {
        name: "Premium Cotton T-Shirt",
        description: "High-quality cotton t-shirt perfect for everyday wear. Soft, comfortable, and durable fabric that maintains its shape after multiple washes.",
        shortDescription: "Premium cotton t-shirt for everyday comfort",
        price: 799,
        brand: "ComfortWear",
        gender: "Unisex",
        productType: "T-Shirt",
        material: "100% Cotton",
        neckType: "Round Neck",
        fitType: "Regular",
        pattern: "Solid",
        sleeveType: "Half Sleeve",
        careInstruction: "Machine wash cold, tumble dry low",
        countryOfOrigin: "India",
        colors: ["White", "Black", "Navy Blue", "Gray"],
        sizes: [
            { size: "S", stock: 25 },
            { size: "M", stock: 30 },
            { size: "L", stock: 20 },
            { size: "XL", stock: 15 }
        ],
        status: "active",
        weight: 0.2,
        images: [{
            url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            publicId: "sample_tshirt_1",
            alt: "Premium Cotton T-Shirt",
            isPrimary: true,
            order: 0
        }]
    },
    {
        name: "Denim Jeans - Slim Fit",
        description: "Classic slim-fit denim jeans made from premium denim fabric. Features a modern cut that's comfortable and stylish for any occasion.",
        shortDescription: "Classic slim-fit denim jeans",
        price: 1999,
        discountedPrice: 1599,
        brand: "DenimCraft",
        gender: "Men",
        productType: "Jeans",
        material: "98% Cotton, 2% Elastane",
        fitType: "Slim",
        pattern: "Solid",
        careInstruction: "Machine wash cold, hang dry",
        countryOfOrigin: "India",
        colors: ["Dark Blue", "Light Blue", "Black"],
        sizes: [
            { size: "S", stock: 15 },
            { size: "M", stock: 25 },
            { size: "L", stock: 20 },
            { size: "XL", stock: 10 }
        ],
        status: "active",
        weight: 0.6,
        images: [{
            url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
            publicId: "sample_jeans_1",
            alt: "Denim Jeans - Slim Fit",
            isPrimary: true,
            order: 0
        }]
    },
    {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation, long battery life, and superior sound quality. Perfect for music lovers and professionals.",
        shortDescription: "Premium wireless headphones with noise cancellation",
        price: 4999,
        discountedPrice: 3999,
        brand: "AudioTech",
        productType: "Headphones",
        material: "Plastic, Metal",
        careInstruction: "Clean with dry cloth, avoid water",
        countryOfOrigin: "China",
        colors: ["Black", "White", "Silver"],
        status: "active",
        weight: 0.3,
        isAccessory: true,
        images: [{
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            publicId: "sample_headphones_1",
            alt: "Wireless Bluetooth Headphones",
            isPrimary: true,
            order: 0
        }]
    },
    {
        name: "Women's Summer Dress",
        description: "Elegant summer dress made from breathable fabric. Perfect for casual outings, office wear, or special occasions. Available in multiple colors and sizes.",
        shortDescription: "Elegant summer dress for all occasions",
        price: 1299,
        brand: "FashionForward",
        gender: "Women",
        productType: "Dress",
        material: "Cotton Blend",
        fitType: "Regular",
        pattern: "Floral",
        sleeveType: "Sleeveless",
        careInstruction: "Hand wash or gentle machine wash",
        countryOfOrigin: "India",
        colors: ["Floral Blue", "Floral Pink", "Solid Black"],
        sizes: [
            { size: "S", stock: 20 },
            { size: "M", stock: 25 },
            { size: "L", stock: 15 },
            { size: "XL", stock: 10 }
        ],
        status: "active",
        weight: 0.3,
        images: [{
            url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
            publicId: "sample_dress_1",
            alt: "Women's Summer Dress",
            isPrimary: true,
            order: 0
        }]
    },
    {
        name: "Sports Running Shoes",
        description: "Comfortable running shoes designed for athletes and fitness enthusiasts. Features cushioned sole, breathable material, and excellent grip for all terrains.",
        shortDescription: "Professional running shoes for athletes",
        price: 2999,
        discountedPrice: 2499,
        brand: "SportsPro",
        gender: "Unisex",
        productType: "Shoes",
        material: "Synthetic, Mesh",
        careInstruction: "Clean with damp cloth, air dry",
        countryOfOrigin: "Vietnam",
        colors: ["Black/White", "Blue/Gray", "Red/Black"],
        sizes: [
            { size: "S", stock: 12 },
            { size: "M", stock: 18 },
            { size: "L", stock: 15 },
            { size: "XL", stock: 8 }
        ],
        status: "active",
        weight: 0.8,
        images: [{
            url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
            publicId: "sample_shoes_1",
            alt: "Sports Running Shoes",
            isPrimary: true,
            order: 0
        }]
    }
];

const createSampleProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');

        // Find a seller and categories
        const seller = await User.findOne({ role: 'seller' });
        if (!seller) {
            console.log('No seller found. Please create a seller first.');
            process.exit(1);
        }

        const categories = await Category.find();
        if (categories.length === 0) {
            console.log('No categories found. Please create categories first.');
            process.exit(1);
        }

        console.log(`Found seller: ${seller.firstName} ${seller.lastName}`);
        console.log(`Found ${categories.length} categories`);

        // Create products
        for (let i = 0; i < sampleProducts.length; i++) {
            const productData = sampleProducts[i];

            // Assign a random category
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];

            const product = new Product({
                ...productData,
                seller: seller._id,
                category: randomCategory._id,
                createdBy: seller._id,
                isApproved: true, // Auto-approve for demo
                approvedAt: new Date(),
                approvedBy: seller._id // Using seller as approver for demo
            });

            await product.save();
            console.log(`Created product: ${product.name} (SKU: ${product.sku})`);
        }

        console.log(`\nSuccessfully created ${sampleProducts.length} sample products!`);

        // Show total products count
        const totalProducts = await Product.countDocuments({ isApproved: true, status: 'active' });
        console.log(`Total approved active products: ${totalProducts}`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating sample products:', error);
        process.exit(1);
    }
};

createSampleProducts();