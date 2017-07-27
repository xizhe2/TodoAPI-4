const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')
const {app} = require('./../server')
const {Todo} = require('./../models/todos')

//add an array of todos for test propose only
const todos = [
    {_id: new ObjectID, text: 'todo 1'},
    {_id: new ObjectID, text: 'todo text 2'}
]

//test life cycle
beforeEach((done) => {
  Todo.remove({})
  .then(()=>{ return Todo.insertMany(todos)})
  .then(() => done());
});

describe('POST/todos', ()=>{
    it('should create a new todo', (done) => {
        //post obj
        var text = 'test post todo text property'
        //supertest suite
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{expect(res.body.text).toBe(text);}) //custom assertion: expect a respon object and access to its property
        .end((err, res) => {
            //test DB suit with assertion
            if (err) return done(err)  //if have err and stop the execution
            
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1)
                expect(todos[0].text).toBe(text)
                done()   // done to wrab up the test suit
            }).catch((e) => done(e))  //to catch all kind of errors
        })
    }) 

    it('should not create an invalide todo', (done)=>{
         request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res)=>{
            if(err) {return done(err)}            
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2)
                done()
            }).catch((e) => done(e))            
        })
    })            
})

describe('GET/todos/:id', ()=>{
    it('should return a todo', (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text)  //res body has a todo property that has text property
        })
        .end(done)
    })

    it('should return status 404', (done)=>{
        request(app)
        .get('/todos/id')
        .expect(404)
        .end(done)
    })



})