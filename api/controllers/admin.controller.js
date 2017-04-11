const mongoose = require("mongoose");
const Business = mongoose.model("Business");
const emailSender = require('../config/emailSender');


/* Put function that verifies the business,
it allows the admin to verify the applying business
  Returns: Success or failure message along with the error if any
  Redirects to: Nothing.
Calling Route: /api/admin/verify/:businessId */
module.exports.verifyBusiness = function (req, res) {
    //Getting the business by its id
    Business.findById(req.params.businessId, function (err, business) {
        if (err)
            res.status(500).json({
              "error": err,
	            "msg": "Error finding the business.",
              "data": null
            });
        else {
            if (business) {
                //if business is already verified
                if (business.verified)
                    return res.status(200).json({
                        "error": null,
                        "msg": "Business is already verified.",
                        "data": null
                    });

                // else verifying the business
                business.verified = true;
                // updating the db
                business.save(function (err) {
                    if (err) res.status(500).json({
                        "error": err,
                        "msg": "Was not able to verify business.",
                        "data": null
                    });
                    else {
                        var text = 'Hello ' + business.name + ',\n\nYour account has been verified.\n\nWelcome to Black Hats.';
                        var subject = 'Account Verified';
                        emailSender.sendEmail(subject, business.email, text, function (err, info) {
                            if (err) res.status(500).json({
                                "error": err,
                                "msg": "Business was not notified of verification.",
                                "data": null
                            });
                            else
                                res.status(200).json({
                                    "error": null,
                                    "msg": "Business is verified and notified.",
                                    "data": null
                                });
                        });
                    }
                });
            } else
                res.status(404).json({
                    "error": null,
                    "msg": "Business not found.",
                    "data": null
                })
        }
    });
};


/* Delete function that deletes a business wether he was approved or not
 Returns: Success or failure message along with the error if any
 Redirects to: Nothing.
Calling Route: /api/admin/delete/:businessId */
module.exports.deleteBusiness = function (req, res) {
    // delete declined busiess
    Business.findByIdAndRemove(req.params.businessId, function (err, business) {
        if (err) {
            res.status(500).json({
                "error": err,
                "msg": "Error deleting business.",
                "data": null
            });
        } else {
            if (business) {
                if (business.verified) {
                    var text = 'Hello ' + business.name + ',\n\nUnfortunately, your application was suspended for not meeting our terms and conditions.\n\nThank you for considering Black Hats.';
                    var subject = 'Account Suspended';
                } else {
                    var text = 'Hello ' + business.name + ',\n\nUnfortunately, your application was rejected.\n\nThank you for considering Black Hats.';
                    var subject = 'Account Rejected';
                }
                emailSender.sendEmail(subject, business.email, text, function (err, info) {
                    if (err) {
                        res.status(500).json({
                            "error": err,
                            "msg": "Business was not notified of rejection.",
                            "data": null
                        });
                    } else {
                        res.status(200).json({
                            "error": null,
                            "msg": "Business deleted and notified.",
                            "data": null
                        });
                    }
                });
            } else
                res.status(404).json({
                    "error": null,
                    "msg": "Business not found.",
                    "data": null
                });
        }
    });
};
