const mongoose = require('mongoose')

 
//connect to db 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })

    console.log('Connected to database successfully.')
  } catch (error) {
    console.log(`Failed to connect to database. Error: ${error.message}`)
  }
}

module.exports = connectDB
