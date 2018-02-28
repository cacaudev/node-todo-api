const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo}     = require('./models/todo');
const {User}     = require('./models/user');

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
  }).catch((error) => {
    res.sendStatus(400); // 400 - Bad request
  });
});

// Fetch all Todo documents in the collection
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }).catch((err) => {
    res.sendStatus(400);
  });
});

// Get a Todo by ID
app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id))
    return res.sendStatus(404);

  Todo.findById(id).then((todo) => {
    if (!todo) 
      return res.sendStatus(404);

    return res.send({todo});
  }).catch((err) => {
    return res.sendStatus(400);
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Export to test file
module.exports = {app}