const expressAsyncHandler = require('express-async-handler')

const generateToken = require('../config/token/generateToken')
const User = require('../models/User')
const logger = require('../utils/logger')

const registerUser = expressAsyncHandler(async (req, res) => {
  console.log('INside registerUser')
  const { firstName, lastName, email, password } = req.body

  //check if user with email exists already
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  //create new user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  })

  if (user) {
    await user.save()

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('There was an error with registration.')
  }
})

const loginUser = expressAsyncHandler(async (req, res) => {
  console.log('Inside loginUser')
  const { email, password } = req.body

  //early exit cond.
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    //this is useful for checking if user logged in on backend but NOT thru middleware

    //authenticate via create a json token
    res.json({
      _id: user._id,
      name: user.name,
      createdDate: user.createdDate,
      email: user.email,
      isAdmin: user.isAdmin,

      image: user.image,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password was entered.')
  }
})

module.exports = {
  registerUser,
  loginUser,
}

/*
NOTES:
-Preventing double entires in mongoose array 
  ->instead of doing conditonal check i just used addToSet()

https://stackoverflow.com/questions/13404363/avoid-duplicate-entries-on-mongoose-array

-WARNING : when we upload image, it actually is not part of req.body?? 
  ->so we cant destructure like this

    const { title, description, content, tags, image } = req?.body



-For editing there are 3 main ways to do it
  ->approach1: findByIdAndUpdate() with ...re.body
    -USing ...req.body is convenient when creating /editing but its dangerous
    because can allow us to alter any data; hence we only destructure out   
    necessary parts and use those  

  ->approach2: findByIdAndUpdate() and only destructure out editable items
    -BUT this is bad we have to include all the fields or will get validation error
      ->this is inconvenient when we only want to change one field
    -If we turn off 'runValidators' then our DB is now corrupted 

  ->approach3: just use save()
    -here we get most control! 
      ->validation done automatically with save() 
      ->we can only list the fields we want to edit (ed. firstName)
       -for fields we wish to remain same, use existing data 
      


-When to use req.body vs req.params when grabbing just id 
  ->for now, just use req.params for grabbing id
  
-Should I use  express-async-handler(no try/catch) OR try/catch (without express-async-handler) 
   ->for a good example using try/catch, see BlogDev(MERN )
     -there, in try block he returns speicfic error msg such as invalid id, not authenticated etc. 
        
     -there, in the catch block he always returns the default error of 500 status code 

-When should we use the flag 'new' and 'runValidators'?
   ->atm we do this when performing edits

-When to grab id from req.params, req.body , or req

-When performing edits or deletions, why are we assuming that the error
resulted because user was not found? What if id is valid but was an issue
with edit/delete?  

  ->may need to do it in 2 steps: https://stackoverflow.com/questions/64323202/determine-mongoose-findbyidandupdate-error-type

-Update password feature

*/
