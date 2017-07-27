var mongoose = require('mongoose')

//create object model
var Todo = mongoose.model('Todo', {
    text: {type: String, required: true, minlength: 1, trim: true},
    completed: {type: Boolean, default: false},
    completedAt: {type: Number, default: false}
})


// // //instancie a obj
// var newTodo = new Todo({text: ' lunch soon    '})

// //save newTodo to DB
// newTodo.save().then(
//     (doc)=>{console.log(JSON.stringify(doc, undefined, 2))},
//     (err)=>{console.log('Unable to save to DB', err)
// })

//exports object
module.exports = {Todo}