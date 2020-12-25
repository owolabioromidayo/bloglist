const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    name : String,
    username : {type: String, required:true, minlength:3 , unique:true},
    passwordHash : {type:String, required:true, minlength:3},
    blogs : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Blog'
        }
    ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()

        delete returnedObj._id
        delete returnedObj.passwordHash
        delete returnedObj.__v

    }
})

const User = mongoose.model('User', userSchema)

module.exports = User