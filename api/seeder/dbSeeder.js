const mongoose = require('mongoose')
const dotenv = require('dotenv')
const stories = require('./data/stories')
const users = require('./data/users')
const User = require('../models/User')
const Story = require('../models/Story')

const convertStringToHTML = require('../utils/textToHtml')

const connectDB = require('../config/db/connectDB')

dotenv.config()

connectDB()

const clearDB = async () => {
  try {C
    //be CAREFUL of order! Story, User should be last to delete

    await Story.deleteMany()
    await User.deleteMany()

    console.log('Resetting the DB, all documents deleted.')
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}

const importData = async () => {
  let userIndex = 0
  await clearDB() //don't forget 'await' !

  //Add users
  const createdUsers = await User.insertMany(users)

  //----------------------------------------- Add stories-----------------------------------------
  let storiesWithUsers = []
  for (let i = 0; i < stories.length; i++) {
    //NOTE: 0%4 = 0; we want to check against this else will be out of bounds for user
    if (i > 0 && i % 4 === 0) {
      userIndex++
    }

    //???
    stories[i].content = stories[i].content + stories[i].content

    //WONT work...will keep reassigning to latest element
    // storiesWithUsers =[{ ...stories[i], user: createdUsers[userIndex].id }]
    storiesWithUsers.push({
      ...stories[i],
      user: createdUsers[userIndex].id,
      nameOfUser: `${createdUsers[userIndex].firstName} ${createdUsers[userIndex].lastName}`,
    })
  }

  await Story.insertMany(storiesWithUsers)

  /*
  -----------------------------------------   Add recommended topics for users-----------------------------------------
    ->prevent following same topic again
  */

  let updatedStories = await Story.find({})
  let allUsers = await User.find({})

  //console.log('createdUsers: ', createdUsers)
  let allTopics = [...new Set(updatedStories.map((story) => story.tags).flat())]
  // console.log('allTopics: ', allTopics)

  for (let i = 0; i < allUsers.length; i++) {
    let topicsNotFollowed = [...allTopics]

    for (let j = 0; j < 5; j++) {
      let selectedIndex = Math.floor(Math.random() * topicsNotFollowed.length)
      allUsers[i].recommendedTopics.push(topicsNotFollowed[selectedIndex])

      // await allUsers[i].save()

      topicsNotFollowed.splice(selectedIndex, 1) //use splice()
    }
  }

  for (let i = 0; i < allUsers.length; i++) {
    await allUsers[i].save()
  }

  /*-----------------------------------------   Add following/followers -----------------------------------------
 
  ->prevent following own self
  ->prevent following same user again 
*/

  let allUsers2 = await User.find({})

  let usersNotFollowed = [...allUsers.map((user) => user._id)]

  console.log('usersNotFollowed: ', usersNotFollowed)

  for (let i = 0; i < allUsers.length; i++) {
    //remove own id from here; so instead 12 we get 11 users
    let usersNotFollowed = [...allUsers.map((user) => user._id)].filter(
      (user) => user._id !== allUsers[i]._id
    )

    for (let j = 0; j < 6; j++) {
      let selectedIndex = Math.floor(Math.random() * usersNotFollowed.length)
      /*
      NOTE:
      ach user will have 5 for following but their followers
      will vary due to our logic !!! 
      */

      //Update my following array
      allUsers2[i].following.push(usersNotFollowed[selectedIndex])
      // await allUsers2[i].save()

      //Update their followers array
      await User.findByIdAndUpdate(usersNotFollowed[selectedIndex], {
        $push: { followers: allUsers2[i]._id },
      })

      usersNotFollowed.splice(selectedIndex, 1)
    }
  }

  for (let i = 0; i < allUsers.length; i++) {
    await allUsers2[i].save()
  }

  console.log(
    '--------------------  Data has been successfully imported. -------------------- '
  )
}

const destroyData = async () => {
  await clearDB()
  process.exit()
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}

/*

TODO: 
-Refactor later to REUSE the outer for loop once everything is working 

-NOTES:

-NOT sure why, but login fails when i DONT use separate loop and save each users changes

  ->I had to do this: 

    for (let i = 0; i < allUsers.length; i++) {
    await allUsers2[i].save()
  }



-await save() only works on single document; not an array of documents
  ->it seems that bulk edit is not supported?? 

-Get random numbers but exclude a number(one already used)

https://www.slingacademy.com/article/js-generate-a-random-number-between-min-and-max-and-exclude-a-specific-number/

https://stackoverflow.com/questions/5520835/how-can-i-generate-a-random-number-within-a-range-but-exclude-some

-When incrementing multiple fields in one edit, do it on on same line! 
https://stackoverflow.com/questions/23332285/how-do-you-increment-multiple-fields-in-one-query-in-mongoose

  ->ex. ERROR
  $inc: { viewsCount: 1}, //ERROR! include multiple fields in one line when using $inc


*/
