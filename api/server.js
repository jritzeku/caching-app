const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
// dotenv.config()
const connectDB = require('./config/db/connectDB')
const { connectRedis } = require('./config/redis/redis')
const generateToken = require('./config/token/generateToken')
const userRoutes = require('./routes/userRoutes')
const { errorHandlerMw, notFoundMw } = require('./middlewares/errorMw')
const rateLimitMiddleware = require('./middlewares/rateLimitMw')
const storyRoutes = require('./routes/storyRoutes')

const morgan = require('morgan')

const http = require('http')

dotenv.config()

const app = express()

connectDB()

connectRedis()

const apiLogs = fs.createWriteStream(
  path.join(__dirname, 'logs', 'apiLogs.log'),
  {
    flags: 'a',
  }
)

app.use(morgan('tiny', { stream: apiLogs }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(rateLimitMiddleware)

app.use(express.json({ limit: '50mb' }))

app.use('/api/user', userRoutes)
app.use('/api/story', storyRoutes)

app.use(notFoundMw)
app.use(errorHandlerMw)

const server = http.createServer(app)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))

/*
NOTES:

-When editing draft I got error msg saying payload too large
'PayloadTooLargeError: request entity too large'

  ->to fix, simply specify limit to 50mb  with express.json()

app.use(express.json({limit: '50mb'}));
https://stackoverflow.com/questions/19917401/error-request-entity-too-large#:~:text=explicitly%2C%20like%20so%20%3A-,app.use(express.json(%7Blimit%3A%20%2750mb%27%7D))%3B,-app.use

*/
