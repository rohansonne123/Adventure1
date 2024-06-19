<<<<<<< HEAD
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.API_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'WANDERLUST_DEV',
      allowerdFormats: async (req, file) => ['png',"jpeg","jpg"], // supports promises as well
    },
  });

  module.exports={
    storage,
    cloudinary,
=======
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.API_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'WANDERLUST_DEV',
      allowerdFormats: async (req, file) => ['png',"jpeg","jpg"], // supports promises as well
    },
  });

  module.exports={
    storage,
    cloudinary,
>>>>>>> aace1cf54c0a401ff4d8b62faeae9eaea6702b7e
  };