const { getRedisClient, connectRedis } = require('../config/redis/redis')

const checkCache = (val) => {
  return (req, res, next) => {
    let key

    if (req.params.id) {
      key = generateKey(`${req.params.id}`)
      console.log('key:', key)
    } else {
      key = generateKey(`${val}`)
    }

    connectRedis().get(key, (err, data) => {
      if (err) {
        throw err
      } else {
        // Check cached data is exist.
        if (data != null) {
          // Send cached data.
          console.log(`[getTodos]Response is sent from cache with key: ${key}`)
          res.status(200).send(JSON.parse(data))
        } else {
          //proceed to fetch from DB
          next()
        }
      }
    })
  }
}

const generateKey = (key) => {
  return `${key}`
}

const rateLimiter = (rule) => {
  return async (req, res, next) => {
    const { endpoint, rate_limit } = rule

    console.log('Inside rateLimiter')
    console.log('rule', rule)

    console.log('req.ip', req.ip)

    const ipAddress = req.ip

    console.log('ipAddress', ipAddress)

    const redisId = `${endpoint}/${ipAddress}`
    const redisClient = getRedisClient()
    //  console.log('redisClient', redisClient)

    const requests = await redisClient.incr(redisId)

    console.log('requests', requests)
    console.log('redisId', redisId)

    if (requests === 1) {
      await redisClient.expire(redisId, rate_limit).time
    }

    if (requests > rate_limit.limit) {
      console.log('rate limit exceeded')
      return response.status(429).send({
        message: 'too much requests',
      })
    }

    next()
  }
}

module.exports = {
  checkCache,
  generateKey,
  rateLimiter,
}

/*
-Passing parameters to middleware
https://tsmx.net/express-middleware-function-with-custom-parameters/
*/
