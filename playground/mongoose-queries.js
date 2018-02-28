const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');
const {User}     = require('./../server/models/user');

let id = '5a95aed8111dd3884d6aaa36';
let userId = '5a9445398a8bfe084547f765';

if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

// Todo.find({ _id: id }).then((todos) => {
//   console.log('Todos', todos);
// });

// Todo.findOne({ _id: id }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID', todo);
// });

User.findById(userId).then((user) =>{
  if (!user) return console.log('User ID not found');
  console.log(JSON.stringify(user, undefined, 2));
}).catch((err) => console.log('Invalid ID', err));