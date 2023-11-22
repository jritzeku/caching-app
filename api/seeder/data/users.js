const bcrypt = require('bcryptjs')

/*
Resources: 

-generate free texts via AI
  ->I used this to generate texts for aboutMe section and
  for actual post content

https://tools.picsart.com/text/ai-writer/editor/?id=1

-remove apostrophes 
https://phrasefix.com/tools/remove-single-quotes-from-text/

-textwrap
  ->Go to View => Word Wrap 

https://stackoverflow.com/questions/31025502/how-can-i-switch-word-wrap-on-and-off-in-visual-studio-code

*/

const users = [
  {
    firstName: 'Mike',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'mike@ex.com',
    password: bcrypt.hashSync('12345', 10),
    blurb: 'Im a code ninja, software wizard, and programming adventurer.',

    aboutMe:
      'Hey there fellow explorers! Im a code ninja, software wizard, and programming adventurer, always on the hunt for my next technological conquest. Fuelled by the power of a good cup of coffee, you can often find me blazing new trails on the hiking trails or running at full speed towards my next challenge. Lets journey forth together and conquer the digital world one line of code at a time!',
  },
  {
    image:
      'https://res.cloudinary.com/dgmandmlc/image/upload/v1682695031/users/jane_bxetkr.png',
    firstName: 'Jane',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'jane@ex.com',
    password: bcrypt.hashSync('12345', 10),
    blurb: 'I love code.',
    aboutMe:
      'Im a code-slinging, program-writing, software-loving adventurer, fueled by the power of coffee and the adrenaline rush of hiking and running through the great outdoors. When Im not deep in lines of code, youll likely find me hitting the trails or pounding the pavement, pushing my limits and exploring all that the world has to offer.',
  },

  {
    image:
      'https://res.cloudinary.com/dgmandmlc/image/upload/v1682695031/users/john_rauppo.jpg',
    firstName: 'John',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'john@ex.com',
    password: bcrypt.hashSync('12345', 10),
    isAdmin: true,
    blurb: 'Im a code-slinging, program-writing, software-loving adventurer',
    aboutMe:
      'Adventurous coder fueled by coffee, powered by code, and inspired by the great outdoors. When Im not debugging and programming, youll find me hiking up mountains and pounding the pavement on my daily runs. With my trusty laptop by my side, Im constantly exploring new software concepts and pushing the limits of whats possible. ',
  },

  {
    image:
      'https://res.cloudinary.com/dgmandmlc/image/upload/v1682694522/users/darren_nalpgw.jpg',
    firstName: 'Darren',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'darren@ex.com',
    password: bcrypt.hashSync('12345', 10),
    blurb: 'Code, sleep, eat, repeat!',
    aboutMe:
      'Im a thrill-seeking individual who finds my escape in coding, programming, and the endless possibilities of software. Fuelled by a passion for the great outdoors, youll often find me hiking through rugged terrain, and blazing through nature trails while running. To keep up with the pace of life, I require a steady stream of caffeine - coffee is like a lifeline to me.',
  },
  //----------------------------------------------------------------
  {
    image:
      'https://res.cloudinary.com/dgmandmlc/image/upload/v1682694483/users/tom_joa88i.jpg',
    firstName: 'Tom',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'tom@ex.com',
    password: bcrypt.hashSync('12345', 10),
    blurb: 'Coding is therapy.',
    aboutMe:
      'Full-time coder, software slinger, and programming problem-solver. Cant start the day without a piping hot cup of coffee and a good tune to get the neurons firing. When Im not crushing code, Im jamming out to eclectic playlists that range from Mozart to Metallica. All hail caffeine and the power of coding!',
  },
  {
    image:
      'https://res.cloudinary.com/dgmandmlc/image/upload/v1682694519/users/anna_ma7ddb.jpg',
    firstName: 'Anna',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'anna@ex.com',
    password: bcrypt.hashSync('12345', 10),
    blurb: 'Coffee and code is all that i need.',
    aboutMe:
      'Code, coffee, and classic tunes are the three things that keep me going. When Im not busy programming, youll find me sipping a freshly brewed cup of java and humming along to my favorite beats. Im a software guru by day and a music fanatic by night – a perfect balance of creativity and logic. Follow me for some tech talk, caffeine buzz, and groovy playlists.',
  },
  {
    image:
      'https://res.cloudinary.com/dgmandmlc/image/upload/v1682694526/users/sarah_zvacjg.jpg',
    firstName: 'Sarah',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'sarah@ex.com',
    password: bcrypt.hashSync('12345', 10),
    blurb: 'Coffee for fuel, coding for my brain, and wanderlust for my soul.',
    aboutMe:
      'Hey, there! Im a code-loving, travel-addicted software programmer who spends a lot of their time hunting down the best eats in town. Im all about exploring the world, tasting new flavors, and writing clean, impeccable code. Follow along as I share my geeky adventures, culinary discoveries, and tech musings. ',
  },
  {
    image:
      'https://res.cloudinary.com/dgmandmlc/image/upload/v1682694521/users/phil_jx1pqu.jpg',
    firstName: 'Phil',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'phiil@ex.com',
    password: bcrypt.hashSync('12345', 10),
    blurb: 'Lofi +  coffee + code',
    aboutMe:
      'Hey there! Im a tech enthusiast, digital nomad, and self-proclaimed foodie. I love exploring new places and trying out different cuisines while tinkering with code and programming languages. Whether its building new software, developing websites, or simply indulging in some delicious eats, Im always up for a challenge. ',
  },

  //----------------------------------------------------------------

  {
    image:
      'https://res.cloudinary.com/dgmandmlc/image/upload/v1682694525/users/raj_tov8va.jpg',
    firstName: 'Raj',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'raj@ex.com',
    password: bcrypt.hashSync('12345', 10),
    blurb: 'Professional bug ',
    aboutMe:
      'Hey there! Im a coding and programming enthusiast who loves to travel and explore new places. When Im not immersed in software development, youll find me on the hunt for delicious food and trying out new recipes in the kitchen. Excited to connect with like-minded folks and share my adventures! ',
  },

  {
    firstName: 'Scott',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'scott@ex.com',
    password: bcrypt.hashSync('12345', 10),
    blurb: 'Code Hunter!',
    aboutMe:
      'Hey yall, Im a coding and programming fanatic with a love for all things software. When Im not geeking out over the latest tech trends, you can find me exploring new destinations and cuisines as a total foodie. Im all about embracing the adventure that life has to offer, both in my career and my personal endeavors. Lets connect and share our passions!',
  },

  {
    image:
      'https://res.cloudinary.com/dgmandmlc/image/upload/v1682694521/users/kim_ik7zyq.jpg',
    firstName: 'Kim',
    lastName: 'Doe',
    createdDate: new Date('3/1/2023'),
    email: 'kim@ex.com',
    password: bcrypt.hashSync('12345', 10),
    blurb: 'Shut up and code!',
    aboutMe:
      'Hi there! Im a lover of all things tech, so youll often find me coding and programming away during my free time. Buuuuut, when Im not buried in lines of code, Im out exploring this beautiful planet we live on. Its a never-ending adventure! And while Im traveling, I make sure to indulge in some of the local cuisine. Im a total foodie and love trying new dishes from around the world. So, lets connect and chat all things software, travel, and food!',
  },

  // {//Redis developer
  //   firstName: 'Tony',
  //   lastName: 'Doe',
  //   email: 'tony@ex.com',
  //   password: bcrypt.hashSync('12345', 10),
  // },
]

module.exports = users
