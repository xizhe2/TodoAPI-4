var mongoose = require('mongoose')

var User = mongoose.model('User', {
    email: {type: String, require: true, minlength:7, trim: true},
    name: {type: String, require: true, minlength: 1, trim: true},
    age: {type: Number}
})

// var newUser = new User({name: 'xiao xia'})
// newUser.save().then(
//     (doc)=>{console.log(JSON.stringify(doc, undefined, 2))}, 
//     (err)=>{console.log('Unable to save newUser')}
// )

module.exports = {User}