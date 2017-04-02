const mongoose = require("mongoose");
const Business = mongoose.model('Business');


// for testing by postman

module.exports.add = function (req, res) {
  Business.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      description: req.body.description
    },
    function (err, hotel) {
      if (err) {
        console.log("Error creating Business");
        res
          .status(400)
          .json(err);
      } else {
        console.log("Business created!", hotel);
        res
          .status(201)
          .json(hotel);
      }
    });
};




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


/*redirects business to display "Edit View" 
and pass business object to the frontend.
Calling route: '/api/editBusiness/:businessId' */
module.exports.displayEditView = function (req, res) {
  //check if logged in 
  // if (req.user) {
  Business.findOne({
    _id: req.params.businessId
  }, function (err, business) {
    //if error occured 
    if (err) {
      res.json(err);

    } else {
      // if business found 
      if (business)
        return res.json(business);

      //business not found 
      else
        res.json({
          error: "Business not found!"
        });
    }
  });
  //user is not logged in
}
/* else {
    res.json({
      error: "login"
    });
  };*/
//};






var _splitArray = function (input) {
  var output;
  if (input && input.lenght > 0) {
    output = input.split(":");
  } else {
    console.log("invalid input");
    output = [];
  }
  return output;
}


/* service to save the edited business info in the database 
and returns updated object to frontend.
Calling route: '/api/editBusiness/:businessId'  */
module.exports.saveNewInfo = function (req, res) {

  //if logged in
  //if (req.user) {
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
        business.phoneNumbers=req.body.phoneNumber1;
        business.phoneNumbers=req.body.phoneNumber1;
      // phoneNumbers : _splitArray(req.body.phoneNumbers);

        //Split workDays by "," to return an array of strings
        business.workingDays.push(_splitArray(req.body.workingDays));
        business.workingHours = {
          from: req.body.from,
          to: req.body.to
        };
        business.address = req.body.address;
        business.description = req.body.description;
        
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
/*else {
    res.json({
      error: "login"
    });
  }
};*/