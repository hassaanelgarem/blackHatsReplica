const mongoose = require("mongoose");
const Business = mongoose.model("Business");


// for testing
/*
module.exports.add = function(req, res){
    const newBusiness = new Business({name: "test4", email: "test4", password: "test4", description: "test4"});
    newBusiness.save(function (err, business) {
      if (err) return res.json({success: false, msg: 'adding failed'});
      res.json({success: true, msg: 'added'});
    });
};
*/

module.exports.updateInteractivity = function(req, res){
  Business.findById(req.body.id, function(err, business){
    business.interactivity = business.interactivity + 1;
    business.save(function(err){
      if(err) res.json({success: false, msg: 'Updating business interactivity failed'});
      res.json({success: true, msg: 'Business interactivity incremented'});
    })
  });
};

module.exports.getMostPopular = function(req, res){
  const query = Business.find().sort({interactivity: -1}).limit(3);
  query.exec(function(err, businesses){
      if(err) res.json({success: false, msg: 'Failed to retrieve most popular businesses'});
      res.json({success: true, msg: 'Got most popular businesses successfully', businesses: businesses});
  });
};
