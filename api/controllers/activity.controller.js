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
                } else {
                    // loop
                    for (const i = 0; i < activity.slots.length; i++) {
                        if (activity.slots[i].startTime.getHours() == start.getHours()) {
                            if (activity.slots[i].startTime.gteMinutes() == start.getMinutes()) {
                                if (activity.slots[i].endTime.getHours() == end.getHours()) {
                                    if (activity.slots[i].endTime.gteMinutes() == end.getMinutes()) {
                                            activity.slots[i].splice(i, 1);
                                            activity.save(function(err, activity) {
                                                if (err) {
                                                    res.json({
                                                        success: false,
                                                        msg: 'Slot Not Deleted'
                                                    });
                                                } else {
                                                    res.json({
                                                        success: true,
                                                        msg: 'Slot Deleted'
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }

                            }

                        }
                    }
                });
        };


        module.exports.addSlot = function(req, res) {
            const start = new Date(req.body.startTime);
            const end = new Date(req.body.endTime);
            Activity.findbyId(req.params.activityId, function(err, activity) {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'There was a problem finding the desired activity'
                    });
                } else {
                    for (const i = 0; i < activity.slots.length; i++) {

                        const x = compareDate(activity.slot[i].startTime, end);
                        const y = compareDate(start, activity.slot[i].endTime);

                        if (!(x == -1 && y == -1)) {
                            const newSlot = {
                                "startTime": start,
                                "endTime": end
                            };

                            activity.slots.push(newSlot);
                            activity.save(function(err, activity) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        msg: 'Slot Not Added'
                                    });
                                } else {
                                    res.json({
                                        success: true,
                                        msg: 'Slot Added'
                                    });
                                }
                            });

                        } else {
                            res.json({
                                success: false,
                                msg: 'Overlap'
                            });
                        }
                    }
                }
            });
        };


        // date1 = date2 --> 0
        // date1 > date2 --> 1
        // date1 < date2 --> -1

        function compareDate(date1, date2) {

            if (date1.getHours() == date2.getHours()) {
                if (date1.getMinutes() == date2.getMinutes()) {
                    return 0;
                } else {
                    if (date1.getMinutes() > date2.getMinutes()) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            } else {
                if (date1.getHours() > date2.getHours()) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
