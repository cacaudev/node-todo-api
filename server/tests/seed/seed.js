const jwt        = require('jsonwebtoken');

const {ObjectID} = require('mongodb');
const {Todo}     = require('./../../models/todo');
const {User}     = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'andrew@example.br',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
},{
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass'
}];

// Array of todos for testing
const todos = [
  { 
    _id: new ObjectID(),
    text: "First something to do"
  },
  { 
    _id: new ObjectID(),
    text: "Second something to do",
    completed: true,
    completedAt: 333
  }
];

// Before every single test remove all documents from the collection todo
// then add only the array of todos above
const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    //this callback it's not going to get fired until 
    // all of those promises resolve - aka these users get
    // sucessfully saved
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};