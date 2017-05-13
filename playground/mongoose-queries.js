const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

var id = "5915201ba061c729b8ecb462";

if (!ObjectID.isValid(id)) {
    console.log("ID is not valid");
} else {
    User.findById(id).then((user) => {
        if (!user) {
            return console.log("User not found");
        }
        console.log(user);
    });
}
