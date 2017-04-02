const mongoose = require("mongoose");
const Activity = mongoose.model("Activity");


/*
  Get function that retrieves the activities offered by a Business from the database
  Calling route: api/activity/:businessId
*/
module.exports.getActivities = function(req, res) {

    //Finds all activities ofeered by a specific business according to its business ID
    Activity.find({"business": req.params.businessId}, function(err, activities) {

      //If an error occurred, display a msg along with the error
      if (err) return res.json({success: false, msg: 'Cannot retrieve activities'});

      //If no error return list of activities offered
      else return res.json({success: true, msg: 'successful retrieval', activities});
    });
}
