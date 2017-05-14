'use strict';
// imports
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

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

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
       return res.status(404).send();
    } else {
        Todo.findById(id).then((todo) => {
            if (!todo) {
                res.status(404).send();
            } else {
                res.send({todo})
            }
        }, (e) => {
            res.status(404).send();
        });
    }
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
     return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((doc) => {
    if (!doc) {
      return res.status(404).send();
    }
    res.status(200).send({doc});
  }, (e) => {
    res.status(400).send();
  });
});

// listen to the port
app.listen(app.get('port'), () => {
    console.log(`Started on port ${app.get('port')}`);
});

module.exports = {app};
