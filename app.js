//Main code for a node.js based todo list application.
const fs = require("fs")
const bodyParser = require("body-parser");
const express = require("express");
var app = express();

//Local imports
const {mongoose} = require("./db/mongoose");  //destructuring
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

//Define port
const port = process.env.PORT || 3000;

//express middleware - log all requests to a log file
app.use((req,res,next) => {
    var msg = `${new Date().toString()}: ${req.method} ${req.url}`;
    console.log(msg);
    fs.appendFile("server.log", msg + '\n', (error) => {
       if (error) {
            console.log("Failed to log activity to server.log : " + error);
       }
    })
    next();
});

//body parser middleware
app.use(bodyParser.json());

//HTTP Methods:
//C create - POST
//R read - GET
//U update - UPDATE
//D delete - DELETE

//setup a route
app.post('/todos', (req,res) => {
    //Create a new todo from body json
    var todo = new Todo({
        text: req.body.text
    });
    todo.save()
    .then((doc) => {
        res.send(doc);
    })
    .catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req,res) => {
    //Fetch todos
    Todo.find().then((results) => {
        res.send({results});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(port,() => {
    console.log("App started, listening on port " + port);
});

module.exports = {app};

// var newUser = new User({
//     email: "chester.craig1@gmail.com"
// }); 

// newUser.save()
// .then(() => {
//     console.log("added new user");
// })
// .catch((e) => {
//     console.log("failed to add user " + e);
// });

// // //create a new todo
// // var otherTodo = new Todo({
// //     text: "Fix Camerons brakes",
// //     completed: true,
// //     completedAt: 123
// // });

// // otherTodo.save()
// // .then((doc) => {
// //     console.log(doc);
// // })
// // .catch((errormessage) => {
// //     console.log("Failed to save otherTodo")
// // });