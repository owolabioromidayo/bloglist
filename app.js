const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const User = require('./models/user')
const Blog = require('./models/blog')



mongoose
    .connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.log('error connecting to MongoDB: ', err.message))

const resetDBs = async() => {
    await User.deleteMany({})
    await Blog.deleteMany({})
}

// resetDBs()
// process.exit()
    
const app = express()
app.use(express.json())
app.use(cors())


app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/login', loginRouter)

app.use(middleware.errorHandler)

module.exports = app