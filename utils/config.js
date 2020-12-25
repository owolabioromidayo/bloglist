require('dotenv').config()

const PORT = process.env.PORT || 3003
let MONGO_URI = process.env.MONGO_URI

if (process.env.NODE_ENV === 'test'){
    MONGO_URI = process.env.TEST_MONGO_URI
}

const SECRET = process.env.SECRET

module.exports  = {PORT, MONGO_URI, SECRET}