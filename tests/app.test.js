//import test libraries
const expect = require("expect");
const request = require("supertest");
const ObjectId = require("mongoose").Types.ObjectId;


const {app} = require("./../app");
const {Todo} = require("./../models/todo"); 


const seedData = [{
    _id: new ObjectId(),
    text: "test task 1"
},{
    _id: new ObjectId(),
    text: "test task 2",
    completed: true,
    completedAt: 1234
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(seedData);
    }).then(() => done());
});

//Test cases
describe("POST /todos", () => {
    it('should create a new todo', (done) => {
        //Using /todos, make a post http request with a json body containing some text
        //Ensure it returns without error and the size of the collection is 1 and record has same text property as one provided
        var text = "test todo task";
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err,res) => {
            if (err) {
                return done(err);
            }
            //check record was actually added
            Todo.find().then((todos) => {
                expect(todos.length).toBe(seedData.length + 1);
                expect(todos[seedData.length].text).toBe(text);
                done();
            }).catch((err) => done(err));
        });
    });

    it('should not allow a task to be created without text', (done) => {
        request(app)
        .post('/todos')
        .send()
        .expect(400)
        .end((err,res) => {
            if (err) {
                return done(err);
            }
            //check no records added
            Todo.find().then((todos) => {
                expect(todos.length).toBe(seedData.length);
                done();
            }).catch((err) => done(err));
        });
    });
});


describe("GET /todos", () => { 
    it('should return seed data', (done) => {
        request(app)
        .get("/todos")
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(seedData.length);
        }).end(done);
    });
});

describe("GET /todos/:id", () => { 
    it('should return a task if provided valid/existing id', (done) => {
        request(app)
        .get("/todos/" + seedData[0]._id.toHexString())
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(seedData[0].text);
        }).end(done);
    });

    it('should return 404 if valid id provided that doesnt exist in db', (done) => {
        request(app)
        .get("/todos/" + new ObjectId().toHexString())
        .expect(404)
        .end(done);
    });

    it('should return 404 if invalid id provided', (done) => {
        request(app)
        .get("/todos/dummyIDVeryWrong")
        .expect(404)
        .end(done);
    });
});

describe("DELETE /todos/:id", () => { 
    it('should delete a task if provided valid/existing id', (done) => {
        request(app)
        .delete("/todos/" + seedData[0]._id.toHexString())
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(seedData[0].text);

            //check if record removed from database.
            Todo.findById(seedData[0]._id.toHexString()).then((todo) => {
                expect(todo).toNotExist(todo);
            }).catch((err) => done(err));
        }).end(done);
    });

    it('should return 404 if valid id provided that doesnt exist in db', (done) => {
        request(app)
        .delete("/todos/" + new ObjectId().toHexString())
        .expect(404)
        .end(done);
    });

    it('should return 404 if invalid id provided', (done) => {
        request(app)
        .delete("/todos/dummyIDVeryWrong")
        .expect(404)
        .end(done);
    });
});


describe("PATCH /todos/:id", () => { 
    it('should set task to completed a task if provided valid/existing id', (done) => {
        request(app)
        .patch("/todos/" + seedData[0]._id.toHexString())
        .send({completed: true})
        .expect(200)
        .expect((res) => {
            //returned updated object
            expect(res.body.todo.completed).toBeTruthy();
            expect(res.body.todo.completedAt).toBeA('number');

            //check in database
            Todo.findById(seedData[0]._id.toHexString()).then((todo) => {
                expect(todo.completed).toBeTruthy();
                expect(todo.completedAt).toBeA('number');
            }).catch((err) => done(err));
        }).end(done);
    });

    it('should set task to not completed and completedAt to null for a task if provided valid/existing id', (done) => {
        request(app)
        .patch("/todos/" + seedData[1]._id.toHexString())
        .send({completed: false})
        .expect(200)
        .expect((res) => {
            //returned updated object
            expect(res.body.todo.completed).toBeFalsy();
            expect(res.body.todo.completedAt).toNotExist();

            //check in database
            Todo.findById(seedData[1]._id.toHexString()).then((todo) => {
                expect(todo.completed).toBeFalsy();
                expect(todo.completedAt).toNotExist();
            }).catch((err) => done(err));
        }).end(done);
    });

    it('should return 404 if invalid id provided', (done) => {
        request(app)
        .patch("/todos/dummyIDVeryWrong")
        .expect(404)
        .end(done);
    });
});