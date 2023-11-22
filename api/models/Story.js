const mongoose = require('mongoose')
 
const storySchema = new mongoose.Schema(
  {
    title: {
      required: [true, 'Title is required'],
      type: String,
      trim: true, //??
    },

    content: {
      type: String,
      required: [true, 'Content is required'],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    nameOfUser: {
      type: String,
      required: [true, 'Name of author is required'],
    },

    thumbnailImg: {
      type: String,
      //required: [true, 'thumbnail of story is required'],
    },

    tags: {
      type: [String],
    },

    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    toJson: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
)

storySchema.pre('remove', async function (next) {
  try {
    //remove child documents
    await Comment.deleteMany({ parentId: this.id })
  } catch (error) {
    next(error)
  }
})

const Story = mongoose.model('Story', storySchema)

module.exports = Story

 