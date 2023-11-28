<h1 align="center">caching-app</h1>

## Description

In this demo, we explore caching on the backend using redis. Here we use existing backend code from medium-clone app.
<br>

The primary goal here was to practice caching, will eventually implement caching strategies in our existing apps (medium-clone). The result is saved via screenshots in TEST folder.

## How to run locally

1.  Install redis on local machine

2.  Create DB in MongoDB Atlas with following tables:
    ->users, stories

3.  Create .env file in root folder containing following:

        MONGO_URI = (your mongodb connection string)

        JWT_KEY = (some string)

        CLOUDINARY_CLOUD_NAME = (your cloudinary cred)

        CLOUDINARY_API_KEY= (your cloudinary cred)

        CLOUDINARY_SECRET_KEY= (your cloudinary cred)

        PORT = 5001

        NODE_ENV= 'development'

        REDIS_HOST = localhost
        REDIS_CACHE_TIMEOUT = 86400
        LOG_DIR = logs

4.  Install dependencies.

    > 'npm i' //in api folder

5.  Seed DB with following command in root directory:

    > 'npm run data:import'
    > &nbsp;

6.  Start redis server
      >on Mac, you can simply double click the executable 'redis-server' file in your redis folder

7.  START our application!(runs both client and server concurrently)

    > 'npm run dev' //in root folder

8. Hit some endpoint and then observe the time it took. Then hit the same endpoint and notice time drastically reduce since we are using the cache second time. 