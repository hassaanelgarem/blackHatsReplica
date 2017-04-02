const mongoose = require("mongoose");
const User = mongoose.model("User");
const Business = mongoose.model("Business");
const Review = mongoose.model("Review");


/* Delete function that finds and deletes a specific review
URI: api/review/:reviewId */
module.exports.deleteReview = function(req, res){
  //Finding and deleting review from database
  Review.findByIdAndRemove(req.params.reviewId, function(err, reviewToDelete){
    if(err) return res.json({success: false, msg: 'There was a problem with deleting the review'});
    res.json({success: true, msg: 'Review successfully deleted'});
  //Delete review from reviews array in corresponding user
  User.findByIdAndUpdate(reviewToDelete.user,
    {$pull: {"reviews": reviewToDelete._id}},
    {safe: true, upsert: true, new: true},
    function(err, model){
      if(err) res.json({success: false});
    }
  );
  //Delete review from reviews array in corresponding business
  Business.findByIdAndUpdate(reviewToDelete.business,
    {$pull: {"reviews": reviewToDelete._id}},
    {safe: true, upsert: true, new: true},
    function(err, model){
      if(err) res.json({success: false});
    }
  );
});
};
