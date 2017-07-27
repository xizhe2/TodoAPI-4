/*they are all objects, so we can use object destructor to pull out their attributs/variables 
 *instead of require module directly
 ***************** this file contient only the APIs request********************
*/
// //standar lib import
var express = require('express')
var bodyParser = require('body-parser') 
var {ObjectID} = require('mongodb')
var app = express()

//local modules import
var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todos')
var {User} = require('./models/user')

const port = process.env.PORT || 3000


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

    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }
    
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

// test pub key

app.listen(port, 
    ()=>{console.log(`Port ${port} is listening...`)}
)

module.exports = {app}