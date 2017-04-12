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
        res.status(500).json({
	    error: errors,
        msg: "Incomplete Input",
        data: null
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
            if (err) return res.status(500).json({
	        error: err,
            msg: "Error Adding the Advertisement Slot",
            data: null
            });
            //  returns a success message
            res.status(200).json({
	        error: null,
            msg: "Advertisement Slot Added Successfully",
            data: null
            });
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
            return res.status(500).json({
	            error: err,
                msg: "Error retrieving advSlots",
                data: null
            });
        } else {
            //  returns an array of Adv Slots
            res.status(200).json({
	            error: null,
                msg: "Advertisement Slots Retrieved Successfully",
                data: advSlot
            });
        }
    })
}


/*  Post function that handles booking an advertisement slot.
    Calling route: /api/advertisement/bookAdvSlot/:advSlot   */
module.exports.bookAdvSlot = function (req, res) {

    // check if advSlot exists
    AdvSlot.findById(req.params.advSlotId, function (err, slot) {
        if (err) return res.status(500).json({
	            error: err,
                msg: "Error Searching For Advertisement Slot",
                data: null
            })
            
        if (!slot) return res.status(404).json({
	            error: null,
                msg: "Advertisement Slot Not Found",
                data: null
            });
        // Upload the adv image
        uploadAdv(req, res, function (flag, image) {
            if (flag)
                return res.status(500).json({
	            error: err,
                msg: "Choose A Valid File",
                data: null
                });
        // Create new AdvBooking object using parameters from post request
            const newAdvBooking = new AdvBooking({
                business: req.user._id,
                advSlot: req.params.advSlotId,
                image: image,
                startTime: req.body.startTime,
                endTime: req.body.endTime
            });

            // Save new booking in database
            newAdvBooking.save(function (err, booking) {
                // If there is an error return it in response
                if (err) return res.status(500).json({
	                        error: err,
                            msg: "Error Adding the Booking",
                            data: null
                            });
                //return a success message
                res.status(200).json({
	            error: null,
                msg: "Booking Added To the Advertisement Slot Successfully",
                data: null
                });
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
                    if (err) return res.status(500).json({
	                        error: err,
                            msg: "Error While Updating Advertisement Slot",
                            data: null
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
        return res.status(500).json({
	        error: errors,
            msg: "Invalid Input",
            data: null
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
            .exec(function (err, currentSlot) {
                //if an error occured, return it in response
                if (err)  return res.status(500).json({
	                        error: err,
                            msg: "Error Retrieving Advertisement Bookings",
                            data: null
                            });
                if (!currentSlot)  return res.status(404).json({
	                                error: null,
                                    msg: "Advertisement Booking Not Found",
                                    data: null
                                    });
                //return a success message
                 return res.status(200).json({
	                error: errors,
                    msg: "Current Bookings Retrieved Successfully",
                    data: currentSlot.advSchedule
                    });
         })
    }

}


/*  Get function that returns the first available slot for booking in a slot's schedule.
    Calling route: /advertisement/getFreeSlot/:advSlotId    */
module.exports.getFreeSlot = function (req, res) {

    req.checkParams('advSlotId', 'Adv slot ID is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(500).json({
	        error: errors,
            msg: "Invalid Input",
            data: null
            });
    } else {

        /*   A query that finds the advSchedule of the selected slot
         and sorts them descendingly by endTime to get the last occupied slot  */
       const query =  AdvSlot.findById(req.params.advSlotId)
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
            });

            query.exec(function (err, lastSlot) {
                //If an error occured return it in response
                if (err) return res.status(500).json({
	                        error: err,
                            msg: "Error Retrieving Last Advertisement Slot",
                            data: null
                            });
                if (!lastSlot) return res.status(404).json({
	                        error: null,
                            msg: "Advertisement Slot Not Found",
                            data: null
                        });

                
                var freeSlot = lastSlot.advSchedule[0];
                
                //if AdvSlot had no previous bookings, return current date
                if("undefined" === typeof freeSlot) {
                        const currentDate = new Date().toISOString();
                        return res.status(200).json({
	                        error: null,
                            msg: "Free Advertisement Slot Retrieved Successfully",
                            data: currentDate
                        });
                } else {

                //gets the end date of the last booked slot
                freeSlot = lastSlot.advSchedule[0].endTime;
                //Increments this date to retrieve the first available slot for booking
                freeSlot.setDate(freeSlot.getDate() + 1);
                //return the first available date for booking
                return res.status(200).json({
	                error: null,
                    msg: "Free Advertisement Slot Retrieved Successfully",
                    data: freeSlot
                    });
                }            
            })

    }

}


var uploadAdv = function (req, res, callback) {
    //upload the image
    uploadAdPhoto(req, res, function (err) {
        //if an error occurred, return the error
        if (err) {
            return res.status(500).json({
	            error: err,
                msg: "Error Uploading Photo",
                data: null
                });
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
                 return res.status(500).json({
	            error: err,
                msg: "File Format Not Supported",
                data: null
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
