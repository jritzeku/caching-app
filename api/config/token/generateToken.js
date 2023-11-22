const jwt = require('jsonwebtoken')

//generate token 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '30d' })
}

module.exports = generateToken
