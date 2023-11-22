const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Story = require('./Story')
 

const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, 'First name is required'],
      type: String,
    },
    lastName: {
      required: [true, 'Last name is required'],
      type: String,
    },
    //this field mainly for stat display
    createdDate: {
      type: Date,
      //  required: true,
      default: Date.now(),
    },
    email: {
      required: [true, 'Email is required'],
      type: String,
    },
    password: {
      required: [true, 'Password is required'],
      type: String,
    },
    blurb: {
      type: String,
      default: '',
    },
    profileSet: {
      type: Boolean,
      default: false,
    },

    aboutMe: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dgmandmlc/image/upload/v1682695332/users/avatar_g9wttl.png',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    warningCount: {
      type: Number,
      default: 0, //after 3 warnings, account may be deleted
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    recommendedTopics: [String],

    active: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
)

//virtual method to populate created post
userSchema.virtual('stories', {
  ref: 'Story',
  foreignField: 'user', //property 'user' in Post
  localField: '_id',
})

//encrypt our pw
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  //hash and salt pw
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

//add  method to our model  for checking pw
userSchema.methods.matchPassword = async function (enteredPassword) {
  //compare() asynchronously compares the given data against the given hash and returns a Promise; hence we use 'await'
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('remove', async function (next) {
  const userId = this.getQuery()['_id'] //just this.id since this refers to User object

  //remove child documents(posts and comments by user before removing user)
  try {
    await Story.deleteMany({ user: userId })
 
  } catch (error) {
    next(error)
  }
})

//make a model out of our schema
const User = mongoose.model('User', userSchema)

module.exports = User

/*
-TODO: 

  ->research  exec() and lean() mongoose methods...is used in some codebase


  ->before removing user, remove all comments and posts created by them
    -https://www.youtube.com/watch?v=NRHzljtAc-0
*/
