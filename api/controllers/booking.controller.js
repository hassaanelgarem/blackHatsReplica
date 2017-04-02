const mongoose = require("mongoose");
const Booking = mongoose.model("Booking");
const Activity = mongoose.model("Activity");
const User = mongoose.model("User");
const Business = mongoose.model("Business");


module.exports.addActivity = function(req, res){
    const newActivity = new Activity({
      name: "test1",
      price: 50,
      description: "test1",
      bookingsPerSlot: 5,
      business: "58df04cdeb554438724cfb38"
    });
    newActivity.save(function (err, activity) {
      if (err) return res.json({success: false, msg: 'adding failed', error: err});
      Business.findByIdAndUpdate(
        activity.business,
        {$push:{"activities": activity._id}},
        {safe: true, upsert: true, new: true},
        function(err, business){
          if(err) res.josn({success: false, error: err});
          res.json({success: true, msg: 'added'});
        }
      );

    });
};


module.exports.bookActivity = function(req, res){
    const newBooking = new Booking({
      slot: req.body.slot,
      activity: req.body.activity,
      user: req.body.user
    });
    newBooking.save(function (err, booking){
      if (err) return res.json({success: false, msg: 'adding failed'});
      User.findByIdAndUpdate(
        booking.user,
        {$push:{"bookings": booking._id}},
        {safe: true, upsert: true, new: true},
        function(err, user){
          if(err) res.json({success: false});
          Activity.findByIdAndUpdate(
            booking.activity,
            {$push:{"bookings": booking._id}},
            {safe: true, upsert: true, new: true},
            function(err, activity){
              if (err) res.json({success: false});
              res.json({success: true});
            }
          );
        }
      );
    });
};
