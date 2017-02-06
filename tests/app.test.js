//import test libraries
const expect = require("expect");
const request = require("supertest");

const {app} = require("./../app");
const {Todo} = require("./../models/todo"); 

const seedData = [{
    text: "test task 1"
},{
    text: "test task 2"
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(seedData);
        }
    ).then(() => done());
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
                expect(todos[seedData.length + 1].text).toBe(text);
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