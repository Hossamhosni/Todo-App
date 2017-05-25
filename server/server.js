'use strict';

//config
var env = process.env.NODE_ENV || 'development';
if (env === "development") {
  process.env.PORT = 3000;
  process.env.MONGOLAB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === "test") {
  process.env.PORT = 3000;
  process.env.MONGOLAB_URI = "mongodb://localhost:27017/TodoAppTest";
}
// imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const {ObjectID} = require('mongodb');

// local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

// setting app and the port settings
var app = express();
app.set('port', process.env.PORT);
app.use(bodyParser.json());

// Post route for adding todos to the database
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET route for getting the todos from the database
app.get('/todos', authenticate,  (req, res) => {
    Todo.find({
      _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
       return res.status(404).send();
    } else {
        Todo.findOne({
          _id: id,
          _creator: req.user._id
        }).then((todo) => {
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

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
     return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((doc) => {
    if (!doc) {
      return res.status(404).send();
    }
    res.status(200).send({doc});
  }, (e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
     return res.status(404).send();
  }
  if (_.isBoolean(body.completed) && (body.completed)) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e) => {
    return res.status(404).send();
  });
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then((user) => {
      return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  });
});

// listen to the port
app.listen(app.get('port'), () => {
    console.log(`Started on port ${app.get('port')}`);
});

module.exports = {app};
