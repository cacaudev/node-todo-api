const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) 
    console.log('Unable to connect to database');
  
  console.log('Connected to MongoDB Database server');
  const db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate({
  //   text: 'Do something'  // filter (find document with that property)
  // }, {
  //   $set: {
  //     completed: false  // what will update
  //   }    
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log('Documents updated: ', result.ok);
  //   console.log(result);
  // }, (err) => {
  //   console.log('Unable to update document', err);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a91691c927eff9a0bdda2d3')
  }, {
    $set: { name : 'Vanessa' }, // update the field
    $inc: { age: 2 }            // increment value + 2 and update
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log('Documents updated: ', result.ok);
    console.log(result);
  }, (err) => {
    console.log('Unable to update document', err);
  });


  
  client.close();
});