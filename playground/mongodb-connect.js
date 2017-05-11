'use strict';
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to database");
    } 
    console.log("Connected to mongoDB Server");

    // db.collection('Todos').insertOne({
    //     text: 'Something to do', 
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log("Failed to insert Todo", err);
    //     } 
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: 'Hossam Hosny', 
        age: 21,
        location: "Cairo"
    }, (err, result) => {
        if (err) {
            return console.log("Failed to insert User", err);
        } 
        console.log(result.ops[0]._id.getTimestamp());
    });

    db.close();
});