const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto', // This will allow uploading any file type
    });

    // Remove file after uploading
    fs.unlinkSync(filePath);

    // console.log('Upload successful:', result); // Add this log
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error); // Add this log
    return { error: error.message };
  }
};

module.exports = { uploadOnCloudinary };
