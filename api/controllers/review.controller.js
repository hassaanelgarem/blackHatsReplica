const mongoose = require("mongoose");
const User = mongoose.model("User");
const Business = mongoose.model("Business");
const Review = mongoose.model("Review");


module.exports.addReview = function(req, res){
    newReview = new Review(req.body);
    newReview.save(function(err,createdNewReview) {
      if(err) {
        res.send(err);
      }
      res.send(createdNewReview);
    });
};

module.exports.addReview = function(req, res){
  //if user is logged in, passport.js will create user object in req
  if(req.user){
  //get values from post request
  var comment = req.body.comment;
  var rating = req.body.rating;
  var user = req.body.user;
  var business = req.body.business;
  //call the create function for our database
  Review.create({
      comment : comment,
      rating : rating,
      user : user,
      business : business
}, function (err, createdNewReview) {
              if (err) {
                  res.send("There was a problem adding the information to the database");
              } else {
                  res.send(createdNewReview);
                  User.update({id : createdNewReview.user}, { $push : {reviews : createdNewReview.id} });
                  Business.update({id : createdNewReview.business}, { $push : {reviews : createdNewReview.id} });
              }
        });
    }
    else {
      res.redirect('/register');
    }
}
