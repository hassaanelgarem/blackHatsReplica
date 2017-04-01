const mongoose = require("mongoose");
const User = mongoose.model("User");
const Business = mongoose.model("Business");


/*Add business id to the favorites array in user model,
and return success message if business added successfuly,
else returns error message.
Calling route: 'api/business/:businessId/addfavorite'
*/
module.exports.addFavorite = function(req, res){
    //if the user is logged in
    if(req.user){ 
        var business_id = req.params.businessId; //to get the id of the busniness i want to add to favorites
        var user_id = req.user.id;  //using passport, get the id of the signed in user
		db.User.update({"_id": user_id}, 
        {$addToSet: { favorites: business_id}},  //add the business id to the favorites array
        function(err, result) {
            //couldn't add to array, return the error
            if (err) {
                res.json({success: false, msg: 'adding business to favorites failed'});
            }
            else{
			    res.json({success: true, msg: 'business added to favorites'});
            }
        }); 
    }
	//if the user is not logged in:
    else{
		res.send("you should sign in first.")
        //res.redirect('/register');
    } 
};


/*Search he Business model for businesses with name or tag 
entered by the user, it gets all businesses with matching names
and tags and returns them to the frontend
Calling route: "/api/search" */
module.exports.searchByNameOrTag = function (req, res) {
    //Check for query string Ex: "/api/search?result=omar"
    if (req.query && req.query.result) {
        var nameOrTag = req.query.result;
        
        //Find businesses from the database
        Business.find({
                $or: [{
                        name: {
                            //Starts with or is the nameOrTag
                            $regex: "^" + nameOrTag,
                            //Ignore whitespace characters and case insensitive
                            $options: "ix"
                        }
                    },
                    {
                        tags: {
                            $regex: "^" + nameOrTag,
                            $options: "ix"
                        }
                    }
                ]
            },
            function (err, businesses) {
                //If an error occured return it to the frontend
                if (err) {
                    res.json(err);
                } else {
                    //return an array of businesses or an empty array
                    res.json(businesses);
                }
            }
        );
    } else
        //return an empty array
        res.json([]);
};
