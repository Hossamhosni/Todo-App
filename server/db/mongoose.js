'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://Hossamhosni:godfather1@3@ds139801.mlab.com:39801/todo-app' || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};
