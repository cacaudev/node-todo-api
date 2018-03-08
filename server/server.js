console.log('Starting server.js');
require('./config/config');

const _          = require('lodash');
const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();
const {ObjectID} = require('mongodb');
const bcrypt     = require('bcryptjs');

const {mongoose}     = require('./db/mongoose');
const {Todo}         = require('./models/todo');
const {User}         = require('./models/user');
const {authenticate} = require('./../middleware/authenticate');

const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// Routes

// Create Todo Document
app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc); // 200 - OK
  }).catch((error) => res.status(400).send(error)); // 400 - Bad request
});

// Fetch all Todo documents in the collection
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }).catch((error) => res.status(400).send(error));
});

// Get a Todo by ID
app.get('/todos/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id))
    return res.sendStatus(404);

  Todo.findById(id).then((todo) => {
    if (!todo) return res.sendStatus(404);
    res.send({todo});
  }).catch((error) => res.status(400).send(error));
});

app.delete('/todos/:id', (req, res) => {
  let idToDelete = req.params.id;
  if (!ObjectID.isValid(idToDelete)) return res.sendStatus(404);

  Todo.findByIdAndRemove(idToDelete).then((todo) => {
    if (!todo) return res.sendStatus(404);
    res.send({todo});
  }).catch((error) => res.status(400).send(error));
});

app.patch('/todos/:id', (req, res) =>{
  let id = req.params.id;
  // Choose the propertys that the user can really change
  let body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) return res.sendStatus(404);  
  // if the completed value is boolean type and is true
  if (_.isBoolean(body.completed) && body.completed) {
    // update the time when the todo was completed 
    body.completedAt = new Date().getTime();
  }
  else {
    // else go back to default values
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) return res.sendStatus(404);    
    res.send({todo});
  }).catch((error) => res.status(400).send(error));
});

// Create User Document
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((error) => res.status(400).send(error)); // 400 - Bad request
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
   }).catch((err) => {
    res.status(400).send(err);
  });  
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Export to test file
module.exports = {app}