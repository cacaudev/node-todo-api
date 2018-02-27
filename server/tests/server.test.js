const expect  = require('expect');
const request = require('supertest');

const {app}  = require('../server');
const {Todo} = require('../models/todo');

// Array of todos for testing
const todos = [
  { text: "First something to do"},
  { text: "Second something to do"}
];

// Before every single test remove all documents from the collection todo
// then add only the array of todos above
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    let text = 'Test todo text mocha';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) return done(err);

        // Expect to find the document with the exact text above
        Todo.find({text}).then((todos) => {   
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));        
      });
  });

  it('Should not create todo with invalid body data', (done) => {    
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        // Fetch all documents in the todo collection - only 2 - array above
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('Should fetch all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});