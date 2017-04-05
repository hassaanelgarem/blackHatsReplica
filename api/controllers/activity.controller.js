const mongoose = require("mongoose");
const Activity = mongoose.model("Activity");
const Business = mongoose.model("Business");

/*
  Get function that retrieves the activities offered by a Business from the database
  Calling route: api/activity/:businessId
*/
module.exports.getActivities = function(req, res) {

    //Finds all activities ofeered by a specific business according to its business ID
    Activity.find({
        "business": req.params.businessId
    }, function(err, activities) {

        //If an error occurred, display a msg along with the error
        if (err) return res.json({
            success: false,
            msg: 'Cannot retrieve activities'
        });

        //If no error return list of activities offered
        else res.json({
            success: true,
            msg: 'successful retrieval',
            activities
        });
    });
}

/*
  Post function that handles adding an activity
  It creates a new activity and saves it in the database
  And updates Activites array in the coreesponding Business
  Calling route: '/api/activity/add'
*/
module.exports.addActivity = function(req, res) {
    //check if logged in
    //if (req.user) {
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
    //} //User not logged in
    /*else {
        res.json({ error: "Please Login" });
    }*/
};


module.exports.getAvailableSlots = function(req, res) {
  const actdate = req.body.date;
  const actID = req.body.activityID;
  var maxBookings = 0;

  Activity.findById(actID)
  .populate( {
    path: 'bookings',
    match: {
      date: actdate
    }
  })
  .exec(function(err, bookedSlots) {
    if(err) return res.json({
      success: false,
      msg: "Error occured while retrieving slots"
    })

    Activity.findById(actID, function(err, actSlots) {
      if(err) res.json({
        success: false,
        msg: "error occured while retrieving activity slots"
      });
      maxBookings = actSlots.bookingsPerSlot;

    var availableSlots = [];
    const counter = 0;

    for(const i = 0; i < actSlots.slots.length; i++) {
      counter = 0;

      for(const j = 0; j < bookedSlots.bookings.length; j++) {

        if (actSlots.slots[i].startTime == bookedSlots.bookings[j].slot.startTime) {
          if(actSlots.slots[i].endTime == bookedSlots.bookings[j].slot.endTime)
            counter++;
        }
      }

      if(counter < maxBookings)
        availableSlots.push(slots[i]);
    }

    res.json( {
      success: true,
      msg: "successful retrieval of available slots",
      availableSlots : availableSlots })
      })
      })
}
