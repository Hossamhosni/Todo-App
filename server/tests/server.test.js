'use strict';

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        }).end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

    it('Should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({
            text: ""
        })
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((err) => {
                done(err);
            });
        });

    });
});

describe("GET /todos", () => {
    it("Should get all todos", (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe("GET /todos/:id", () => {
  it("Should return a doc", (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it("Should return a 404 if todo not found", (done) => {
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it("Should return a 404 if a wrong id is sent", (done) => {
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  });
});
describe("DELETE /todos/:id", () => {
  it("Should delete an item from the database", (done) => {
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.doc.text).toBe(todos[0].text);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
        Todo.findById(todos[0]._id.toHexString()).then((todo) => {
          expect(todo).toNotExist();
          done();
        });
    });
  });

  it("Should return a 404 if a todo id is not found", (done) => {
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it("Should return a 404 if a todo id is invalid",(done) => {
    request(app)
    .delete('/todos/123')
    .expect(404)
    .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("Should update the todo", (done) => {
    var id = todos[0]._id.toHexString();
    request(app)
    .patch(`/todos/${id}`)
    .send({
      "text":"Walk the talk",
      "completed":true
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe("Walk the talk")
      expect(res.body.todo.completedAt).toBeA('number');
    }).end(done);
  });

  it("Should clear completedAt when todo is not completed", (done) => {
    var id = todos[1]._id.toHexString();
    request(app)
    .patch(`/todos/${id}`)
    .send({
      "text": "hell the mell",
      "completed": false
    }).
    expect(200)
    .expect((res) => {
      expect(res.body.todo.completedAt).toNotExist();
      expect(res.body.todo.completed).toBe(false);
    })
    .end(done);
  });

});

describe('GET /users/me', () => {
  it('Should return user if authenicated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).end(done);
  });

  it('Should return a 401 if not authenicated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toMatch({});
    }).end(done);
  });
});

describe('POST /users', () => {
  it('Should create a user', (done) => {
    var email = 'hossam@example4.com';
    var password = '1232333';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    }).end((err) => {
      if (err) {
        return done(err);
      } else {
        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      }
    });
  });

  it('Should return validation error if request invalid' , (done) => {
    var email = "notanemail";
    var password = "123";
    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('Should not create user if email is in use', (done) => {
    var email = users[0].email;
    var password = "12321312";
    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', () => {
  it('Should login users and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[1].email, password: users[1].password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
    }).end((err, res) => {
      if (err) return done(err);
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => {
        done(e);
      });
    });
  });

  it('Should return invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[1].email, password: "123"})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err, res) => {
      if (err) return done(err);
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
});
