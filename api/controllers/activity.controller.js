const mongoose = require("mongoose");
const Activity = mongoose.model("Activity");


/* Service to edit an Activity in the database
Calling route: '/api/editBusiness/:businessId'  */
module.exports.editActivity = function(req, res) {
    //Find Activity to be eidited
    Activity.findById(req.params.activityId, function(err, activity) {
        //If an error occurs return this error
        if (err) {
            res.json(err);
        } else {
            // If Activity found in database its information will be changed
            if (activity) {
                activity.name = req.body.name;
                activity.price = req.body.price;
                activity.description = req.body.description;
                activity.bookingsPerSlot = req.body.bookingsPerSlot;
                activity.business = req.body.business;
            }
            activity.save(function(err) {
                if (err) res.json({
                    success: false,
                    error: err
                });
                res.json({
                    success: true,
                    msg: 'Activity edited Successfully'
                });
            });
        }
        //If Activity not found return message
        else {
            res.json({
                error: "Activity not found"
            });
        }
    });
};
