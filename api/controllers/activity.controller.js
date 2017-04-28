const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const expressValidator = require('express-validator');
const Activity = mongoose.model("Activity");
const Business = mongoose.model("Business");


/* Multer configuration to upload a single file from an
html input with name "myfile" to public/uploads/activityPhotos folder*/
const uploadPhotos = multer({
    dest: path.join(__dirname, '../', '../public/uploads/activityPhotos')
}).single('myfile');



/*
    Post function that handles adding an activity
    It creates a new activity and saves it in the database
    And updates Activites array in the coreesponding Business
    Takes:
        Body: {
        name: "name of new activity",
        price: "price of new activity",
        description: "description of new activity",
        bookingsPerSlot: "Maximum number of bookins per slot of new activity",
        }
    Returns: {
        error: "Error object if any",
        msg: "Success or failure message",
        data: "Nothing"
    }
    Redirects to: Nothing.
    Calling route: '/api/activity/add'
*/
module.exports.addActivity = function(req, res) {
    //check if logged in
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('bookingsPerSlot', 'Bookings per slot is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.status(500).json({
            error: errors,
            msg: "Incomplete Input",
            data: null
        });
    } else {
        // Create new Activity object using parameters from request
        const newActivity = new Activity({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            bookingsPerSlot: req.body.bookingsPerSlot,
            business: req.user._id
        });
        // Save new Activity in database
        newActivity.save(function(err, activity) {
            // If there is an error return it in response
            if (err) return res.status(500).json({
                error: err,
                msg: "Failed To Add Activity",
                data: null
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
                    if (err) res.status(500).json({
                        error: err,
                        msg: null,
                        data: null
                    });
                    if (business) {
                        // If no errors occur, respond with success = true
                        res.status(200).json({
                            error: null,
                            msg: "Activity Added Successfully",
                            data: activity
                        });
                    } else {
                        res.status(404).json({
                            error: null,
                            msg: "Business not found",
                            data: null
                        });
                    }


                }
            );
        });
    }

};


/*
    Get function that retrieves the activities offered by a Business from the database
    Takes:
        params: {
            businessId
        }
    Returns: {
        error: "Error object if any",
        msg: "Success or failure message",
        data: "Activities of a given business"
    }
    Redirects to: Nothing.
    Calling route: api/activity/:businessId
*/
module.exports.getActivities = function(req, res) {

    //Finds all activities ofeered by a specific business according to its business ID
    Activity.find({
        "business": req.params.businessId
    }, function(err, activities) {

        //If an error occurred, display a msg along with the error
        if (err) return res.status(500).json({
            error: err,
            msg: "Cannot Retrieve activities",
            data: null
        });

        //If no error return list of activities offered
        else res.status(200).json({
            error: null,
            msg: "Successful Retrieval",
            data: activities
        });
    });
};


//Calling route: api/activity/getActivity/:businessId
module.exports.getActivityBookings = function(req, res) {

    //Finds all activities offered by a specific business according to its business ID
    Activity.find({
            "business": req.params.businessId
        })
        .populate({
            path: 'bookings'
        })
        .select('name')
        .select('bookings')
        .exec(function(err, activities) {
            //If an error occurred, display a msg along with the error
            if (err) return res.status(500).json({
                error: err,
                msg: "Cannot Retrieve activities",
                data: null
            });
            else if (!activities) return res.status(404).json({
                error: null,
                msg: "Business has no activities",
                data: null
            });
            //If no error return list of activities offered
            else {
                var options = {
                    path: 'bookings.user',
                    model: 'User'
                }
                Activity.populate(activities, options, function(err, populatedActvities) {
                    if (err) {
                        //If an error occurred, display a msg along with the error
                        if (err) return res.status(500).json({
                            error: err,
                            msg: "Cannot Retrieve activities",
                            data: null
                        });
                    } else {
                        return res.status(200).json({
                            error: null,
                            msg: "Successful Retrieval",
                            data: populatedActvities
                        });
                    }
                });
            }
        });
};


