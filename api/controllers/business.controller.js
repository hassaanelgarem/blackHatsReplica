const mongoose = require("mongoose");
const Business = mongoose.model("Business");


// Post function that increments the interactivity attribute of a certain business by 1
// URI: api/business/interact/:id
module.exports.updateInteractivity = function(req, res) {
    Business.findById(req.params.id, function(err, business) {
        business.interactivity = business.interactivity + 1;
        business.save(function(err) {
            if (err) res.json({
                success: false,
                msg: 'Updating business interactivity failed'
            });
            res.json({
                success: true,
                msg: 'Business interactivity incremented'
            });
        })
    });
};


// Get function that returns the three most popular businesses based on their interactivity
// URI: api/business/mostPopular
module.exports.getMostPopular = function(req, res) {
    const query = Business.find().sort({
        interactivity: -1
    }).limit(3);
    query.exec(function(err, businesses) {
        if (err) res.json({
            success: false,
            msg: 'Failed to retrieve most popular businesses'
        });
        res.json({
            success: true,
            msg: 'Got most popular businesses successfully',
            businesses: businesses
        });
    });
};
