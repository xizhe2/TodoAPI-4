var mongoose = require('mongoose');

//set up mongoose to use promise and to connect mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);  //mongodb env variable

module.exports = {mongoose};  //exports the object mongoose