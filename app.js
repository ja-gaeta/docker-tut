const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const redis = require('redis')

let RedisStore = require('connect-redis')(session)

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require('./config/config')

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
})

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log('successfully connected to DB'))
    .catch((err) => {
      console.log(err)
      setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry()

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    },
    resave: false,
    saveUninitialized: false,
  })
)

app.use(express.json())

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)

app.get('/', (req, res) => {
  res.send('<h2>Olá mundão velho</h2>')
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))
