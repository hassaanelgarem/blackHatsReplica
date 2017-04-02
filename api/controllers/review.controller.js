const mongoose = require('mongoose');
const User = mongoose.model('User');
const Business = mongoose.model('Business');
const Review = mongoose.model('Review');


/* Get function that retrieves the reviews made by a user from the database
and displays them
Calling route: api/review/user/:userID */
module.exports.getUserReviews = function(req, res) {
  //Finds all reviews made by a user according to the User ID
  Review.find({"user": req.params.userID}, function(err, reviews) {
    //If an error occurred, return an error
    if(err) {
      res.status(500).send(err);
    }
    else {
      //returns an array of reviews
      res.json({success: true, msg: 'successful retrieval', reviews});
    }
  })
}


/*
Post function that handles editing an existing review
It retrieves the review from the database, updates it
and saves it back in the database
Calling route: api/review/edit/:reviewID
parameters: {
  newComment: "The new comment as specified by the user"
  newRating: "The new rating as specified by the user"
}
*/
module.exports.editReview = function(req, res) {
  //gets values of variables that user wants to edit
  const newComment = req.body.comment;
  const newRating = req.body.rating;

  //Finds the review by the ID specified in the URI and updates the comment and the rating
  Review.findByIdAndUpdate(
    req.params.reviewID,
    {"comment": newComment, "rating": newRating},
    {safe: true, new: true},
      function(err, editedReview) {
      //If error occurred return it in response
      if (err) return res.json({success: false, msg: 'Failed to edit review'});
      //If no error occurs, response with success = true
      res.json({success: true, msg: 'Review successfully edited'});
    })
}
