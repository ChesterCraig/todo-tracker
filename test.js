//for random testing

const {SHA256} = require("crypto-js");


var message = "testingThis123123";
var hash = SHA256(message).toString();

console.log(hash);