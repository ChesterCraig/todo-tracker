//Main code for a node.js based todo list application.
const mongoose = require("mongoose");

//connect to mongodb database (mongoose is maintaining this connection)
mongoose.Promise = global.Promise; //set mongoose to use standard js promises
mongoose.connect("mongodb://" + "admin" + ":" + "123" +"@ds143559.mlab.com:43559/todo-tracker");

//export our databse connection object
module.exports = {mongoose};