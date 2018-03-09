const express    = require('express');
const router     = express.Router();
const {ObjectID} = require('mongodb');
const _          = require('lodash');
const bodyParser = require('body-parser');

const {Todo}     = require('./../models/todo');
const {mongoose} = require('./../db/mongoose');

// Create Todo Document
router.post('/', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc); // 200 - OK
  }).catch((error) => res.status(400).send(error)); // 400 - Bad request
});

// Fetch all Todo documents in the collection
router.get('/', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }).catch((error) => res.status(400).send(error));
});

// Get a Todo by ID
router.get('/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id))
    return res.sendStatus(404);

  Todo.findById(id).then((todo) => {
    if (!todo) return res.sendStatus(404);
    res.send({todo});
  }).catch((error) => res.status(400).send(error));
});

router.delete('/:id', (req, res) => {
  let idToDelete = req.params.id;
  if (!ObjectID.isValid(idToDelete)) return res.sendStatus(404);

  Todo.findByIdAndRemove(idToDelete).then((todo) => {
    if (!todo) return res.sendStatus(404);
    res.send({todo});
  }).catch((error) => res.status(400).send(error));
});

router.patch('/:id', (req, res) =>{
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

module.exports = router;