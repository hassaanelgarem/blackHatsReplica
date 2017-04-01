const mongoose = require("mongoose");
const User = mongoose.model("User");
const Business = mongoose.model("Business");


//frontend: 
module.exports.privacy = function(req, res){
    res.render('privacy');
};


//frontend:
module.exports.terms = function(req, res){
    res.render('terms');
};


/*2.4:
 Get function that adds the business to user's favorites
 URI: api/business/:businessId/addfavorite
*/
module.exports.addFavorite = function(req, res){
    //if the user is logged in
    if(req.user){ 
        var business_id = req.params.businessId; //to get the id of the busniness i want to add to favorites
        var user_id = req.user.id;  //using passport, get the id of the signed in user
		db.User.update({_id: user_id}, { $addToSet: { favorites: business_id} }) //add the business id to the favorites array of the user
		//res.send("business added to favorites");
		res.redirect('/business/'+business_id);
    }
	//if the user is not logged in:
    else{
		res.send("you should sign in first.")
        //res.redirect('/register');
    }
       
};




