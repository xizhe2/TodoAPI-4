var {User} = require('./../models/user')

//middleware function to make route private; actual rout will not run until next is called inside the middleware
var authenticate = (req, res, next) => {
    var token = req.header('x-auth')

    User.findByToken(token).then((user) => {
        if(!user){
            // res.status(401).send()}
            //this technic will stop execution next line if sth wrong
            return Promise.reject() 
        }

        //modify the req obj instead of send bk the user
        req.user = user
        req.token = token
        next()
    }).catch((e) => {res.status(401).send()})
}

module.exports = {authenticate}