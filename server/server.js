'use strict';
// third party imports
var express = require('express');
var bodyParser = require('body-parser');

// local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// setting app and the port settings
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());

// Post route for adding todos to the database
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET route for getting the todos from the database
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// listen to the port
app.listen(app.get('port'), () => {
    console.log("Started on port 3000");
});

module.exports = {app};
