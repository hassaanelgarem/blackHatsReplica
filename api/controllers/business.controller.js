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


/* Get function that gets the current data of the business
and pass business object to the frontend to display it in edit view.
Calling route: '/api/business/edit/:businessId' */
module.exports.getCurrentInfo = function (req, res) {
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
        if (business)
          res.json(business);

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


/* Put function to save the edited business info in the database 
and returns updated object to frontend.
Calling route: '/api/business/edit/:businessId'  */
module.exports.saveNewInfo = function (req, res) {

  //if logged in
  if (req.user) {
    Business.findOne({
      _id: req.params.businessId
    }, function (err, business) {
      //if an error occurred, return the error
      if (err) {
        res.json(err);
      } else {
        // if business found in database its basic info will be saved 
        if (business) {
          business.name = req.body.name;
          business.email = req.body.email;
          business.password = req.body.password;
          business.phoneNumbers[0] = req.body.phoneNumber1;
          business.phoneNumbers[1] = req.body.phoneNumber2;

          //Split workDays by "," to return an array of strings
          business.workingDays = req.body.workingDays.split(",");
          business.workingHours = {
            from: req.body.from,
            to: req.body.to
          };
          var coordinates = req.body.coordinates.split(",");
          coordinates[0] = parseFloat(coordinates[0]);
          coordinates[1] = parseFloat(coordinates[1]);
          business.location = {
            address : req.body.address,
            coordinates : coordinates
          };
          business.description = req.body.description;
          business.paymentRequired = parseInt(req.body.paymentRequired);
          business.deposit = parseInt(req.body.deposit);

          business.save(function (err) {
            if (err) {
              res.json(err);
            } else {
              res.json(business);
            }
          });
        }
        //if business not found return this message to frontend 
        else {
          res.json({
            error: "Business not found!"
          });
        }
      }
    });
  }
  //if business not logged in
  else {
    res.json({
      error: "login"
    });
  }
};
