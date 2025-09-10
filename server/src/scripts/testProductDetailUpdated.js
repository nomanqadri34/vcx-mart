const axios = require('axios');

async function testUpdatedProductDetail() {
    try {
        console.log('Testing Updated Product Detail Page...');

        // Test getting a product with the new structure
        const productsResponse = await axios.get('http://localhost:5000/api/v1/products');
        console.log('Products API Status:', productsResponse.status);

        if (productsResponse.data.data.products.length > 0) {
            const firstProduct = productsResponse.data.data.products[0];
            console.log('First product ID:', firstProduct._id);

            // Test getting single product
            const productResponse = await axios.get(`http://localhost:5000/api/v1/products/${firstProduct._id}`);
            console.log('Single Product API Status:', productResponse.status);

            const product = productResponse.data.data.product;
            console.log('\n=== Product Details ===');
            console.log('Name:', product.name);
            console.log('Price:', product.price);
            console.log('Discounted Price:', product.discountedPrice);
            console.log('Brand:', product.brand);
            console.log('Material:', product.material);
            console.log('Pattern:', product.pattern);
            console.log('Fit Type:', product.fitType);
            console.log('Sleeve Type:', product.sleeveType);
            console.log('Neck Type:', product.neckType);
            console.log('Gender:', product.gender);
            console.log('Product Type:', product.productType);
            console.log('Country of Origin:', product.countryOfOrigin);
            console.log('Care Instructions:', product.careInstruction);
            console.log('Weight:', product.weight);
            console.log('SKU:', product.sku);
            console.log('Is Accessory:', product.isAccessory);

            console.log('\n=== Sizes ===');
            if (product.sizes && product.sizes.length > 0) {
                product.sizes.forEach(size => {
                    console.log(`- ${size.size}: ${size.stock} in stock`);
                });
            } else {
                console.log('No sizes defined');
            }

            console.log('\n=== Colors ===');
            if (product.colors && product.colors.length > 0) {
                console.log('Available colors:', product.colors.join(', '));
            } else {
                console.log('No colors defined');
            }

            console.log('\n=== Key Highlights ===');
            if (product.keyHighlightsCustomFields && product.keyHighlightsCustomFields.length > 0) {
                product.keyHighlightsCustomFields.forEach((highlight, index) => {
                    console.log(`${index + 1}. ${highlight.heading}: ${highlight.value}`);
                });
            } else {
                console.log('No key highlights defined');
            }

            console.log('\n=== Product Information ===');
            if (product.productInformationCustomFields && product.productInformationCustomFields.length > 0) {
                product.productInformationCustomFields.forEach((info, index) => {
                    console.log(`${index + 1}. ${info.heading}: ${info.value}`);
                });
            } else {
                console.log('No product information defined');
            }

            console.log('\n=== Images ===');
            if (product.images && product.images.length > 0) {
                console.log(`${product.images.length} images available`);
                product.images.forEach((image, index) => {
                    console.log(`${index + 1}. ${image.url} (Primary: ${image.isPrimary})`);
                });
            } else {
                console.log('No images available');
            }

            console.log('\n=== Seller Info ===');
            if (product.seller) {
                console.log('Seller Name:', product.seller.firstName, product.seller.lastName);
                console.log('Business Name:', product.seller.businessName);
            } else {
                console.log('No seller information');
            }

            console.log('\n=== Category ===');
            if (product.category) {
                console.log('Category:', product.category.name);
                console.log('Category Slug:', product.category.slug);
            } else {
                console.log('No category information');
            }

            console.log('\n=== Stock Information ===');
            console.log('Total Inventory:', product.totalInventory);
            console.log('In Stock:', product.inStock);
            console.log('Low Stock:', product.lowStock);
            console.log('Out of Stock:', product.outOfStock);

        } else {
            console.log('No products found in database');
        }

        console.log('\n✅ Product detail test completed!');
        console.log('\nThe ProductDetailPage.jsx should now properly display:');
        console.log('- Sizes with stock information');
        console.log('- Available colors');
        console.log('- Product specifications (brand, material, etc.)');
        console.log('- Key highlights and product information');
        console.log('- Proper pricing with discounts');
        console.log('- Stock-aware quantity selection');

    } catch (error) {
        console.error('❌ Test error:', error.response?.status, error.response?.data || error.message);
    }
}

testUpdatedProductDetail();