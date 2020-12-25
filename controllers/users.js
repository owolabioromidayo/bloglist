const mongoose = require('mongoose')
const userRouter = require('express').Router()
const User = require('../models/user')
const bcrpyt = require('bcrypt')


userRouter.get('/', async(req,res, next) => {
    const users = await User.find({}).populate('blogs')
    res.json(users)
})

userRouter.post('/', async(req,res, next) => {
    const body = req.body

    const saltRounds = 10
    const passwordHash = await bcrpyt.hash(body.password, saltRounds)

    const user = new User({
        name : body.name,
        username: body.username,
        passwordHash 
    })

    const savedUser = await user.save()
    res.json(savedUser)
})




module.exports = userRouter