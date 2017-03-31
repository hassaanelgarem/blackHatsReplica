/*
Dummy example controller File

1) require the database model you will be working on along with mongoose and any other module that you will use.

const mongoose = require("mongoose");
const User = mongoose.model("User");

2) define your functions that the route get or post method will call

Example:

module.exports.login = function(req, res){
    //Do something here
};

*/
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Business = mongoose.model("Business");

module.exports.privacy = function(req, res){
	res.send("render privacy policy page");
    //res.render('privacy');
};




