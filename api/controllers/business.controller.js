const mongoose = require("mongoose");
const Business = mongoose.model("Business");


// for testing
/*
module.exports.add = function(req, res){
    const newBusiness = new Business({name: "test", email: "test", password: "test", description: "test"});
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
