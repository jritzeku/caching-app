const logger = require('../utils/logger')
const notFoundMw = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`)
 
  res.status(404)
  next(error)
}

const errorHandlerMw = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  console.error(err)

  logger.appLogger.log('error', err?.message)

  res.json({
    message: err?.message,
    //only show error stack during dev mode!

    stack: process.env.NODE_ENV !== 'production' ? null : err.stack,
  })
}

module.exports = { notFoundMw, errorHandlerMw }

 