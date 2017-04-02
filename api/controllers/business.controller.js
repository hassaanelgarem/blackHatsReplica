const mongoose = require("mongoose");
const Business = mongoose.model("Business");
const bcrypt = require('bcryptjs');

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

// Business.methods.generateHash = function(password){
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
// }


module.exports.addBusiness = function(req, res){
  let newBusiness = new Business({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    phoneNumbers: req.body.phoneNumbers
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newBusiness.password, salt, (err, hash) => {
      if(err) res.json({success: false, msg:'bcrypt'});
      newBusiness.password = hash;
      newBusiness.save(function(err){
        if(err) res.json({success: false, msg:'save'});
        res.json({success: true, msg:'Your application is successfully submitted!'});
      });
    });

});
}


// Post function that increments the interactivity attribute of a certain business by 1
// URI: api/business/interact/:id
module.exports.updateInteractivity = function(req, res){
  Business.findById(req.params.id, function(err, business){
    business.interactivity = business.interactivity + 1;
    business.save(function(err){
      if(err) res.json({success: false, msg: 'Updating business interactivity failed'});
      res.json({success: true, msg: 'Business interactivity incremented'});
    })
  });
};


// Get function that returns the three most popular businesses based on their interactivity
// URI: api/business/mostPopular
module.exports.getMostPopular = function(req, res){
  const query = Business.find().sort({interactivity: -1}).limit(3);
  query.exec(function(err, businesses){
      if(err) res.json({success: false, msg: 'Failed to retrieve most popular businesses'});
      res.json({success: true, msg: 'Got most popular businesses successfully', businesses: businesses});
  });
};
