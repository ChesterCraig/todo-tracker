const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const _ = require('lodash');

//user is created via Schema (so we can add methods, if we only do a model we cant)

var UserSchema = new mongoose.Schema(
{
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true, //trims all the leading and trailing spaces..
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{value} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: { 
            type: String,
            require: true
        } 
    }]
});

//add instance method (needs to be standard function so we can access this)
UserSchema.methods.generateAuthToken = function() {
    //this = user
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access: access}, 'abc123').toString();
    user.tokens.push({access: access, token: token});
   
    return user.save().then(() => {
        return token;
    });
};


//override to JSON method so we don't send back thigns we do need to, to the user
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    //trim back properties on objects
    return _.pick(userObject,['_id','email']);
};


var User = mongoose.model('User', UserSchema);

module.exports = {User};