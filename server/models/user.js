const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash') 

var UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        require: true, 
        minlength:7, 
        trim: true, 
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not valid email`
        }
    }, 
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    token: [{
        access: {type: String, require: true},
        token: {type: String, require: true}
    }]
})

//****************************to add instance method to UserSchema*************************
UserSchema.methods.toJSON = function () {
    var user = this
    //take moongoose user obj to convert to regular obj with properties only availabe 
    var userObject = user.toObject()  
    return _.pick(userObject, ['_id', 'email'])  //password and token will never show to user
}

UserSchema.methods.generateAuthToken = function () {
    //to assigne the method individual user
    var user = this  

    //def token's properties in order to access them and verify later
    var access = 'auth'
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'secret123').toString()

    //add token to user's token array and save it DB and return a token value
    user.token.push({access, token})
    return user.save().then(() => {return token}) // return chain promises = return it's return value

}
var User = mongoose.model('User', UserSchema)  //to attache methods to User obj


module.exports = {User}