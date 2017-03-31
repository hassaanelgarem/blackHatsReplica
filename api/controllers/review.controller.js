const mongoose = require("mongoose");
const User = mongoose.model("User");
const Business = mongoose.model("Business");
const Review = mongoose.model("Review");

module.exports.getReviews = functin(req, res){
  Review.find({"business" : req.params.businessId}, function(err, reviews){
    if(err){
      res.status(500).send(err);
    }
    else{
      res.send(reviews);
    }
  });
}
