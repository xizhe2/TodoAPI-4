const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash') 
const bcrypt = require('bcryptjs')

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
    tokens: [{
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
    user.tokens.push({access, token})
    return user.save().then(() => {return token}) // chain promises's return value = return it's return value

}

//****************************to add model method to UserSchema*************************
UserSchema.statics.findByToken = function (token) {
    var User = this
    var decode  //undefine variable for try/catch of verify()
    try{
        decode = jwt.verify(token, 'secret123') 
    } catch(e){
        return Promise.reject() //reject value will be in server.js caller catch
    }

    //if decode succes, we will find the user associated with its properties matches
    //return keyword means we can add a then call on server.js to findByToken
    return User.findOne({
        '_id': decode._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

//****************************to add mongoose middleware to UserSchema*************************
//to make sure the inside the function(hash password) run before <event> save, then call next to finish the middleware task
UserSchema.pre('save', function (next) {
    var user = this
    //only hash pw when user is changed
    if(user.isModified()){
        bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(user.password, salt, (err, hash) => {
            //update pw
            user.password = hash
            next()
        })
    })
    }else{
        next()
    }


})



var User = mongoose.model('User', UserSchema)  //to attache methods to User obj

module.exports = {User}