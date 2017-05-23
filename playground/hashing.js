'use strict';
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = "goodfellas";

// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		console.log(hash);
// 	});
// });

var hashedPassword ="$2a$10$.S66cWxzfmhK.MDzK3hzIeadj09vgK5/ySrQTS2qubMEMhez/pLbW";
bcrypt.compare(password, hashedPassword, (err, result) => {
	console.log(result);
});
