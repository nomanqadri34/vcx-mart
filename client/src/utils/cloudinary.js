// Cloudinary configuration for unsigned uploads
const CLOUDINARY_CLOUD_NAME = "dfisnbg4l";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";
const CLOUDINARY_BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

export const uploadToCloudinary = async (file, folder = "products") => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_BASE_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload image");
        }

        const data = await response.json();
        return {
            url: data.secure_url,
            publicId: data.public_id,
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

export const uploadMultipleToCloudinary = async (files, folder = "products") => {
    try {
        const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error("Multiple upload error:", error);
        throw error;
    }
};

// Generate Cloudinary URL with transformations
export const getCloudinaryUrl = (publicId, transformations = {}) => {
    const { width, height, crop = "fill", quality = "auto" } = transformations;

    let url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

    const transforms = [];
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (crop) transforms.push(`c_${crop}`);
    if (quality) transforms.push(`q_${quality}`);

    if (transforms.length > 0) {
        url += transforms.join(",") + "/";
    }

    url += publicId;
    return url;
};