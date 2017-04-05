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


/* Delete function that finds and deletes a specific slot in a specific activity
URI: api/activity/:activityId/deleteSlot */
module.exports.deleteSlot = function(req, res) {

    //Create constants to save them as Date format
    const start = new Date(req.body.startTime);
    const end = new Date(req.body.endTime);

    //Finding specified activity
    Activity.findById(req.params.activityId, function(err, activity) {

        //If an error occurred, display a msg along with the error
        if (err) {
            res.json({
                success: false,
                msg: 'There was a problem finding the desired activity'
            });
        }
        //If activity is found
        else {

            //Loop to find the slot in the slots array
            for (var i = 0; i < activity.slots.length; i++) {

                //Found flag
                var found = false;

                //Checking the specified time against the slots time
                if ((compareDate(start, activity.slots[i].startTime) == 0) && (compareDate(end, activity.slots[i].endTime) == 0)) {

                    //Function to remove slot from array
                    activity.slots.splice(i, 1);

                    //Save changes
                    activity.save(function(err, activity) {

                        //If an error occurred, display a msg along with the error
                        if (err) {
                            res.json({
                                success: false,
                                msg: 'Slot Not Deleted'
                            });
                        }

                        //If no error occurrs, display msg
                        else {
                            res.json({
                                success: true,
                                msg: 'Slot Deleted'
                            });
                        }
                    });

                    //Set flag and break
                    found = true;
                    break;
                }
            }

            //If slot does not exist
            if (!found) {
                res.json({
                    success: false,
                    msg: "Couldn't find desired slot"
                })
            }


        }
    });
};


/* Post function that adds a slot in a specific activity
URI: api/activity/edit/:activityId/addSlot*/
module.exports.addSlot = function(req, res) {

    //Create constants to save them as Date format
    const start = new Date(req.body.startTime);
    const end = new Date(req.body.endTime);

    //Finding specified activity
    Activity.findById(req.params.activityId, function(err, activity) {

        //If an error occurred, display a msg along with the error
        if (err) {
            res.json({
                success: false,
                msg: 'There was a problem finding the desired activity'
            });
        }

        //If activity found
        else {

            //Flag for overlap
            var noOverlap = true;

            //Loop to find the slot in the slots array
            for (var i = 0; i < activity.slots.length; i++) {

                //Compare new and existing slot timings using helper function
                const compareStart = compareDate(activity.slots[i].startTime, end);
                const compareEnd = compareDate(start, activity.slots[i].endTime);

                //If no overlap
                if (!(x == -1 && y == -1)) {

                }
                //If overlap
                else {
                    noOverlap = false
                    break;
                }
            }

            // If flag is still set, no overlap
            if (noOverlap) {

                //Create new slot
                const newSlot = {
                    "startTime": start,
                    "endTime": end
                };

                //Push it in the array
                activity.slots.push(newSlot);

                //Save activity
                activity.save(function(err, activity) {

                    //If an error occurred, display a msg along with the error
                    if (err) {
                        res.json({
                            success: false,
                            msg: 'Slot Not Added'
                        });
                    }

                    //If no error occurrs, display msg
                    else {
                        res.json({
                            success: true,
                            msg: 'Slot Added'
                        });
                    }
                });
            }

            //If an error occurred, display a msg along with the error
            else {
                res.json({
                    success: false,
                    msg: 'Overlap'
                });
            }


        }
    });
};


/* Helper function that compares dates and returns
  date1 = date2 --> 0
  date1 > date2 --> 1
  date1 < date2 --> -1 */
function compareDate(date1, date2) {


    //Hours equal
    if (date1.getHours() == date2.getHours()) {

        //Check minutes
        if (date1.getMinutes() == date2.getMinutes()) {
            return 0;
        } else {
            if (date1.getMinutes() > date2.getMinutes()) {
                return 1;
            } else {
                return -1;
            }
        }
    }

    //Hours not equal
    else {
        if (date1.getHours() > date2.getHours()) {
            return 1;
        } else {
            return -1;
        }
    }
}