/*
    Post method that takes as a parameters the date and the Activity ID and returns
    the free slots where the resgistered user can make a booking
    Takes:
        Body: {
            date:"Date to find available slots in"
            activityID: "id of the activity tha will contain the slot to be added"
        }
    Returns: {
        error: "Error object if any",
        msg: "Success or failure message",
        data: "Available Slots in given date"
    }
    Redirects to: Nothing.
    Calling route: '/api/activity/freeSlots'
*/
module.exports.getAvailableSlots = function(req, res) {

    req.checkBody('date', 'Date is required').notEmpty();
    req.checkBody('activityID', 'Activity ID is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.status(500).json({
            error: errors,
            msg: "Incomplete Input",
            data: null
        });
    } else {
        //values from the body of the put request
        const actdate = req.body.date;
        const actID = req.body.activityID;
        //Maximum bookings that can be made in one slot and is specified by the business
        var maxBookings = 0;
        //Retrieves the array of bookings of this activity according to it's activity ID
        Activity.findById(actID)
            //populate an array of references with booking objects being referenced
            .populate({
                path: 'bookings',
                //filters to keep only bookings made on the date "actDate"
                match: {
                    date: actdate
                }
            })
            .exec(function(err, bookedSlots) {
                //If an error occured return it in response
                if (err) return res.status(500).json({
                    error: err,
                    msg: "Error occured while retrieving Slots",
                    data: null
                });
                if (!bookedSlots) return res.status(404).json({
                    error: null,
                    msg: "Activity not found",
                    data: null
                });
                //retrieves the slots specified by the business for their activity
                Activity.findById(actID, function(err, actSlots) {
                    //If an error occured return it in response
                    if (err) return res.status(500).json({
                        error: err,
                        msg: "Error occured while retrieving Activity Slots",
                        data: null
                    });
                    if (actSlots) {
                        //Initializes the maxBookings according to the Activity
                        maxBookings = actSlots.bookingsPerSlot;
                        //Array that will contain all the available slots for booking
                        var availableSlots = [];
                        var counter = 0;
                        //Loops over the array of slots specified by the business
                        for (var i = 0; i < actSlots.slots.length; i++) {
                            //counts the number of bookings made in that slot
                            counter = 0;
                            //Loops over the array of bookings made for that activity
                            for (var j = 0; j < bookedSlots.bookings.length; j++) {
                                //checks if the activity time is equal to the booking time
                                const actStartTime = new Date(actSlots.slots[i].startTime);
                                const bookingStartTime = new Date(bookedSlots.bookings[j].slot.startTime);
                                const actEndTime = new Date(actSlots.slots[i].endTime);
                                const bookingEndTime = new Date(bookedSlots.bookings[j].slot.endTime)
                                if (actStartTime.getTime() == bookingStartTime.getTime()) {
                                    if (actEndTime.getTime() == bookingEndTime.getTime()) {
                                        counter++;
                                    }
                                }
                            }
                            //Checks if the counter is less than the maximum number of bookings per slot
                            if (counter < maxBookings)
                                //adds the slot into the array of available slots
                                availableSlots.push(actSlots.slots[i]);
                        }
                        //returns the array of available slots
                        res.status(200).json({
                            error: null,
                            msg: "Successful Retrieval of Available Slots",
                            data: availableSlots
                        });
                    } else
                        res.status(404).json({
                            error: null,
                            msg: "Slots not found.",
                            data: null
                        });
                });
            });
    }
};


/*
    Delete function that finds and deletes a specific slot in a specific activity
    Takes:
        Body: {
            start: "start time of slot to be deleted"
            end: "end time of slot to be deleted"
        }
        params: {
            activityId
        }
    Returns: {
        error: "Error object if any",
        msg: "Success or failure message",
        data: "Nothing"
    }
    Redirects to: Nothing.
    Calling route: '/api/activity/:activityId/deleteSlot'
*/
module.exports.deleteSlot = function(req, res) {

    req.checkBody('startTime', 'Start Time is required').notEmpty();
    req.checkBody('endTime', 'End Time is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.status(500).json({
            error: errors,
            msg: "Incomplete Input",
            data: null
        });
    } else {
        activityBelongs(req.params.activityId, req.user._id, function(flag) {
            if (flag) {
                //Create constants to save them as Date format
                const start = new Date(req.body.startTime);
                const end = new Date(req.body.endTime);

                //Finding specified activity
                Activity.findById(req.params.activityId, function(err, activity) {

                    //If an error occurred, display a msg along with the error
                    if (err) {
                        res.status(500).json({
                            error: err,
                            msg: "Error retrieving desired activity",
                            data: null
                        });
                    }
                    //If activity is found
                    else {

                        if (!activity) return res.status(404).json({
                            error: null,
                            msg: "Activity not found",
                            data: null
                        });

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
                                        res.status(500).json({
                                            error: err,
                                            msg: "Error while deleting Slot",
                                            data: null
                                        });
                                    }

                                    //If no error occurrs, display msg
                                    else {
                                        res.status(200).json({
                                            error: null,
                                            msg: "Slot Deleted Successfully",
                                            data: null
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
                            return res.status(404).json({
                                error: null,
                                msg: "Slot not found",
                                data: null
                            });
                        }
                    }
                });
            } else {
                res.status(401).json({
                    error: null,
                    msg: "Business Login Required or Unauthorized Access",
                    data: null
                });
            }
        });
    }
};


