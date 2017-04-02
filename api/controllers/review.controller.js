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

/* Post function that adds a review by a registered user on a business to the database
Calling route: api/review/add */
module.exports.addReview = function(req, res) {
  //check if logged in
  if(req.user) {
    //get values from post request
    var comment = req.body.comment;
    var rating = req.body.rating;
    var user = req.body.user;
    var business = req.body.business;
    //creates a new Review object with the values from the post request
    const newReview = new Review({
      comment: comment,
      rating: rating,
      user: user,
      business: business
    });
  //saves the new review in the database
    newReview.save(function(err, review) {
      //if an error occurred, return an error
      if (err) return res.json({success: false, msg: 'There was a problem adding the information to the database', error: err});
      //Adds review to reviews array of corresponding user
      User.findByIdAndUpdate(
        review.user,
        {$push: {"reviews": review._id}},
        {safe: true, upsert: true, new: true},
        function(err, model){
          if (err) res.json({success: false, msg: "Error occured while updating User concerned", error: err});
        });
        //Adds review to reviews array of corresponding business
        Business.findByIdAndUpdate(
          review.business,
          {$push: {"reviews": review._id}},
          {safe: true, upsert: true, new: true},
          function(err, model){
            if (err) res.json({success: false, msg: "Error occured while updating the business concered", error: err});
            res.json({success: true, msg: "Review successfully added"});
          }
        );
      });
  }
  //User not logged in
  else {
    res.json({error : "login!"});
  }
};


/* Get function that retrieves the reviews made on a Business from the database
Calling route: api/review/:businessId */
module.exports.getReviews = function(req, res) {
  //Finds all reviews made on a specific business according to its business ID
  Review.find({"business" : req.params.businessId}, function(err, reviews) {
    //If an error occurred, return an error
    if(err) {
      res.status(500).send(err);
    }
    else {
      //returns an array of reviews
      res.json({success: true, msg: 'successful retrieval', reviews});
    }
  });
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
    });
}
