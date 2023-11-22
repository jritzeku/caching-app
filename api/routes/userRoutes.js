const express = require('express')

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,

  editProfile,
  followUser,
  unfollowUser,

  editUserAdmin,
  deleteUser,
  addTagToRecommendations,
  removeTagFromRecommendations,
} = require('../controllers/userController')

const { authMw, adminMw } = require('../middlewares/userMw')
const {
  imgUploadMw,
  profileImgResizeMw,
  storyImgResizeMw,
} = require('../middlewares/uploadMw')

const userRoutes = express.Router()

userRoutes.post('/', registerUser)
userRoutes.post('/login', loginUser)

module.exports = userRoutes

/*
NOTE: 

-Restrict access to ONLY your own account/resources  
 

*/
