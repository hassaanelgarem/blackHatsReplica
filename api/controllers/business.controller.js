const mongoose = require("mongoose");
const Business = mongoose.model("Business");


/*
  Post function that increments the interactivity attribute of a certain business by 1
  Calling route: /api/business/interact/:id
*/
module.exports.updateInteractivity = function(req, res) {
  // Find the business to be updated from database
  Business.findById(req.params.id, function(err, business) {

    // Increment interactivity by 1
    business.interactivity = business.interactivity + 1;

    // Save the updated business in database
    business.save(function(err) {

      // If there is an error return it in response
      if(err) res.json({success: false, msg: 'Updating business interactivity failed', error: err});

      // If no error respond with success = true
      res.json({success: true, msg: 'Business interactivity incremented'});
    })
  });
};


/*
  Get function that returns the three most popular businesses based on their interactivity
  Calling route: api/business/mostPopular
*/
module.exports.getMostPopular = function(req, res) {

  // query for sorting businesses based on interactivity and limits the result to 3
  const query = Business.find().sort({interactivity: -1}).limit(3);

  // execute the above query
  query.exec(function(err, businesses) {

      // If there is an error return it in response
      if(err) res.json({success: false, msg: 'Failed to retrieve most popular businesses', error: err});

      // If no error return the list of businesses
      res.json({success: true, msg: 'Got most popular businesses successfully', businesses: businesses});
  });
};


/*
  Get function that returns all info of a certain business
  Calling route: api/business/businessPage/:id
*/
module.exports.getBusinessInfo = function(req, res) {

  //Find the bussiness by id to get its info, reviews and activities in details
  Business.findById(req.params.id).populate('reviews').populate('activities').exec(function(err, business) {

      //If an error occurred, display a msg along with the error
      if (err) return res.json({success: false, msg: 'Cannot retrieve business'});

      //If no error return the bisness info
      else {
        business.reviews = business.reviews.slice(0, 3);
        return res.json({success: true, msg: 'successful retrieval', business});
      }
  });
}
