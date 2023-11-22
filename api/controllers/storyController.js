const expressAsyncHandler = require('express-async-handler')
const Story = require('../models/Story')
const logger = require('../utils/logger')
const User = require('../models/User')
const validateId = require('../utils/validateId')
const fs = require('fs')
const cloudinaryUploadImg = require('../utils/cloudinaryUpload')
const getDaysArray = require('../utils/getDaysArray')
const { generateKey } = require('../middlewares/redisMw')
const { getRedisClient, connectRedis } = require('../config/redis/redis')

const createStory = expressAsyncHandler(async (req, res) => {
  console.log('Inside createStory')
  const { _id: loggedInUserId } = req?.user

  const { title, content, tags, image } = req?.body

  if (typeof tags === 'string') {
    tagsArray = tags.split(',')
  } else {
    tagsArray = tags
  }

  let imgUploaded

  if (image) {
    imgUploaded = image
  } else {
    //get path to img
    const localPath = `public/images/posts/${req?.file?.filename}`
    //upload to cloudinary
    let result = await cloudinaryUploadImg(localPath)
    imgUploaded = result?.url
    console.log('imgUploaded', imgUploaded)
  }

  const story = await Story.create({
    title,
    content,
    tags: tagsArray,
    thumbnailImg: imgUploaded,
    user: loggedInUserId,
    nameOfUser: `${req.user.firstName} ${req.user.lastName}`,
  })

  getRedisClient().del(`stories`)

  res.status(201).json(story)
})

const editStory = expressAsyncHandler(async (req, res) => {
  console.log('Inside editStory')
  const { id } = req.params
  const { _id: loggedInUserId } = req.user

  const { title, content, tags, image } = req.body
  console.log('reqbody', req.body)

  validateId(id)

  if (typeof tags === 'string') {
    tagsArray = tags.split(',')
  } else {
    tagsArray = tags
  }

  const story = await Story.findById(id)

  if (!(story.user.toString() === loggedInUserId.toString())) {
    res.status(422)
    throw new Error('Not allowed, you are not the owner of this content.')
  }

  if (!story) {
    res.status(404)
    throw new Error('story not found.')
  }

  let imgUploaded

  if (image) {
    imgUploaded = image
  } else {
    //get path to img
    const localPath = `public/images/posts/${req?.file?.filename}`
    //upload to cloudinary
    let result = await cloudinaryUploadImg(localPath)
    imgUploaded = result?.url
  }

  story.title = title || story.title
  story.thumbnailImg = imgUploaded || story.thumbnailImg
  story.content = content || story.content
  story.tags = tagsArray || story.tags

  await story.save()

  const key = generateKey(`story-${story._id}`)
  getRedisClient().setex(
    key,
    process.env.REDIS_CACHE_TIMEOUT, //second
    JSON.stringify(story)
  )

  getRedisClient().del(`allStories`)

  res.json(story)
})

const deleteStory = expressAsyncHandler(async (req, res) => {
  console.log('Inside deleteStory')
  const { id } = req.params
  const { _id: loggedInUserId } = req?.user

  validateId(id)

  const story = await Story.findById(id)

  if (
    !(story.user.toString() === loggedInUserId.toString() || req?.user?.isAdmin)
  ) {
    res.status(422)
    throw new Error(
      'Not allowed, you must be either admin or owner of this content.'
    )
  }

  if (!story) {
    res.status(404)
    throw new Error('story not found.')
  }

  await story.remove()

  getRedisClient().del(`story-${story._id}`)
  getRedisClient().del(`allStories`)

  res.json(story)
})

const getStories = expressAsyncHandler(async (req, res) => {
  console.log('Inside getStories')
  const keyword = req.query.keyword
    ? [
        {
          title: {
            //reason for using regex is so we dont have to type EXACT thing to perform search
            $regex: req.query.keyword,
            $options: 'i', //case insensitive
          },
        },

        {
          nameOfUser: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        },

        {
          tags: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        },
      ]
    : {}

  let stories

  if (JSON.stringify(keyword) === '{}') {
    stories = await Story.find({})
      .populate('user', '-password')

      .sort('-createdAt')

    const key = generateKey(`allStories`)

    getRedisClient().setex(
      key,
      process.env.REDIS_CACHE_TIMEOUT, //second
      JSON.stringify(stories)
    )
  } else {
    stories = await Story.find({
      $or: [keyword[0], keyword[1], keyword[2]],
    })
      .populate('user', '-password')

      .sort('-createdAt')

    // const key = generateKey(
    //   // `allStories-${keyword[0]}-${keyword[1]}-${keyword[2]}`
    //   `allStories`
    // )
    // connectRedis().setex(
    //   key,
    //   process.env.REDIS_CACHE_TIMEOUT, //second
    //   JSON.stringify(data)
    // )
  }

  res.json(stories)
})

const getTrendingStories = expressAsyncHandler(async (req, res) => {
  console.log('Inside  getTrendingStories')
  const trendingStories = await Story.find({}).limit(6)

  const key = generateKey(`trendingStories`)

  getRedisClient().setex(
    key,
    process.env.REDIS_CACHE_TIMEOUT, //second
    JSON.stringify(trendingStories)
  )

  res.json(trendingStories)
})

const getStory = expressAsyncHandler(async (req, res) => {
  console.log('Inside getStory')
  const { id } = req.params

  const story = await Story.findById(id)
    .populate('user', '-password')
    .populate('claps')

  if (!story) {
    res.status(404)
    throw new Error('story not found.')
  }

  const key = generateKey(story._id)

  console.log('key', key)

  getRedisClient().setex(
    key,
    process.env.REDIS_CACHE_TIMEOUT, //second
    JSON.stringify(story)
  )

  res.json(story)
})

const getUserStories = expressAsyncHandler(async (req, res) => {
  console.log('Inside getUserStories controller')
  const { id: userId } = req.params

  const userStories = await Story.find({ user: userId })
    .populate('user', '-password')

    .sort('-createdAt')

  const key = generateKey(`userStories-${userId}`)

  getRedisClient().setex(
    key,
    process.env.REDIS_CACHE_TIMEOUT, //second
    JSON.stringify(userStories)
  )

  res.json(userStories)
})

module.exports = {
  createStory,
  editStory,
  deleteStory,
  getStories,
  getTrendingStories,
  getStory,
  getUserStories,
}

/*
NOTES:


-Use redis for rate limiting
  ->set up rate limiting with redisF

 https://medium.com/@elangoram1998/create-a-rate-limiter-using-node-js-express-js-and-redis-cache-b5a0f7debf2b

  ->why use redis
https://blog.logrocket.com/set-up-rate-limiting-next-js-redis/#:~:text=Depending%20on%20the%20automatic%20scaling,it%20extremely%20fast%20and%20efficient.
 
-Redis commands 
https://www.javatpoint.com/redis-all-commands

-Update a value of existing key

  ->SIMPLY set the cache with existing key and will overwrite old one since
  that is how hashmap works!

-Delete all cache 

 getRedisClient().flushall() 

-Set key with expiration time

  const key = generateKey(`trendingStories`)

  getRedisClient().setex(
    key,
    process.env.REDIS_CACHE_TIMEOUT, //second
    JSON.stringify(trendingStories)
  )

-Get all keys

  getRedisClient().keys('*', (err, keys) => {
    console.log('keys', keys)
  })


  -Check if key exists
  let result = getRedisClient().exists(`story-${story._id}`)
  console.log('result', result)
*/
