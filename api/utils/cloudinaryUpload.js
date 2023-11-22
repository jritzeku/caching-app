const cloudinary = require('cloudinary')
const dotenv = require('dotenv')

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

const cloudinaryUploadImg = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: 'auto',
    })

    return {
      url: data?.secure_url,
    }
  } catch (error) {
    return error
  }
}

module.exports = cloudinaryUploadImg


 
/*
NOTE: 

-For some reason, was getting error saying can not read cloudinary api key? 

  ->so i added dotenv in this file and configured it and now works; in the tutorial
  it was only done in server.js file 

*/