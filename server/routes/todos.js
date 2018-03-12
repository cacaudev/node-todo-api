const express    = require('express');
const router     = express.Router();
const {ObjectID} = require('mongodb');
const _          = require('lodash');
const bodyParser = require('body-parser');

const {Todo}         = require('./../models/todo');
const {mongoose}     = require('./../db/mongoose');
const {authenticate} = require('./../middleware/authenticate');

// Create Todo Document
router.post('/', authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc); // 200 - OK
  }).catch((error) => res.status(400).send(error)); // 400 - Bad request
});

// Fetch all Todo documents in the collection
router.get('/', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({todos});
  }).catch((error) => res.status(400).send(error));
});

// Get a Todo by ID
router.get('/:id', authenticate, (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id))
    return res.sendStatus(404);

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) return res.sendStatus(404);
    res.send({todo});
  }).catch((error) => res.status(400).send(error));
});

router.delete('/:id', authenticate, (req, res) => {
  let idToDelete = req.params.id;
  if (!ObjectID.isValid(idToDelete)) return res.sendStatus(404);

  Todo.findOneAndRemove({
    _id: idToDelete,
    _creator: req.user._id
    }).then((todo) => {
    if (!todo) return res.sendStatus(404);
    res.send({todo});
  }).catch((error) => res.status(400).send(error));
});

router.patch('/:id', authenticate, (req, res) =>{
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

  Todo.findOneAndUpdate(
    {_id: id, _creator: req.user._id},
    {$set: body}, 
    {new: true}  
  ).then((todo) => {
    if (!todo) return res.sendStatus(404);    
    res.send({todo});
  }).catch((error) => res.status(400).send(error));
});

module.exports = router;