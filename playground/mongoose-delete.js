const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');
const {User}     = require('./../server/models/user');

// Remove all documents from collection
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Other Methods
// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findOneAndRemove({
  _id: "5a98486bb9f94b6021f8cb45"
}).then((todo) => {
  console.log('Todo', todo);
});

// Todo.findByIdAndRemove('5a97395abbebf3ac1addf990').then((todo) => {
//   console.log(todo);
// });