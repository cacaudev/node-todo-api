console.log('Starting server');

require('./config/config');

const _          = require('lodash');
const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();
const {ObjectID} = require('mongodb');
const bcrypt     = require('bcryptjs');
const router     = express.Router();

const {mongoose}     = require('./db/mongoose');
const {Todo}         = require('./models/todo');
const {User}         = require('./models/user');

// Routes
const todos = require('./routes/todos');
const users = require('./routes/users');

const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use('/todos', todos);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Export to test file
module.exports = {app}