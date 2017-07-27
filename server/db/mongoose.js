var mongoose = require('mongoose');

//set up mongoose to use promise and to connect mongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};  //exports the object mongoose