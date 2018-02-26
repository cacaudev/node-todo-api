const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

let Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

let User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

// let newTodo = new Todo({
//   text: 'Cook dinner'
// });

// newTodo.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (error) => {
//   console.log('Unable to save todo', error);
// });

// let otherTodo = new Todo({
//   text: '     Eat lunch       '
// });

// otherTodo.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (error) => {
//   console.log('Unable to save todo', error);
// });

let newUser = new User({
  email: ' cacau@test.br'
});

newUser.save().then((doc) => {
  console.log('User saved:');
  console.log(JSON.stringify(doc, undefined, 2));
}, (error) => {
  console.log('Unable to save user', error);
});
