const mongoose = require("mongoose");
const User = mongoose.model("User");
const Business = mongoose.model("Business");
const Review = mongoose.model("Review");


module.exports.deleteReview = function(req, res){
  User.findByIdAndRemove(req.id, function(err, reviewToDelete){
    if(err){
      res.send("There was a problem with deleting the review"),
    }
    else {
      var response = {
        message : "Review successfully deleted",
        id: reviewToDelete._id;
      };
      res.send(response);
      User.update({ }, { $pull : {reviewToDelete.user} });
      Business.update({ }, { $pull : {reviewToDelete.business} });
    }
  });
}
