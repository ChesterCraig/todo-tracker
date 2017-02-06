var mongoose = require("mongoose");

var User = mongoose.model('User',{
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true, //trims all the leading and trailing spaces..
        unique: true,
    }
});


module.exports = {User};