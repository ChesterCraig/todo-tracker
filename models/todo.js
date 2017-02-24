var mongoose = require("mongoose"); 


//Define some models for mongoose
var Todo = mongoose.model('Todo',{
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true //trims all the leading and trailing spaces..
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    } 
});

module.exports = {Todo};