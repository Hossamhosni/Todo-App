'use strict';
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to database");
    } 
    console.log("Connected to mongoDB Server");

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log("Unable to fetch todos");
    // });
    // db.close();

    db.collection("Users").find({name: "Hossam Hosny"}).count((err, count) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Users with the name Hossam: ${count}`);
    });
    db.close();
});