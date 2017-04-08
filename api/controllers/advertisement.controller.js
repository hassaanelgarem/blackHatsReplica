const mongoose = require("mongoose");
const express = require("express");
const AdvBooking = mongoose.model("AdvBooking");
const AdvSlot = mongoose.model("AdvSlot");
const fs = require('fs');
const path = require("path");
const multer = require('multer');


/* Multer configuration to upload a single file from an
html input with name "myfile" to public/uploads/businessPhotos folder   */
const uploadAdPhoto = multer({
    dest: path.join(__dirname, '../', '../public/uploads/businessAds')
}).single('myfile');


/*  POST method that adds a new advertisement slot and saves it in the database.
    Calling route: api/advertisement/addAdvSlots   */
module.exports.addAdvSlots = function (req, res) {

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();
    req.checkBody('length', 'Length is required').notEmpty();
    req.checkBody('width', 'Width is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.json({
            success: false,
            msg: 'Incomplete input',
            errors: errors
        });
    } else {
        //  creates a new advertisement slot using values from the POST request
        const newAdvSlot = new AdvSlot({
            name: req.body.name,
            price: req.body.price,
            length: req.body.length,
            width: req.body.width,
            advSchedule: []
        });
        //  saves the new advertisement slot in the database
        newAdvSlot.save(function (err, newSlot) {
            //  If there is an error return it in response
            if (err) return res.json({
                success: false,
                msg: 'Error adding the advertisement slot'
            });
            //  returns a success message
            res.json({
                success: true,
                msg: 'advertisement slot Successfully added'
            })
        })
    }


}


/*  Get function that retrieves the Adv Slots that appear on the homepage from the database.
    Calling route: api/advertisement/getAdvSlots    */
module.exports.getAdvSlots = function (req, res) {
    //  finds all advSlots that can appear on homepage
    AdvSlot.find({}, {
        //    projection to show specific fields of Adv Slots
        name: 1,
        price: 1,
        length: 1,
        width: 1
    }, function (err, advSlot) {
        //  If there is an error return it in response
        if (err) {
            return res.json({
                success: false,
                msg: "Error retrieving advSlots"
            });
        } else {
            //  returns an array of Adv Slots
            res.json({
                success: true,
                msg: 'Successful retrieval',
                advSlot
            });
        }
    })
};


/*  Post function that handles booking an advertisement slot.
    Calling route: /api/advertisement/bookAdvSlot/:advSlot   */
module.exports.bookAdvSlot = function (req, res) {

    // check if advSlot exists
    AdvSlot.findById(req.params.advSlot, function (err, slot) {
        if (err) return res.json({
            success: false,
            msg: "Error searching for slot"
        });
        if (!slot) return res.json({
            success: false,
            msg: "Can't find slot"
        });
        // Create new AdvBooking object using parameters from post request
        uploadAdv(req, res, function (flag, image) {
            if (flag)
                return res.json({
                    error: "You have to choose a valid file"
                });

            const newAdvBooking = new AdvBooking({
                business: req.user._id,
                advSlot: req.params.advSlot,
                image: image,
                startTime: req.body.startTime,
                endTime: req.body.endTime
            });

            // Save new booking in database
            newAdvBooking.save(function (err, booking) {
                // If there is an error return it in response
                if (err) return res.json({
                    success: false,
                    msg: 'Error adding the booking',
                    err
                });
                //return a sucess message
                res.json({
                    success: true,
                    msg: 'Booking is added Successfully'
                })
            })
            //Adds the new booking to the advSchedule array in advSlot
            AdvSlot.findByIdAndUpdate(
                newAdvBooking.advSlot, {
                    $push: {
                        "advSchedule": newAdvBooking._id
                    }
                }, {
                    safe: true,
                    upsert: true,
                    new: true
                },
                function (err, adv) {
                    //If there is an error, return it in response
                    if (err) return res.json({
                        success: false,
                        msg: "Error occured while updating advertisement slot"
                    });
                });
        });
    });
};


