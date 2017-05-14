const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');
const {Todo} = require('./../server/models/todo');
const {ObjectID} = require('mongodb');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

Todo.findByIdAndRemove("59176e797cfbb30f90d87e10").then((result) => {
  console.log(result);
});
