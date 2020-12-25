const blogsRouter = require('express').Router()
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')


blogsRouter.get('/', async (req, res, next) => {
  const blogs = await Blog.find({}).populate('user')
   res.json(blogs)
   
})


blogsRouter.post('/',  async (req, res, next) => {
    const user = await User.findById(req.body.user)
    const token = res.locals.token
    const decodedToken = jwt.verify(token, config.SECRET)

    if (!token || !decodedToken){
      res.status(401),json({err : "token missing or invalid"})
    }

    const blog = new Blog({
      title : req.body.title,
      author : req.body.author,
      user : user._id,
      url : req.body.url
    })

    const savedBlog  = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    return res.status(201).json(savedBlog)
  })


blogsRouter.put('/:id', async(req,res,next) => {

  const body = req.body
  const blog = {
    title : body.title,
    author : body.author,
    url : body.url,
    likes : body.likes
    }
  console.log(blog)
  const updatedBlog = await Blog.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.params.id)}, blog , {new:true, runValidators:true})
  return res.json(updatedBlog)

})


blogsRouter.delete('/:id', async(req,res,next) => {
    const token = res.locals.token
    const decodedToken = jwt.verify(token, config.SECRET)

    const blogToDelete = await Blog.findById(req.params.id).populate('user')

    if(!token || !decodedToken){
      res.status(401).json({err: "token missing or invalid"})
    }else if (blogToDelete.user._id.toString() !== decodedToken.id ){
      res.status(401).json({err: "unauthorized user"})
    }else{
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
    }

    next()

})



module.exports = blogsRouter