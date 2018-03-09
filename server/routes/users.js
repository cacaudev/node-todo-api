const express    = require('express');
const router     = express.Router();
const {ObjectID} = require('mongodb');
const _          = require('lodash');
const bodyParser = require('body-parser');

const {User}         = require('./../models/user');
const {mongoose}     = require('./../db/mongoose');
const {authenticate} = require('./../middleware/authenticate');


// Create User Document
router.post('/', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((error) => res.status(400).send(error)); // 400 - Bad request
});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.post('/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
   }).catch((err) => {
    res.status(400).send(err);
  });  
});

module.exports = router;