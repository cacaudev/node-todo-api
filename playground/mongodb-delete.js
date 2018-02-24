const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) 
    console.log('Unable to connect to database');
  
  console.log('Connected to MongoDB Database server');
  const db = client.db('TodoApp');

  // deletedMany
  // db.collection('Users').deleteMany({ name: 'Vava' }).then((result) => {
  //   console.log(`Documents deleted: ${result.deletedCount}`);
  // }, (err) => {
  //   console.log('Unable to delete documents', err);
  // });

  // deletedOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(`Documents deleted: ${result.deletedCount}`);
  // }, (err) => {
  //   console.log('Unable to delete documents', err);
  // });

  // findOneAndDelete
  db.collection('Users').findOneAndDelete({ 
    _id: new ObjectID('5a8f50d9751f024fcc4a3fa2')
  }).then((result) => {
    console.log(`Documents deleted:`);
    console.log(JSON.stringify(result.value, undefined, 2));
  }, (err) => {
    console.log('Unable to delete documents', err);
  });

  client.close();
});