const expect  = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app}  = require('../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    let hexId = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('Should return 404 if not found', (done) => {
    let newId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${newId}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('Should delete a todo doc', (done) => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[1].text)
      })
      .end((err, res) => {
        if (err)
          return done(err);

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('Should return 404 if todo not found', (done) => {
    let newId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${newId}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
    .delete(`/todos/123abc`)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {  
  it('Should update the todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let newText = "Updated the text";

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text: newText, completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(newText);   
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');   
      })
      .end(done);
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let newText = "Updated the text!!";

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text: newText, completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(newText); 
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();  
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('Should create a user', (done) => {
    let email = 'example@example.com';
    let password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) return done(err);

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          // if fail the password was not hashed
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('Should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'andrew.br',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('Should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: '123abc'
      })
      .expect(400)
      .end(done);
  });
});