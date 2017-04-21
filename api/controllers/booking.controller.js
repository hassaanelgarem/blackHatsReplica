const mongoose = require("mongoose");
const Booking = mongoose.model("Booking");
const Activity = mongoose.model("Activity");
const User = mongoose.model("User");
const Business = mongoose.model("Business");


/*
    Post function that handles booking an activity
    It creates a new booking and saves it in database
    And updates bookings array in concered Activity and User
    Takes:
        Body: {
            slot: "An object consist of two dates, startTime and endTime",
            activity: "id of the activity being booked",
            date: "date of the booking"
        }
    Returns: success or failure message along with error object if any.
    Redirect to: Nothing.
    Calling route: '/api/activity/book'
*/
module.exports.bookActivity = function (req, res) {
    req.checkBody('slot', 'Slot is required').notEmpty();
    req.checkBody('activity', 'Activity ID is required').notEmpty();
    req.checkBody('date', 'Date is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.status(500).json({
            error: errors,
            msg: 'Incomplete input',
            data: null
        });
    } else {
        // Create new Booking object using parameters from request
        const newBooking = new Booking({
            slot: req.body.slot,
            activity: req.body.activity,
            user: "58dff292c0dc7f2224966e47",
            date: req.body.date
        });
        Activity.findById(req.body.activity, function (err, doc) {
            if (err) return res.status(500).json({
                error: err,
                msg: "Error searching for activity",
                data: null
            });
            if (!doc) return res.status(404).json({
                error: null,
                msg: "Can't find activity",
                data: null
            });
            // Save new booking in database
            newBooking.save(function (err, booking) {
                // If there is an error return it in response
                if (err) return res.status(500).json({
                    error: err,
                    msg: "Error adding the booking",
                    data: null
                });

                // Find user by his id and insert the booking id in his bookings array
                User.findByIdAndUpdate(
                    booking.user, {
                        $push: {
                            "bookings": booking._id
                        }
                    }, {
                        safe: true,
                        upsert: true,
                        new: true
                    },
                    function (err, user) {
                        // If there is an error return it in response
                        if (err) return res.status(500).json({
                            error: err,
                            msg: "Error updating user",
                            data: null
                        });
                        if (user) {
                            // Find activity by it's id and insert the booking id in it's bookings array
                            Activity.findByIdAndUpdate(
                                booking.activity, {
                                    $push: {
                                        "bookings": booking._id
                                    }
                                }, {
                                    safe: true,
                                    upsert: true,
                                    new: true
                                },
                                function (err, activity) {
                                    // If there is an error return it in response
                                    if (err) return res.status(500).json({
                                        error: err,
                                        msg: "Error updating activity",
                                        data: null
                                    });
                                    if (activity) {
                                        // If no errors occur, respond with success = true
                                        res.status(200).json({
                                            error: null,
                                            msg: "Booked an activity successfully",
                                            data: null
                                        });
                                    } else
                                        res.status(404).json({
                                            error: null,
                                            msg: "Activity not found, Booking was added to database however was not added to bookings of activity.",
                                            data: null
                                        });

                                });
                        } else
                            res.status(404).json({
                                error: null,
                                msg: "User not found, Booking was added to database however was not added to bookings of user, or activity.",
                                data: null
                            });
                    });
            });
        });
    }
};


/*
    Get function to return all bookings that a specific user booked
    Takes:
        params: {
            userId
        }
    Returns: Success or failure message along with the error if any
    and a list of bookings by this user
    Redirects to: Nothing.
    Calling routes: '/api/booking/history/:userId'
*/
module.exports.getBookingHistory = function (req, res) {

    //Finds history of bookings for a specific user given his id
    Booking.find({
        "user": req.params.userId
    }).populate('activity').exec(function (err, bookings) {

        //If an error occurred, display a message along with the error
        if (err) return res.status(500).json({
            "error": err,
            "msg": "Cannot retrieve history.",
            "data": null
        })

        //If no error display list of bookings made by this user or empty array
        res.status(200).json({
            "error": null,
            "msg": "Successful retrieval",
            "data": bookings
        });
    });
}


/*
    Delete function that finds and deletes a specific booking
    Takes:
        params: {
            bookingId
        }
    Returns: {
        error: "Error object if any",
        msg: "Success or failure message"
    }
    Redirects to: Nothing
    Calling route: '/api/activity/deleteBooking/:bookingId'
*/
module.exports.deleteBooking = function (req, res) {
    //Finding and deleting booking from database
    Booking.findByIdAndRemove(req.params.bookingId, function (err, bookingToDel) {
        //If error, return in response
        if (err) return res.status(500).json({
            error: err,
            msg: "There was a problem with deleting the booking",
            data: null
        });
        if (bookingToDel) {
            //Delete booking from bookings array in corresponding user
            User.findByIdAndUpdate(bookingToDel.user, {
                    $pull: {
                        "bookings": bookingToDel.id
                    }
                }, {
                    safe: true,
                    upsert: true,
                    new: true
                },
                //If error occurred, return it in response
                function (err, user) {
                    if (err) return res.status(500).json({
                        error: err,
                        msg: "Error occured while updating User concerned",
                        data: null
                    });
                    if (user) {
                        //Delete booking from bookings array in corresponding activity
                        Activity.findByIdAndUpdate(bookingToDel.activity, {
                                $pull: {
                                    "bookings": bookingToDel.id
                                }
                            }, {
                                safe: true,
                                upsert: true,
                                new: true
                            },
                            //If error occurred, return it in response
                            function (err, activity) {
                                if (err) return res.status(500).json({
                                    error: err,
                                    msg: "Error occured while updating Activity concerned",
                                    data: null
                                });
                                if (activity)
                                    //If booking successfully deleted, return success message
                                    res.status(200).json({
                                        error: err,
                                        msg: 'Booking successfully deleted',
                                        data: null
                                    });
                                else
                                    res.status(404).json({
                                        error: null,
                                        msg: 'Activity not found, Booking was deleted, however it was not deleted from activities\' bookings',
                                        data: null
                                    });
                            });
                    } else
                        res.status(404).json({
                            error: null,
                            msg: 'User not found, Booking was deleted, however it was not deleted from user\'s and activities\' bookings',
                            data: null
                        });
                });
        } else
            res.status(404).json({
                error: null,
                msg: "booking not found",
                data: null
            })
    })
}
