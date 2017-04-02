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



// Post function that increments the interactivity attribute of a certain business by 1
// URI: api/business/interact/:id
module.exports.updateInteractivity = function (req, res) {
	Business.findById(req.params.id, function (err, business) {
		business.interactivity = business.interactivity + 1;
		business.save(function (err) {
			if (err) res.json({
				success: false,
				msg: 'Updating business interactivity failed'
			});
			res.json({
				success: true,
				msg: 'Business interactivity incremented'
			});
		})
	});
};


// Get function that returns the three most popular businesses based on their interactivity
// URI: api/business/mostPopular
module.exports.getMostPopular = function (req, res) {
	const query = Business.find().sort({
		interactivity: -1
	}).limit(3);
	query.exec(function (err, businesses) {
		if (err) res.json({
			success: false,
			msg: 'Failed to retrieve most popular businesses'
		});
		res.json({
			success: true,
			msg: 'Got most popular businesses successfully',
			businesses: businesses
		});
	});
};



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