/*
    Post function that adds a slot in a specific activity
    Takes:
        Body: {
            newSlot: "An object consist of two dates, startTime and endTime that will be added to the activity",
            start: "start time of newSlot"
            end: "end time of newSlot"
        }
        params: {
            activityId
        }
    Returns: {
        error: "Error object if any",
        msg: "Success or failure message",
        data: "Nothing"
    }
    Redirects to: Nothing.
    Calling route: '/api/activity/:activityId/addSlot'
*/
module.exports.addSlot = function(req, res) {
    activityBelongs(req.params.activityId, req.user._id, function(flag) {
        if (flag) {
            req.checkBody('startTime', 'Start Time is required').notEmpty();
            req.checkBody('endTime', 'End Time is required').notEmpty();

            const errors = req.validationErrors();

            if (errors) {
                res.status(500).json({
                    error: errors,
                    msg: "Incomplete Input",
                    data: null
                });
            } else {
                //Create constants to save them as Date format
                const start = new Date(req.body.startTime);
                const end = new Date(req.body.endTime);

                //Finding specified activity
                Activity.findById(req.params.activityId, function(err, activity) {

                    //If an error occurred, display a msg along with the error
                    if (err) {
                        res.status(500).json({
                            error: err,
                            msg: "Error while finding Activity",
                            data: null
                        });
                    }

                    //If activity found
                    else {
                        if (!activity) return res.status(404).json({
                            error: null,
                            msg: "Activity not found",
                            data: null
                        });
                        //Flag for overlap
                        var noOverlap = true;

                        //Loop to find the slot in the slots array
                        for (var i = 0; i < activity.slots.length; i++) {

                            //Compare new and existing slot timings using helper function
                            const compareStart = compareDate(activity.slots[i].startTime, end);
                            const compareEnd = compareDate(start, activity.slots[i].endTime);

                            //If no overlap
                            if (!(compareStart == -1 && compareEnd == -1)) {

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
                                    res.status(500).json({
                                        error: err,
                                        msg: "Error while adding Slot",
                                        data: null
                                    });
                                }

                                //If no error occurrs, display msg
                                else {
                                    res.status(200).json({
                                        error: null,
                                        msg: "Slot Added Successfully",
                                        data: null
                                    });
                                }
                            });
                        }

                        //If an error occurred, display a msg along with the error
                        else {
                            res.status(405).json({
                                error: null,
                                msg: "Slots Overlap",
                                data: null
                            });
                        }
                    }
                });
            }
        } else {
            res.status(401).json({
                error: null,
                msg: "Business Login Required or Unauthorized Access",
                data: null
            });
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


/*
    Post function to upload photo using multer
    and store the uploaded image path in the Activity
    model in photos array, and return the
    filepath to the frontend to show the image.
    Takes:
        Body: {
            newPath: "path of photo to be added",
            activityId: "id of the activity tha will contain the photo to be added"
        }
        params: {
            activityId
        }
    Returns: {
        error: "Error object if any",
        msg: "Success or failure message",
        data: "Nothing"
    }
    Redirects to: Nothing.
    Calling route: '/api/activity/:activityId/addPhoto'
*/
module.exports.addPhoto = function(req, res) {

    activityBelongs(req.params.activityId, req.user._id, function(flag) {
        if (flag) {
            //upload the image
            uploadPhotos(req, res, function(err) {
                //if an error occurred, return the error
                if (err) {
                    return res.status(500).json({
                        error: err,
                        msg: null,
                        data: null
                    });
                }
                /*if multer found a file selected
                and image was uploaded successfully,
                multer will save the image in req.file*/
                if (req.file) {
                    //get the image format
                    var string = req.file.originalname.substring(req.file.originalname.length - 3, req.file.originalname.length);

                    //if it was jpeg add a "j" to the returned "peg"
                    if (string === "peg")
                        string = "j" + string;
                    string = string.toLowerCase();
                    //check if it is not a valid image format
                    if (!(string === "png" || string === "jpg" || string === "jpeg" || string === "gif")) {
                        //delete the uploaded file
                        fs.unlink(req.file.path);

                        //return the error message to frontend
                        return res.status(500).json({
                            error: err,
                            msg: "File Format is Not Supported",
                            data: null
                        });
                    }
                    //copy and rename the image to the following format and location
                    var newPath = path.join(__dirname, "../", "../public/uploads/activityPhotos/" + req.file.filename + "." + string);
                    fs.renameSync(req.file.path, newPath, function(err) {
                        if (err) throw err;

                        //delete the image with the old name
                        fs.unlink(req.file.path);
                    });

                    //add the image file name to the photos array of the Business model
                    Activity.update({
                            "_id": req.params.activityId
                        }, {
                            $push: {
                                "photos": req.file.filename + "." + string
                            }
                        },
                        function(err, result) {
                            //couldn't add to array, return the error
                            if (err) {
                                return res.status(500).json({
                                    error: err,
                                    msg: null,
                                    data: null
                                });
                            } else {
                                //if updating is ok
                                if (result.nModified > 0) {
                                    //return the file path to the frontend to show the image
                                    res.status(200).json({
                                        error: null,
                                        msg: 'Photo added successfully.',
                                        data: req.file.filename + "." + string
                                    });
                                } else
                                    res.status(404).json({
                                        error: null,
                                        msg: "Activity not found",
                                        data: null
                                    });
                            }
                        });
                }
                //multer did not find a file selected to upload
                else {
                    return res.status(500).json({
                        error: null,
                        msg: "Choose a Valid File",
                        data: null
                    });
                }
            });
        } else {
            res.status(401).json({
                error: null,
                msg: "Business Login Required or Unauthorized Access",
                data: null
            });
        }
    });


};


/*
    Delete function that deletes photo from activity's
    photos array, and returns success message or error message.
    Takes:
        Body: {
            imagePath: "path of photo to be deleted",
            activityId: "id of the activity containg the photo to be deleted"
        }
        params: {
            activityId,
            photoPath
        }
    Returns: {
        error: "Error object if any",
        msg: "Success or failure message",
        data: "Nothing"
    }
    Redirects to: Nothing.
    Calling route: '/api/activity/:activityId/deletePhoto/:photoPath'
*/
module.exports.deletePhoto = function(req, res) {

    activityBelongs(req.params.activityId, req.user._id, function(flag) {
        if (flag) {
            var imagePath = req.params.photoPath;
            var activityId = req.params.activityId;
            Activity.update({
                "_id": activityId
            }, {
                $pull: {
                    "photos": imagePath
                }
            }, function(err, data) {
                if (err) {
                    res.status(500).json({
                        error: err,
                        msg: "Error while deleting Photo",
                        data: null
                    });
                } else {

                    //add directory path to image name
                    imagePath = path.join(__dirname, "../", "../public/uploads/activityPhotos/", req.params.photoPath);

                    //delete the photo from filesystem
                    fs.unlink(imagePath, function(err) {
                        //don't care if file doesn't exist
                    });
                    res.status(200).json({
                        error: null,
                        msg: "Photo Deleted Successfully",
                        data: null
                    });
                }
            });
        } else {
            res.status(401).json({
                error: null,
                msg: "Business Login Required or Unauthorized Access",
                data: null
            });
        }
    });
};


function activityBelongs(activityId, businessId, done) {
    Business.findById(businessId, function(err, business) {
        if (business) {
            if (business.activities.indexOf(activityId) > -1) {
                done(true);
            } else {
                done(false);
            }
        } else {
            done(false);
        }
    });
}


/*
    Delete function that finds and deletes a specific activity
    Takes:
        params: {
            activityId
        }
    Returns: {
        error: "Error object if any",
        msg: "Success or failure message",
        data: "Nothing"
    }
    Redirects to: Nothing.
    Calling route: '/api/activity/:activityId/delete'
*/
module.exports.deleteActivity = function(req, res) {
    activityBelongs(req.params.activityId, req.user._id, function(flag) {
        if (flag) {
            //Finding and deleting activity from database
            Activity.findByIdAndRemove(req.params.activityId, function(err, activity) {
                if (err) return res.status(500).json({
                    error: err,
                    msg: "Error while deleting Activity",
                    data: null
                });
                if (activity) {

                    //Delete activity from activites array in corresponding business
                    Business.findByIdAndUpdate(activity.business, {
                            $pull: {
                                "activities": activity._id
                            }
                        }, {
                            safe: true,
                            upsert: true,
                            new: true
                        },
                        function(err, model) {
                            if (err) return res.status(500).json({
                                error: err,
                                msg: "Error occured while finding the business",
                                data: null
                            });
                            if (model)
                                res.status(200).json({
                                    error: null,
                                    msg: "Activity Deleted Successfully",
                                    data: null
                                });
                            else
                                res.status(404).json({
                                    error: null,
                                    msg: "Activity was Deleted Successfully, however, it was not removed from business' activities.",
                                    data: null
                                });
                        });

                } else {
                    res.status(404).json({
                        error: null,
                        msg: "Activity not found",
                        data: null
                    });
                }
            });
        } else {
            res.status(401).json({
                error: null,
                msg: "Business Login Required or Unauthorized Access",
                data: null
            });
        }
    });
};
/*
    Get function, that gets the info of an activity
    and pass activity object to the frontend to display it.
    Takes:
        params{
            activityId
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/activity/:activityId/get'
*/
module.exports.getActivity = function(req, res) {
    //select all fields except password
    Activity.findById(req.params.activityId).exec(function(err, activity) {
        //if error occured
        if (err) {
            res.status(500).json({
                error: err,
                msg: null,
                data: null

            });
        } else {
            if (activity) {
                var act = activity.toObject();
                act.slots.sort(function(a, b) {
                    var one = new Date(b.startTime);
                    var two = new Date(a.startTime);
                    one.setDate(12);
                    one.setMonth(12);
                    one.setFullYear(2012);
                    two.setDate(12);
                    two.setMonth(12);
                    two.setFullYear(2012);
                    return two - one;
                });
                res.status(200).json({
                    error: null,
                    msg: null,
                    data: act
                });
            } else {
                res.status(404).json({
                    error: null,
                    msg: 'Activity not found.',
                    data: null
                });
            }
        }
    });
}

/*
    Post function, that updates an activity
    Takes:
        params{
            activityId
        }
        body{
          name,
          price,
          description,
          bookingsPerSlot
      }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/activity/:activityId/edit'
*/
module.exports.editActivity = function(req, res) {

    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('price', 'Price is required.').notEmpty();
    req.checkBody('description', 'Description is required.').notEmpty();
    req.checkBody('bookingsPerSlot', 'Bookings Per Slot is required.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.status(500).json({
            error: errors,
            msg: "Incomplete Input",
            data: null
        });
    } else {
        activityBelongs(req.params.activityId, req.user._id, function(flag) {
            if (flag) {
                Activity.findByIdAndUpdate(req.params.activityId, {
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                    bookingsPerSlot: req.body.bookingsPerSlot
                }, {}, function(err, activity) {
                    if (err) {
                        res.status(500).json({
                            error: err,
                            msg: "Error updating databse",
                            data: null
                        });
                    } else {
                        if (!activity) {
                            res.status(500).json({
                                error: null,
                                msg: "Activity not found",
                                data: null
                            });
                        } else {
                            res.status(200).json({
                                error: null,
                                msg: "Activity updated Successfully",
                                data: null
                            });
                        }
                    }
                });
            } else {
                res.status(401).json({
                    error: null,
                    msg: "Business Login Required or Unauthorized Access",
                    data: null
                });
            }
        });
    }

}
