const mongoose = require("mongoose");
const Activity = mongoose.model("Activity");


/* Post function to edit an Activity in the database
Calling route: '/api/activity/edit/:activityId'  */
module.exports.editActivity = function(req, res) {
    if (req.user) {
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

                    activity.save(function(err) {
                        if (err) {
                            res.json({
                                success: false,
                                error: err
                            });
                        } else {
                            res.json({ activity, msg: "activity edited successfully" });

                        }

                    });
                }
                //If Activity not found return message
                else {
                    res.json({
                        error: "Activity not found"
                    });
                }
            }
        });

    } else {
        res.json({
            error: "login!"
        });
    }
};