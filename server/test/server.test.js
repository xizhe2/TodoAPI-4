const expect = require('expect')
const request = require('supertest')

const {ObjectID} = require('mongodb')
const {app} = require('./../server')
const {Todo} = require('./../models/todos')

//add an array of todos for test propose only
const todos = [
    {_id: new ObjectID, text: 'todo 1'},
    {_id: new ObjectID, text: 'todo text 2', completed: false, completedAt: 333}
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
        .expect((res)=>{expect(res.body.todo.text).toBe(todos[0].text)}) //res body has a todo property that has text property
        .end(done)
    })

    it('should return status 404 if todo not found', (done)=>{
        var hexId = new ObjectID().toHexString
        request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done)
    })

    it('should return status 404 if todo not valide', (done)=>{
        request(app)
        .get("/todos/123abc")
        .expect(404)
        .end(done)
    })
})

describe('DELETE/todos/:id', () => {
    it('should delete a todo', (done) =>{
        var hexId = todos[1]._id.toHexString()
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {expect(res.body.todo._id).toBe(hexId)})
        .end((err, res) => {
            if(err) { return done(err)}
            
            Todo.findById(hexId).then((todo) =>{
                expect(todo).toNotExist()
                done()
            }).catch((e) => done())
        })
    })

    it('should send back 404 if id not found', (done) =>{
        var hexId = new ObjectID().toHexString
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done)
    })

    it('should send back 404 if id not valide', (done) =>{
        request(app)
        .delete("/todos/123abc")
        .expect(404)
        .end(done)
    })
    
})

describe('UPDATE/todos/:id', () =>{
    it('should update todo with completed', (done) =>{
        var hexId = todos[0]._id.toHexString()
        var text = 'update first todo from todos array'
        request(app)
        .patch(`/todos/${hexId}`)
        .send({text, completed: true})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId)
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(true)
            expect(res.body.todo.completedAt).toBeA('number')
        })
        .end(done)
    })

    it('should update todo with non-completed', (done) =>{
        var hexId = todos[1]._id.toHexString()
        var text = 'update 2nd todo from todos array'
        request(app)
        .patch(`/todos/${hexId}`)
        .send({text, completed: false})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId)
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toNotExist()
        })
        .end(done)
    })

    it('should send back 404 if id not found', (done) =>{
        var hexId = new ObjectID().toHexString
        request(app)
        .patch(`/todos/${hexId}`)
        .expect(404)
        .end(done)
    })

    it('should send back 404 if id not valide', (done) =>{
        request(app)
        .patch("/todos/123abc")
        .expect(404)
        .end(done)
    })

})