const mongoose = require("mongoose");
const AdvBooking = mongoose.model("AdvBooking");
const AdvSlot = mongoose.model("AdvSlot");


/* Get function that retrieves the AdvSlots that appear on the homepage from the database
   URI: api/ads */
module.exports.getAdvSlots = function (req, res) {
  //finds all advSlots that can appear on homepage
  AdvSlot.find({}, {
    name: 1,
    price: 1,
    length: 1,
    width: 1
  }, function (err, advSlot) {
    // If there is an error return it in response
    if (err) {
      return res.json({
        success: false,
        msg: "Error retrieving advSlots",
        error: err
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
   URI: /api/business/bookAdvSlot */
module.exports.bookAdvSlot = function (req, res) {
  // Create new AdvBooking object using parameters from request
  const newAdvBooking = new AdvBooking({
    business: req.body.business,
    advSlot: req.body.advSlot,
    image: req.body.image,
    startTime: req.body.startTime,
    endTime: req.body.endTime
  });
  // Save new booking in database
  AdvBooking.save(function (err, booking) {
    // If there is an error return it in response
    if (err) return res.json({
      success: false,
      msg: 'Error adding the booking',
      error: err
    });
    // Find advSlot by its id and insert the booking id in its advSchedule array
    AdvSlot.findByIdAndUpdate(
      booking.advSlot, {
        $push: {
          "advSchedule": booking._id
        }
      }, {
        safe: true,
        upsert: true,
        new: true
      },
      function (err, advSlot) {
        // If there is an error return it in response
        if (err) res.json({
          success: false,
          msg: "Error updating Adv Slot",
          error: err
        });
      }
    );
  })
};