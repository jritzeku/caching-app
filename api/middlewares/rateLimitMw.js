const setRateLimit = require('express-rate-limit')

// Rate limit middleware
const rateLimitMiddleware = setRateLimit({
  windowMs: 60 * 1000, //minute
  max: 20, //20 requests(allowed per minute)
  message: 'You have exceeded your 5 requests per minute limit.',
  headers: true,
})

module.exports = rateLimitMiddleware

/*
NOTES:

-Rate limiter
https://reflectoring.io/tutorial-nodejs-rate-limiter/


Rate limiting is a strategy for limiting network traffic on a server. It 
puts a cap on how quickly and frequently a user can interact with a 
server or resource, preventing overload and abuse. 

*/
