const mongoose = require('mongoose');
const User = mongoose.model('User');
const Business = mongoose.model('Business');
const Review = mongoose.model('Review');


/* for testing
module.exports.add = function(req, res){
    const newBusiness = new Business({
      name: "test4",
      email: "test4",
      password: "test4",
      description: "test4"});
    newBusiness.save(function (err, business) {
      if (err) return res.json({success: false, msg: 'adding failed'});
      res.json({success: true, msg: 'added'});
    });
};


module.exports.addUser = function(req, res){
    const newUser = new User({
      firstName: "test4",
      lastName: "test4",
      email: "test4",
      username: "test4",
      password: "test4"
    });
    newUser.save(function (err, user) {
      if (err) return res.json({success: false, msg: 'adding failed'});
      res.json({success: true, msg: 'added'});
    });
};
*/


/* Post function that adds a review by a registered user on a business to the database
Calling route: api/review/add */
module.exports.addReview = function(req, res) {
    //check if logged in
    if (req.user) {
        //get values from post request
        var comment = req.body.comment;
        var rating = req.body.rating;
        var user = req.body.user;
        var business = req.body.business;
        var time = req.body.time;
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
            if (err) return res.json({
                success: false,
                msg: 'There was a problem adding the information to the database',
                error: err
            });
            //Adds review to reviews array of corresponding user
            User.findByIdAndUpdate(
                review.user, {
                    $push: {
                        "reviews": review._id
                    }
                }, {
                    safe: true,
                    upsert: true,
                    new: true
                },
                function(err, model) {
                    if (err) res.json({
                        success: false,
                        msg: "Error occured while updating User concerned",
                        error: err
                    });
                });
            //Adds review to reviews array of corresponding business
            Business.findByIdAndUpdate(
                review.business, {
                    $push: {
                        "reviews": review._id
                    }
                }, {
                    safe: true,
                    upsert: true,
                    new: true
                },
                function(err, model) {
                    if (err) res.json({
                        success: false,
                        msg: "Error occured while updating the business concered",
                        error: err
                    });
                    res.json({
                        success: true,
                        msg: "Review successfully added"
                    });
                }
            );
        });
    }
    //User not logged in
    else {
        res.json({
            error: "login!"
        });
    }
};


/* Get function that retrieves the reviews made on a Business from the database
Calling route: api/review/:businessId */
module.exports.getReviews = function(req, res) {
    //Finds all reviews made on a specific business according to its business ID
    Review.find({
        "business": req.params.businessId
    }, function(err, reviews) {
        //If an error occurred, return an error
        if (err) {
            res.status(500).send(err);
        } else {
            //returns an array of reviews
            res.json({
                success: true,
                msg: 'successful retrieval',
                reviews
            });
        }
    });
}
