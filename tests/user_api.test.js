const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')
const bcrpyt = require('bcrypt')

const api = supertest(app)


const initialUsers = [
    {
        username: 'dmain',
        passwordHash: 'sekret'
    }
]



describe('user post validation', () => {

    beforeAll( async() => {
        User.deleteMany({})
        promiseArray1 = initialUsers.map(async (user) => {
            user.passwordHash = await bcrpyt.hash(user.passwordHash, 10)
        })
        await Promise.all(promiseArray1)

        userObjs = initialUsers.map(user => new User(user))
        promiseArray2 = userObjs.map(user => user.save())
        await Promise.all(promiseArray2)

    })

    test('username < 3 chars', async() => {
        
        const user = {
            username :'s',
            password : 'sffsf'
        }

        await api
            .post('/api/users/', user)
            .expect(400)
    })

    test('username not unique', async() => {
        const user = {
            username :'Dayo',
            password: 'sfsf'
        }

        await api
            .post('/api/users/', user)
            .expect(400)
    })

    test('password non-existent', async() => {
        const user = {
            username : 'the way'
        }

        await api
              .post('/api/users/', user)
              .expect(400)
    })

})