const mongoose = require("mongoose");
const express = require("express");
const AdvBooking = mongoose.model("AdvBooking");
const AdvSlot = mongoose.model("AdvSlot");


/* POST method that adds a new advertisement slot and saves it in the database
calling route: api/advertisment/addAdvSlots */
module.exports.addAdvSlots = function(req, res) {
    //creates a new advertisement slot using values from the POST request
    const newAdvSlot = new AdvSlot({
        name: req.body.name,
        price: req.body.price,
        length: req.body.length,
        width: req.body.width,
        advSchedule: []
    });
    //saves the new advertisement slot in the database
    newAdvSlot.save(function(err, newSlot) {
        // If there is an error return it in response
        if (err) return res.json({
            success: false,
            msg: 'Error adding the advertisement slot'
        });
        //returns a success message
        res.json({
          success: true,
          msg: 'advertisement slot Successfully added'
        })
    })
}


/* Get function that retrieves the AdvSlots that appear on the homepage from the database
   Calling route: api/advertisement/getAdvSlots */
module.exports.getAdvSlots = function(req, res) {
    //finds all advSlots that can appear on homepage
    AdvSlot.find({}, {
      //projection to show specific fields only
        name: 1,
        price: 1,
        length: 1,
        width: 1
    }, function(err, advSlot) {
        // If there is an error return it in response
        if (err) {
            return res.json({
                success: false,
                msg: "Error retrieving advSlots"
            });
        } else {
            //returns an array of AdvSlots
            res.json({
                success: true,
                msg: 'Successful retrieval',
                advSlot
            });
        }
    })
};


/* Post function that handles booking an advertisement slot
   Calling route: /api/business/bookAdvSlot */
module.exports.bookAdvSlot = function(req, res) {
    // Create new AdvBooking object using parameters from post request
    const newAdvBooking = new AdvBooking({
        business: req.body.business,
        advSlot: req.body.advSlot,
        image: req.body.image,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    });
    // Save new booking in database
    newAdvBooking.save(function(err, booking) {
        // If there is an error return it in response
        if (err) return res.json({
            success: false,
            msg: 'Error adding the booking'
        });
        //return a sucess message
        res.json({
          success: true,
          msg: 'Booking is added Successfully'
        })
    })
    //Adds booking to the advSchedule array in advSlot
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
        function(err, adv) {
            //If there is an error, return it in response
            if (err) return res.json({
                success: false,
                msg: "Error occured while updating advertisement slot"
            });
        });
}


/* Get function that returns the current bookings of an advertisement slot ordered
in ascending order and excluding any booking that expired
Calling route: /advertisement/getCurrentBookings/:advSlotID */
module.exports.getCurrentBookings = function(req, res) {
    AdvSlot
    .findById(req.params.advSlotID)
    //used to populate an array of references wih objects being referenced
    .populate({
        path: 'advSchedule',
        options: {
            sort: {
                'startTime': 1
            }
        },
        //excludes any booking that expired
        match: {
            endTime: {
                '$gte': Date.now()
            }
        }
    })
    .exec(function(err, bookings) {
        //if an error occured, return it in response
        if (err) return res.json({
            success: false,
            msg: "Error occured while retrieving bookings"
        })
        //return a success message
        res.json({
            success: true,
            msg: "Successfully retrieved bookings",
            bookings: bookings.advSchedule
        })
    })
}


/* Get method that returns the first available slot for booking
Calling route: /advertisement/getFreeSlot/:advSlotID */
module.exports.getFreeSlot = function(req, res) {
  AdvSlot
  .findById(req.params.advSlotID)
  //used to populate an array of references wih objects being referenced
  .populate({
      path: 'advSchedule',
      options: {
          //sorts descendingly
          sort: {
              'endTime': -1
          },
          //returns only the first element of the array
          limit: 1
      }
      })
  .exec(function(err, lastSlot) {
    //If an error occured return it in response
    if (err) return res.json({
        success: false,
        msg: "Error occured while retrieving slot"
    })
    //gets the end date of the last booked slot
    const freeSlot = lastSlot.advSchedule[0].endTime;
    //Increments this date to retrieve the first available slot for booking
    freeSlot.setDate(freeSlot.getDate()+1);
    //return the first available date for booking
    res.json({
      success: true,
      msg: "Successful retrieval of Last Slot",
      lastSlot : freeSlot
    })
  })
}
