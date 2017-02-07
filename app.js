//Main code for a node.js based todo list application.
const fs = require("fs")
const bodyParser = require("body-parser");
const express = require("express");
var app = express();

//Local imports
const {mongoose} = require("./db/mongoose");  //destructuring
const ObjectId = require("mongoose").Types.ObjectId;
var {Todo} = require("./models/todo");
var {User} = require("./models/user");


//Define port
const port = process.env.PORT || 3000;

//express middleware - log all requests to a log file
app.use((req,res,next) => {
    var msg = `${new Date().toString()}: ${req.method} ${req.url}`;
    //console.log(msg);
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
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

//5898245aad700f18973c605c

app.get('/todos/:id', (req,res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).send("Object ID is invalid");
    }
    //Fetch todo
    Todo.findById(req.params.id).then((todo) => {      //by calling the return value todo we can use es6 to do the todo: todo, if we call it result in our return we need to say todo: result
        if (!todo) {
            res.status(404).send();
        } else {
            res.send({todo});
        }
    }).catch((e) => {
         res.status(404).send();
    });
});



// ADDED - NO TESTING SUPPORT. NOT SURE IF ADHERES TO GOOD PRACTICES FOR WHAT IT SHOULD RETURN??
app.delete('/todos/:id', (req,res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).send("Object ID is invalid");
    }
    //Fetch todo
    Todo.findByIdAndRemove(req.params.id).then((todo) => {      //by calling the return value todo we can use es6 to do the todo: todo, if we call it result in our return we need to say todo: result
        if (!todo) {
            res.status(404).send();
        } else {
            res.send({todo});
        }
    }).catch((e) => {
         res.status(404).send();
    });
});


app.listen(port,() => {
    console.log(`App started, listening on port ${port}`);
});

module.exports = {app};
