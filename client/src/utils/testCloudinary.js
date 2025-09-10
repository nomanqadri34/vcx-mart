// Test file to verify Cloudinary integration
import { uploadToCloudinary } from './cloudinary';

export const testCloudinaryUpload = async () => {
    try {
        // Create a simple test image (1x1 pixel PNG)
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, 0, 1, 1);

        // Convert to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], 'test.png', { type: 'image/png' });

        console.log('Testing Cloudinary upload...');
        const result = await uploadToCloudinary(file, 'test');
        console.log('Upload successful:', result);

        return result;
    } catch (error) {
        console.error('Cloudinary test failed:', error);
        throw error;
    }
};

// Usage: testCloudinaryUpload().then(console.log).catch(console.error);