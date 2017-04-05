const mongoose = require("mongoose");
const Activity = mongoose.model("Activity");
const Business = mongoose.model("Business");


/* Put method that takes as a parameters the date and the Activity ID and returns
the free slots where the resgistered user can make a booking
Calling route: /activity/freeSlots */
module.exports.getAvailableSlots = function(req, res) {
  //values from the body of the put request
  const actdate = req.body.date;
  const actID = req.body.activityID;
  //Maximum bookings that can be made in one slot and is specified by the business
  var maxBookings = 0;
  //Retrieves the array of bookings of this activity according to it's activity ID
  Activity.findById(actID)
  //populate an array of references with booking objects being referenced
  .populate( {
    path: 'bookings',
    //filters to keep only bookings made on the date "actDate"
    match: {
      date: actdate
    }
  })
  .exec(function(err, bookedSlots) {
    //If an error occured return it in response
    if(err) return res.json({
      success: false,
      msg: "Error occured while retrieving slots"
    })
    //retrieves the slots specified by the business for their activity
    Activity.findById(actID, function(err, actSlots) {
      //If an error occured return it in response
      if(err) res.json({
        success: false,
        msg: "error occured while retrieving activity slots"
      });
      //Initializes the maxBookings according to the Activity
      maxBookings = actSlots.bookingsPerSlot;
      //Array that will contain all the available slots for booking
      var availableSlots = [];
      const counter = 0;
      //Loops over the array of slots specified by the business
      for(const i = 0; i < actSlots.slots.length; i++) {
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
              if (actEndTime.getTime() == bookingEndTime.getTime()){
                counter++;
              }
          }
      }
      //Checks if the counter is less than the maximum number of bookings per slot
      if(counter < maxBookings)
        //adds the slot into the array of available slots
        availableSlots.push(slots[i]);
    }
    //returns the array of available slots
    res.json( {
      success: true,
      msg: "successful retrieval of available slots",
      availableSlots : availableSlots })
      })
      })
}
