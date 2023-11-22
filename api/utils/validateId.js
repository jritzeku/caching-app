const mongoose = require('mongoose')

const validateId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id)
  if (!isValid) throw new Error('The id enterred is not valid!')
}

module.exports = validateId


/*
TODO: 

-find appropriate status code for this 
*/