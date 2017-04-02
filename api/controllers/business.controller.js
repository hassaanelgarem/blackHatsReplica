const mongoose = require("mongoose");
const Business = mongoose.model("Business");


// for testing
/*
module.exports.add = function(req, res){
    const newBusiness = new Business({name: "test4", email: "test4", password: "test4", description: "test4"});
    newBusiness.save(function (err, business) {
      if (err) return res.json({success: false, msg: 'adding failed'});
      res.json({success: true, msg: 'added'});
    });
};
*/



/*save the choosen Category by the business in the database .
  business can choose only 1 Category
  Calling route: '/api/business/addCategory' */
module.exports.addCategory = function (req, res) {
	//check if logged in 
	if (req.user) {
		Business.findOne({
			_id: req.params.businessId
		}, function (err, business) {
			//if error occured 
			if (err) {
				res.json(err);
			} else {
				// if business found 
				if (business) {
					business.category = req.body.category;
					
					/*service to save the choosen Category in the database 
				and return the updated object to frontend.
				*/
					business.save(function(err){
						if(err){
							res.json(err);
						}
						else{
							res.json(business);
						}
					});
				}

				//business not found 
				else
					res.json({
						error: "Business not found!"
					});
			}
		});
		//user is not logged in
	} else {
		res.json({
			error: "login"
		});
	};
};