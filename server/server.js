// require('./config/config')
require('./config/config')

// //standar lib import
var express = require('express')
var bodyParser = require('body-parser') 
var {ObjectID} = require('mongodb')
var app = express()

const _ = require('lodash')

//local modules import
var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todos')
var {User} = require('./models/user')

const port = process.env.PORT;

app.use(bodyParser.json())

app.post('/todos',(req, res)=>{
    var todo = new Todo({text: req.body.text})
    
    todo.save().then(
        (doc)=>{res.send(doc)}, 
        (err)=>{res.status(400).send(err)}
    )
})

app.get('/todos', (req, res) =>{
    //to get back all todos
    Todo.find().then(
        (todos)=>{res.send({todos})},
        (e)=>{res.status(400).send(e)})
})

app.get('/todos/:id', (req, res)=>{
    // res.send(req.params)  //to test
    var id = req.params.id

    if(!ObjectID.isValid(id)){return res.status(404).send()}
    
    //find return a promis(a todo)
    Todo.findById(id)
    .then((todo) =>{
        //cas fail
        if(!todo) {return res.status(404).send() }
        //cas succes: send back an todo obj attached with its properties
        res.send({todo})
      })
    .catch((e)=>{res.status(404).send(e)})
})

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id
    if(!ObjectID.isValid(id)) {return res.status(404).send()}

    Todo.findByIdAndRemove(id).then((todo) => {
        if(todo == null) {res.status(404).send()}
        res.send({todo})
    }).catch((e) => {res.status(404).send(e)})
})

app.patch('/todos/:id', (req, res) => {
    //find id
    var id = req.params.id
    var body = _.pick(req.body, ['text','completed'])  //allow user to update properties
    if(!ObjectID.isValid(id)) {return res.status(404).send()}

    //checking and update body(obj/variable) properties 
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt =  new Date().getTime()  //update by propram
    }else{
        body.completed = false
        body.completedAt = null
        
    }

    //update(set) body in DB 
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => { 
        if(!todo) { return res.status(404).send()}
        res.send({todo})  //send back todo obj's property(variable todo) with ES6 syntax
     }).catch((e) => {res.status(404).send(e)})
})

app.post('/user', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body)
    
    user.save()
    .then((user)=>{res.send(user)})
    .catch((err)=>{res.status(400).send(err)})
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});


module.exports = {app}

//test msg