'use strict';
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to database");
    } 
    console.log("Connected to mongoDB Server");

    
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5914c0d6cf59a137f8cbe917')},
        {
            $set: {
                completed: true
            }
        }, {
            returnOriginal:false
        }
    ).then((result) => {
        console.log(result);
    });

    db.collection("Users").findOneAndUpdate({
        _id: new ObjectID("5914c98c77faef9f0ff84f29")
    },
    {   
        $set :{
            name: "Was Hossam Hosny"
        }, $inc: {
            age: 2
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });
    
    db.close();
});