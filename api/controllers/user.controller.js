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
    res.render('privacy');
};

module.exports.terms = function(req, res){
    res.render('terms');
};

//2.4:add business to favorites:
module.exports.addFavorite = function(req, res){
    
    var business_id = req.params.businessId; //check
    var user_id = req.user.id;  //using passport
    var errors = req.validationErrors();
	if(errors){
		/*res.render('business',{
			errors:errors
		});*/
	}
	else {
		db.User.update({_id: user_id}, { $addToSet: { favorites: business_id} })
		res.redirect('/api/business/'+business_id);
		//req.flash('success_msg', 'added to favorites');
	}    
};



