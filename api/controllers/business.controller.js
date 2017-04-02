const mongoose = require("mongoose");
const Business = mongoose.model("Business");


/*Put function, to save the choosen tags by the business in the database .
  business can choose up to 5 tags .
  Calling route: '/api/editBusiness/:businessId/addTags' */
module.exports.addTags = function (req, res) {
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
          var array = req.body.tags.split(",");
          for (var i = 0; i < array.length; i++) {
            business.tags.push(array[i]);
          }

          /*save the choosen tags in the database 
          and return the updated object to frontend.
          */
          business.save(function (err) {
            if (err) {
              res.json(err);
            } else {
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
  }
  //user is not logged in
  else {
    res.json({
      error: "login"
    });
  };
}


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