/*  Get function that returns the current bookings of an advertisement slot ordered
in ascending order and excluding any booking that is expired.
Calling route: /advertisement/getCurrentBookings/:advSlotId */
module.exports.getCurrentBookings = function (req, res) {

    req.checkParams('advSlotId', 'Adv slot ID is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.json({
            success: false,
            msg: 'Incomplete input',
            errors: errors
        });
    } else {
        /*   A query that finds the advSchedule of the selected slot
        and sorts it ascendingly by startTime and excludes any expired ads */
        AdvSlot.findById(req.params.advSlotId)
            //  populate an array of references with booking objects being referenced
            .populate({
                path: 'advSchedule',
                options: {
                    sort: {
                        'startTime': 1
                    }
                },
                //excludes any booking that is expired
                match: {
                    endTime: {
                        '$gte': Date.now()
                    }
                }
            })
            .exec(function (err, bookings) {
                //if an error occured, return it in response
                if (err) return res.json({
                    success: false,
                    msg: "Error occured while retrieving bookings"
                })
                if (!bookings) return res.json({
                    success: false,
                    msg: "Could not find Adv slot"
                });
                //return a success message
                res.json({
                    success: true,
                    msg: "Successfully retrieved bookings",
                    bookings: bookings.advSchedule
                })
            })
    }

}


/*  Get function that returns the first available slot for booking in a slot's schedule.
    Calling route: /advertisement/getFreeSlot/:advSlotID    */
module.exports.getFreeSlot = function (req, res) {

    req.checkParams('advSlotID', 'Adv slot ID is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.json({
            success: false,
            msg: 'Incomplete input',
            errors: errors
        });
    } else {

        /*   A query that finds the advSchedule of the selected slot
         and sorts them descendingly by endTime to get the last occupied slot  */
        AdvSlot.findById(req.params.advSlotID)
            //used to populate an array of references with booking objects being referenced
            .populate({
                path: 'advSchedule',
                options: {
                    //sorts descendingly by endTime
                    sort: {
                        'endTime': -1
                    },
                    //returns only the first element of the array
                    limit: 1
                }
            })
            .exec(function (err, lastSlot) {
                //If an error occured return it in response
                if (err) return res.json({
                    success: false,
                    msg: "Error occured while retrieving slot"
                })
                if (!lastSlot) return res.json({
                    success: false,
                    msg: "Could not find Adv Slot"
                });
                //gets the end date of the last booked slot
                const freeSlot = lastSlot.advSchedule[0].endTime;
                //Increments this date to retrieve the first available slot for booking
                freeSlot.setDate(freeSlot.getDate() + 1);
                //return the first available date for booking
                res.json({
                    success: true,
                    msg: "Successful retrieval of Last Slot",
                    lastSlot: freeSlot
                })
            })

    }

}




var uploadAdv = function (req, res, callback) {
    //upload the image
    uploadAdPhoto(req, res, function (err) {
        //if an error occurred, return the error
        if (err) {
            return res.json(err);
        }
        //if multer found a file selected
        //and image was uploaded successfully,
        //multer will save the image in req.file
        if (req.file) {
            //get the image format
            var string = req.file.originalname.substring(req.file.originalname.length - 3, req.file.originalname.length);

            //if it was jpeg add a "j" to the returned "peg"
            if (string === "peg")
                string = "j" + string;

            //check if it is not a valid image format
            if (!(string === "png" || string === "jpg" || string === "jpeg")) {
                //delete the uploaded file
                fs.unlink(req.file.path);

                //return the error message to frontend
                return res.json({
                    error: "File format is not supported!"
                });
            }
            //copy and rename the image to the following format and location
            var newPath = path.join(__dirname, "../", "../public/uploads/businessAds/img" + Date.now() + "." + string);
            fs.renameSync(req.file.path, newPath, function (err) {
                if (err) throw err;

                //delete the image with the old name
                fs.unlink(req.file.path);
            });

            //get the name part only from the uploaded image
            var nameLength = ("img" + Date.now() + string).length + 1;
            newPath = newPath.substring(newPath.length - nameLength);

            callback(false, newPath);
        }
        //multer did not find a file selected to upload
        else {
            callback(true, null);
        }
    });
};