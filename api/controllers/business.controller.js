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
