//import test libraries
const expect = require("expect");
const request = require("supertest");

const {app} = require("./../app");
const {Todo} = require("./../models/todo"); 


beforeEach((done) => {
    //wipe database
    Todo.remove({}).then(() => {
        console.log("Wiped database contents")
        done();
    });
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
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
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
                expect(todos.length).toBe(0);
                done();
            }).catch((err) => done(err));
        });
    });
});
