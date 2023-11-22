const redis = require('redis')
require('dotenv').config()

let client

const connectRedis = () => {
  try {
    //redis client is set
    client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
    client.on('connect', () => {
      console.log('Successfully connected to redis')
    })
    return client
  } catch (e) {
    console.log('Error while connecting to Redis.')
  }
}

const getRedisClient = () => {
  try {
    return client
  } catch (e) {
    console.log('No redis client is available, make sure to connect to redis.')
  }
}

const rateLimiter = (secondsLimit, limitAmount) => async (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  ;[response] = await redisClient
    .multi()
    .incr(ip)
    .expire(ip, secondsLimit)
    .exec()

  if (response[1] > limitAmount)
    res.json({
      loggedIn: false,
      status: 'Slow down!! Try again in a minute.',
    })
  else next()
}

module.exports = {
  connectRedis,
  getRedisClient,
  rateLimiter
}
