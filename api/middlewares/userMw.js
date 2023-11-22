const expressAsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
 
const authMw = expressAsyncHandler(async (req, res, next) => {
  let token

  if (req?.headers?.authorization?.startsWith('Bearer')) {
    /*
     -We use try/catch to get the specific error that may be generated when attempting to decode
       ->for general errors can just use if/else where we can throw our own custom errors
     */
    try {
      token = req?.headers?.authorization.split(' ')[1]

      if (!token) {
        res.status(401) //status code needs to be set UNLESS we want to use teh default of 200(not the case here)
        throw new Error('Not authorized, no token detected')
      }

      //decode the token to get valuable info from it
      const decoded = jwt.verify(token, process.env.JWT_KEY)
      const user = await User.findById(decoded?.id).select('-password')

      //append our user data to request object
      req.user = user
      next()
    } catch (error) {
      console.log(error)
      res.status(401) //401 denotes authentication failure
      throw new Error('Not authorized, token failed.')
    }
  }
})

const adminMw = (req, res, next) => {
  if (req?.user?.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

const blockedMw = (user) => {
  if (user?.isBlocked) {
    throw new Error(
      'Access denied! Your account is blocked, please contact the administrator for further questions.'
    )
  }
}

module.exports = { authMw, adminMw, blockedMw }
 