var mongoose = require('mongoose')
var validator = require('validator')

var User = mongoose.model('User', {
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


module.exports = {User}