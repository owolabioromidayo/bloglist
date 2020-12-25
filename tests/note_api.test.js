const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)
const initialBlogs = [
    {
        title: "The Way",
        author: "Mark Strnik"
    },
    {
        title: "The Only Way",
        author: "Only Mark Strnik"
    }
]

const user = {
    username : "sjdks",
    password: "dmains"
}
const getUser = async() => {
    await api.post('/api/users', user)
    const userAndToken = await api.post('/login', user)
    return userAndToken
}

const userAndToken =  getUser()
console.log(userAndToken);

beforeEach(async () => {
    await Blog.deleteMany({})
    const promiseArray = initialBlogs.map(async (blog) => await api.post('/api/blogs', blog).set('Authorization', 'Bearer '+userAndToken.token))
    await Promise.all(promiseArray)
})

test('api returns correct amount', async() => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('_id is transformed to id', async() => {
    const res = await api.get('/api/blogs')
    res.body.forEach(i => expect(i.id).toBeDefined()) 

})

test('post request increments total number', async() => {
    const newObj = {
        title : "The only real path",
        author : "Matt Sivilankis"
    }

    await api
        .post('/api/blogs', newObj)
        .set('Authorization', 'Bearer '+ userAndToken.token)

    const newObjs = await Blog.find({})
    expect(initialBlogs.length + 1).toEqual(newObjs.length)
})


test('likes defaults to 0 if missing', async() => {
    const newObj = {
        title : "this is the path",
        author : "The one and only"
    }

    const savedObj = await api
        .post('/api/blogs', newObj)
        .set('Authorization', 'Bearer '+ userAndToken.token)
    expect(savedObj.body.likes).toEqual(0)
})

test('require title and author', async() => {
    const newObj = {
        title: "",
        author : ""
    }

      await api
     .post('/api/blogs', newObj)
     .set('Authorization', 'Bearer '+ userAndToken.token)
     .expect(400)

})


afterAll(()=> {mongoose.connection.close()})