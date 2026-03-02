import { v2 as cloudinary } from "cloudinary";

// Cache the cloudinary configuration
let isConfigured = false;

const connectCloudinary = async () => {
    // Only configure once
    if (!isConfigured) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        isConfigured = true;
    }
    return cloudinary;
}

export default connectCloudinary;