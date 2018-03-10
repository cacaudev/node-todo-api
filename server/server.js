console.log('Starting server');

require('./config/config');

const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();

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