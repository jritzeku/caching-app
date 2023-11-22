const express = require('express')

const {
  createStory,
  editStory,
  deleteStory,
  getStories,

  getTrendingStories,
  getStory,

  getUserStories,
} = require('../controllers/storyController')

const { authMw, adminMw } = require('../middlewares/userMw')

const { imgUploadMw, storyImgResizeMw } = require('../middlewares/uploadMw')
const { checkCache } = require('../middlewares/redisMw')

const storyRoutes = express.Router()

const RATE_LIMIT = {
  endpoint: '/api/story',
  rate_limit: {
    time: 60,
    limit: 1,
  },
}

storyRoutes.get('/', checkCache('allStories'), getStories)

storyRoutes.get('/getUserStories/:id', getUserStories)

storyRoutes.get(
  '/getTrendingStories',

  checkCache('trendingStories'),
  getTrendingStories
)

storyRoutes.get('/:id', checkCache(), getStory)

storyRoutes.delete('/:id', authMw, deleteStory)

storyRoutes.post(
  '/',
  authMw,
  imgUploadMw.single('image'),
  storyImgResizeMw,
  createStory
)

storyRoutes.put(
  '/:id',
  authMw,
  imgUploadMw.single('image'),
  storyImgResizeMw,
  editStory
)

module.exports = storyRoutes
