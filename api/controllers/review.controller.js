const mongoose = require('mongoose');
const User = mongoose.model('User');
const Business = mongoose.model('Business');
const Review = mongoose.model('Review');


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
            // Gets the business being reviewed
            Business.findById(review.business, function(err, doc) {
                if (err) res.json({
                    success: false
                });

                // Updates totalRating of the business
                doc.totalRatings = doc.totalRatings + review.rating;

                //Adds review to reviews array of corresponding business
                doc.reviews.push(review._id);

                // Saves the updated business document in database
                doc.save(function(err, doc) {
                    if (err) res.json({
                        success: false,
                        msg: "Error occured while updating the business concered",
                        error: err
                    });
                    res.json({
                        success: true,
                        msg: "Review successfully added"
                    });
                });
            });
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


/*
  Get function that returns the average rating of a business
  Takes as a parameter the business ID in the route
  Calling route: api/review/averageRating/:businessId
*/
module.exports.getAverageRating = function(req, res) {

    // Get the business concered from the database by it's Id
    Business.findById(req.params.businessId, function(err, doc) {

        // If there is an error return it in response
        if (err) res.json({
            success: false,
            msg: "error finding Business",
            error: err
        });

        // Calculate average rating using totalRating and count of reviews
        const reviewsCount = doc.reviews.length;
        let averageRating = doc.totalRatings / reviewsCount;

        // Return average rating in response
        res.json({
            success: true,
            msg: "Successfully calculated average rating",
            rating: averageRating
        });
    });
}
