const mongoose = require("mongoose");
const Activity = mongoose.model("Activity");
const Business = mongoose.model("Business");


/*
  Post function that handles adding an activity
  It creates a new activity and saves it in the database
  And updates Activites array in the coreesponding Business
  Calling route: '/api/activity/add'
*/
module.exports.addActivity = function(req, res) {
    //check if logged in
    if (req.user) {
        // Create new Activity object using parameters from request
        const newActivity = new Activity({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            bookingsPerSlot: req.body.bookingsPerSlot,
            business: req.body.business
        });
        // Save new Activity in database
        newActivity.save(function(err, activity) {
            // If there is an error return it in response
            if (err) return res.json({
                success: false,
                msg: 'Failed to Add Activity',
                error: err
            });

            // Find Business by their id and inserts the activity id in their activites array
            Business.findByIdAndUpdate(
                activity.business, {
                    $push: {
                        "activities": activity._id
                    }
                }, {
                    safe: true,
                    upsert: true,
                    new: true
                },
                function(err, business) {
                    // If there is an error return it in response
                    if (err) res.josn({
                        success: false,
                        error: err
                    });
                    // If no errors occur, respond with success = true
                    res.json({
                        success: true,
                        msg: 'Activity Added'
                    });
                }
            );
        });
    } //User not logged in
    else {
        res.json({ error: "Please Login" });
    }
};