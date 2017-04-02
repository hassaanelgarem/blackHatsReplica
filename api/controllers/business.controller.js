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


/*
  Post function that increments the interactivity attribute of a certain business by 1
  URI: api/business/interact/:id
*/
module.exports.updateInteractivity = function(req, res){
  // Find the business to be updated from database
  Business.findById(req.params.id, function(err, business){

    // Increment interactivity by 1
    business.interactivity = business.interactivity + 1;

    // Save the updated business in database
    business.save(function(err){

      // If there is an error return it in response
      if(err) res.json({success: false, msg: 'Updating business interactivity failed', error: err});

      // If no error respond with success = true
      res.json({success: true, msg: 'Business interactivity incremented'});
    })
  });
};

/*
  Get function that returns the three most popular businesses based on their interactivity
  URI: api/business/mostPopular
*/
module.exports.getMostPopular = function(req, res){

  // query for sorting businesses based on interactivity and limits the result to 3
  const query = Business.find().sort({interactivity: -1}).limit(3);

  // execute the above query
  query.exec(function(err, businesses){

      // If there is an error return it in response
      if(err) res.json({success: false, msg: 'Failed to retrieve most popular businesses', error: err});

      // If no error return the list of businesses
      res.json({success: true, msg: 'Got most popular businesses successfully', businesses: businesses});
  });
};
