'use strict';
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to database");
    } 
    console.log("Connected to mongoDB Server");

    // db.collection('Todos').deleteMany({text: "Eat Launch"}).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log(err);
    // });

    // db.collection('Todos').deleteOne({text: "Eat Launch"}).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log(err);
    // });

    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({_id :new ObjectID("5913ae2a852a694c2831a33d")}).then((result) => {
        console.log(result);
    });

    db.collection('Users').deleteMany({name: "Hossam Hosny"}).then((result) => {
        console.log(result);
    });

    db.close();
});